// src/ui-components.ts
class UIComponents {
  notificationContainer = null;
  constructor() {
    this.createNotificationContainer();
  }
  createNotificationContainer() {
    if (document.getElementById("notification-container"))
      return;
    this.notificationContainer = document.createElement("div");
    this.notificationContainer.id = "notification-container";
    this.notificationContainer.className = "fixed top-4 right-4 z-50 flex flex-col gap-2";
    document.body.appendChild(this.notificationContainer);
  }
  showNotification(message, options = {}) {
    const { type = "info", duration = 3000 } = options;
    const notification = document.createElement("div");
    notification.className = `
      p-4 rounded-lg shadow-lg max-w-sm
      transform transition-all duration-300
      flex items-center gap-3
      ${this.getNotificationClasses(type)}
    `;
    const icon = this.getNotificationIcon(type);
    notification.innerHTML = `
      <span class="text-xl">${icon}</span>
      <span class="flex-1">${message}</span>
      <button class="text-current opacity-50 hover:opacity-100 transition-opacity" onclick="this.parentElement.remove()">
        ×
      </button>
    `;
    this.notificationContainer?.appendChild(notification);
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
      notification.style.opacity = "1";
    }, 10);
    setTimeout(() => {
      notification.style.opacity = "0";
      notification.style.transform = "translateX(100%)";
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
  getNotificationClasses(type) {
    const classes = {
      success: "bg-green-50 text-green-800 border border-green-200",
      error: "bg-red-50 text-red-800 border border-red-200",
      warning: "bg-yellow-50 text-yellow-800 border border-yellow-200",
      info: "bg-blue-50 text-blue-800 border border-blue-200"
    };
    return classes[type] || classes.info;
  }
  getNotificationIcon(type) {
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ"
    };
    return icons[type] || icons.info;
  }
  showModal(content, title) {
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm";
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        ${title ? `
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-xl font-semibold text-gray-900">${title}</h3>
          </div>
        ` : ""}
        <div class="px-6 py-4 overflow-y-auto max-h-[60vh]">
          ${content}
        </div>
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors" onclick="this.closest('.fixed').remove()">
            Close
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }
  formatJSON(data) {
    return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>${JSON.stringify(data, null, 2)}</code></pre>`;
  }
  addCustomField(containerId) {
    const container = document.getElementById(containerId);
    if (!container)
      return;
    const row = document.createElement("div");
    row.className = "flex gap-2 items-center";
    row.innerHTML = `
      <input type="text" placeholder="Key" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent custom-key">
      <input type="text" placeholder="Value" class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent custom-value">
      <button type="button" class="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors" onclick="this.parentElement.remove()">
        ×
      </button>
    `;
    container.appendChild(row);
  }
  collectCustomFields(containerId) {
    const container = document.getElementById(containerId);
    if (!container)
      return {};
    const rows = container.querySelectorAll(".flex");
    const customFields = {};
    rows.forEach((row) => {
      const keyInput = row.querySelector(".custom-key");
      const valueInput = row.querySelector(".custom-value");
      if (keyInput && valueInput) {
        const key = keyInput.value.trim();
        const value = valueInput.value.trim();
        if (key && value) {
          const numValue = Number(value);
          customFields[key] = isNaN(numValue) ? value : numValue;
        }
      }
    });
    return customFields;
  }
}
var ui = new UIComponents;
export {
  ui,
  UIComponents
};
