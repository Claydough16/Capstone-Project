import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockResetIcon from '@mui/icons-material/LockReset';
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton'
import CheckIcon from '@mui/icons-material/Check'
import ErrorIcon from '@mui/icons-material/Error'
import CloseIcon from "@mui/icons-material/Close";
import { Container, Modal, Alert } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../../environment";

const defaultTheme = createTheme();

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    height: 550,
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
};


function PasswordReset() {

    const [openModal, setOpenModal] = useState(false);
    const [email, setEmail] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [resetEmail, setResetEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmError, setConfirmError] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
    const [passwordResetError, setPasswordResetError] = useState(false);
    const [previewLink, setPreviewLink] = useState("false");

    const navigate = useNavigate();
    const handleClose = () => setOpenModal(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get('token')
        const email = urlParams.get('email')

        // If token and email are in the url query parameters, open the password reset modal
        if (token && email) {
            console.log('we got email and tokens', email, token)
            setResetToken(token);
            setResetEmail(email);
            setOpenModal(true);
        }
    }, [])

    useEffect(() => {
        if (password !== confirmPassword) {
            setConfirmError(true)
        } else {
            setConfirmError(false)
        }

    }, [confirmPassword])
    // do useEffect on page load and grab the url and check if it
    // has any query parameters, specifically token, in order to set the
    // state variable to open the modal

    const submitPasswordResetRequest = async () => {
        setEmail("");
        const url = `${baseURL}/user/password-reset?` + new URLSearchParams({ email: email }).toString();
        // console.log("sending to", url);
        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            const data = await res.json();
            // console.log("email to send to", email);
            // console.log(data.previewURL);
            const previewLink = data.previewURL;

            if (res.ok) {
                setPreviewLink(previewLink);
                setEmailSent(true);
                setTimeout(() => setEmailSent(false), 20000);
            } else {
                setEmailError(true);
                setTimeout(() => setEmailError(false), 5000);
            }
        } catch (error) {
            setEmailError(true);
            setTimeout(() => setEmailError(false), 5000);
        }
    }


    const submitPasswordReset = async () => {
        if (password !== confirmPassword || password == "") {
            window.alert("Passwords must match!")
            return
        }

        // send POST /user/password-reset
        const url = `${baseURL}/user/password-reset`

        // with email, token, newPassword in body (form data)
        const body = JSON.stringify({
            email: resetEmail,
            token: resetToken,
            newPassword: password
        })

        const res = await fetch(url, {
            method: "POST",
            body: body,
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await res.json();
        // console.log(res.status, res.statusText)

        if (res.ok) {
            setPasswordResetSuccess(true);
            setTimeout(() => setOpenModal(false), 5000);
        } else {
            setPasswordResetError(true);
        }
    }

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            navigate("/dashboard")
        }
    }, [])

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 12,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        <LockResetIcon />
                    </Avatar>
                    <Typography sx={{ fontSize: 40 }} component="h1" variant="h5">
                        Password Reset
                    </Typography>
                    <Typography sx={{ fontSize: 20, justifyContent: "center", marginTop: 5, marginBottom: 5 }} component="h1" variant="h5">
                        Verify your Email  below
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={55}>
                            <TextField
                                name="password-reset-input"
                                required
                                fullWidth
                                id="password-reset-input"
                                label="Enter your email"
                                autoFocus
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                        </Grid>
                    </Grid>
                    <Box
                        component="form"
                        noValidate
                        sx={{ mt: 3 }}
                    >
                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={submitPasswordResetRequest}
                        >
                            Verify
                        </Button>
                    </Box>
                    <Box>
                        <Link href="/" variant="body2">
                            Back to Login page
                        </Link>
                    </Box>
                    {emailError && (
                        <Alert icon={<ErrorIcon />} severity="error" sx={{ mt: 3, width: '100%' }}>
                            That email does not exist in our database!
                        </Alert>
                    )}
                    {emailSent && (
                        <Alert icon={<CheckIcon />} severity="success" sx={{ mt: 3, width: '100%' }}>
                            Email found! Please click the link below <a href={previewLink}>{previewLink}</a>

                        </Alert>
                    )}
                    <Modal
                        open={openModal}
                        onClose={handleClose}
                    >
                        <Box sx={(style)}>
                            <Box sx={{
                                p: 1,
                                display: "flex",
                                justifyContent: "flex-end",
                                position: "absolute",
                                top: 5,
                                right: 5,
                            }}>
                                <IconButton onClick={handleClose}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            <TextField
                                name="new-password"
                                required
                                fullWidth
                                id="new-password"
                                label="Enter your new password"
                                sx={{ mt: 5, mb: 5 }}
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                            <TextField
                                error={confirmError}
                                name="confirm-password"
                                required
                                fullWidth
                                id="confirm-password"
                                label="Confirm your new password"
                                sx={{ mb: 5 }}
                                onChange={(e) => { setConfirmPassword(e.target.value) }}
                                helperText={confirmError ? "Passwords must match" : ""}
                            />
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 5, mb: 2 }}
                                onClick={submitPasswordReset}
                            >
                                Submit
                            </Button>
                            {passwordResetError && (
                                <Alert icon={<ErrorIcon />} severity="error" sx={{ mt: 3, width: '100%' }}>
                                    Could not reset password, try again.
                                </Alert>
                            )}
                            {passwordResetSuccess && (
                                <Alert icon={<CheckIcon />} severity="success" sx={{ mt: 3, width: '100%' }}>
                                    Password has been reset!
                                </Alert>
                            )}
                        </Box>
                    </Modal>
                </Box>
            </Container>
        </ThemeProvider>
    )
}

export default PasswordReset