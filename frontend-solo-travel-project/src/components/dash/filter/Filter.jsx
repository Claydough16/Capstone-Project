import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Search from "./Search";
import { baseURL } from "../../../environment/index";
import FilterTags from "./tagFilter/FilterTags";
import Grid from "@mui/material/Grid";

function Filter({
  setPosts,
  token,
  setFilterActive,
  setFilterData,
  filterPosts,
  setSelectedTags,
  selectedTags,
  setFilterLocation,
  filterLocation,
  setFetchActive,
  filterActive,
  fetchActive,
}) {
  function activateFilterLoop() {
    setFetchActive(true);
    setFilterActive(true);
    setTimeout(swapFilter, 400);
  }

  function swapFilter() {
    setFilterActive(false);
    setFetchActive(false); //False until filter cleared
    console.log("setimeout finished");
  }

  function clearFilter() {
    setFilterActive(false);
    setFetchActive(true);
    window.location.reload();
  }
  return (
    <>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          marginLeft: 5,
          height: 468,
          width: 300,
          position: "absolute",
          /*     justifyContent: "flex-end", */
          alignItems: "center",
        }}
      >
        <Search
          filterLocation={filterLocation}
          setFilterLocation={setFilterLocation}
        />
        <FilterTags
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
        {fetchActive ? (
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 0, mb: 0, position: "absolute", top: 398, width: 250 }}
            size="large"
            onClick={activateFilterLoop}
          >
            Find Me
          </Button>
        ) : (
          <Grid container columnSpacing={{ xs: 1 }}>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 0, mb: 0, position: "relative", top: 50 }}
                size="large"
                onClick={activateFilterLoop}
              >
                Find Me
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 0, mb: 0, position: "relative", top: 50 }}
                size="large"
                onClick={clearFilter}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        )}
      </Paper>
    </>
  );
}

export default Filter;
