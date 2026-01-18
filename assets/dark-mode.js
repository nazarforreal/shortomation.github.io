// Dark mode functionality with system preference detection and localStorage persistence

(function () {
    'use strict';

    const THEME_KEY = 'theme-preference';
    const DARK_THEME = 'dark';
    const LIGHT_THEME = 'light';

    // Get saved theme preference or detect system preference
    function getPreferredTheme() {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return DARK_THEME;
        }

        return LIGHT_THEME;
    }

    // Apply theme to the document
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        updateToggleButton(theme);
    }

    // Update toggle button icon
    function updateToggleButton(theme) {
        const toggle = document.getElementById('dark-mode-toggle');
        if (toggle) {
            toggle.textContent = theme === DARK_THEME ? '☀️' : '🌙';
            toggle.setAttribute('aria-label', theme === DARK_THEME ? 'Switch to light mode' : 'Switch to dark mode');
        }
    }

    // Toggle theme
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
        const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

        applyTheme(newTheme);
        localStorage.setItem(THEME_KEY, newTheme);
    }

    // Initialize theme on page load
    function initTheme() {
        const theme = getPreferredTheme();
        applyTheme(theme);
    }

    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            // Only update if user hasn't set a manual preference
            if (!localStorage.getItem(THEME_KEY)) {
                applyTheme(e.matches ? DARK_THEME : LIGHT_THEME);
            }
        });
    }

    // Initialize theme immediately (before DOM loads to prevent flash)
    initTheme();

    // Set up toggle button when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            const toggle = document.getElementById('dark-mode-toggle');
            if (toggle) {
                toggle.addEventListener('click', toggleTheme);
            }
        });
    } else {
        const toggle = document.getElementById('dark-mode-toggle');
        if (toggle) {
            toggle.addEventListener('click', toggleTheme);
        }
    }

    // Export for potential external use
    window.darkMode = {
        toggle: toggleTheme,
        getTheme: () => document.documentElement.getAttribute('data-theme') || LIGHT_THEME,
        setTheme: applyTheme
    };
})();
