'use client'
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faChartLine,
  faBell,
  faTags,
  faUserFriends,
  faCog,
  faEnvelope,
  faChevronDown,
  faChevronRight,
  faBars,
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar: React.FC<{ isSidebarOpen: boolean, toggleSidebar: () => void }> = ({ isSidebarOpen, toggleSidebar }) => {
  const pathname = usePathname();
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(false);

  const togglePerformance = () => setIsPerformanceOpen(!isPerformanceOpen);

  const menuItems = [
    { name: 'Dashboard', icon: faTachometerAlt, url: '/home' },
    { name: 'Subscription Manager', icon: faEnvelope, url: '/home/subscription' },
    { name: 'Notifications', icon: faBell, url: '/home/notification' },
    { name: 'Promo Codes', icon: faTags, url: '/home/promo-codes' },
    { name: 'Influencer', icon: faUserFriends, url: '/home/influencer' },
    { name: 'Additional Settings', icon: faCog, url: '/home/settings' },
  ];

  const performanceSubItems = [
    { name: 'CTC', icon: faChartLine, url: '/home/ctc' },
    { name: 'NPS', icon: faChartLine, url: '/home/nps' },
  ];

  return (
    <div>
      <nav
        className={`fixed inset-y-0 left-0 z-30 w-64 p-4 bg-[#003654] text-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:flex md:flex-col md:h-full`}
      >
        <div className="flex items-center justify-center mb-6">
          <h1 className="text-2xl font-bold">Jodloo</h1>
        </div>
        <div className="space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.url}
              className={`nav-link ${
                pathname === item.url ? 'active' : ''
              }`}
              onClick={toggleSidebar}
            >
              <FontAwesomeIcon icon={item.icon} className="mr-2 text-base" />
              <span className="text-sm">{item.name}</span>
            </Link>
          ))}
          <div className="nav-link cursor-pointer" onClick={togglePerformance}>
            <FontAwesomeIcon icon={faChartLine} className="mr-2 text-base" />
            <span className="text-sm">Performance Data</span>
            <FontAwesomeIcon icon={isPerformanceOpen ? faChevronDown : faChevronRight} className="ml-auto text-base" />
          </div>
          {isPerformanceOpen && (
            <div className="ml-6 space-y-2">
              {performanceSubItems.map((subItem) => (
                <Link
                  key={subItem.name}
                  href={subItem.url}
                  className={`nav-link ${
                    pathname === subItem.url ? 'active' : ''
                  }`}
                  onClick={toggleSidebar}
                >
                  <FontAwesomeIcon icon={subItem.icon} className="mr-2 text-base" />
                  <span className="text-sm">{subItem.name}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Sidebar;
