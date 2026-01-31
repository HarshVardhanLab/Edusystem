export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/v1/accounts/login/',
  REGISTER: '/api/v1/accounts/register/',
  PROFILE: '/api/v1/accounts/profile/',
  LOGOUT: '/api/v1/accounts/logout/',
  TOKEN_REFRESH: '/api/v1/accounts/token/refresh/',
  
  // Library
  LIBRARY_CREATE: '/api/v1/libraries/create/',
  LIBRARY_DETAIL: '/api/v1/libraries/detail/',
  LIBRARY_LIST: '/api/v1/libraries/',
  
  // Students
  STUDENTS: '/api/v1/students/',
  STUDENT_CREATE: '/api/v1/students/create/',
  STUDENT_BULK_UPLOAD: '/api/v1/students/bulk-upload/',
  STUDENT_DETAIL: (id) => `/api/v1/students/${id}/`,
  STUDENT_DEACTIVATE: (id) => `/api/v1/students/${id}/deactivate/`,
  STUDENT_ACTIVATE: (id) => `/api/v1/students/${id}/activate/`,
  STUDENT_DELETE: (id) => `/api/v1/students/${id}/delete/`,
  
  // Seats
  SEATS: '/api/v1/seats/',
  SEAT_CREATE: '/api/v1/seats/create/',
  SEAT_DETAIL: (id) => `/api/v1/seats/${id}/`,
  SEAT_ASSIGN: (id) => `/api/v1/seats/${id}/assign/`,
  SEAT_FREE: (id) => `/api/v1/seats/${id}/free/`,
  SEAT_DELETE: (id) => `/api/v1/seats/${id}/delete/`,
  
  // Attendance
  ATTENDANCE: '/api/v1/attendance/',
  ATTENDANCE_MARK: '/api/v1/attendance/mark/',
  ATTENDANCE_DAILY: '/api/v1/attendance/daily/',
  ATTENDANCE_MONTHLY: '/api/v1/attendance/monthly-summary/',
  
  // Subscriptions
  SUBSCRIPTIONS: '/api/v1/subscriptions/',
  SUBSCRIPTION_CREATE: '/api/v1/subscriptions/create/',
  SUBSCRIPTION_DETAIL: (id) => `/api/v1/subscriptions/${id}/`,
  SUBSCRIPTION_PAYMENT: (id) => `/api/v1/subscriptions/${id}/payment/`,
  SUBSCRIPTION_EXPIRING: '/api/v1/subscriptions/expiring/',
  
  // Notifications
  NOTIFICATIONS: '/api/v1/notifications/',
  NOTIFICATION_CREATE: '/api/v1/notifications/create/',
  NOTIFICATION_DETAIL: (id) => `/api/v1/notifications/${id}/`,
  NOTIFICATION_MARK_READ: (id) => `/api/v1/notifications/${id}/mark-read/`,
  NOTIFICATION_MARK_ALL_READ: '/api/v1/notifications/mark-all-read/',
  
  // Reports
  DASHBOARD: '/api/v1/reports/dashboard/',
  MONTHLY_ATTENDANCE_REPORT: '/api/v1/reports/monthly-attendance/',
  STUDENT_REPORT: '/api/v1/reports/students/',
};
