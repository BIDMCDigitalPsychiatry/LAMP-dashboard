// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  Tooltip,
  Typography,
  Grid,
  Fab,
  Divider,
  Icon,
  Button,
  TextField,
  ButtonBase,
  Container,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core"
import LAMP from "lamp-core"
import { makeStyles, Theme, createStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { Service } from "../../DBService/DBService"

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#333",
    },
  },
  overrides: {
    MuiFilledInput: {
      root: {
        border: 0,
        backgroundColor: "#f4f4f4",
      },
      underline: {
        "&&&:before": {
          borderBottom: "none",
        },
        "&&:after": {
          borderBottom: "none",
        },
      },
    },
    MuiTextField: {
      root: { width: "100%" },
    },
    MuiDivider: {
      root: { margin: "25px 0" },
    },
  },
})

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerWidth: { maxWidth: 1055 },
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
    activityContent: {
      padding: "25px 50px 0",
    },
    btnText: {
      color: "#333",
      fontSize: 14,
      lineHeight: "38px",
      cursor: "pointer",
      textTransform: "capitalize",
      boxShadow: "none",
      border: "#7599FF solid 1px",
      background: "transparent",
      margin: "15px 0",
      "& span.material-icons": { marginRight: 5, color: "#7599FF" },
    },
    btnTextAdd: {
      color: "#333",
      fontSize: 14,
      lineHeight: "38px",
      cursor: "pointer",
      textTransform: "capitalize",
      boxShadow: "none",
      border: "#7599FF solid 1px",
      background: "transparent",
      "& svg": { marginRight: 5, color: "#7599FF" },
    },
    colorRed: {
      color: "#FF0000",
    },
    inputFile: {
      display: "none",
    },
    uploadFile: {
      position: "absolute",
      "& input": {
        height: 154,
        position: "absolute",
        top: 0,
        padding: 0,
        opacity: 0,
        zIndex: 111,
      },
    },
    gridTitle: { margin: "50px 0 35px", paddingBottom: 15, borderBottom: "#ddd solid 1px" },
    btnBlue: {
      background: "#7599FF",
      borderRadius: "40px",
      minWidth: 100,
      boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.20)",
      lineHeight: "38px",

      cursor: "pointer",
      textTransform: "capitalize",
      fontSize: "16px",
      color: "#fff",
      "& svg": { marginRight: 8 },
      "&:hover": { background: "#5680f9" },
    },
  })
)

export default function TipDetails({
  selectedDataCategory,
  studyId,
  category,
  tipsDataArrayVal,
  handleTipsDataArray,
  ...props
}: {
  selectedDataCategory?: any
  category?: string
  studyId?: string
  tipsDataArrayVal?: any
  handleTipsDataArray?: Function
}) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()
  const [categoryImage, setCategoryImage] = useState("")
  const [tipsDataArray, setTipsDataArray] = useState([{ title: "", text: "", image: "" }])
  const [loading, setLoading] = useState(false)
  const [focusedTextfield, setFocusedTextfield] = useState(null)
  const [openDialog, setOpenDialog] = useState(false)
  const [clickDeleteId, setClickDeleteId] = useState("")
  const [deletedIds, setDeletedIds]: any = useState("")
  const [addRow, setAddRow] = useState(false)
  const [selectedCategory, setSelectedCategory]: any = useState({})
  const defaultSettingsArray = [{ title: "", text: "", image: "" }]
  const defaultSelectedCategory = {
    id: undefined,
    name: "",
    spec: "lamp.tips",
    icon: "",
    schedule: [],
    settings: [{ title: "", text: "", image: "" }],
    studyID: "",
  }

  useEffect(() => {
    let currentSelectedCategory = selectedCategory
    if (addRow) {
      if (Object.keys(selectedCategory).length > 0 && Object.keys(selectedCategory.settings).length > 0) {
        currentSelectedCategory.settings = currentSelectedCategory.settings.concat(defaultSettingsArray)
        setSelectedCategory(currentSelectedCategory)
        setTipsDataArray(currentSelectedCategory.settings)
      } else {
        setSelectedCategory(defaultSelectedCategory)
      }
      let settingsLength = selectedCategory.settings.length
      setFocusedTextfield("tipsTitle_" + (settingsLength - 1))
    }
    setAddRow(false)
  }, [addRow])

  useEffect(() => {
    let id = deletedIds
    if (id !== "") {
      let currentTipsArray = tipsDataArray
      currentTipsArray.splice(id, 1)
      setTipsDataArray([...currentTipsArray])
      let currentSelectedCategory = selectedCategory
      currentSelectedCategory.settings = currentTipsArray
      setSelectedCategory(currentSelectedCategory)
      setDeletedIds("")
    }
    setLoading(false)
  }, [deletedIds])

  useEffect(() => {
    if (tipsDataArrayVal) {
      setTipsDataArray(tipsDataArrayVal)
    }
  }, [tipsDataArrayVal])

  useEffect(() => {
    //getTipsByStudyId()
    if (selectedDataCategory) {
      setSelectedCategory(selectedDataCategory)
    }
  }, [selectedDataCategory])

  const removeEventValue = (event) => {
    event.target.value = null
  }

  const deleteData = (id) => {
    if (Object.keys(selectedCategory).length > 0 && Object.keys(selectedCategory.settings).length <= 1)
      enqueueSnackbar(t("You are not allowed to delete all the details from the tip."), {
        variant: "error",
      })
    else {
      setLoading(true)
      setOpenDialog(false)
      setDeletedIds(id)
    }
  }

  const getTipsByStudyId = () => {
    if (studyId) {
      Service.getDataByKey("activities", [category], "id").then((activitiesData: any) => {
        setSelectedCategory(activitiesData)
      })
    }
  }

  const uploadImageFile = (event, type = "new", id = "") => {
    const file = event.target.files[0]
    const fileName = event.target.files[0].name
    const fileSize = event.target.files[0].size / 1024 / 1024
    const extension = fileName.split(".").reverse()[0]?.toLowerCase()
    const fileFormats = ["jpeg", "jpg", "png", "bmp", "gif", "svg"]
    if (fileFormats.includes(extension) && fileSize <= 4) {
      setLoading(true)
      let tipsData: any
      if (type === "photo") {
        file &&
          getBase64(
            file,
            (result: any) => {
              setCategoryImage(result)
              setLoading(false)
            },
            "photo"
          )
      } else {
        tipsData = tipsDataArray
        file &&
          getBase64(file, (result: any) => {
            tipsData[id].image = result
            setTipsDataArray([...tipsData])
            setLoading(false)
          })
      }
    } else {
      enqueueSnackbar(t("Images should be in the format jpeg/png/bmp/gif/svg and the size should not exceed 4 MB."), {
        variant: "error",
      })
    }
  }

  const getBase64 = (file, cb, type = "") => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    if (type === "photo") {
      const fileName = file.name
      const extension = fileName.split(".").reverse()[0]?.toLowerCase()
      const fileFormats = ["jpeg", "jpg", "png", "bmp", "gif", "svg"]
      if (extension !== "svg") {
        let width = 300
        let height = 300
        reader.onload = (event) => {
          let img = new Image()
          img.src = event.target.result as string
          img.onload = () => {
            let elem = document.createElement("canvas")
            elem.width = width
            elem.height = height
            let ctx = elem.getContext("2d")
            ctx.drawImage(img, 0, 0, width, height)
            cb(ctx.canvas.toDataURL())
          }
        }
      } else {
        reader.onloadend = () => {
          cb(reader.result)
        }
      }
    } else {
      reader.onloadend = () => {
        cb(reader.result)
      }
    }
    reader.onerror = function (error) {
      enqueueSnackbar(t("An error occured while uploading. Please try again."), {
        variant: "error",
      })
    }
  }

  const handleTipsData = (e: any, type, id) => {
    let tipsData = tipsDataArray
    if (type === "title") tipsData[id].title = e.target.value
    if (type === "text") tipsData[id].text = e.target.value
    if (type === "image") {
      uploadImageFile(e, "all", id)
    }
    setTipsDataArray([...tipsData])
    let currentSelectedCategory = selectedCategory
    currentSelectedCategory.settings = tipsData
    setSelectedCategory(currentSelectedCategory)
  }

  useEffect(() => {
    handleTipsDataArray(tipsDataArray)
  }, [tipsDataArray])

  const removeImage = (id = 0) => {
    let tipsData
    tipsData = tipsDataArray
    tipsData[id].image = ""
    setTipsDataArray([...tipsData])
  }

  return (
    <Grid container direction="column" spacing={2} {...props}>
      <MuiThemeProvider theme={theme}>
        <Container className={classes.containerWidth}>
          {Object.keys(selectedCategory).length > 0 ? (
            <Grid container direction="row" justify="space-between" alignItems="center" className={classes.gridTitle}>
              <Grid item>
                <Typography variant="h6">{t("Tip Details")}</Typography>
              </Grid>
              <Grid item>
                <Fab
                  className={classes.btnBlue}
                  aria-label="Add"
                  variant="extended"
                  onClick={() => {
                    setAddRow(true)
                  }}
                  disabled={!category || !studyId ? true : false}
                >
                  <Icon>add</Icon> {t("Add")}
                </Fab>
              </Grid>
            </Grid>
          ) : (
            ""
          )}
          {Object.keys(selectedCategory).length > 0 && Object.keys(selectedCategory.settings).length > 0
            ? selectedCategory.settings.map(
                (x, idx) => (
                  <Grid container spacing={2} key={idx}>
                    <Grid item xs sm={4} md={3} lg={2}>
                      <Tooltip title={!x.image ? t("Tap to select a photo.") : t("Tap to delete the photo.")}>
                        <Box
                          width={154}
                          height={154}
                          border={1}
                          borderRadius={4}
                          borderColor="text.secondary"
                          color="text.secondary"
                          style={{
                            background: !!x.image ? `url(${x.image}) center center/cover no-repeat` : undefined,
                            position: "relative",
                          }}
                        >
                          {x.image === "" || x.image === undefined ? (
                            <label htmlFor="upload-image">
                              <TextField
                                name="upload-image"
                                variant="filled"
                                className={classes.uploadFile}
                                type="file"
                                onClick={(event) => removeEventValue(event)}
                                onChange={(event) => handleTipsData(event, "image", idx)}
                              />
                            </label>
                          ) : (
                            ""
                          )}
                          <ButtonBase
                            style={{ width: "100%", height: "100%" }}
                            onClick={(e) => {
                              removeImage(idx)
                            }}
                          >
                            <Icon fontSize="large">
                              {x.image === "" || x.image === undefined ? "add_a_photo" : "delete_forever"}
                            </Icon>
                          </ButtonBase>
                        </Box>
                      </Tooltip>
                    </Grid>
                    <Grid item sm={8} md={9} lg={10}>
                      <Grid container spacing={2}>
                        <Grid item lg={6} md={6} sm={6} xs={12}>
                          <Box>
                            <TextField
                              error={
                                typeof x.title === "undefined" ||
                                (typeof x.title !== "undefined" && x.title?.trim() === "")
                                  ? true
                                  : false
                              }
                              autoFocus={focusedTextfield === "tipsTitle_" + idx ? true : false}
                              fullWidth
                              variant="filled"
                              label={t("Tips Title")}
                              value={x.title}
                              id={"tipsTitle_" + idx}
                              className="tipsTitle"
                              onChange={(e) => {
                                handleTipsData(e, "title", idx)
                              }}
                              helperText={
                                typeof x.title === "undefined" ||
                                (typeof x.title !== "undefined" && x.title?.trim() === "")
                                  ? t("Please enter Tips Title")
                                  : ""
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          <Box>
                            <TextField
                              error={
                                typeof x.text === "undefined" ||
                                (typeof x.text !== "undefined" && x.text?.trim() === "")
                                  ? true
                                  : false
                              }
                              fullWidth
                              variant="filled"
                              label={t("Tips Description")}
                              rows={4}
                              rowsMax={15}
                              value={x.text}
                              onChange={(e) => {
                                handleTipsData(e, "text", idx)
                              }}
                              multiline
                              helperText={
                                typeof x.text === "undefined" ||
                                (typeof x.text !== "undefined" && x.text?.trim() === "")
                                  ? t("Please enter Tips Description")
                                  : ""
                              }
                            />
                          </Box>
                        </Grid>
                        <Grid item lg={3} md={6} sm={6}>
                          <Box>
                            <Tooltip title={t("Delete")}>
                              <Fab
                                className={classes.btnText}
                                aria-label="Delete"
                                variant="extended"
                                onClick={() => {
                                  setOpenDialog(true)
                                  setClickDeleteId(idx)
                                }}
                              >
                                <Icon>delete</Icon> {t("Delete")}
                              </Fab>
                            </Tooltip>
                          </Box>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider />
                    </Grid>
                  </Grid>
                ) //)
              )
            : ""}
        </Container>
      </MuiThemeProvider>

      <Dialog
        open={openDialog}
        onClick={() => {
          setOpenDialog(false)
        }}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent dividers={false} classes={{ root: classes.activityContent }}>
          <Box mt={2} mb={3}>
            <Typography variant="body2">{t("Are you sure you want to delete this?")}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mb={3}>
            <Button onClick={() => deleteData(clickDeleteId)} color="primary" autoFocus>
              {t("Yes")}
            </Button>
            <Button
              onClick={() => {
                setOpenDialog(false)
              }}
              color="secondary"
              autoFocus
            >
              {t("No")}
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
