import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ menuItems }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-gray-800 text-white min-h-screen transition-all duration-300 relative ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Curved top and bottom edges */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-gray-100 rounded-bl-3xl"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 bg-gray-100 rounded-tl-3xl"></div>
      
      {/* Collapse button in the middle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-1/2 -right-3 transform -translate-y-1/2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-full shadow-lg transition-all duration-300 z-50 border-2 border-gray-600"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      
      <div className="p-6 flex items-center justify-center">
        {!isCollapsed ? (
          <h2 className="text-2xl font-bold">Library System</h2>
        ) : (
          <div className="text-2xl font-bold">LS</div>
        )}
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'px-6'} py-3 hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-gray-700 border-l-4 border-blue-500' : ''
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <span className={`text-xl ${isCollapsed ? '' : 'mr-3'}`}>{item.icon}</span>
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
