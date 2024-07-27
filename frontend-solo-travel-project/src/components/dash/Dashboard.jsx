import * as React from "react";
import { useState, useEffect } from "react";
import { createTheme } from "@mui/material/styles";
import { baseURL } from "../../environment/index";
//MUI Imports
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

//Component Imports
import AddPost from "../posts/AddPost";
import PostIndex from "../posts/PostIndex";
import Filter from "./filter/Filter";
import Pin from "../maps/Pin";

//Leaflet Import
import SimpleMap from "../maps/SimpleMap";
import SiteFooter from "../footer/Footer";

const drawerWidth = 240; // Adjust this value to change width of navbar popout

//Currently does nothing because theme is default
const defaultTheme = createTheme();

export default function Dashboard({ token, userId, username }) {
  const [posts, setPosts] = useState([]);
  const [pinElement, setPin] = useState();
  const [filterActive, setFilterActive] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [filterLocation, setFilterLocation] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [fetchActive, setFetchActive] = useState(true);
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [zoom, setZoom] = useState(2);
  const [mapRef, setMap] = useState(null);
  /*  let pinElement = ""; */

  const fetchPosts = async () => {
    const url = `${baseURL}/post/all`; //ENDPOINT HERE

    const options = {
      method: "GET",
      headers: new Headers({
        Authorization: token,
      }),
    };

    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error("Failed to fetch posts");
      }
      const data = await res.json();
      setPosts(data.result);
      /*   console.log("normal"); */
    } catch (err) {
      console.error(err.message);
    }
  };

  const filterPosts = async () => {
    const url = `${baseURL}/post/filter`; //ENDPOINT HERE
    /*   const filterCoords = filterLocation; */
    const xCoord = filterLocation[1];
    const yCoord = filterLocation[0];
    const tags = selectedTags;

    //Sets the zoom and location of leaflet map
    setLat(xCoord);
    setLong(yCoord);

    setZoom(5);

    let bodyObj = JSON.stringify({
      xCoord,
      yCoord,
      tags,
    });

    const options = {
      headers: new Headers({
        Authorization: token,
        "Content-Type": "application/json",
      }),
      body: bodyObj,
      method: "POST",
    };

    try {
      const res = await fetch(url, options);
      /*  if (!res.ok) {
        throw new Error("Failed to fetch posts");
      } */
      const data = await res.json();
      /*   setFilterActive(true); */
      setPosts(data.result);
      console.log("filtering");
      console.log(posts);
      mapRef.setView([lat, long], zoom);

      /*  setPosts(data.result); */
    } catch (err) {
      console.error(err.message);
    }
  };

  function renderPins() {
    setPin(<Pin posts={posts} />);
  }

  //EXECUTES FETCH ON PAGE RELOAD
  useEffect(() => {
    if (token && filterActive === false && fetchActive === true) {
      fetchPosts();
    }
    if (token && filterActive === true) {
      filterPosts();
      renderPins();
    }
    if (posts) {
      renderPins();
    }
  }, [token, posts, fetchActive]);

  return (
    <>
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: "100vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar />
        <Container maxWidth="true" sx={{ mt: 4, mb: 0, flexGrow: 1 }}>
          <Grid container spacing={2} position={"relative"}>
            {/* {fetch ? <SimpleMap posts={posts} /> : null} */}
            <SimpleMap
              posts={posts}
              pinElement={pinElement}
              lat={lat}
              long={long}
              zoom={zoom}
              setMap={setMap}
            />
            {/*  FILTER DISPLAY GRID ---> Absolutely positioned child element of container*/}
            <Grid item xs={12} position={"absolute"}>
              <Filter
                setPosts={setPosts}
                token={token}
                setFilterActive={setFilterActive}
                filterActive={filterActive}
                setFilterData={setFilterData}
                filterPosts={filterPosts}
                filterLocation={filterLocation}
                setFilterLocation={setFilterLocation}
                selectedTags={selectedTags}
                setSelectedTags={setSelectedTags}
                setFetchActive={setFetchActive}
                fetchActive={fetchActive}
              />
            </Grid>
          </Grid>
        </Container>

        {/* POST DISPLAY GRID */}
        <Container maxWidth="false" sx={{ mt: 3, mb: 4 }} direction="column">
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", justifyContent: "flex-end" }}>
              <AddPost token={token} username={username} />
            </Paper>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              <PostIndex
                token={token}
                userId={userId}
                posts={posts}
                setPosts={setPosts}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} width={100}></Grid>
        </Container>
        <Box sx={{ mt: "auto", width: "100%" }}>
          <SiteFooter />
        </Box>
      </Box>
    </>
  );
}
