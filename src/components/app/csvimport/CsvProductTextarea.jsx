import React from "react";

const CsvProductTextarea = ({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  error,
}) => {
  return (
    <div className="w-full h-auto flex flex-col justify-start items-start gap-2">
      <label htmlFor={id} className="text-[14px] font-medium leading-[21px] ">
        {label}
      </label>
      <textarea
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-[158px] resize-none rounded-[8px] bg-[#f8f8f8]/[0.6] focus:border outline-none p-3  ${
          error?.missingFields?.includes(name) && "border border-red-500"
        } `}
      ></textarea>

      {error?.missingFields?.includes(name) ? (
        <p className="text-red-700 text-sm font-medium">Error in this field</p>
      ) : null}
    </div>
  );
};

export default CsvProductTextarea;
