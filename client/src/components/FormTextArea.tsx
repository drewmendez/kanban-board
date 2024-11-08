import React from "react";

interface FormTextAreaProp
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: any;
}

const FormTextArea = React.forwardRef<HTMLTextAreaElement, FormTextAreaProp>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label>{label}</label>
        <textarea
          className="resize-none rounded border-2 py-2 pl-3 outline-none"
          {...props}
          ref={ref}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

export default FormTextArea;
