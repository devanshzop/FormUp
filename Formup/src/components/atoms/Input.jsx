import { forwardRef } from 'react';

const Input = forwardRef(({ 
  label, 
  error, 
  className = '',
  required = false,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={props.id} 
          className="block text-sm font-medium text-gray-700 "
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500  ${className}`}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 ">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';


export default Input;