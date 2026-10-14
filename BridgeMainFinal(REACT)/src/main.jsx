import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { http } from './services/http';
import { setupMockApi } from './services/mockServer';
import { store } from './store';

import './styles/styles.css'; // original stylesheet, unchanged
import './styles/extras.css'; // only for the new UI states (errors, modal, spinner, pagination)

// No backend yet: serve the REST endpoints from an in-browser mock.
// Set VITE_USE_MOCK_API=false to talk to a real server instead.
if (import.meta.env.VITE_USE_MOCK_API !== 'false') {
  setupMockApi(http);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <ToastProvider>
          <ThemeProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ThemeProvider>
        </ToastProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
