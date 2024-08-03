import Sidebar from '@/components/ui/Navbar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow p-4 bg-gray-100 text-black ml-64 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
