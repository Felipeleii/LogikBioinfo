/**
 * Theme Toggle Functionality
 * Allows switching between dark and light mode with localStorage persistence
 */

// Initialize theme on page load
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.classList.toggle('light', savedTheme === 'light');
  updateThemeIcon(savedTheme);
}

// Toggle between dark and light theme
function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light');
  const newTheme = isLight ? 'light' : 'dark';
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

// Update the theme icon based on current theme
function updateThemeIcon(theme) {
  const icons = document.querySelectorAll('.theme-toggle-icon');
  icons.forEach(icon => {
    icon.className = theme === 'light' 
      ? 'fas fa-moon theme-toggle-icon' 
      : 'fas fa-sun theme-toggle-icon';
  });
}

// Initialize theme when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTheme);
} else {
  initTheme();
}
