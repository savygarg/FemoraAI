import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';
import Sidebar from './Sidebar';

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="app-layout">
      <Navbar onMenuToggle={toggleSidebar} />

      <div className="app-layout__body">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
        />

        <main className="app-layout__main">
          <Outlet />
          <footer className="app-disclaimer">
            <strong>Health information notice:</strong> FemoraAI predictions and
            AI-generated explanations are for information only, not medical diagnoses
            or a replacement for professional advice. Consult a qualified healthcare
            professional for diagnosis, treatment, abnormal results, or persistent
            concerns. Seek appropriate emergency care for emergency symptoms.
          </footer>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;