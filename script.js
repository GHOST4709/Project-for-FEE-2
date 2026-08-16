/**
 * Bridge Campus Network - Main Application Script
 * Handles Theme Toggling, Form LocalStorage Bridge, Dynamic UI Updates, and Interactive Elements
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Element Selectors
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');
  const toast = document.getElementById('toast');
  const joinForm = document.getElementById('join-form');
  const rsvpButtons = document.querySelectorAll('.rsvp-btn');

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

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
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

  // --- Form Submission & LocalStorage Connection --- //

  if (joinForm) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const collegeInput = document.getElementById('college');

      if (nameInput && emailInput && collegeInput) {
        // Save user sign-up details into localStorage
        localStorage.setItem('bridge_user_name', nameInput.value.trim());
        localStorage.setItem('bridge_user_email', emailInput.value.trim());
        localStorage.setItem('bridge_user_college', collegeInput.value.trim());

        showToast('Access pass generated! Redirecting...');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 1000);
      }
    });
  }

  // --- Dynamic Dashboard Population --- //

  if (userNameEl || userCampusEl || userBadgeEl) {
    const storedName = localStorage.getItem('bridge_user_name');
    const storedEmail = localStorage.getItem('bridge_user_email');
    const storedCollege = localStorage.getItem('bridge_user_college');

    // Determine name display (Full Name -> First Name)
    let fullName = storedName;
    if (!fullName && storedEmail) {
      const nameFromEmail = storedEmail.split('@')[0].replace(/[._-]/g, ' ');
      fullName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    }
    if (!fullName) fullName = 'Alex Rivera';

    // Set Welcome Header with First Name
    if (userNameEl) {
      const firstName = fullName.trim().split(' ')[0];
      userNameEl.textContent = firstName;
    }

    // Set User Avatar Initials
    if (userBadgeEl) {
      const nameParts = fullName.trim().split(/\s+/);
      let initials = nameParts[0].charAt(0);
      if (nameParts.length > 1) {
        initials += nameParts[nameParts.length - 1].charAt(0);
      }
      userBadgeEl.textContent = initials.toUpperCase();
      userBadgeEl.setAttribute('title', fullName);
    }

    // Set College Subtitle
    if (userCampusEl) {
      const collegeName = storedCollege || 'Main Campus';
      userCampusEl.textContent = `${collegeName} • Student Pass Active`;
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