import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { Alert } from "@mui/material";
import { baseURL } from "../../environment";
import { useNavigate } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';

const defaultTheme = createTheme();

export default function SignUp({ updateToken, setUserId, setUsername }) {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const firstName = data.get("firstName");
    const lastName = data.get("lastName");
    const userName = data.get("userName");
    const email = data.get("email");
    const password = data.get("password");
    const confirmPassword = data.get("confirm-password");

    const errors = [];

    // Input validation
    if (firstName.length < 2) {
      errors.push("First Name must be at least 2 characters long.");
    }

    if (lastName.length < 2) {
      errors.push("Last Name must be at least 2 characters long.");
    }

    if (userName.length < 3 || userName.length > 15) {
      errors.push("Username must be between 3 and 15 characters long.");
    }

    if (password.length < 4) {
      errors.push("Password must be at least 4 characters long.");
    }

    if (password !== confirmPassword) {
      errors.push("Passwords do not match.");
    }

    if (!email.includes("@")) {
      errors.push("Please enter a valid email address.");
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      setTimeout(() => setValidationErrors([]), 5000);
      return;
    }

    let bodyObj = JSON.stringify({
      firstName,
      lastName,
      userName,
      email,
      password,
    });

    const url = `${baseURL}/user/signup`;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");

    const requestOption = {
      headers,
      body: bodyObj,
      method: "POST",
    };

    try {
      const response = await fetch(url, requestOption);
      const data = await response.json();

      if (response.status === 400) {
        if (data.userNameExists) {
          errors.push("Username already taken!");
        }
        if (data.emailExists) {
          errors.push("Email already taken!");
        }
        setValidationErrors(errors);
        setTimeout(() => setValidationErrors([]), 5000);
        return;
      }

      if (data.message === "Success!") {
        updateToken(data.token);
        setUserId(data.userId);
        setUsername(data.userNametag);
        navigate("/dashboard");
      } else {
        if (data.message.includes(userName)) {
          errors.push("Username already taken!");
        }
        if (data.message.includes(email)) {
          errors.push("Email already taken!");
        }
        setValidationErrors(errors);
        setTimeout(() => setValidationErrors([]), 5000);
      }
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <PersonIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  inputProps={{
                    minLength: 2,
                    maxLength: 20,
                  }}
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  inputProps={{
                    minLength: 2,
                    maxLength: 20,
                  }}
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  inputProps={{
                    minLength: 3,
                    maxLength: 15,
                  }}
                  required
                  fullWidth
                  id="userName"
                  label="Username"
                  name="userName"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  type="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  inputProps={{
                    minLength: 4,
                  }}
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  inputProps={{
                    minLength: 4,
                  }}
                  required
                  fullWidth
                  name="confirm-password"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  autoComplete="confirm password"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowConfirmPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? (
                            <Visibility />
                          ) : (
                            <VisibilityOff />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            {validationErrors.length > 0 && (
              <Box sx={{ mt: 2 }}>
                {validationErrors.map((error, index) => (
                  <Alert severity="error" key={index}>
                    {error}
                  </Alert>
                ))}
              </Box>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
