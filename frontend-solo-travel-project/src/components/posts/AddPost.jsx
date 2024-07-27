import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
/* import Typography from "@mui/material/Typography"; */
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";

import { IconButton } from "@mui/material";
import { baseURL } from "../../environment";

import Tags from "./tags/Tags";
import LocationSearch from "./LocationSearch";

import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  height: 550,
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  mt: 1,
  mx: 12,
};

export default function BasicModal(props) {
  const [open1, setOpen1] = useState(false);
  const [selected, setSelected] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState();
  const [selectedImage, setImage] = useState();
  const [selectedImageBase64, setImage64] = useState();
  const [date, setDate] = useState();

  const handleOpen = () => setOpen1(true);
  const handleClose = () => setOpen1(false);

  function refreshPage() {
    window.location.reload();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    console.log("pinged submit");
    const data = new FormData(e.currentTarget);
    const title = data.get("title");
    const description = data.get("description");
    const tags = selected;
    const location = selectedLocation;
    const eventDate = date;
    const image = selectedImageBase64;
    const username = props.username;

    let bodyObj = JSON.stringify({
      title,
      description,
      tags,
      location,
      eventDate,
      image,
      username,
    });

    const url = `${baseURL}/post/new`;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", props.token);

    const requestOption = {
      headers,
      body: bodyObj,
      method: "POST",
    };

    try {
      const response = await fetch(url, requestOption);
      const data = await response.json();
      handleClose();
      refreshPage();
    } catch (err) {
      console.error(err.message);
    }
  }
  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
        sx={{ mt: 0, mb: 0 }}
        size="large"
      >
        New Post
      </Button>

      <Modal
        open={open1}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box>
          <Box
            sx={style}
            component="form"
            noValidate
            onSubmit={handleSubmit}
            /*  onSubmit={handleSubmit} */
            /* SET WIDTH WITH MX */
          >
            <Box
              sx={{
                p: 1,
                display: "flex",
                justifyContent: "flex-end",
                position: "absolute",
                top: 5,
                right: 5,
              }}
            >
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ marginBottom: 2.5, fontFamily: "verdana" }}>
              <Typography variant="h5">Add Some Details</Typography>
            </Box>

            <Divider />

            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Event Title"
              name="title"
              autoComplete="title"
              autoFocus
              sx={{ marginTop: 3 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="description"
              label="Description"
              id="description"
              multiline
              rows={4}
            />
            <Tags selected={selected} setSelected={setSelected} />
            <Button
              variant="contained"
              sx={{ mt: 0, mb: 0, position: "absolute", bottom: 20 }}
              size="large"
              type="submit"
            >
              Create
            </Button>
          </Box>
          <LocationSearch
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            date={date}
            setDate={setDate}
            selectedImage={selectedImage}
            setImage64={setImage64}
            setImage={setImage}
            setOpen1={setOpen1}
          />
          {/*    <ImageUpload /> */}
        </Box>
      </Modal>
    </>
  );
}
