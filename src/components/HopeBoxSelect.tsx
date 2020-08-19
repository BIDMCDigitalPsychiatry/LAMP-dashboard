import React, { useState } from "react"
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles"
import GridList from "@material-ui/core/GridList"
import GridListTile from "@material-ui/core/GridListTile"
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline"
import { ReactComponent as Camera } from "../icons/Camera.svg"
import { ReactComponent as HopeBoxHeader } from "../icons/HopeBoxHeader.svg"
import { ReactComponent as Saved } from "../icons/Saved.svg"
import {
  Input,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Icon,
  Box,
  ButtonBase,
  Link,
  Dialog,
  DialogContent,
  Button,
} from "@material-ui/core"

import CloseIcon from "@material-ui/icons/Close"
import ImageUploader from "react-images-upload"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
    },
    singletile: { padding: "0 8px 15px 8px  !important", "& div": { borderRadius: 10 } },

    gridList: {
      width: "100%",
      height: "100%",
      padding: "0 10px",
    },
    backbtn: { 
      // paddingLeft: 0, paddingRight: 0 
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

    addbtnmain: {
      textAlign: "center",
      "& button": { padding: 0 },
      "& h5": {
        fontWeight: 600,
        fontSize: 16,
        color: "rgba(0, 0, 0, 0.75)",
        marginLeft: 10,
        display: "inline-block",
      },
    },
    journalhd: {
      margin: "20px 0 15px 0",
    },

    addicon: { float: "left", color: "#E46759" },
    sample: {},
    hopeHEader: { background: "#FBF1EF", boxShadow: "none", borderBottom: "#fff solid 65px" },
    HopeHeadImage: { marginBottom: -80, marginLeft: "auto", marginRight: "auto" },
    hopeBoxContent: {
      textAlign: "center",
      "& h4": { fontSize: 18, fontWeight: 600, lineHeight: "24px", marginBottom: 20 },
    },
    btnpeach: {
      background: "#FFAC98",
      padding: "15px 25px 15px 25px",
      borderRadius: "40px",
      minWidth: "200px",
      maxWidth: 200,
      boxShadow: " 0px 10px 15px rgba(255, 172, 152, 0.25)",
      lineHeight: "22px",
      display: "inline-block",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: "bold",
      "&:hover": {
        background: "#FFAC98",
        boxShadow:
          "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
      },
      "& div": { background: "transparent !important", margin: 0, padding: 0, boxShadow: "none" },
      "& button": {
        margin: "0 !important",
        padding: "0 !important",
        background: "transparent !important",
        fontSize: "16px !important",
        color: "rgba(0, 0, 0, 0.75) !important",
        fontWeight: "bold !important",
        lineHeight: "22px !important",
      },
    },
    linkpeach: { fontSize: 16, color: "#BC453D", fontWeight: 600 },

    closeButton: {
      color: theme.palette.grey[500],
    },
    dialogueContent: {
      padding: "0px 14px 50px 14px",
      textAlign: "center",
      position: "relative",
      "& h4": { fontSize: 25, fontWeight: 600, marginBottom: 15, marginTop: 20 },
      "& p": { fontSize: 16, fontWeight: 600, color: "rgba(0, 0, 0, 0.75)", lineHeight: "19px" },
      "& img": { width: "100%" },
    },
    dialogueStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    savedMsg: {
      position: "absolute",
      top: 0,
      width: "100%",
      left: 0,
      height: "100%",
      background: "rgba(255,255,255,0.7)",
      paddingTop: "30%",
    },
  })
)

const tileData = []
export default function HopeBoxSelect({ ...props }) {
  const classes = useStyles()
  const [pictures, setPictures] = useState([])
  const [openPreview, setOpenPreview] = useState(false)
  const [imageSrc, setImageSrc] = useState("")
  const [imgSaved, setImgSaved] = useState(false)

  const onDrop = (picture) => {
    if (picture.length > 0) {
      setPictures([...pictures, picture])
      setImageSrc(URL.createObjectURL(picture[0]))
      setOpenPreview(true)
    }
  }

  const openPreviewDialog = () => {
    setImgSaved(false)
    setOpenPreview(true)
  }
  const closePreviewDialog = () => {
    setImgSaved(false)
    setOpenPreview(false)
  }

  const saveImage = () => {
    setImgSaved(true)
  }
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.hopeHEader}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton color="default" className={classes.backbtn} onClick={props.onComplete} aria-label="Menu">
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h5">Hope Box</Typography>
        </Toolbar>
        <HopeBoxHeader className={classes.HopeHeadImage} />
      </AppBar>
      <Box className={classes.hopeBoxContent} px={5} pt={4}>
        <Typography variant="h4">Save images and quotes that bring joy and hope to your life.</Typography>
        <Typography variant="body1" gutterBottom>
          {" "}
          Hope Box content will show up in your feed from time to time to inspire and uplift you.
        </Typography>
        {/* <Box textAlign="center" mt={5} pt={2}>
          <ButtonBase className={classes.btnpeach}>Add an image</ButtonBase>
        </Box>*/}
        <Box textAlign="center" mt={5} pt={2}>
          <ImageUploader
            {...props}
            className={classes.btnpeach}
            withIcon={false}
            withLabel={false}
            withPreview={false}
            onChange={onDrop}
            imgExtension={[".jpg", ".gif", ".png", ".gif"]}
            maxFileSize={9242880}
            buttonText="Add an image"
          />
        </Box>
        <Box textAlign="center" mt={3}>
          <ButtonBase className={classes.btnpeach}>Add a quote</ButtonBase>
        </Box>
        <Box textAlign="center" width={1} mt={3}>
          <Link className={classes.linkpeach}>View my Hope Box</Link>
        </Box>
      </Box>
      {/* <Grid container xs={12} spacing={0} className={classes.journalhd} alignItems="center" justify="center">
        <Grid item xs className={classes.addbtnmain}>
          <IconButton>
            <AddCircleOutlineIcon className={classes.addicon} />
          </IconButton>
          <Typography variant="h5">Add a quote </Typography>
        </Grid>
        <Grid item xs className={classes.addbtnmain}>
          <IconButton>
            <Camera className={classes.addicon} />
          </IconButton>
          <Typography variant="h5">Add an image</Typography>
        </Grid>
      </Grid> */}

      <GridList cellHeight={180} spacing={2} className={classes.gridList} cols={3}>
        {tileData.map((tile) => (
          <GridListTile key={tile.img} cols={1} className={classes.singletile}>
            <img src={tile.img} alt={tile.title} />
          </GridListTile>
        ))}
      </GridList>

      <Dialog fullWidth={true} open={openPreview} onClose={closePreviewDialog}>
        <Box display="flex" justifyContent="flex-end">
          <Box>
            <IconButton aria-label="close" className={classes.closeButton} onClick={() => setOpenPreview(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <DialogContent className={classes.dialogueContent}>
          <img src={imageSrc}></img>
          <Box textAlign="center" mt={5}>
            <Button className={classes.btnpeach} onClick={() => saveImage()}>
              Add to Hope Box
            </Button>
          </Box>
          {imgSaved == true && (
            <Box className={classes.savedMsg}>
              <Saved onClick={closePreviewDialog} />
              <h4>Saved!</h4>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
