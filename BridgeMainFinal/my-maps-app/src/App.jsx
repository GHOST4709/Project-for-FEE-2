import { Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import ReportIssue from './pages/ReportIssue';
import Announcements from './pages/Announcements';
import Community from './pages/Community';
import TrackAdmin from './pages/TrackAdmin';
import NotFound from './pages/NotFound';
import './styles/App.css';

/**
 * Top-level shell: a persistent Header/Footer around whichever page the
 * router matches. Each page owns its own state (search, filters, forms) —
 * this component's only job is routing.
 */
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/community" element={<Community />} />
        <Route path="/track-admin" element={<TrackAdmin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
