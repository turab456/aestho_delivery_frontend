import React from "react";
import { CustomInputLabel } from "./CustomInput";

type Option = {
  label: string;
  value: string;
};

interface CustomDropdownProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  options?: Option[];
  helperText?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  required = false,
  options,
  children,
  className = "",
  disabled = false,
  id,
  helperText,
  ...rest
}) => {
  return (
    <div>
      {label && (
        <CustomInputLabel label={label} required={required} htmlFor={id} />
      )}
      <select
        id={id}
        disabled={disabled}
        className={`w-full rounded-lg border border-gray-300 bg-white text-sm text-gray-700 transition focus:border-black focus:outline-none disabled:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 ${className}`}
        style={{
          width: "100%",
          padding: "12px 16px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          fontSize: "14px",
          fontFamily: "Outfit, sans-serif",
          height: "44px",
          backgroundColor: disabled ? "#f3f4f6" : "#ffffff",
          color: "#374151",
        }}
        {...rest}
      >
        {options
          ? options.map((option) => (
              <option key={option.value || option.label} value={option.value}>
                {option.label}
              </option>
            ))
          : children}
      </select>
      {helperText && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default CustomDropdown;
