// Core Imports
import React from "react"
import { Box, Grid, Typography } from "@material-ui/core"

import { ReactComponent as One } from "../icons/HopeBox/One.svg"
import { ReactComponent as Two } from "../icons/HopeBox/Two.svg"
import { ReactComponent as Three } from "../icons/HopeBox/Three.svg"
import { ReactComponent as Four } from "../icons/HopeBox/Four.svg"

export default function HopeBox({ ...props }) {
  return (
    <Box
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        overflow: "hidden",
        width: "auto",
        height: "auto",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <One />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box style={{ background: "green", overflowWrap: "anywhere" }}>Don’t stop until you’re proud.</Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Two />
          {/* </Grid> */}
          {/* <Grid item xs={12} sm={6}> */}
          <Three />
          {/* </Grid> */}
        </Grid>
        <Grid item xs={12} sm={6}>
          {/* <Grid item xs={12} sm={6}> */}
          <Box style={{ background: "pink", overflowWrap: "anywhere" }}>Smooth seas never made a skilled sailor.</Box>
          {/* </Grid> */}
          {/* <Grid item xs={12} sm={6}> */}
          <Four />
          {/* </Grid> */}
          {/* <Grid item xs={12} sm={6}> */}
          <Box style={{ background: "red", overflowWrap: "anywhere" }}>
            Begin each day with a positive thought and a grateful heart.
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
