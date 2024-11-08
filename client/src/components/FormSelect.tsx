import React from "react";

interface FormSelectProp extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: any;
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProp>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label>{label}</label>
        <select
          className="max-w-max rounded-lg border p-2 outline-none"
          {...props}
          ref={ref}
        >
          <option value="todo">TODO</option>
          <option value="in-progress">IN-PROGRESS</option>
          <option value="completed">COMPLETED</option>
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

export default FormSelect;
