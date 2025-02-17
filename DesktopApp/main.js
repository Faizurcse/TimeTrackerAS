import { app, BrowserWindow, powerMonitor } from "electron";

let mainWindow;
let sleepStartTime = null;
let lockStartTime = null;
let sleepTime = 0;
let lockTime = 0;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 580,
    resizable: false,
    fullscreenable: false,
    maximizable: false,
    closable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.setMenu(null);
  mainWindow.loadFile("./App/index.html");

  mainWindow.on("close", async (e) => {
    e.preventDefault(); // Prevent immediate close

    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send("data-saved-in-database", {
        DBdata: "closeWindow",
      });

      setTimeout(() => {
        mainWindow.destroy(); // Close after 7 seconds
      }, 7000);
    }
  });
}

app.whenReady().then(() => {
  createWindow();

  powerMonitor.on("suspend", () => {
    sleepStartTime = Date.now();
  });

  powerMonitor.on("resume", () => {
    if (sleepStartTime) {
      sleepTime = Math.floor((Date.now() - sleepStartTime) / 1000);
      sleepStartTime = null;
    }
    resetIdleTimes(); // Reset times when user is active
  });

  powerMonitor.on("lock-screen", () => {
    lockStartTime = Date.now();
  });

  powerMonitor.on("unlock-screen", () => {
    if (lockStartTime) {
      lockTime = Math.floor((Date.now() - lockStartTime) / 1000);
      lockStartTime = null;
    }
    resetIdleTimes(); // Reset times when user is active
  });

  function resetIdleTimes() {
    sleepTime = 0;
    lockTime = 0;
  }

  setInterval(() => {
    const idleTime = powerMonitor.getSystemIdleTime();

    if (mainWindow && mainWindow.webContents) {
      mainWindow.webContents.send("activityData", {
        idleTime: idleTime >= 6 ? idleTime : 0,
        sleepTime,
        lockTime,
      });
    }
  }, 1000);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
