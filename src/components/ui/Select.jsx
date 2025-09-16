import React, { useState, useRef, useEffect } from 'react';

const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value || '');
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue);
    setIsOpen(false);
    if (onValueChange) {
      onValueChange(newValue);
    }
  };

  return (
    <div ref={selectRef} className="relative w-full" {...props}>
      {React.Children.map(children, (child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            onClick: () => setIsOpen(!isOpen),
            isOpen,
            selectedValue
          });
        }
        if (child.type === SelectContent) {
          return React.cloneElement(child, {
            isOpen,
            onValueChange: handleValueChange
          });
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = ({ children, onClick, isOpen, selectedValue, className = '' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm
        placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
        disabled:cursor-not-allowed disabled:opacity-50
        dark:border-gray-700 dark:bg-gray-800 dark:text-white
        ${className}
      `.trim()}
    >
      {children}
      <svg
        className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
};

const SelectValue = ({ placeholder, children }) => {
  return <span className="text-left">{children || placeholder}</span>;
};

const SelectContent = ({ children, isOpen, onValueChange }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-gray-300 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
      {React.Children.map(children, (child) => {
        if (child.type === SelectItem) {
          return React.cloneElement(child, { onValueChange });
        }
        return child;
      })}
    </div>
  );
};

const SelectItem = ({ children, value, onValueChange }) => {
  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-700 dark:focus:bg-gray-700 dark:text-white"
    >
      {children}
    </button>
  );
};

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };
