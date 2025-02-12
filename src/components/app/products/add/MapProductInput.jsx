import { Autocomplete, LoadScript, useLoadScript } from "@react-google-maps/api";
import React, { useEffect, useRef, useState } from "react";

const MapProductInput = ({
  id,
  name,
  type,
  label,
  placeholder,
  setUserInput,
  setLatitude,
  setLongitude,
  value,
  onChange,
  onBlur,
  values,
  errors,
  touched,
}) => {
  const startLocationRef = useRef();


  const handlePlaceChange = () => {
    const place = startLocationRef.current.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      //   onChange();
      setLatitude(lat);
      setLongitude(lng);
      setUserInput(place?.formatted_address);
      values.pickupAddress = place?.formatted_address;
    }
  };


  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_APP_GMAPS_KEY} libraries={["places"]}>

      <div className="w-full h-auto flex flex-col justify-start items-start gap-2">
        <label htmlFor={id} className="text-[14px] font-medium leading-[21px] ">
          {label}
        </label>
        <Autocomplete
          className="w-full "
          onLoad={(autocomplete) => (startLocationRef.current = autocomplete)}
          onPlaceChanged={handlePlaceChange}
        >
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            className={`w-full h-[49px] rounded-[8px] outline-none focus:border bg-[#f8f8f8]/[0.6] px-3 ${errors[name] && touched[name] ? "border border-red-500" : ""
              } `}
          />
        </Autocomplete>
        {errors[name] && touched[name] ? (
          <p className="text-red-700 text-sm font-medium">{errors[name]}</p>
        ) : null}
      </div>
    </LoadScript>
  );
};

export default MapProductInput;
