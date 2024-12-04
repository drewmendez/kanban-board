import React from "react";
import { useGetStatuses } from "../services/tasksServices";
import { useParams } from "react-router-dom";

interface FormSelectProp extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: any;
}

const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProp>(
  ({ label, error, ...props }, ref) => {
    const { data: statuses } = useGetStatuses();
    const params = useParams();

    return (
      <div className="flex flex-col gap-1">
        <label>{label}</label>
        <select
          className="max-w-max cursor-pointer rounded-lg border p-2 uppercase outline-none"
          {...props}
          ref={ref}
        >
          {statuses?.map((status) => (
            <option
              key={status.status_id}
              value={status.status_id}
              selected={Number(params.status_id) === status.status_id}
            >
              {status.status_title}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    );
  },
);

export default FormSelect;
