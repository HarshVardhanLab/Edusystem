const EmptyState = ({ message = 'No data available', icon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
      {icon && <div className="text-6xl mb-4">{icon}</div>}
      <p className="text-xl font-medium text-gray-700">{message}</p>
      <p className="text-sm text-gray-500 mt-2">Get started by adding new records</p>
    </div>
  );
};

export default EmptyState;
