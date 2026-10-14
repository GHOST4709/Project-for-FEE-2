import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import InputField from '../components/ui/InputField';
import { TabList } from '../components/ui/Tabs';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useForm } from '../hooks/useForm';
import { createValidator, email, minLength, required } from '../utils/validators';

// Validation rules live outside the component so they're created once.
const validateLogin = createValidator({
  email: [required('Email'), email()],
  password: [required('Password')],
});

const validateSignup = createValidator({
  name: [required('Full name'), minLength(2, 'Full name')],
  email: [required('Email'), email()],
  college: [required('College name'), minLength(2, 'College name')],
  password: [required('Password'), minLength(6, 'Password')],
});

const LOGIN_INITIAL = { email: '', password: '' };
const SIGNUP_INITIAL = { name: '', email: '', college: '', password: '' };

const AUTH_TABS = [
  { id: 'login', label: 'Log in' },
  { id: 'signup', label: 'Create account' },
];

export default function LoginPage() {
  useDocumentTitle('Bridge — Log in');

  const { isLoggedIn, login, signup, loginAsGuest } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // "Already signed in? Skip the gate": checked once on arrival, so the short
  // delay after a successful login (toast -> redirect) still plays out.
  const [alreadySignedIn] = useState(isLoggedIn);

  // Deep link: the landing page's "Join Free" CTA links here with ?tab=signup.
  const [tab, setTab] = useState(searchParams.get('tab') === 'signup' ? 'signup' : 'login');
  const isSignup = tab === 'signup';

  // Pending redirect timers are cleared if the user leaves the page early.
  const redirectTimer = useRef(null);
  useEffect(() => () => clearTimeout(redirectTimer.current), []);
  const goToDashboard = (delay) => {
    redirectTimer.current = setTimeout(() => navigate('/dashboard'), delay);
  };

  const loginForm = useForm({
    initialValues: LOGIN_INITIAL,
    validate: validateLogin,
    onSubmit: (values) => {
      const result = login(values);

      if (!result.ok && result.reason === 'not_found') {
        showToast('No account with that email — try creating one');
        setTab('signup');
        signupForm.setValue('email', values.email.trim().toLowerCase());
        return;
      }
      if (!result.ok) {
        showToast('Incorrect password. Try again.');
        return;
      }

      showToast(`Welcome back, ${result.user.name.split(' ')[0]}!`);
      goToDashboard(700);
    },
  });

  const signupForm = useForm({
    initialValues: SIGNUP_INITIAL,
    validate: validateSignup,
    onSubmit: (values) => {
      const result = signup(values);

      if (!result.ok) {
        showToast('An account already exists for that email — log in instead');
        setTab('login');
        loginForm.setValue('email', values.email.trim().toLowerCase());
        return;
      }

      showToast('Account created! Redirecting...');
      goToDashboard(700);
    },
  });

  const handleGuest = () => {
    loginAsGuest();
    showToast('Continuing as guest...');
    goToDashboard(500);
  };

  if (alreadySignedIn) return <Navigate to="/dashboard" replace />;

  const heading = isSignup ? 'Create your pass' : 'Welcome back';
  const subheading = isSignup ? 'Free forever for verified students.' : 'Log in to reach your dashboard.';

  const switchTo = (next) => (event) => {
    event.preventDefault();
    setTab(next);
  };

  return (
    <main className="auth-shell">
      <div className="ticket auth-card">
        <div className="ticket-top">
          <p className="section-eyebrow">CAMPUS PASS</p>
          <h2 id="auth-heading">{heading}</h2>
          <p className="ticket-sub" id="auth-subheading">
            {subheading}
          </p>
        </div>

        <TabList tabs={AUTH_TABS} active={tab} onChange={setTab} className="carpool-tabs auth-tabs" idPrefix="tab" />

        {/* Both forms stay mounted (just hidden) so typed values survive switching tabs. */}
        <form
          id="login-form"
          className="auth-form"
          ref={loginForm.formRef}
          onSubmit={loginForm.handleSubmit}
          noValidate
          style={{ display: isSignup ? 'none' : 'flex' }}
        >
          <InputField
            id="login-email"
            label="University Email"
            type="email"
            placeholder="alex@university.edu"
            required
            {...loginForm.getFieldProps('email')}
          />
          <InputField
            id="login-password"
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            {...loginForm.getFieldProps('password')}
          />
          <button type="submit" className="btn btn-primary btn-full">
            Log in
          </button>
        </form>

        <form
          id="signup-form"
          className="auth-form"
          ref={signupForm.formRef}
          onSubmit={signupForm.handleSubmit}
          noValidate
          style={{ display: isSignup ? 'flex' : 'none' }}
        >
          <InputField
            id="signup-name"
            label="Full Name"
            type="text"
            placeholder="Alex Rivera"
            required
            {...signupForm.getFieldProps('name')}
          />
          <InputField
            id="signup-email"
            label="University Email"
            type="email"
            placeholder="alex@university.edu"
            required
            {...signupForm.getFieldProps('email')}
          />
          <InputField
            id="signup-college"
            label="College / University Name"
            type="text"
            placeholder="e.g. Stanford University"
            required
            {...signupForm.getFieldProps('college')}
          />
          <InputField
            id="signup-password"
            label="Create Password"
            type="password"
            placeholder="At least 6 characters"
            required
            minLength={6}
            {...signupForm.getFieldProps('password')}
          />
          <button type="submit" className="btn btn-primary btn-full">
            Create free account
          </button>
        </form>

        <div className="auth-divider">
          <span>or</span>
        </div>
        <button type="button" className="btn btn-ghost btn-full" id="guest-btn" onClick={handleGuest}>
          Continue as guest
        </button>

        <p className="form-note" id="auth-switch-note">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <a href="#" className="auth-header-link" onClick={switchTo('login')}>
                Log in
              </a>
            </>
          ) : (
            <>
              New to Bridge?{' '}
              <a href="#" className="auth-header-link" onClick={switchTo('signup')}>
                Create a free account
              </a>
            </>
          )}
        </p>
      </div>
    </main>
  );
}
