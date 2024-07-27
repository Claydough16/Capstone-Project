import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { ClickAwayListener } from "@mui/base/ClickAwayListener";

function Search({ setFilterLocation, filterLocation }) {
  const provider = new OpenStreetMapProvider();
  const [locations, setLocations] = useState([]);
  const [open, setOpen] = useState(false);
  const [filterName, setFilterName] = useState();

  let key = 0;

  const handleClick = () => {
    setOpen(true);
  };

  const handleClickAway = () => {
    setOpen(false);
  };

  const styles = {
    position: "absolute",
    top: 150,
    right: 0,
    left: 16,
    zIndex: 1,
    p: 1,
    bgcolor: "background.paper",
    maxHeight: 340,
    maxWidth: 300,
    overflow: "auto",
  };

  async function handleLocation(e) {
    e.preventDefault();
    let newArray = [];
    //MUI method for retrieving form data
    const data = new FormData(e.currentTarget);
    const locationName = data.get("location");
    //OpenStreetMapProvider call. Returns object with coordinate data and label.
    const locationResults = await provider.search({ query: locationName });
    locationResults.forEach((location) => {
      const locationData = [location.label, , location.x, location.y];
      newArray.push(locationData);
    });
    setLocations(newArray);
  }

  function handleSelect(location) {
    setFilterName(location[0].slice(0, 70) + "...");
    setFilterLocation([location[2], location[3]]);
    handleClickAway();
  }
  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <Box component="form" noValidate onSubmit={handleLocation}>
          <Typography
            sx={{
              marginBottom: 1,
              marginTop: 3,
              fontFamily: "verdana",
            }}
          >
            Where to?
          </Typography>
          <TextField
            required
            fullWidth
            name="location"
            label="Location"
            id="location"
            helperText={filterName}
          />

          {open ? (
            <Grid container spacing={2} sx={styles}>
              {locations.map((location) => (
                <Grid item key={key++}>
                  <Button
                    variant="outlined"
                    onClick={() => handleSelect(location)}
                  >
                    {location[0]}
                  </Button>
                </Grid>
              ))}
            </Grid>
          ) : null}

          <Button
            type="submit"
            onClick={handleClick}
            sx={{ marginBottom: 1, marginTop: 0.5 }}
          >
            Search
          </Button>
        </Box>
      </ClickAwayListener>
    </>
  );
}

export default Search;
