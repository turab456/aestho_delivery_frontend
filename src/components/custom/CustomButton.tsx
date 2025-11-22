import React from "react";

interface CustomButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  fullWidth = true,
  style,
}) => {
  const baseColor = "#1f2937";
  const hoverColor = "#111827";
  const disabledColor = "#4b5563";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        width: fullWidth ? "100%" : "auto",
        padding: "12px 16px",
        backgroundColor: disabled ? disabledColor : baseColor,
        color: "#f9fafb",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        fontWeight: "500",
        fontFamily: "Outfit, sans-serif",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background-color 0.2s ease",
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = hoverColor;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = baseColor;
        }
      }}
    >
      {children}
    </button>
  );
};

export default CustomButton;
