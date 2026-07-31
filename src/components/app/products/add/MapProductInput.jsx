import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import React, { useRef } from "react";

const LIBRARIES = ["places"];

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
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_APP_GMAPS_KEY || "",
    libraries: LIBRARIES,
  });

  const startLocationRef = useRef();

  const handlePlaceChange = () => {
    if (!startLocationRef.current) return;
    const place = startLocationRef.current.getPlace();
    if (place && place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setLatitude(lat);
      setLongitude(lng);
      setUserInput(place?.formatted_address);
      if (values) {
        values.pickupAddress = place?.formatted_address;
      }
    }
  };

  return (
    <div className="w-full h-auto flex flex-col justify-start items-start gap-2">
      <label htmlFor={id} className="text-[14px] font-medium leading-[21px] ">
        {label}
      </label>
      {isLoaded ? (
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
            className={`w-full h-[49px] rounded-[8px] outline-none focus:border bg-[#f8f8f8]/[0.6] px-3 ${
              errors && errors[name] && touched && touched[name] ? "border border-red-500" : ""
            } `}
          />
        </Autocomplete>
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full h-[49px] rounded-[8px] outline-none focus:border bg-[#f8f8f8]/[0.6] px-3 ${
            errors && errors[name] && touched && touched[name] ? "border border-red-500" : ""
          } `}
        />
      )}
      {errors && errors[name] && touched && touched[name] ? (
        <p className="text-red-700 text-sm font-medium">{errors[name]}</p>
      ) : null}
    </div>
  );
};

export default MapProductInput;
