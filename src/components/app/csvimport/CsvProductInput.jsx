import React from "react";

const CsvProductInput = ({
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
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-[49px] rounded-[8px] outline-none focus:border bg-[#f8f8f8]/[0.6] px-3  ${
          error?.missingFields?.includes(name) && "border border-red-500"
        } `}
      />

      {error?.missingFields?.includes(name) ? (
        <p className="text-red-700 text-sm font-medium">Error in this field</p>
      ) : null}
    </div>
  );
};

export default CsvProductInput;
