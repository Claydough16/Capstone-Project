import React, { useState } from "react";
import { Marker, Popup } from "react-leaflet";
/* import Pin from "../maps/Pin-location.png"; */
import icon from "leaflet/dist/images/marker-icon.png";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

function PinModals({ post, coordinates }) {
  const myIcon = L.icon({
    iconUrl: icon, // icon png
    iconSize: [25, 30], // size of the icon
    iconAnchor: [12.5, 41], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -41], // point from which the popup should open relative to the iconAnchor
  });

  L.Marker.prototype.options.icon = myIcon;

  function formatDate(dateString) {
    const date = new Date(dateString);

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? " PM" : " AM";
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${month}/${day}/${year} at ${hours}:${minutes}${ampm}`;
  }

  const [open, setOpen] = useState(false);

  function handleOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
  };
  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Card
            sx={{
              maxWidth: 345,
              minWidth: 345,
              minHeight: 500,
              backgroundColor: "#F5F5F5",
            }}
            variant="outlined"
          >
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: "grey" }} aria-label="recipe">
                  {/* Changed the Avatar to display "U" if user is undefined */}
                  {post.username ? post.username.charAt(0).toUpperCase() : "U"}
                </Avatar>
              }
              titleTypographyProps={{ variant: "h7" }}
              title={post.title}
              subheader={`${post.username} • ${formatDate(post.eventDate)}`}
            />
            <CardMedia
              component="img"
              height="194"
              image={post.imgUrl}
              alt="Post image"
            />
            <CardContent sx={{ height: 170 }}>
              <Typography variant="body2" color="text.secondary">
                {post.tags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    variant={"outlined"}
                    color={"primary"}
                    sx={{ margin: 0.5, fontSize: 12 }}
                  />
                ))}
              </Typography>
              <Box sx={{ p: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {post.description}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Modal>
      <Marker position={coordinates}>
        <Popup>
          <Button onClick={handleOpen}>{post.title}</Button>
        </Popup>
      </Marker>
    </>
  );
}

export default PinModals;
