import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false, 
  error, 
  disabled = false,
  multiline = false,
  rows = 3,
  icon,
  help,
  min,
  max
}) => {
  const inputClasses = `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
    error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''} ${
    icon ? 'pl-10' : ''
  }`;

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon icon={icon} className="text-gray-400" />
          </div>
        )}
        
        {multiline ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={inputClasses}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            min={min}
            max={max}
            className={inputClasses}
          />
        )}
      </div>
      
      {help && !error && (
        <p className="text-gray-500 text-xs mt-1">{help}</p>
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <FontAwesomeIcon icon="exclamation-circle" className="mr-1" />
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
