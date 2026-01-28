const statusText = document.getElementById("status");

chrome.storage.local.get("sessionActive", (data) => {
  updateStatus(data.sessionActive);
});

document.getElementById("start").onclick = () => {
  chrome.storage.local.set({ sessionActive: true });
  updateStatus(true);
};

document.getElementById("stop").onclick = () => {
  chrome.storage.local.set({ sessionActive: false });
  updateStatus(false);
};

document.getElementById("reset").onclick = () => {
  if (confirm("Reset all posted groups?")) {
    chrome.storage.local.clear();
    statusText.textContent = "Session: Reset Done";
  }
};

function updateStatus(active) {
  if (active) {
    statusText.textContent = "Session: ACTIVE";
    statusText.style.color = "green";
  } else {
    statusText.textContent = "Session: STOPPED";
    statusText.style.color = "red";
  }
}
