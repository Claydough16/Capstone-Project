import {
  Box,
  Button,
  Typography,
  TextField,
  Toolbar,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import useProfile from "../hooks/useProfile";
import SiteFooter from "../footer/Footer";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import PostIndex from "../posts/PostIndex";
import Posts from "../posts/Posts";
import Dashboard from "../dash/Dashboard";
import { baseURL } from "../../environment";

function Profile(props) {
  const [posts, setPosts] = useState([]);

  const token = (props && props.token) ?? "";

  const {
    userName,
    firstName,
    lastName,
    age,
    bio,
    country,
    travelPreferences,
    interests,
    getProfile,
    updateProfile,
  } = useProfile();

  const [changedAge, setChangedAge] = useState(age);
  const [changedBio, setChangedBio] = useState(bio);
  const [changedCountry, setChangedCountry] = useState(country);
  const [changedTravelPreferences, setChangedTravelPreferences] =
    useState(travelPreferences);
  const [changedInterests, setChangedInterests] = useState(interests);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleUpdateProfile = () => {
    updateProfile(
      changedAge,
      changedBio,
      changedCountry,
      changedTravelPreferences,
      changedInterests
    );
    window.location.reload();
  };

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  useEffect(() => {
    setChangedAge(age);
    setChangedBio(bio);
    setChangedCountry(country);
    setChangedTravelPreferences(travelPreferences);
    setChangedInterests(interests);
  }, [age, bio, country, travelPreferences, interests]);

  useEffect(() => {
    fetchPosts();
  }, [])

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

  const itemData = [
    {
      img: " https://images.unsplash.com/photo-1720807359320-9ee1c7344e55",
      title: "Shrine",
    },
    {
      img: "https://images.unsplash.com/photo-1719583112932-d2426a3196ae",
      title: "Beach",
    },
    {
      img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
      title: "Camera",
    },
    {
      img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
      title: "Coffee",
    },
    {
      img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
      title: "Hats",
    },
    {
      img: "https://images.unsplash.com/photo-1720737278938-3a7db22702ac",
      title: "Rocks",
    },
    {
      img: "https://images.unsplash.com/photo-1444491741275-3747c53c99b4",
      title: "Biking",
    },
    {
      img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
      title: "Fern",
    },
    {
      img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
      title: "Mushrooms",
    },
    {
      img: "https://images.unsplash.com/photo-1720617834905-4723d5888e48",
      title: "Horses",
    },
    {
      img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
      title: "Sea star",
    },
    {
      img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
      title: "Bike",
    },
  ];
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
        }}
      >
        <Toolbar />
        <Container maxWidth="false" sx={{ mt: 3, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={24} spacing={1}>
              <Grid container maxWidth={1800} display={"flex"} justifyContent={"space-between"}>
                {!isEditMode && (
                  <Grid item xs={4}>
                    <Card sx={{ maxWidth: 500, minHeight: 810, mb: 5 }}>
                      <CardHeader
                        avatar={
                          <Avatar
                            sx={{ bgcolor: "grey", height: 75, width: 75 }}
                            aria-label="recipe"
                          >
                            {userName.charAt(0).toUpperCase()}
                          </Avatar>
                        }
                        title={
                          age ? (
                            <Typography component="h1" variant="h5">
                              {" "}
                              {firstName} {lastName}, {age}
                            </Typography>
                          ) : (
                            <Typography component="h1" variant="h5">
                              {" "}
                              {firstName} {lastName}
                            </Typography>
                          )
                        }
                        subheader={
                          <Typography
                            component="h1"
                            variant="subtitle1"
                            fontSize={18}
                          >
                            {country ? (
                              <Typography>
                                {" "}
                                {userName}, {country}
                              </Typography>
                            ) : (
                              <Typography> {userName}</Typography>
                            )}
                          </Typography>
                        }
                      ></CardHeader>
                      <Divider />
                      <CardContent>
                        {bio || travelPreferences || interests ? (
                          <Box>
                            {bio ? (
                              <Box>
                                <Chip
                                  variant="outlined"
                                  color="primary"
                                  label={
                                    <Typography component="h1" variant="h6">
                                      About Me
                                    </Typography>
                                  }
                                ></Chip>
                                <Typography sx={{ padding: 1, mb: 2 }}>
                                  {bio}
                                </Typography>
                              </Box>
                            ) : null}
                            {travelPreferences ? (
                              <Box>
                                <Chip
                                  variant="outlined"
                                  color="primary"
                                  label={
                                    <Typography component="h1" variant="h6">
                                      Travel Preferences
                                    </Typography>
                                  }
                                ></Chip>
                                <Typography sx={{ padding: 1, mb: 2 }}>
                                  {travelPreferences}
                                </Typography>
                              </Box>
                            ) : null}
                            {interests ? (
                              <Box>
                                <Chip
                                  variant="outlined"
                                  color="primary"
                                  label={
                                    <Typography component="h1" variant="h6">
                                      Interests
                                    </Typography>
                                  }
                                ></Chip>

                                <Typography sx={{ padding: 1 }}>
                                  {interests}
                                </Typography>
                              </Box>
                            ) : null}
                          </Box>
                        ) : (
                          <Box>
                            <Chip
                              variant="outlined"
                              color="primary"
                              label={
                                <Typography component="h1" variant="h6">
                                  Tell us about yourself
                                </Typography>
                              }
                            ></Chip>
                            <Typography sx={{ padding: 1 }}>
                              Your insights go here
                            </Typography>
                          </Box>
                        )}
                      </CardContent>

                      {/*  <Divider /> */}

                      <CardActions>
                        {!isEditMode && (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-end",
                              width: 468,
                            }}
                          >
                            <Button
                              type="button"
                              sx={{ mt: 0, mb: 1 }}
                              onClick={handleEditClick}
                            >
                              Edit Profile
                            </Button>
                          </Box>
                        )}
                      </CardActions>
                    </Card>
                  </Grid>
                )}

                {/*  <Divider /> */}

                {!isEditMode && (
                  <Grid item xs={4} display={"flex"}>
                    <Paper sx={{ width: 500, maxHeight: 810 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "auto",
                          padding: 2,
                        }}
                      >
                        <Typography component={"h1"} variant="h4" sx={{ justifyContent: "center" }}>
                          Albums
                        </Typography>
                      </Box>
                      <Divider />
                      <ImageList
                        sx={{ width: 500, height: 700 }}
                        cols={2}
                        rowHeight={190}
                      >
                        {itemData.map((item) => (
                          <ImageListItem key={item.img}>
                            <img
                              srcSet={`${item.img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                              src={`${item.img}?w=164&h=164&fit=crop&auto=format`}
                              alt={item.title}
                              loading="lazy"
                            />
                          </ImageListItem>
                        ))}
                      </ImageList>
                    </Paper>
                  </Grid>
                )}
                {!isEditMode && (
                  <Grid item xs={4} display={"flex"} >
                    <Paper sx={{ width: 500, maxHeight: 810 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "auto",
                          padding: 2,
                        }}
                      >
                        <Typography component={"h1"} variant="h4" sx={{ justifyContent: "center" }}>
                          Posts
                        </Typography>
                      </Box>
                      <Divider />
                      <ImageList
                        sx={{ width: 500, height: "175%" }}
                        cols={1}
                        rowHeight={390}
                      >
                        <Grid container
                          rowSpacing={1}
                          justifyContent={"center"}
                          sx={{
                            maxHeight: "50%",
                            overflow: "auto"
                          }}
                        >
                          {posts.map((post) => (
                            <>
                              {post["username"] == userName &&
                                <Grid item sx={12}>
                                  <Posts post={post} userId={props.userId} token={token} />
                                </Grid>
                              }
                            </>
                          ))}
                        </Grid>
                      </ImageList>
                    </Paper>
                  </Grid>
                )}
              </Grid>
              {isEditMode && (
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Typography component="h1" variant="h5">
                    Age
                  </Typography>
                  <TextField
                    margin="normal"
                    fullWidth
                    multiline
                    rows={1}
                    id="age"
                    label="What is your age?"
                    name="Age"
                    defaultValue={changedAge}
                    onChange={(e) => {
                      setChangedAge(e.target.value);
                    }}
                  />
                </Paper>
              )}
            </Grid>
            <Grid item xs={12}>
              {isEditMode && (
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Typography component="h1" variant="h5">
                    Biography
                  </Typography>

                  <TextField
                    margin="normal"
                    fullWidth
                    multiline
                    rows={2}
                    id="bio"
                    label="Tell us something about yourself"
                    name="Bio"
                    defaultValue={changedBio}
                    onChange={(e) => {
                      setChangedBio(e.target.value);
                    }}
                  />
                </Paper>
              )}
            </Grid>
            <Grid item xs={12}>
              {isEditMode && (
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Typography component="h1" variant="h5">
                    Country:
                  </Typography>

                  <TextField
                    margin="normal"
                    fullWidth
                    multiline
                    rows={1}
                    id="country"
                    label="What country do you live in?"
                    name="country"
                    defaultValue={changedCountry}
                    onChange={(e) => {
                      setChangedCountry(e.target.value);
                    }}
                  />
                </Paper>
              )}
            </Grid>
            <Grid item xs={12}>
              {isEditMode && (
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Typography component="h1" variant="h5">
                    Travel Preferences:
                  </Typography>
                  <TextField
                    margin="normal"
                    fullWidth
                    multiline
                    rows={2}
                    id="travelPreferences"
                    label="What are your preferences while traveling?"
                    name="travelPreferences"
                    defaultValue={changedTravelPreferences}
                    onChange={(e) => {
                      setChangedTravelPreferences(e.target.value);
                    }}
                  />
                </Paper>
              )}
            </Grid>
            <Grid item xs={12}>
              {isEditMode && (
                <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                  <Typography component="h1" variant="h5">
                    Interests:
                  </Typography>
                  <TextField
                    margin="normal"
                    fullWidth
                    multiline
                    rows={2}
                    id="interests"
                    label="What are some things you are interested in?"
                    name="interests"
                    defaultValue={changedInterests}
                    onChange={(e) => {
                      setChangedInterests(e.target.value);
                    }}
                  />
                </Paper>
              )}
            </Grid>
            <Grid item xs={12}>
              {isEditMode ? (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2, mb: 2 }}
                  onClick={handleUpdateProfile}
                >
                  Save
                </Button>
              ) : null}
            </Grid>
          </Grid>
        </Container>
      </Box >
    </>
  );
}

export default Profile;
