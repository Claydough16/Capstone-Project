//MUI imports
import React from "react";
import CardDisplay from "./CardDisplay";
import Art from "./PlaceholderArt/Art.png";
import Museum from "./PlaceholderArt/Museum.png";
import Coffee from "./PlaceholderArt/Coffee.png";
import Hiking from "./PlaceholderArt/Hiking.png";
import Music from "./PlaceholderArt/Music.png";
import Food from "./PlaceholderArt/Food.png";

import Grid from "@mui/material/Grid";

function ImageSelector({ setImage, setImage64 }) {
  const PlaceholderArt = [Art, Museum, Coffee, Hiking, Music, Food];

  return (
    <>
      <Grid container width={350} height={210}>
        {PlaceholderArt.map((pic) => (
          <Grid
            item
            xs={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              p: 1,
            }}
          >
            <CardDisplay
              image={pic}
              setImage={setImage}
              setImage64={setImage64}
            />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default ImageSelector;
