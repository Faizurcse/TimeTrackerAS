const { ipcRenderer } = require("electron");
let startTime, breakStartTime;
let workTimer, breakTimer;
let isWorking = false,
  isOnBreak = false;
let workElapsed = 0,
  breakElapsed = 0;
let lastActiveTimer = null; // Stores last active timer (work or break)
let isIdle = false; // Flag to track idle state
let lastIdleValue = 0; // Stores the last idle time before becoming active
let ONbreakIdlePop = false;
let OnLogouIdlePop = false;

document.getElementById("logout-pop-msg").style.display = "none";
document.getElementById("idle-pop-msg-container").style.display = "none";
document.getElementById("appit-surveillance").style.display = "none";


const timeData = [];


function toGetLoginDateTime() {
  const today = new Date();

  // Format date as DD/MM/YYYY
  const formattedDate = today.toLocaleDateString("en-GB"); // "08/02/2025"

  // Format time as HH:MM:SS AM/PM
  const formattedTime = today.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Combine Date & Time
  const formattedDateTime = `${formattedDate},${formattedTime}`; // "08/02/2025 09:05:23 PM"

  let existingEntry = timeData.find((entry) => entry.date === formattedDate);

  if (!existingEntry) {
    // Save only if there is NO existing entry for today
    timeData.push({
      loginAt: formattedDateTime,
    });
  }

  timeData.map((e) => {
    document.getElementById(
      "start-candidate-time"
    ).innerText = `Login at : ${e.loginAt}`;
  });

}

function formatTime(ms) {
  let hours = Math.floor(ms / (1000 * 60 * 60));
  let minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
}

function updateWorkTimer() {
  let elapsed = Date.now() - startTime + workElapsed;
  document.getElementById("display").innerText = formatTime(elapsed);
}

function updateBreakTimer() {
  let elapsed = Date.now() - breakStartTime + breakElapsed;
  document.getElementById("break-time").innerText = formatTime(elapsed);
}

document.getElementById("start-btn").addEventListener("click", function () {
  document.getElementById("start-btn").disabled = true;
  document.getElementById("stop-btn").disabled = false;
  document.getElementById("pause-btn").disabled = false;
  toGetLoginDateTime();
  if (!isWorking) {
    startTime = Date.now();
    workTimer = setInterval(updateWorkTimer, 1000);
    isWorking = true;
  }
  if (isOnBreak) {
    clearInterval(breakTimer);
    breakElapsed += Date.now() - breakStartTime;
    isOnBreak = false;
  }
});

document.getElementById("pause-btn").addEventListener("click", function () {
  document.getElementById("start-btn").disabled = false;
  document.getElementById("pause-btn").disabled = true;
  if (isWorking) {
    clearInterval(workTimer);
    workElapsed += Date.now() - startTime;
    isWorking = false;
  }
  if (!isOnBreak) {
    breakStartTime = Date.now();
    breakTimer = setInterval(updateBreakTimer, 1000);
    isOnBreak = true;
    ONbreakIdlePop = true;
    // Reset idle time when break starts
    lastIdleValue = 0;
  }
});

function updateIdleTime() {
  let totalIdleTime = 0;
  timeData.forEach((entry) => {
    totalIdleTime = entry.totalIdleTime || 0; // Ensure totalIdleTime is a number
  });

  let totalIdleHours = Math.floor(totalIdleTime / 3600); // Convert seconds to hours
  let totalIdleMinutes = Math.floor((totalIdleTime % 3600) / 60); // Remaining minutes
  let totalIdleSeconds = totalIdleTime % 60; // Remaining seconds

  document.getElementById("total-idle-time").innerText = `${String(
    totalIdleHours
  ).padStart(2, "0")}:${String(totalIdleMinutes).padStart(2, "0")}:${String(
    totalIdleSeconds
  ).padStart(2, "0")}`;
}

document.getElementById("stop-btn").addEventListener("click", function () {
  document.getElementById("logout-pop-msg").style.display = "block";

  // Store the last active timer before stopping
  if (isWorking) {
    clearInterval(workTimer);
    workElapsed += Date.now() - startTime;
    isWorking = false;
    lastActiveTimer = "work"; // Store last active timer
  } else if (isOnBreak) {
    clearInterval(breakTimer);
    breakElapsed += Date.now() - breakStartTime;
    isOnBreak = false;
    lastActiveTimer = "break"; // Store last active timer
  }

  OnLogouIdlePop = true;
  // Reset idle time when break starts
  lastIdleValue = 0;
  // Show the correct work time in the pop-up
  document.getElementById("logout-pop-time").innerText =
    formatTime(workElapsed);
});

function noButton() {
  document.getElementById("logout-pop-msg").style.display = "none";

  // Resume the last active timer only
  if (lastActiveTimer === "work") {
    startTime = Date.now();
    workTimer = setInterval(updateWorkTimer, 1000);
    isWorking = true;
    OnLogouIdlePop = false;
  } else if (lastActiveTimer === "break") {
    breakStartTime = Date.now();
    breakTimer = setInterval(updateBreakTimer, 1000);
    isOnBreak = true;
    OnLogouIdlePop = false;
  }
}

function yesButton() {
  const todayDate = new Date().toISOString().split("T")[0]; // Extract YYYY-MM-DD

  let existingLog = timeData.find((log) => log.date === todayDate);

  if (existingLog) {
    // If today's log exists, update it
    existingLog.WorkTime = workElapsed;
    existingLog.BreakTime = breakElapsed;
  } else {
    // If no log exists for today, add a new one
    timeData.push({
      date: todayDate,
      WorkTime: workElapsed,
      BreakTime: breakElapsed,
    });
  }
  document.getElementById("logout-pop-msg").style.display = "none";

  timeData.map((e) => {
    console.log(e.date, formatTime(e.WorkTime), formatTime(e.BreakTime));
  });

  toSaveDataInDataBase();

  // // Resume the last active timer only
  // if (lastActiveTimer === "work") {
  //   startTime = Date.now();
  //   workTimer = setInterval(updateWorkTimer, 1000);
  //   isWorking = true;
  //   OnLogouIdlePop = false;
  // } else if (lastActiveTimer === "break") {
  //   breakStartTime = Date.now();
  //   breakTimer = setInterval(updateBreakTimer, 1000);
  //   isOnBreak = true;
  //   OnLogouIdlePop = false;
  // }

  workElapsed = 0,
  breakElapsed = 0;
  document.getElementById("total-idle-time").innerText ="00:00:00"
  document.getElementById("display").innerText ="00:00:00"
  document.getElementById("break-time").innerText ="00:00:00"
  lastIdleValue = 0
}

//-------------------------------------- idel time counter------------------------------------------------------------
ipcRenderer.on("activityData", (event, arg) => {
  const { idleTime, sleepTime, lockTime } = arg;
  const IdleDate = new Date().toISOString().split("T")[0];

  let idle = idleTime ? parseInt(idleTime, 10) : 0;
  let sleep = sleepTime ? parseInt(sleepTime, 10) : 0;
  let lock = lockTime ? parseInt(lockTime, 10) : 0;
  let newIdleTime = idle + sleep + lock;

  // Reset idle time when break starts
  if (isOnBreak) {
    lastIdleValue = 0;
    return; // Don't show idle pop-up on break
  }

  if (OnLogouIdlePop) {
    lastIdleValue = 0;
    return;
  }

  if (idleTime >= 6) {
    document.getElementById("idle-pop-msg").innerHTML = newIdleTime - 6;
    document.getElementById("idle-pop-msg-container").style.display = "block";

    if (isWorking) {
      clearInterval(workTimer);
      workElapsed += Date.now() - startTime;
      isWorking = false;
      lastActiveTimer = "work";
      document.getElementById("start-btn").disabled = true;
    } else if (isOnBreak) {
      clearInterval(breakTimer);
      breakElapsed += Date.now() - breakStartTime;
      isOnBreak = false;
      lastActiveTimer = "break";
      document.getElementById("pause-btn").disabled = true;
    }

    isIdle = true;
    lastIdleValue = newIdleTime - 6;
  }

  document.getElementById("if-not-add-text").innerHTML = "";

  document.getElementById("idle-pop-msg-btn").onclick = () => {
    const idletimeReason = document
      .getElementById("idle-pop-msg-input")
      .value.trim();

    if (idletimeReason === "") {
      document.getElementById("if-not-add-text").innerHTML =
        "Please add a valid reason for idle time.";
      return;
    }

    if (lastActiveTimer === "work") {
      startTime = Date.now();
      workTimer = setInterval(updateWorkTimer, 1000);
      isWorking = true;
    } else if (lastActiveTimer === "break") {
      breakStartTime = Date.now();
      breakTimer = setInterval(updateBreakTimer, 1000);
      isOnBreak = true;
    }

    if (isIdle && idleTime === 0) {
      let existingEntry = timeData.find((entry) => entry.date === IdleDate);

      if (existingEntry) {
        existingEntry.totalIdleTime =
          (existingEntry.totalIdleTime || 0) + lastIdleValue;
        if (!existingEntry.idleMsg) existingEntry.idleMsg = [];
        existingEntry.idleMsg.push(idletimeReason);
      } else {
        timeData.push({
          date: IdleDate,
          totalIdleTime: lastIdleValue,
          idleMsg: [idletimeReason],
        });
      }

      lastIdleValue = 0;
      isIdle = false;
      console.log("Updated Time Data:", timeData);
      updateIdleTime();
    }

    console.log("Idle Time Reason:", idletimeReason);

    document.getElementById("idle-pop-msg-input").value = "";
    document.getElementById("idle-pop-msg-container").style.display = "none";
    document.getElementById("start-btn").disabled = false;
  };
});

//---------------------------signup-------------------------------------------------------

const userSignupData = localStorage.getItem("userSignupData");
if (userSignupData) {
  document.getElementById("after-signup-form-will-be-none").style.display =
    "none";
}

const parsedDataName = JSON.parse(userSignupData);
const name = parsedDataName?.data?.name; // Extract email
document.getElementById(
  "welocome-candidate-name"
).innerHTML = `Welcome ${name} !`;

async function signup(event) {
  event.preventDefault(); // Prevent form from refreshing the page

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  try {
    const response = await fetch("http://localhost:8000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }), // Convert to JSON
    });

    const data = await response.json(); // Get response from API

    if (response.ok && data) {
      // Save response data to local storage
      localStorage.setItem("userSignupData", JSON.stringify(data));
      document.getElementById(
        "alert-register-messages"
      ).innerHTML = `Signup successful!`;
      setTimeout(() => {
        console.log(data);
        document.getElementById("alert-register-messages").style.display =
          "none";
      }, 2000);
      document.getElementById("alert-register-messages").style.display =
        "block";
      document.getElementById("signupFormAppit").style.display = "none";
      document.getElementById("appit-surveillance").style.display = "block";
    } else {
      document.getElementById(
        "alert-register-messages"
      ).innerHTML = `Error:${data.message}`;
      setTimeout(() => {
        document.getElementById("alert-register-messages").style.display =
          "none";
      }, 2000);
      document.getElementById("alert-register-messages").style.display =
        "block";
    }
  } catch (error) {
    // console.error("Error during signup:", error);
    document.getElementById(
      "alert-register-messages"
    ).innerHTML = `Something went wrong. Please try again.`;
    setTimeout(() => {
      document.getElementById("alert-register-messages").style.display = "none";
    }, 2000);
    document.getElementById("alert-register-messages").style.display = "block";
  }
}

async function login() {
  // Get saved user data from localStorage
  const userSignupData = localStorage.getItem("userSignupData");

  if (!userSignupData) {
    document.getElementById(
      "alert-register-messages"
    ).innerHTML = `No user found. Please signup first.`;
    setTimeout(() => {
      document.getElementById("alert-register-messages").style.display = "none";
    }, 2000);
    document.getElementById("alert-register-messages").style.display = "block";
    return;
  }

  const parsedData = JSON.parse(userSignupData);
  const email = parsedData?.data?.email; // Extract email

  try {
    const response = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }), // Send only email
    });

    const data = await response.json(); // Get response from API

    if (response.ok && data) {
      // Save login response data to local storage
      // localStorage.setItem("userLoginData", JSON.stringify(data));

      document.getElementById(
        "alert-register-messages"
      ).innerHTML = `Login successful`;
      document.getElementById("signupFormAppit").style.display = "none";
      document.getElementById("appit-surveillance").style.display = "block";
      document.getElementById("alert-register-messages").style.display = "none";
      setTimeout(() => {
        document.getElementById("alert-register-messages").style.display =
          "none";
      }, 2000);
      document.getElementById("alert-register-messages").style.display =
        "block";
    } else {
      document.getElementById(
        "alert-register-messages"
      ).innerHTML = `Error : ${data.message}`;
      setTimeout(() => {
        document.getElementById("alert-register-messages").style.display =
          "none";
      }, 2000);
      document.getElementById("alert-register-messages").style.display =
        "block";
    }
  } catch (error) {
    console.error("Error during login:", error);
    document.getElementById(
      "alert-register-messages"
    ).innerHTML = `Something went wrong. Please try again.`;
    setTimeout(() => {
      document.getElementById("alert-register-messages").style.display = "none";
    }, 2000);
    document.getElementById("alert-register-messages").style.display = "block";
  }
}

// ------------------------------------fetch data---------------------------------------------

// Get saved user data from localStorage
async function toSaveDataInDataBase() {
  const userSignupData = localStorage.getItem("userSignupData");

  if (!userSignupData) {
    document.getElementById(
      "worktime-saving-messages"
    ).innerHTML = `No user found. Please signup first.`;
    setTimeout(() => {
      document.getElementById("worktime-saving-messages").style.display =
        "none";
    }, 2000);
    document.getElementById("worktime-saving-messages").style.display = "block";
    return;
  }

  const parsedDataForDataBase = JSON.parse(userSignupData);
  const email = parsedDataForDataBase?.data?.email;
  const name = parsedDataForDataBase?.data?.name;

  // Destructure the first object from the array
  const [{ date, WorkTime, BreakTime, idleMsg, totalIdleTime }] = timeData;

  // Create the payload with destructured values
  const payload = {
    name,
    email,
    date,
    WorkTime,
    BreakTime,
    idleMsg,
    totalIdleTime,
  };

  try {
    const response = await fetch(
      "http://localhost:8000/api/employee/TimeTrackingofUser",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (response.ok && data) {
      document.getElementById(
        "worktime-saving-messages"
      ).innerHTML = `Work time submitted successfully.`;
    } else {
      document.getElementById(
        "worktime-saving-messages"
      ).innerHTML = `Error: ${data.message}`;
    }
  } catch (error) {
    console.error("Error during submission:", error);
    document.getElementById(
      "worktime-saving-messages"
    ).innerHTML = `Something went wrong. Please try again.`;
  }

  // Display and hide message
  setTimeout(() => {
    document.getElementById("worktime-saving-messages").style.display = "none";
  }, 3000);
  document.getElementById("worktime-saving-messages").style.display = "block";
}
