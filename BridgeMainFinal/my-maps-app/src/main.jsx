import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { IssuesProvider } from './context/IssuesContext.jsx';
import './styles/global.css';
import './styles/header.css';
import './styles/sidebar.css';
import './styles/footer.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <IssuesProvider>
          <App />
        </IssuesProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
