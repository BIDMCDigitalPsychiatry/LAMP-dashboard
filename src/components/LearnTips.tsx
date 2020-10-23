// Core Imports
import React, { useState } from "react"
import { Typography, makeStyles, Box, Grid, IconButton, Container, AppBar, Toolbar, Icon } from "@material-ui/core"
import ResponsiveDialog from "./ResponsiveDialog"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"
import TipNotification from "./TipNotification"

const useStyles = makeStyles((theme) => ({
  topicon: {
    minWidth: 180,
    minHeight: 180,
    [theme.breakpoints.down("xs")]: {
      minWidth: 180,
      minHeight: 180,
    },
  },
  root2: {
    maxWidth: 345,
    margin: "16px",
    maxLength: 500,
  },
  media: {
    height: 200,
  },
  header: {
    background: "#FFF9E5",
    padding: "0 20px 20px 20px",
    [theme.breakpoints.up("sm")]: {
      textAlign: "center",
    },
    "& h2": {
      fontSize: 25,
      fontWeight: 600,
      color: "rgba(0, 0, 0, 0.75)",
    },
  },
  headerIcon: { textAlign: "center" },
  tipscontentarea: {
    padding: 20,
    "& h3": {
      fontWeight: "bold",
      fontSize: "16px",
      marginBottom: "15px",
    },
    "& p": {
      fontSize: "14px",
      lineHeight: "20px",
      color: "rgba(0, 0, 0, 0.75)",
    },
  },
  tipStyle: {
    background: "#FFF9E5",
    borderRadius: "10px",
    padding: "20px 20px 20px 20px",
    textAlign: "justify",
    margin: "20px auto 0px",
    "& h6": { fontSize: 16, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)" },
  },
  toolbardashboard: {
    minHeight: 65,
    padding: "0 10px",
    "& h5": {
      color: "rgba(0, 0, 0, 0.75)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      width: "calc(100% - 96px)",
    },
  },
  rightArrow: { maxWidth: 50, padding: "15px 12px 11px 12px !important", "& svg": { color: "rgba(0, 0, 0, 0.5)" } },
  lineyellow: {
    background: "#FFD645",
    height: "3px",
  },
  linegreen: {
    background: "#65CEBF",
    height: "3px",
  },
  linered: {
    background: "#FF775B",
    height: "3px",
  },
  lineblue: {
    background: "#86B6FF",
    height: "3px",
  },
  likebtn: {
    fontStyle: "italic",
    padding: 6,
    margin: "0 5px",
    "&:hover": { background: "#FFD645" },
    "& label": {
      position: "absolute",
      bottom: -18,
      fontSize: 12,
    },
  },
  active: {
    background: "#FFD645",
  },
  howFeel: { fontSize: 14, color: "rgba(0, 0, 0, 0.5)", fontStyle: "italic", textAlign: "center", marginBottom: 10 },
  btnyellow: {
    background: "#FFD645",
    borderRadius: "40px",
    minWidth: "200px",
    boxShadow: "0px 10px 15px rgba(255, 214, 69, 0.25)",
    lineHeight: "38px",
    marginTop: "12%",
    cursor: "pointer",
    textTransform: "capitalize",
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.75)",
    "& span": { cursor: "pointer" },
    "&:hover": {
      background: "#FFD645",
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    },
  },
  colorLine: { maxWidth: 115 },
}))

export default function LearnTips({ ...props }) {
  const classes = useStyles()
  const [openDialog, setOpenDialog] = useState(false)
  const [title, setTitle] = useState(null)
  const [details, setDetails] = useState(null)
  const [images, setImages] = useState(null)
  const [author, setAuthor] = useState(null)
  const [link, setLink] = useState(null)

  return (
    <Container>
      <Box pb={4}>
        <Grid container direction="row" alignItems="stretch">
          {Object.keys(props.details).length > 0
            ? props.details.map((detail, index) => (
                <Grid key={index} container direction="row" justify="center" alignItems="center">
                  <Grid item lg={6} sm={12} xs={12}>
                    <Box
                      className={classes.tipStyle}
                      onClick={() => {
                        setOpenDialog(true)
                        setTitle(detail.title)
                        setDetails(detail.text)
                        setImages(detail.image)
                        setAuthor(detail.author)
                        setLink(detail.link)
                      }}
                    >
                      <div>
                        <Grid container spacing={3}>
                          <Grid item xs>
                            <Typography variant="h6">{detail.title}</Typography>
                          </Grid>
                          <Grid item xs justify="center" className={classes.rightArrow}>
                            <ChevronRightIcon />
                          </Grid>
                        </Grid>
                      </div>
                    </Box>
                  </Grid>
                </Grid>
              ))
            : ""}
        </Grid>
      </Box>
      <ResponsiveDialog
        transient={false}
        animate
        fullScreen
        open={openDialog}
        onClose={() => {
          setOpenDialog(false)
        }}
      >
        <AppBar position="static" style={{ background: "#FFF9E5", boxShadow: "none" }}>
          <Toolbar className={classes.toolbardashboard}>
            <IconButton onClick={() => setOpenDialog(false)} color="default" aria-label="Menu">
              <Icon>arrow_back</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>
        <TipNotification
          title={title}
          details={details}
          icon={props.icon}
          images={images}
          author={author}
          link={link}
          onComplete={() => {
            setOpenDialog(false)
          }}
        />
      </ResponsiveDialog>
    </Container>
  )
}
