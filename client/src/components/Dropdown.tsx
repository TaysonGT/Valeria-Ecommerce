import React, { useState, useRef, useEffect } from 'react';

interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  color?: string;
  onClick: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items?: DropdownItem[];
  position?: 'left' | 'right';
  align?: 'top' | 'bottom';
}

export const Dropdown: React.FC<React.PropsWithChildren<DropdownProps>> = ({ 
  trigger,
  position = 'right',
  items,
  align = 'bottom'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <div className='cursor-pointer' onClick={() => setIsOpen(prev=>!prev)}>
        {trigger}
      </div>
      
      <div
        className={`absolute z-50 mt-2 ${
          position === 'right' ? 'right-0' : 'left-0'
        } ${
          align === 'top' ? 'bottom-full mb-2' : ''
        } ${
          isOpen? 'opacity-100 pointer-events-auto translate-y-0 scale-100':'opacity-0 pointer-events-none translate-y-4 scale-95'
        }
        w-46 duration-200 ease-in-out rounded-sm shadow-lg bg-white text-black text-sm ring-1 ring-gray-300 p-2`}
      >
        <ul>
          {/* {items} */}
          {items?.map((item, index) => (
            <li key={index} 
              className={`flex items-center gap-3 rounded-lg p-2 pl-3 cursor-pointer duration-75 hover:bg-gray-50 ${item.color? `text-${item.color}` : ''}`} 
              onClick={()=>{
                item.onClick()
                setIsOpen(false);
              }}>
              {item.icon && <span className="className='text-lg'">{item.icon}</span>}
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}