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

function GoogleMaps({ state, address, setLatLng, setAddress }) {
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
    const { latLng } = e;
    const latitude = latLng.lat();
    const longitude = latLng.lng();
    setLatitude(latitude ? latitude : 0);
    setLongitude(longitude ? longitude : 0);

    // Perform reverse geocoding
    axios
      .get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
          import.meta.env.VITE_APP_GMAPS_KEY
        }`
      )
      .then((response) => {
        const address = response.data.results[1].formatted_address;
        setUserInput(address);
        setSelectedLocation({ latitude, longitude, address });
        try {
          setLatLng({ latitude, longitude });
          setAddress(address);
        } catch (error) {}
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
    // Perform geocoding for the entered address
    axios
      .get(
        userInput !== ""
          ? `https://maps.googleapis.com/maps/api/geocode/json?address=${userInput}&key=${
              import.meta.env.VITE_APP_GMAPS_KEY
            }`
          : `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${
              import.meta.env.VITE_APP_GMAPS_KEY
            }`
      )
      .then((response) => {
        const { lat, lng } = response.data.results[0].geometry.location;
        setLatitude(lat ? lat : 0);
        setLongitude(lng ? lng : 0);
        setSelectedLocation({
          latitude: lat,
          longitude: lng,
          address: userInput,
        });

        try {
          setLatLng({ lat, lng });
          setAddress(address);
        } catch (error) {}
      })
      .catch((error) => {
        console.log("Error fetching location", error);
      });
  };

  useEffect(() => {
    (userInput !== "" || address !== "") && handleSetAddress();
  }, [userInput, address]);

  return (
    <>
      {isLoaded && state !== "" ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={25}
          onClick={(e) => handleMapClick(e)}
          options={{
            styles: [
              {
                // featureType: "landscape",
                // elementType: "geometry",
                stylers: [{ hue: "#f85e00" }, { saturation: 50 }],
              },
            ],
          }}
        >
          {/* Render a marker for the user */}
          <Marker
            key={`${latitude}-${longitude}`}
            position={{
              lat: latitude,
              lng: longitude,
            }}
            icon={{
              url: "/store.png", // Path to your custom marker
              scaledSize: new google.maps.Size(20, 20), // Adjust width and height as needed
            }}
          ></Marker>
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
