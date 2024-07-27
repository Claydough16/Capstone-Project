import React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Posts from "./Posts";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";

function PostIndex({ userId, token, setPinLocations, pinLocations, posts }) {
  let key = 0;

  return (
    <>
      <Grid container spacing={2}>
        {posts.map((post) => (
          <Grid item key={key++}>
            <Posts post={post} userId={userId} token={token} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

export default PostIndex;
