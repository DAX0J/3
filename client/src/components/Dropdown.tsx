import { useState, useEffect, useRef } from 'react';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const Dropdown = ({ label, options, value, onChange, className = '' }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(option => option.value === value) || options[0];

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button 
        className="flex items-center bg-[#1A1A1A] px-4 py-2 uppercase tracking-wider text-sm"
        onClick={toggleDropdown}
        type="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {label}: {selectedOption.label}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div 
        className={`absolute left-0 mt-1 w-48 bg-[#1A1A1A] z-10 transition-all duration-200 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
        <div className="py-2 px-4">
          {options.map((option) => (
            <div 
              key={option.value}
              className="py-1 text-sm cursor-pointer hover:text-[#999999] transition-colors"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
