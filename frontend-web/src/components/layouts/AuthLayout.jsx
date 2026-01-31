const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Library System</h1>
          <p className="text-gray-600 mt-2">Manage your library efficiently</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
