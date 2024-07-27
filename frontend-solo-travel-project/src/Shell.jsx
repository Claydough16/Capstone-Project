import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationModal from "./components/notifications/NotificationModal";
import { baseURL } from "./environment";
import { Routes, Route } from "react-router-dom"; // Ensure correct import
import Login from "./components/auth/Login";
import Dashboard from "./components/dash/Dashboard";
import Signup from "./components/auth/Signup";
import MyLikes from "./components/likes/MyLikes";
import Profile from "./components/profile/Profile";
import Friends from "./components/friends/Friends";
import PasswordReset from "./components/passwordReset/PasswordReset";
import MainInbox from "./components/inbox/MainInbox";
import { navListItems } from "./components/dash/navItems";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: "border-box",
        ...(!open && {
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing(9),
            },
        }),
    },
}));

const defaultTheme = createTheme();

function Shell() {
    const [open, setOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sessionToken, setSessionToken] = useState("");
    const [userId, setUserId] = useState("");
    const [unreadCount, setUnreadCount] = useState(0);
    const [username, setUsername] = useState(""); // Ensure setUsername is defined

    const navigate = useNavigate();
    const location = useLocation();

    const toggleDrawer = () => {
        setOpen(!open);
    };

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setSessionToken("");
        setUserId("");
        navigate("/");
    };

    const updateLocalToken = (newToken) => {
        localStorage.setItem("token", newToken);
        setSessionToken(newToken);
        if (
            location.pathname === `${baseURL}` ||
            location.pathname === `${baseURL}/signup`
        ) {
            setSessionToken("");
        }
    };

    const updateLocalUserId = (newUserId) => {
        localStorage.setItem("userId", newUserId);
        setUserId(newUserId);
    };

    const updateLocalUsername = (newUsername) => {
        localStorage.setItem("userName", newUsername);
        setUsername(newUsername);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        const storedUserId = localStorage.getItem("userId");
        if (token) {
            setSessionToken(token);
        } else {
            setSessionToken("");
        }
        if (storedUserId) {
            setUserId(storedUserId);
        } else {
            setUserId("");
        }
    }, []);

    useEffect(() => {
        if (
            sessionToken &&
            location.pathname !== "/" &&
            location.pathname !== "/signup"
        ) {
            fetchUnreadCount();
            // Poll for unread notifications every 5 seconds
            const intervalId = setInterval(fetchUnreadCount, 5000);
            // Clear interval on component unmount
            return () => clearInterval(intervalId);
        }
    }, [sessionToken, location.pathname]);

    const fetchUnreadCount = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${baseURL}/notification/unread`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch unread notifications count");
            }

            const data = await response.json();
            setUnreadCount(data.unreadCount);
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    };

    const getHeaderText = () => {
        const pathSegments = location.pathname
            .split("/")
            .filter((segment) => segment !== "");
        if (pathSegments.length > 0) {
            return (
                pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() +
                pathSegments[pathSegments.length - 1].slice(1)
            );
        }
        return "";
    };

    return (
        <div className="App">
            <ThemeProvider theme={defaultTheme}>
                <Box sx={{ display: "flex" }}>
                    <CssBaseline />
                    {sessionToken && (
                        <>
                            <AppBar position="absolute" open={open}>
                                <Toolbar
                                    sx={{
                                        pr: "24px",
                                    }}
                                >
                                    <IconButton
                                        edge="start"
                                        color="inherit"
                                        aria-label="open drawer"
                                        onClick={toggleDrawer}
                                        sx={{
                                            marginRight: "36px",
                                            ...(open && { display: "none" }),
                                        }}
                                    >
                                        <MenuIcon />
                                    </IconButton>
                                    <Typography
                                        component="h1"
                                        variant="h6"
                                        color="inherit"
                                        noWrap
                                        sx={{ flexGrow: 1 }}
                                    >
                                        {getHeaderText()}
                                    </Typography>
                                    <IconButton color="inherit" onClick={toggleModal}>
                                        <Badge badgeContent={unreadCount} color="error">
                                            {unreadCount > 0 ? (
                                                <NotificationsActiveIcon />
                                            ) : (
                                                <NotificationsIcon />
                                            )}
                                        </Badge>
                                    </IconButton>
                                    <IconButton color="inherit" onClick={handleLogout}>
                                        <LogoutIcon />
                                    </IconButton>
                                </Toolbar>
                            </AppBar>
                            <Drawer variant="permanent" open={open}>
                                <Toolbar
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                        px: [1],
                                    }}
                                >
                                    <IconButton onClick={toggleDrawer}>
                                        <ChevronLeftIcon />
                                    </IconButton>
                                </Toolbar>
                                <Divider />
                                <List component="nav">{navListItems}</List>
                            </Drawer>
                        </>
                    )}
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Login
                                    updateToken={updateLocalToken}
                                    setUserId={updateLocalUserId}
                                    setUsername={updateLocalUsername}
                                />
                            }
                        />
                        <Route
                            path="/signup"
                            element={
                                <Signup
                                    updateToken={updateLocalToken}
                                    setUserId={updateLocalUserId}
                                    setUsername={updateLocalUsername}
                                />
                            }
                        />
                        <Route path="/password-reset" element={<PasswordReset />} />
                        <Route
                            path="/dashboard"
                            element={<Dashboard token={sessionToken} userId={userId} />}
                        />
                        <Route
                            path="/profile"
                            element={<Profile token={sessionToken} userId={userId} />}
                        />
                        <Route
                            path="/user/:userId/interested"
                            element={<MyLikes token={sessionToken} userId={userId} />}
                        />
                        <Route path="/friends" element={<Friends />} />
                        <Route
                            path="/message/inbox"
                            element={<MainInbox token={sessionToken} userId={userId} />}
                        />
                    </Routes>
                </Box>
            </ThemeProvider>
            <NotificationModal
                isOpen={isModalOpen}
                onClose={toggleModal}
                fetchUnreadCount={fetchUnreadCount}
            />
        </div>
    );
}

export default Shell;
