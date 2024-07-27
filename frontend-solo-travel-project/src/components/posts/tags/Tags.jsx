import React from "react";
import { Box } from "@mui/material";
import "../../../App.css";
import DisplayChips from "./DisplayChips";

export default function ColorChips(props) {
  const tags = [
    "Outdoors",
    "Indoors",
    "Coffee",
    "Museum",
    "Art",
    "Sightseeing",
    "Hiking",
    "Group Activity",
  ];
  let key = 1;

  return (
    <>
      <Box p={2} sx={{ position: "relative", right: 7 }}>
        {tags.map((tag) => (
          <DisplayChips
            key={key++}
            tagName={tag}
            selected={props.selected}
            setSelected={props.setSelected}
          />
        ))}
      </Box>
    </>
  );
}
