// Core Imports
import React from "react"
import { Box, Typography, makeStyles, Theme, createStyles } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerWidth: { maxWidth: 1055 },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    unableContainer: {
      width: 24,
      height: 24,
      border: "3px solid #BFBFBF",
      borderRadius: 12,
      boxSizing: "border-box",
      marginRight: 17,
      opacity: 0.4,
    },
    unableCheck: {
      fontSize: 14,
      color: "rgba(0, 0, 0, 0.4)",
      flex: 1,
      opacity: 0.4,
    },
    uncheckContainer: {
      width: 24,
      height: 24,
      border: "3px solid #C6C6C6",
      borderRadius: 12,
      boxSizing: "border-box",
      arginRight: 17,
    },
    checkedContainer: {
      width: 24,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#2F9D7E",
      borderRadius: 12,
      marginRight: 17,
    },
    titleChecked: {
      fontSize: 14,
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: "bold",
      flex: 1,
    },
    titleUncheck: {
      fontSize: 14,
      color: "rgba(0, 0, 0, 0.4)",
      flex: 1,
    },
    mL14: {
      marginLeft: "14px",
    },
  })
)

export default function RatioButton({ checked, onChange, title, value, unable, smallSpace, color, ...props }) {
  const classes = useStyles()
  return (
    <Box display="flex" mx={3}>
      <div
        onClick={() => !unable && onChange(value)}
        className={unable ? classes.unableContainer : checked ? classes.checkedContainer : classes.uncheckContainer}
        style={{
          marginRight: smallSpace ? 10 : 10,
          backgroundColor: checked ? (color ? color : "#2F9D7E") : "transparent",
        }}
      />
      <Typography className={unable ? classes.unableCheck : checked ? classes.titleChecked : classes.titleUncheck}>
        {title}
      </Typography>
    </Box>
  )
}
