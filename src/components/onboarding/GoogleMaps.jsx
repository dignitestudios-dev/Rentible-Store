import React, { useState, useEffect, useContext } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import axios from "axios";
import { AppContext } from "../../context/AppContext";
import { ErrorToast } from "../global/Toaster";

function GoogleMaps({ state, setAddress, address }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: `${import.meta.env.VITE_APP_GMAPS_KEY}`,
  });

  const {
    setLatitude,
    setLongitude,
    userInput,
    setUserInput,
    latitude,
    longitude,
  } = useContext(AppContext);

  const containerStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "12px",
    border: "1px solid #d9d9d9",
  };

  const [selectedLocation, setSelectedLocation] = useState({
    latitude: 0,
    longitude: 0,
    address: null,
  });

  const user = {
    id: "user",
    lat: selectedLocation?.latitude || latitude,
    lng: selectedLocation?.longitude || longitude,
  };

  const center = {
    lat: user?.lat,
    lng: user?.lng,
  };

  const handleMapClick = (e) => {
    if (!isLoaded) return; // Ensure Google Maps is loaded

    const { latLng } = e;
    const latitude = latLng.lat();
    const longitude = latLng.lng();

    setLatitude(latitude);
    setLongitude(longitude);

    // Perform reverse geocoding
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
          import.meta.env.VITE_APP_GMAPS_KEY
        }`
      )
      .then((response) => {
        const formattedAddress = response.data.results[0]?.formatted_address;
        setUserInput(formattedAddress);
        setSelectedLocation({ latitude, longitude, address: formattedAddress });
        setAddress(formattedAddress);
      })
      .catch((error) => {
        console.log("Error fetching address:", error);
        setSelectedLocation({
          latitude,
          longitude,
          address: "Address not available",
        });
      });
  };

  const handleSetAddress = () => {
    if (!isLoaded) return; // Ensure Google Maps is loaded

    axios
      .get(
        userInput !== ""
          ? `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              userInput
            )}&key=${import.meta.env.VITE_APP_GMAPS_KEY}`
          : `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              address
            )}&key=${import.meta.env.VITE_APP_GMAPS_KEY}`
      )
      .then((response) => {
        const { lat, lng } = response.data.results[0].geometry.location;
        setLatitude(lat);
        setLongitude(lng);
        setSelectedLocation({
          latitude: lat,
          longitude: lng,
          address: userInput,
        });
        setAddress(response.data.results[0]?.formatted_address || "");
      })
      .catch((error) => {
        console.log("Error fetching location", error);
      });
  };

  useEffect(() => {
    if (userInput !== "") {
      handleSetAddress();
    }
  }, [userInput, address]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-200 rounded-xl text-xs font-medium text-gray-600 flex items-center justify-center">
        Loading map...
      </div>
    );
  }

  return (
    <>
      {state !== "" ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={15}
          onClick={(e) => handleMapClick(e)}
        >
          {/* Render a marker for the user */}
          <Marker
            key={`${latitude}-${longitude}`}
            position={{
              lat: latitude,
              lng: longitude,
            }}
            icon={
              isLoaded
                ? {
                    url: "/map_marker.png", // Path to your custom marker
                    scaledSize: new google.maps.Size(50, 50), // Adjust width and height as needed
                  }
                : {
                    url: "/map_marker.png", // Path to your custom marker
                  }
            }
          />
        </GoogleMap>
      ) : (
        <div className="w-full h-full bg-gray-200 rounded-xl text-xs font-medium text-gray-600 flex items-center justify-center">
          Please select a valid state.
        </div>
      )}
    </>
  );
}

export default GoogleMaps;
