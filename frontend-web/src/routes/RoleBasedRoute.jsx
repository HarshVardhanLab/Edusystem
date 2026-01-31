import { Navigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth';

const RoleBasedRoute = ({ children, allowedRole }) => {
  const userRole = getUserRole();

  if (userRole !== allowedRole) {
    const redirectPath = userRole === 'LIBRARY_OWNER' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default RoleBasedRoute;
