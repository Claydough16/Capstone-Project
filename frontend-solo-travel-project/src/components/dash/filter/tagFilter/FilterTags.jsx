import React from "react";
import { Box } from "@mui/material";
import DisplayChips from "./DisplayChips";

export default function FilterTags(props) {
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
      <Box p={1} sx={{ position: "relative" }}>
        {tags.map((tag) => (
          <DisplayChips
            key={key++}
            tagName={tag}
            selected={props.selectedTags}
            setSelected={props.setSelectedTags}
          />
        ))}
      </Box>
    </>
  );
}
