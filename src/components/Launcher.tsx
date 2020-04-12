// Core Imports
import React, { useState, useEffect } from "react"
import { Box, Icon, Typography, Divider, Grid, Tooltip, Paper, ButtonBase, useTheme } from "@material-ui/core"

var Launcher: any = {}

Launcher.Placeholder = function Placeholder({ ...props }) {
  return (
    <React.Fragment>
      <Box
        {...props}
        bgcolor="grey.100"
        border={1}
        borderColor="grey.300"
        borderRadius={8}
        style={{
          width: 150,
          height: 150,
          ...(props.style || {}),
        }}
      >
        <Grid container direction="column" justify="center" alignItems="center" style={{ height: "100%" }}>
          <Grid item>
            <Icon>more_horiz</Icon>
          </Grid>
          <Grid item />
        </Grid>
      </Box>
      <Typography variant="overline" align="center">
        No items available
      </Typography>
    </React.Fragment>
  )
}

Launcher.Button = function Button({ notification, favorite, icon, title, onClick, ...props }) {
  const theme = useTheme()
  const color = !!notification
    ? theme.palette.secondary.main
    : !!favorite
    ? theme.palette.primary.main
    : theme.palette.background.paper
  const tooltip = !!notification
    ? "You have a pending notification for this activity."
    : !!favorite
    ? "You've added this activity as a favorite."
    : ""
  return (
    <React.Fragment>
      <Tooltip disableHoverListener={tooltip.length === 0} title={tooltip}>
        <Paper
          elevation={2}
          style={{
            width: 150,
            height: 150,
            borderRadius: 8,
            background: color,
            color: !!notification || !!favorite ? "#fff" : theme.palette.text.primary,
          }}
        >
          <ButtonBase style={{ width: "100%", height: "100%" }} onClick={onClick || (() => {})}>
            <Grid container direction="column" justify="center" alignItems="center" style={{ height: "100%" }}>
              <Grid item>{icon || <Icon fontSize="large">more_horiz</Icon>}</Grid>
              <Grid item />
            </Grid>
          </ButtonBase>
        </Paper>
      </Tooltip>
      <Box textAlign="center" padding style={{ width: 150 }}>
        <Typography variant="overline" style={{ lineHeight: "normal" }}>
          {!!notification || !!favorite ? <b>{title}</b> : title}
        </Typography>
      </Box>
    </React.Fragment>
  )
}

Launcher.Section = function Section({ title, children, ...props }) {
  // eslint-disable-next-line
  const [expanded, setExpanded] = useState(false)
  // eslint-disable-next-line
  const [scroll, setScroll] = useState(false)
  useEffect(() => setExpanded(Array.isArray(children) ? children.filter((x) => !!x).length > 0 : !!children), [
    children,
  ])

  return (
    <React.Fragment>
      <Grid item style={{ margin: "0px 16px" }}>
        <Typography variant="overline" style={{ fontWeight: 700, fontSize: 16 }}>
          {title}
        </Typography>
      </Grid>
      <Grid>
        <Grid
          container
          justify="center"
          direction="row"
          wrap={scroll ? "nowrap" : "wrap"}
          spacing={scroll ? 2 : 1}
          style={{
            overflowX: scroll ? "scroll" : undefined,
            overflowY: scroll ? "hidden" : undefined,
            padding: scroll ? "0px 0px 16px 16px" : undefined,
          }}
        >
          {Array.isArray(children) && children.filter((x) => !!x).length > 0 ? (
            children
              .filter((x) => !!x)
              .map((x, idx) => (
                <Grid item key={idx}>
                  {x}
                </Grid>
              ))
          ) : (
            <Grid item>
              {Array.isArray(children) && children.filter((x) => !!x).length === 0 ? (
                <Launcher.Placeholder />
              ) : (
                children ?? <Launcher.Placeholder />
              )}
            </Grid>
          )}
          <Grid />
        </Grid>
      </Grid>
    </React.Fragment>
  )
}

Launcher.Group = function ({ children, ...props }) {
  return (
    <Grid container direction="column" spacing={2} wrap="nowrap">
      <Grid item />
      {children.map((x, idx) => (
        <React.Fragment key={idx}>
          {x}
          {idx + 1 < children.length && (
            <Grid item>
              <Divider />
            </Grid>
          )}
        </React.Fragment>
      ))}
      <Grid item />
    </Grid>
  )
}

export default Launcher
