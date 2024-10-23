import { ErrorMessage, useField } from "formik";
import { useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

interface FieldProps {
  label?: string;
  name: string;
  validation?: boolean;
  isLoading?: boolean;
  type?: string;
  buttonText?: string;
  placeholder?: string;
  className?: string;
}

const Field = ({
  label,
  validation,
  isLoading,
  buttonText,
  type,
  ...props
}: FieldProps) => {
  // useField hook from Formik to manage form field state and validation
  const [field, meta] = useField(props.name);

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div className="w-[260px] flex flex-col gap-1">
      <label htmlFor={field.name} className="flex flex-row gap-2">
        {label}
        {validation && <span className="font-semibold text-red-600">*</span>}
      </label>

      {/* Render a button if the field type is "submit" */}
      {type === "submit" ? (
        <button
          className={`${buttonFieldCSS} ${
            meta.touched && meta.error ? "is-invalid" : ""
          }`}
          type={type}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : buttonText}
        </button>
      ) : (
        // Render an input field for other types, with password visibility toggle if type is password
        <div className="relative">
          <input
            className={`${
              type === "textarea" ? textAreaFieldCSS : inputFieldCSS
            } 
              ${meta.touched && meta.error ? "is-invalid" : ""}`}
            {...field}
            {...props}
            type={type === "password" && showPassword ? "text" : type}
            autoComplete="off"
          />

          {/* Eye Icon for Toggling Password Visibility */}
          {type === "password" && (
            <span
              className="absolute inset-y-0 right-[16px] top-1 flex items-center cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            </span>
          )}
        </div>
      )}

      {/* Display validation error message */}
      <ErrorMessage
        component="div"
        name={field.name}
        className="text-red-400 mb-0 mt-[-8px] text-sm"
      />
    </div>
  );
};

export default Field;

// CSS classes for various input types
export const inputFieldCSS =
  "block w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
export const textAreaFieldCSS =
  "textarea textarea-primary w-full p-3 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
export const buttonFieldCSS =
  "w-max min-w-20 p-2 bg-[#8645a8] text-white shadow-md hover:shadow-lg mx-auto font-quando rounded-full hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary";
