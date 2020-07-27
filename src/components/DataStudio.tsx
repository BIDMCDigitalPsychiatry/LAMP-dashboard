import React from "react"
import {
  Box,
  Button,
  AppBar,
  Toolbar,
  makeStyles,
  MenuItem,
} from "@material-ui/core";
import DataStudioCanvas from "./DataStudioCanvas";
import Logo from "../icons/logo.png";
import Menu from "@material-ui/core/Menu"
import { ConfirmProvider } from "material-ui-confirm";
import LAMP, { 
  Participant as ParticipantObj
} from "lamp-core"

const useStyles = makeStyles((theme) => ({
  body: { backgroundColor: "f0f4f7 !important" },
  title: {
    flexGrow: 1,
  },
  paper: {
    width: "auto",
    padding: 10,
  },
  headerwhite: { backgroundColor: "white" },
  loggedUser: {
    backgroundColor: "#4696eb",
    display: "block",
    borderRadius: 0,
    minHeight: 100,
    paddingLeft: 30,
    paddingRight: 40,
    "& p": {
      textTransform: "capitalize",
      fontSize: 18,
      color: "white",
      display: "block",
      margin: 0,
      fontWeight: 400,
      lineHeight: "18px",
    },
    "& span": { fontSize: 14, fontWeight: 300, textTransform: "capitalize", color: "white", textAlign: "right" },
    "&:hover": { backgroundColor: "#0052a9" },
  },
  customtoolbar: { paddingRight: 0 },
  loggeduserDropdown: {
    "& ul": { minWidth: 160 },
  },
  logdroplist: {
    backgroundColor: "white",
    minWidth: 160,
    top: "100px !important",
    borderRadius: 0,
    right: 0,
    left: "auto !important",
  }
})) 

export default function DataStudio({ participant, ...props }: { participant: ParticipantObj }) 
{
  const classes = useStyles()
  const [userActivityEvents, setUserActivityEvents] = React.useState([]);
  localStorage.setItem("participant_id", JSON.stringify(participant));

  // Adding Background color to Body
  React.useEffect(() => {
    document.body.style.backgroundColor = "#f0f4f7";
  })  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  
  return (
    <React.Fragment>
      <AppBar position="static" className={classes.headerwhite}>
        <Toolbar className={classes.customtoolbar}>
          <Box component="span" className={classes.title}>
            <img src={Logo} alt="Logo"/>
          </Box>
          <Button aria-haspopup="true" className={classes.loggedUser} onClick={handleClick}>
            <Box component="p">Zco Admin</Box>
            <Box component="span">Researcher</Box>
          </Button>
          <Menu
            id="simple-menu"
            classes={{ paper: classes.logdroplist }}
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>My account</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <ConfirmProvider>
      <DataStudioCanvas />
      </ConfirmProvider>
    </React.Fragment>
  )
} 