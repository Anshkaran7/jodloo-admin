'use client'
import { useState } from 'react';
import Sidebar from '@/components/ui/Navbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col flex-grow w-full">
        <div className="flex items-center justify-between p-4 bg-[#003654] text-white md:hidden">
          <h1 className="text-2xl font-bold">Jodloo</h1>
          <button onClick={toggleSidebar} title="Toggle Sidebar">
            <FontAwesomeIcon icon={faBars} className="text-2xl" />
          </button>
        </div>
        <div className="flex-grow p-4 bg-gray-100 text-black overflow-auto">
          {children}
        </div>
      </div>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Layout;
