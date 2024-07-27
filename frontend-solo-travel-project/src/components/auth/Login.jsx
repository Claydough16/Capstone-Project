import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../environment";
import styled, { keyframes } from "styled-components";
import LoginIcon from '@mui/icons-material/Login';

// import images
import window from "../login-images/window.jpg";
import camel from "../login-images/camel.jpg";
import stairs from "../login-images/stairs.jpg";
import boat from "../login-images/boat.jpg";
import car from "../login-images/car.jpg";
import moscow from "../login-images/moscow.jpg";
import green from "../login-images/green.jpg";
import city from "../login-images/city.jpg";

const defaultTheme = createTheme();

const slideIn = keyframes`
  0% { transform: translateX(100%); }
  100% { transform: translateX(0); }
`;

const slideOut = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
`;

const StyledImageContainer = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  animation: ${(props) => (props.fade ? slideIn : slideOut)} 1s forwards;
  transform: translateX(0);
  image-rendering: crisp-edges; 
`;

const StyledImage = styled.div`
  background-image: url(${(props) => props.image});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  width: 100%;
  height: 100%;
  filter: brightness(0.9); 
`;

export default function SignInSide({ updateToken, setUserId, setUsername }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  const imageUrls = [
    window,
    camel,
    stairs,
    boat,
    car,
    moscow,
    green,
    city,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % imageUrls.length
        );
        setFade(true);
      }, 1000);
    }, 9000); 

    return () => clearInterval(interval);
  }, [imageUrls.length]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    let body = JSON.stringify({
      identifier: data.get("identifier"),
      password: data.get("password"),
    });

    const url = `${baseURL}/user/login`;

    try {
      const res = await fetch(url, {
        method: "POST",
        body: body,
        headers: new Headers({
          "Content-Type": "application/json",
        }),
      });
      const data = await res.json();

      if (data.message === "Successful!") {
        console.log(data);
        updateToken(data.token);
        setUserId(data.userId); 
        setUsername(data.userNametag);
        navigate("/dashboard");
      } else {
        alert("Incorrect Username or Password");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            position: "relative",
            overflow: "hidden",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
          }}
        >
          <StyledImageContainer fade={fade}>
            <StyledImage image={imageUrls[currentImageIndex]} />
          </StyledImageContainer>
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 1000,
            }}
          >
            <Avatar sx={{ bgcolor: "primary.main" }}>
              <LoginIcon sx={{mr: 0.5}}/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1, mx: 12 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="identifier"
                label="Email or Username"
                name="identifier"
                autoComplete="identifier"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Link href="/password-reset" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/signup" variant="body2">
                    Don't have an account? Create one!
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
