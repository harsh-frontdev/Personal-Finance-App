export function showToast(message, type = "success") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "fixed bottom-6 right-6 z-[2000] flex flex-col gap-3 pointer-events-none";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "bg-white border border-border shadow-xl rounded-xl p-4 flex items-center gap-3 transform transition-all duration-300 translate-y-8 opacity-0 pointer-events-auto min-w-[300px]";
  
  const iconSpan = document.createElement("span");
  iconSpan.className = "material-symbols-rounded text-[1.5rem]";
  if (type === "success") {
    iconSpan.textContent = "check_circle";
    iconSpan.classList.add("text-[#16a34a]");
  } else if (type === "error") {
    iconSpan.textContent = "error";
    iconSpan.classList.add("text-[#dc2626]");
  } else {
    iconSpan.textContent = "info";
    iconSpan.classList.add("text-primary");
  }

  const messageDiv = document.createElement("div");
  messageDiv.className = "text-sm font-semibold text-main font-manrope";
  messageDiv.textContent = message;

  toast.appendChild(iconSpan);
  toast.appendChild(messageDiv);
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-8", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
  });

  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-8", "opacity-0");
    
    setTimeout(() => {
      toast.remove();
      if (container.children.length === 0) {
        container.remove();
      }
    }, 300);
  }, 3000);
}
