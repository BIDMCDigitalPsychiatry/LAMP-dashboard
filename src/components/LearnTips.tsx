// Core Imports
import React, { useState } from "react"
import {
  Typography,
  makeStyles,
  Box,
  Grid,
  IconButton,
  useTheme,
  Container,
  AppBar,
  Toolbar,
  Icon,
  CardMedia,
  CardContent,
  useMediaQuery,
  CardActionArea,
  Card,
  Link,
} from "@material-ui/core"
import ResponsiveDialog from "./ResponsiveDialog"
import ChevronRightIcon from "@material-ui/icons/ChevronRight"

const useStyles = makeStyles((theme) => ({
  topicon: {
    minWidth: 200,
    minHeight: 200,

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
    margin: "0 auto 20px",
    "& h6": { fontSize: 16, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)" },
  },
  toolbardashboard: {
    minHeight: 65,
    "& h5": {
      color: "rgba(0, 0, 0, 0.75)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      width: "100%",
    },
  },
  backbtn: { paddingLeft: 0, paddingRight: 0 },
  rightArrow: { maxWidth: 50, padding: "15px 12px 11px 12px !important", "& svg": { color: "rgba(0, 0, 0, 0.5)" } },
}))

export default function LearnTips({ ...props }) {
  const classes = useStyles()
  const [openDialog, setOpenDialog] = useState(false)
  const [title, setTitle] = useState(null)
  const [details, setDetails] = useState(null)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))

  return (
    <Container>
      <Box>
        <Grid container direction="row" alignItems="stretch">
          {props.details.map((detail) =>
            props.type === 2 ? (
              <Grid item lg={6} sm={12} xs={12}>
                <Card className={classes.root2}>
                  <CardActionArea>
                    <CardMedia className={classes.media} image={detail.image} />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {detail.text}
                        <br />
                        {detail.author}
                      </Typography>
                      {detail.link && <Link href={detail.link}>{detail.text}</Link>}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ) : (
              <Grid container direction="row" justify="center" alignItems="center">
                <Grid item lg={6} sm={12} xs={12}>
                  <Box
                    className={classes.tipStyle}
                    onClick={() => {
                      setOpenDialog(true)
                      setTitle(detail.title)
                      setDetails(detail.text)
                    }}
                  >
                    {supportsSidebar ? (
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
                    ) : (
                      <Typography variant="h6">{detail.title}</Typography>
                    )}
                  </Box>
                </Grid>
              </Grid>
            )
          )}{" "}
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
            <IconButton
              onClick={() => setOpenDialog(false)}
              color="default"
              className={classes.backbtn}
              aria-label="Menu"
            >
              <Icon>arrow_back</Icon>
            </IconButton>
          </Toolbar>
        </AppBar>

        <Box className={classes.header}>
          <Box width={1} className={classes.headerIcon}>
            {props.icon}
          </Box>
          <Typography variant="caption">Tip</Typography>
          <Typography variant="h2">{title}</Typography>
        </Box>

        <CardContent className={classes.tipscontentarea}>
          <Typography variant="body2" color="textSecondary" component="p">
            {details}
          </Typography>
        </CardContent>
      </ResponsiveDialog>
    </Container>
  )
}
