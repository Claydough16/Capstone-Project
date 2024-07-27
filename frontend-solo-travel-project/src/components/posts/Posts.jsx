import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LikeFunction from "../likes/LikeFunction";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { baseURL } from "../../environment";
import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { MessageInput } from "@chatscope/chat-ui-kit-react";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import Popover from "@mui/material/Popover";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";

// concatenate the date for posts
function formatDate(dateString) {
  const date = new Date(dateString);

  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2);

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? " PM" : " AM";
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${month}/${day}/${year} at ${hours}:${minutes}${ampm}`;
}

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function Posts({ post, userId, token }) {
  const [expanded, setExpanded] = useState(false);
  const [likeCount, setLikeCount] = useState(
    post.likes ? post.likes.length : 0
  );
  const userName = localStorage.getItem("userName");

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = (value) => {
    setOpen(false);
  };

  const handleModalClick = () => {
    setOpen(true);
  };

  const handlePopoverClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen1(true);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setOpen1(false);
  };

  const handleOptions = () => {
    handlePopoverClose();
    if (post.username === userName) {
      handleModalClick();
    }
  };

  async function handleDelete() {
    const url = `${baseURL}/post/${post._id}`;

    const options = {
      method: "DELETE",
      headers: new Headers({
        Authorization: token,
      }),
    };

    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        throw new Error("Failed to delete post");
      }
      const data = await res.json();
      console.log(data.message);
    } catch (err) {
      console.error(err.message);
    }
  }

  const addFriend = async () => {
    /*   const token = localStorage.getItem("token"); */
    const userId = localStorage.getItem("userId");
    const friend = post.username;
    console.log(friend, userId);

    const url = `${baseURL}/user/friends`;

    const headers = new Headers();
    headers.append("Authorization", token);
    headers.append("Content-Type", "application/json");

    const body = { friendUserName: friend, userId: userId };

    const requestOptions = {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error("Failed to send friend request");
      }
      setOpen1(false)
      console.log("Friend request sent successfully.");
    } catch (error) {
      console.error("Error sending friend request:", error.message);
    }
  };

  //Creates a chat room on message send,
  async function sendMessage(userMessage) {
    const body = userMessage;
    const user = userName;

    const room = [userName, post.username];

    let bodyObj = JSON.stringify({
      body,
      user,
      room,
    });

    const url = `${baseURL}/message/new`;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", token);

    const requestOption = {
      headers,
      body: bodyObj,
      method: "POST",
    };

    try {
      const response = await fetch(url, requestOption);
      const data = await response.json();
      createRoom();
    } catch (err) {
      console.error(err.message);
    }
  }

  async function createRoom() {
    const name = `${userName} and ${post.username}'s room`;
    const addedUsers = [userName, post.username];

    let bodyObj = JSON.stringify({
      name,
      addedUsers,
    });

    const url = `${baseURL}/room/`;
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", token);

    const requestOption = {
      headers,
      body: bodyObj,
      method: "POST",
    };

    try {
      const response = await fetch(url, requestOption);
      const data = await response.json();
    } catch (err) {
      console.error(err.message);
    }
  }

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  React.useEffect(() => {
    if (post && post.likes) {
      setLikeCount(post.likes.length);
    }
  }, [post, userId]);

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          Are you sure you would like to delete this post?
        </DialogTitle>
        <Button
          variant="contained"
          color="error"
          sx={{ mt: 1 }}
          onClick={handleDelete}
        >
          {" "}
          {post.username === userName ? "Delete" : "Report"}
        </Button>
      </Dialog>

      <Popover
        open={open1}
        onClose={handlePopoverClose}
        anchorEl={anchorEl}
        sx={{ left: 20 }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ padding: 2 }}>
          <Typography sx={{ mb: 0.5 }}> Options </Typography>
          <Divider></Divider>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              {" "}
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 1 }}
                onClick={addFriend}
              >
                <Box sx={{ width: 90 }}>Add Friend</Box>
              </Button>
            </Grid>
            <Grid item>
              {" "}
              <Button
                variant="contained"
                color="error"
                sx={{ mt: 1 }}
                onClick={handleOptions}
              >
                {" "}
                <Box sx={{ width: 90 }}>
                  {" "}
                  {post.username === userName ? "Delete" : "Report"}
                </Box>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Popover>
      <Card
        sx={{
          maxWidth: 345,
          minWidth: 345,
          minHeight: 500,
          backgroundColor: "#F5F5F5",
        }}
        variant="outlined"
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: "grey" }} aria-label="recipe">
              {/* Changed the Avatar to display "U" if user is undefined */}
              {post.username ? post.username.charAt(0).toUpperCase() : "U"}
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon onClick={handlePopoverClick} />
            </IconButton>
          }
          titleTypographyProps={{ variant: "h7" }}
          title={post.title}
          subheader={`${post.username} • ${formatDate(post.eventDate)}`}
        />
        <CardMedia
          component="img"
          height="194"
          image={post.imgUrl}
          alt="Post image"
        />
        <CardContent sx={{ height: 170 }}>
          <Typography variant="body2" color="text.secondary">
            {post.tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                variant={"outlined"}
                color={"primary"}
                sx={{ margin: 0.5, fontSize: 12 }}
              />
            ))}
          </Typography>
          <Box sx={{ p: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {post.description}
            </Typography>
          </Box>
        </CardContent>
        <CardActions disableSpacing>
          <LikeFunction
            postId={post._id}
            userId={userId}
            token={token}
            updateLikeCount={setLikeCount}
            likeCount={likeCount}
          />
          {/*           <IconButton aria-label="share">
            <ShareIcon />
          </IconButton> */}
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <MessageInput
              placeholder={`Send ${post.username} a message`}
              onSend={sendMessage}
              attachButton={false}
            />
          </CardContent>
        </Collapse>
      </Card>
    </>
  );
}
