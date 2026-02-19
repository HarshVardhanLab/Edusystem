import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Sidebar = ({ menuItems }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen transition-all duration-300 relative shadow-2xl ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      {/* Logo Section */}
      <div className="p-6 flex items-center justify-center border-b border-gray-700">
        {!isCollapsed ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Library System
            </h2>
            <p className="text-xs text-gray-400 mt-1">Nova LBS</p>
          </div>
        ) : (
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            LS
          </div>
        )}
      </div>
      
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white p-2 rounded-full shadow-lg transition-all duration-300 z-50 border-2 border-gray-800"
        title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      
      {/* Navigation */}
      <nav className="mt-6 px-3">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-4'} py-3 mb-2 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/50' 
                  : 'hover:bg-gray-700/50'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <span className={`text-xl ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'} transition-colors`}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </div>
  );
};

export default Sidebar;
