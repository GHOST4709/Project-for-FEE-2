// /**
//  * Bridge Campus Network - Main Application Script
//  * Handles Theme Toggling, Session/Logout, Dynamic UI Updates, and Interactive Elements
//  *
//  * Auth note: sessions are mocked entirely in localStorage (bridge_logged_in,
//  * bridge_user_name/email/college, and a bridge_users "table" of signed-up
//  * accounts). There's no backend in this build, so passwords are compared in
//  * plain text client-side — that's fine for a prototype, never do this for a
//  * real product. See login.html for the sign-up/log-in logic itself.
//  */

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2200);
}

function logout() {
  localStorage.removeItem('bridge_logged_in');
  localStorage.removeItem('bridge_user_name');
  localStorage.removeItem('bridge_user_email');
  localStorage.removeItem('bridge_user_college');
  window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
  // DOM Element Selectors
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');
  const rsvpButtons = document.querySelectorAll('.rsvp-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const navAuthCta = document.getElementById('nav-auth-cta');

  // Dynamic Dashboard Elements
  const userNameEl = document.getElementById('user-name');
  const userCampusEl = document.getElementById('user-campus');
  const userBadgeEl = document.getElementById('user-badge');

  // --- Theme Management --- //

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme, showNotification = false) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (themeIcon && themeLabel) {
      if (theme === 'dark') {
        themeIcon.textContent = '☀️';
        themeLabel.textContent = 'Light';
      } else {
        themeIcon.textContent = '🌙';
        themeLabel.textContent = 'Dark';
      }
    }

    if (showNotification) {
      showToast(`Switched to ${theme} mode`);
    }

    // Some pages (map.html) re-skin a live Google Map on theme change.
    if (typeof window.onBridgeThemeChange === 'function') {
      window.onBridgeThemeChange(theme);
    }
  }

  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme, true);
    });
  }

  window.addEventListener('storage', (event) => {
    if (event.key === 'theme' && event.newValue) {
      applyTheme(event.newValue, false);
    }
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // --- Landing page nav CTA: reflects session state --- //

  if (navAuthCta) {
    const isLoggedIn = localStorage.getItem('bridge_logged_in') === 'true';
    if (isLoggedIn) {
      navAuthCta.textContent = 'Dashboard →';
      navAuthCta.href = 'dashboard.html';
    }
  }

  // --- Logout --- //

  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  // --- Dynamic Dashboard Population --- //
  // (Protected pages redirect to login.html before this ever runs with no
  // session, so a real name/email/college is always present here.)

  if (userNameEl || userCampusEl || userBadgeEl) {
    const storedName = localStorage.getItem('bridge_user_name') || 'Student';
    const storedCollege = localStorage.getItem('bridge_user_college') || 'Main Campus';

    if (userNameEl) {
      const firstName = storedName.trim().split(' ')[0];
      userNameEl.textContent = firstName;
    }

    if (userBadgeEl) {
      const nameParts = storedName.trim().split(/\s+/);
      let initials = nameParts[0].charAt(0);
      if (nameParts.length > 1) {
        initials += nameParts[nameParts.length - 1].charAt(0);
      }
      userBadgeEl.textContent = initials.toUpperCase();
      userBadgeEl.setAttribute('title', storedName);
    }

    if (userCampusEl) {
      userCampusEl.textContent = `${storedCollege} • Student Pass Active`;
    }
  }

  // --- RSVP Button Handler --- //

  if (rsvpButtons.length > 0) {
    rsvpButtons.forEach((button) => {
      button.addEventListener('click', function () {
        const isAttending = this.classList.contains('btn-primary');

        if (isAttending) {
          this.classList.remove('btn-primary');
          this.classList.add('btn-ghost');
          this.textContent = 'RSVP';
          showToast('RSVP Cancelled');
        } else {
          this.classList.remove('btn-ghost');
          this.classList.add('btn-primary');
          this.textContent = 'Going ✓';
          showToast('Attending Event!');
        }
      });
    });
  }
});