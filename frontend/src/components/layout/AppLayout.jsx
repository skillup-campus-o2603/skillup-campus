import { Outlet } from 'react-router';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function AppLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content" id="contenido-principal">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
