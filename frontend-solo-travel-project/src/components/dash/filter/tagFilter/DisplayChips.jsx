import React, { useState } from "react";
import Chip from "@mui/material/Chip";

export default function DisplayChips(props) {
  const [variant, setVariant] = useState("outlined");
  const clickedColor = "primary";
  const emptyColor = "primary";

  function handleClick() {
    if (variant === "outlined") {
      let addSelected = [...props.selected];
      addSelected.push(props.tagName);
      props.setSelected(addSelected);
      setVariant();
      console.log(props.selected);
      return;
    }
    if (variant !== "outlined") {
      let newArray = props.selected.filter((name) => name !== props.tagName);
      props.setSelected(newArray);
      setVariant("outlined");
      console.log(props.selected);
      return;
    }
  }
  return (
    <>
      <Chip
        label={props.tagName}
        variant={variant}
        color={variant !== "outlined" ? clickedColor : emptyColor}
        onClick={handleClick}
        sx={{ margin: 0.5, p: 0 }}
      />
    </>
  );
}
