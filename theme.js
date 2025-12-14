// ===============================================
// Theme Toggle Functionality
// ===============================================
const themeToggleBtn = document.getElementById('theme-toggle');
const body = document.body;

// Function to set theme
function setTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = '🌙';
    } else {
        body.classList.remove('dark-mode');
        if (themeToggleBtn) themeToggleBtn.textContent = '☀';
    }
    localStorage.setItem('theme', theme);
}

// Function to toggle theme
function toggleTheme() {
    const currentTheme = body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Load saved theme on page load
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Listen for theme changes from other tabs/windows
window.addEventListener('storage', (e) => {
    if (e.key === 'theme') {
        setTheme(e.newValue);
    }
});

// Add event listener to theme toggle button
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}
