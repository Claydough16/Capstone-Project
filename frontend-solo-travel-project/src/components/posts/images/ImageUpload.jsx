//MUI imports
import React from "react";
import Grid from "@mui/material/Grid";
import ImageSelector from "./ImageSelector";
import InputFileUpload from "../../upload/FileUpload";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";

function ImageUpload({ selectedImage, setImage, setImage64 }) {
  return (
    <>
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: " center",
          }}
        >
          {selectedImage ? (
            <Card sx={{ maxWidth: 345, marginTop: 2, marginBottom: 1 }}>
              <CardMedia
                component="img"
                height="120"
                image={selectedImage}
                alt="Placeholder icon"
              />
            </Card>
          ) : (
            <Paper elevation={5} sx={{ marginTop: 2, marginBottom: 1 }}>
              <Typography
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
                elevation={5}
                sx={{ height: 120, width: 345 }}
              >
                Select a Cover Photo
              </Typography>
            </Paper>
          )}
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <ImageSelector setImage={setImage} setImage64={setImage64} />
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: " center",
          }}
        >
          <InputFileUpload setImage={setImage} setImage64={setImage64} />
        </Grid>
      </Grid>
    </>
  );
}

export default ImageUpload;
