import React, { useRef, useState } from "react";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaGlobe } from "react-icons/fa";

function SimpleMap({ pinElement, lat, long, zoom, setMap }) {
  /* const mapRef = useRef(null); */
  const latitude = lat;
  const longitude = long;

  const [mapType, setMapType] = useState("standard");

  // Custom tile layers
  const tileLayers = {
    standard: {
      name: "Standard",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      options: {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        tileSize: 256,
      },
    },
    satellite: {
      name: "Satellite",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      options: {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">ESRI',
        tileSize: 256,
      },
    },
  };

  // Define maxBounds to restrict map view to the world area-- change as desired
  const maxBounds = [
    [-85, -180], // Southwest coordinates
    [85, 180], // Northeast coordinates
  ];

  // Function to handle map type change
  const toggleMapType = () => {
    setMapType((prevType) =>
      prevType === "standard" ? "satellite" : "standard"
    );
  };

  return (
    <div
      style={{
        position: "relative",
        height: "500px",
        width: "100vw",
        zIndex: "0",
      }}
    >
      <MapContainer
        center={[lat, long]}
        zoom={zoom}
        zoomControl={false}
        ref={setMap}
        style={{ height: "100%", width: "100%" }}
        maxBounds={maxBounds}
        maxBoundsViscosity={1.0}
        doubleClickZoom={false}
        minZoom={2}
        maxZoom={18}
      >
        {/* Single tile layer based on mapType */}
        <TileLayer {...tileLayers[mapType]} />

        {/* Render pins */}
        {pinElement}

        <ZoomControl position="bottomright" />
      </MapContainer>

      {/* Toggle map type button */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "#fff",
          padding: "5px",
          borderRadius: "50%",
          cursor: "pointer",
          zIndex: 1000,
        }}
        onClick={toggleMapType}
      >
        <FaGlobe size={24} color="#007bff" />
      </div>
    </div>
  );
}

export default SimpleMap;
