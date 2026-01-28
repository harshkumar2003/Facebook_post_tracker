function getGroupId() {
  const match = window.location.href.match(/groups\/(\d+)/);
  return match ? match[1] : null;
}

const groupId = getGroupId();
if (!groupId) return;

chrome.storage.local.get(["sessionActive", "groups"], (data) => {
  const sessionActive = data.sessionActive;
  const groups = data.groups || {};

  const badge = document.createElement("div");
  badge.style.position = "fixed";
  badge.style.bottom = "20px";
  badge.style.right = "20px";
  badge.style.padding = "10px";
  badge.style.color = "#fff";
  badge.style.zIndex = "9999";
  badge.style.borderRadius = "6px";
  badge.style.cursor = "pointer";

  if (groups[groupId]) {
    badge.textContent = "✅ Already Posted";
    badge.style.background = "green";
  } else {
    badge.textContent = "❌ Not Posted";
    badge.style.background = "red";
  }

  if (sessionActive && !groups[groupId]) {
    badge.onclick = () => {
      groups[groupId] = {
        url: window.location.href,
        postedAt: new Date().toISOString()
      };
      chrome.storage.local.set({ groups }, () => {
        badge.textContent = "✅ Already Posted";
        badge.style.background = "green";
      });
    };
  }

  if (!sessionActive) {
    badge.textContent += " (Session OFF)";
    badge.style.background = "gray";
  }

  document.body.appendChild(badge);
});
