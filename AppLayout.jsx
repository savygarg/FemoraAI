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
        </main>
      </div>
    </div>
  );
}

export default AppLayout;