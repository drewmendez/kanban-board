import React from "react";

interface FormFieldProp extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: any;
}

const FormField = React.forwardRef<HTMLInputElement, FormFieldProp>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label>{label}</label>
        <input
          className="rounded border-2 py-2 pl-3 outline-none"
          {...props}
          ref={ref}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

export default FormField;
