import { app, BrowserWindow, powerMonitor } from "electron";

let mainWindow;
let isUserActive = false; // Flag to track if the user is already active
let totalSleepTime = 0;
let totalLockTime = 0;
let sleepStartTime = null;
let lockStartTime = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 580,
    resizable: false, // Disable resizing
    fullscreenable: false, // Disable fullscreen
    maximizable: false, // Disable maximizing
    closable: false, // Has no direct effect, so handle it in 'close' event
    // minimizable:false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.setMenu(null);
  mainWindow.loadFile("./App/index.html");
  //  mainWindow.webContents.openDevTools();
  mainWindow.on("close", (e) => {
    e.preventDefault(); // Prevent window from closing The close button is disabled.
  });
}

app.whenReady().then(() => {
  createWindow();

  // Detect when the system goes to sleep
  powerMonitor.on("suspend", () => {
    sleepStartTime = Date.now();
  });

  // Detect when the system wakes up
  powerMonitor.on("resume", () => {
    if (sleepStartTime) {
      const sleepDuration = (Date.now() - sleepStartTime) / 1000;
      totalSleepTime += sleepDuration;
      sleepStartTime = null;
    }
  });

  // Detect screen lock
  powerMonitor.on("lock-screen", () => {
    lockStartTime = Date.now();
  });

  // Detect screen unlock
  powerMonitor.on("unlock-screen", () => {
    if (lockStartTime) {
      const lockDuration = (Date.now() - lockStartTime) / 1000;
      totalLockTime += lockDuration;
      lockStartTime = null;
    }
  });

  // Track total idle, sleep, and lock time every 6 seconds
  setInterval(() => {
    const idleTimes = powerMonitor.getSystemIdleTime();

    if (idleTimes >= 6) {
      // User is idle
      // console.log(`⚠️ User has been idle for ${idleTimes} seconds!`);
      // Send data to the renderer process
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send("activityData", {
          idleTime: idleTimes,
          sleepTime: totalSleepTime,
          lockTime: totalLockTime,
        });
      }
      // Reset active flag to allow future activity detection
      isUserActive = false;
    } else if (!isUserActive) {
      // User becomes active again
      // console.log("🟢 User is active!");
      if (mainWindow && mainWindow.webContents) {
        mainWindow.webContents.send("activityData", {
          idleTime: 0, // No idle time
          sleepTime: totalSleepTime,
          lockTime: totalLockTime,
        });
      }
      // Set the flag so the active check is not triggered again
      isUserActive = true;
    }
  }, 1000);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
