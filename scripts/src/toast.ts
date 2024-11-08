export function showToast(message: string, type: 'warning' | 'info' | 'error' | 'ok') {
    // Get or create toast container
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.left = '50%';
        container.style.transform = 'translateX(-50%)';
        container.style.width = '300px';
        container.style.zIndex = '1000';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '10px';
        document.body.appendChild(container);
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} merriweather`;
    toast.textContent = message;

    // Apply styles for toast
    toast.style.padding = '15px 25px';
    toast.style.borderRadius = '5px';
    toast.style.color = '#ffffff';
    toast.style.fontSize = '16px';
    toast.style.opacity = '1';
    toast.style.transition = 'opacity 0.5s ease';

    // Append toast to container
    container.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentElement === container) {
                container.removeChild(toast);
                if (container.children.length === 0) {
                    document.body.removeChild(container);
                }
            }
        }, 500);
    }, 3000);
}
