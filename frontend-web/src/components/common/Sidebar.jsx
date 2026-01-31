import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ menuItems }) => {
  const location = useLocation();

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-6">
        <h2 className="text-2xl font-bold">Library System</h2>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 hover:bg-gray-700 transition-colors ${
                isActive ? 'bg-gray-700 border-l-4 border-blue-500' : ''
              }`}
            >
              {item.icon && <span className="mr-3">{item.icon}</span>}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
