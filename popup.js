const statusText = document.getElementById("status");
const startBtn = document.getElementById("start");
const stopBtn = document.getElementById("stop");
const resetBtn = document.getElementById("reset");

// START session
startBtn.onclick = () => {
  chrome.storage.local.set({ sessionActive: true }, () => {
    loadStatus();
  });
};

// STOP session
stopBtn.onclick = () => {
  chrome.storage.local.set({ sessionActive: false }, () => {
    loadStatus();
  });
};

// RESET data
resetBtn.onclick = () => {
  if (confirm("Reset all posted groups?")) {
    chrome.storage.local.clear(() => {
      statusText.textContent = "Session reset. No data saved.";
      statusText.style.color = "gray";
    });
  }
};

// MAIN LOGIC
function loadStatus() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url || "";
    const match = url.match(/groups\/(\d+)/);
    const groupId = match ? match[1] : null;

    chrome.storage.local.get(["sessionActive", "groups"], (data) => {
      const sessionActive = data.sessionActive;
      const groups = data.groups || {};

      if (!sessionActive) {
        statusText.textContent = "⏸ Session stopped";
        statusText.style.color = "gray";
        return;
      }

      if (!groupId) {
        statusText.textContent = "Not a Facebook group page";
        statusText.style.color = "gray";
        return;
      }

      if (groups[groupId]) {
        statusText.textContent =
          "✅ Already posted — no need to post in this group";
        statusText.style.color = "green";
      } else {
        statusText.textContent =
          "❌ Not posted yet — you can post in this group";
        statusText.style.color = "red";
      }
    });
  });
}

// Load status when popup opens
loadStatus();
