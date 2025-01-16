import React from "react";

const ProductInput = ({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  errors,
  touched,
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
        onBlur={onBlur}
        placeholder={placeholder}
        className={`w-full h-[49px] rounded-[8px] outline-none focus:border bg-[#f8f8f8]/[0.6] px-3 ${
          errors[name] && touched[name] ? "border border-red-500" : ""
        } `}
      />
      {errors[name] && touched[name] ? (
        <p className="text-red-700 text-sm font-medium">{errors[name]}</p>
      ) : null}
    </div>
  );
};

export default ProductInput;
