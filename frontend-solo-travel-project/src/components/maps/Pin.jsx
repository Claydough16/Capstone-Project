import React, { useState } from "react";
import { Marker, Popup } from "react-leaflet";
/* import Pin from "../maps/Pin-location.png"; */
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import PinModals from "./PinModals";

function Pin({ posts }) {
  return (
    <>
      {posts.map((post) => {
        let coordinates = [post.location[3], post.location[2]];
        return (
          <>
            <PinModals post={post} coordinates={coordinates} />
          </>
        );
      })}
    </>
  );
}

export default Pin;
