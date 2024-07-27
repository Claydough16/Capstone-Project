import React from "react";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";

function CardDisplay({ image, setImage, setImage64 }) {
  async function getDataBlob(url) {
    let res = await fetch(url);
    let blob = await res.blob();
    return blob;
  }

  //Our function to convert image
  function convertBase64(file) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  }

  async function handleSelect() {
    //Sets front end display image
    setImage(image);

    let imgBlob = await getDataBlob(image);
    //Converts img blob to base64 so our server can upload to cloud
    const base64 = await convertBase64(imgBlob);
    setImage64(base64);
  }

  return (
    <>
      <Card
        sx={{
          maxWidth: 100,
          maxHeight: 100,
        }}
      >
        <CardActionArea onClick={handleSelect}>
          <CardMedia
            component="img"
            height="100"
            image={image}
            alt="Placeholder icon"
          />
        </CardActionArea>
      </Card>
    </>
  );
}

export default CardDisplay;
