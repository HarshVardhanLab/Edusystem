import { Navigate } from 'react-router-dom';
import { getUserRole } from '../utils/auth';

const RoleBasedRoute = ({ children, allowedRole }) => {
  const userRole = getUserRole();
  console.log('RoleBasedRoute: userRole:', userRole, 'allowedRole:', allowedRole);

  if (userRole !== allowedRole) {
    let redirectPath = '/login';
    
    if (userRole === 'SUPER_ADMIN') {
      redirectPath = '/superadmin/dashboard';
    } else if (userRole === 'LIBRARY_OWNER') {
      redirectPath = '/admin/dashboard';
    } else if (userRole === 'STUDENT') {
      redirectPath = '/student/dashboard';
    }
    
    console.log('RoleBasedRoute: Redirecting to:', redirectPath);
    return <Navigate to={redirectPath} replace />;
  }

  console.log('RoleBasedRoute: Access granted, rendering children');
  return children;
};

export default RoleBasedRoute;
