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
  Checkbox,
  ButtonBase,
  Container,
  MenuItem,
  CircularProgress,
  Backdrop,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core"
import LAMP from "lamp-core"
import { makeStyles, Theme, createStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"
import DeleteIcon from "@material-ui/icons/Delete"
import { useSnackbar } from "notistack"

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
  })
)

function urlValidator(url) {
  var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/
  if (!re.test(url)) {
    return false
  } else {
    return true
  }
}

export default function TipCreator({
  activities,
  onSave,
  onCancel,
  studies,
  allActivities,
  ...props
}: {
  activities?: any
  onSave?: any
  onCancel?: any
  studies?: any
  allActivities?: any
}) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [category, setCategory] = useState("")
  const [categoryImage, setCategoryImage] = useState("")
  const [text, setText] = useState(!!activities ? activities.name : undefined)
  const [loading, setLoading] = useState(false)
  const [categoryArray, setCategoryArray] = useState([])
  const [newTipText, setNewTipText] = useState("")
  const [duplicateTipText, setDuplicateTipText] = useState("")
  const [selectedCategory, setSelectedCategory]: any = useState({})
  const [deletedIds, setDeletedIds]: any = useState("")
  const [tipsDataArray, setTipsDataArray] = useState([{ title: "", link: "", text: "", image: "", author: "" }])
  const [newTipsData, setNewTipsData] = useState([{ title: "", link: "", text: "", image: "", author: "" }])
  const [studyId, setStudyId] = useState(!!activities ? activities.parentID : undefined)
  const [openDialog, setOpenDialog] = useState(false)
  const [clickDeleteId, setClickDeleteId] = useState("")
  const [isDuplicate, setIsDuplicate] = useState(false)

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
    setLoading(true)
    ;(async () => {
      if (category && category !== "add_new") {
        let existsData = categoryArray.find((o) => o.id === category)
        if (Object.keys(existsData).length > 0) {
          if (existsData.id) {
            let iconsData: any = await LAMP.Type.getAttachment(existsData.id, "lamp.dashboard.tip_details")
            if (iconsData.hasOwnProperty("data")) {
              setCategoryImage(iconsData.data.icon)
            }
          }
          setSelectedCategory(existsData)
          setTipsDataArray(existsData.settings)
        }
      } else {
        setSelectedCategory({})
        setTipsDataArray([{ title: "", link: "", text: "", image: "", author: "" }])
      }
      setLoading(false)
    })()
  }, [category])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (studyId) {
        let activityData = await LAMP.Activity.allByStudy(studyId)
        let tipsCategoryData = activityData.filter((activity) => activity.spec === "lamp.tips")
        setCategoryArray(tipsCategoryData)
      }
      if (!!activities) {
        let activitiesData = JSON.parse(JSON.stringify(activities))
        setCategory(activitiesData.id)
        if (Object.keys(activitiesData.settings).length > 0) {
          //setCategory(activitiesData.id)
          setSelectedCategory(activitiesData)
          setTipsDataArray(activitiesData.settings)
        }
        let iconsData: any = await LAMP.Type.getAttachment(activitiesData.id, "lamp.dashboard.tip_details")
        if (iconsData.hasOwnProperty("data")) {
          setCategoryImage(iconsData.data.icon)
        }
      }
      setLoading(false)
    })()
  }, [studyId])

  const handleTipsData = (e: any, type, id) => {
    let tipsData = tipsDataArray
    if (type === "title") tipsData[id].title = e.target.value
    if (type === "link") tipsData[id].link = e.target.value
    if (type === "text") tipsData[id].text = e.target.value
    if (type === "author") tipsData[id].author = e.target.value
    if (type === "image") {
      uploadImageFile(e, "all", id)
    }
    setTipsDataArray([...tipsData])
  }

  const handleNewTips = (e, type) => {
    let tipsData: any = newTipsData
    if (type === "title") tipsData[0].title = e.target.value
    if (type === "link") tipsData[0].link = e.target.value
    if (type === "text") tipsData[0].text = e.target.value
    if (type === "author") tipsData[0].author = e.target.value
    if (type === "image") {
      uploadImageFile(e, "new")
    }
    setNewTipsData([...tipsData])
  }

  const getBase64 = (file, cb, type = "") => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    if (type === "icon") {
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
    reader.onerror = function (error) {
      console.log("Error: ", error)
      enqueueSnackbar("An error occured while uploading. Please try again.", {
        variant: "error",
      })
    }
  }

  const uploadImageFile = (event, type = "new", id = "") => {
    const file = event.target.files[0]
    const fileName = event.target.files[0].name
    const fileSize = event.target.files[0].size / 1024 / 1024
    const extension = fileName.split(".").reverse()[0].toLowerCase()
    const fileFormats = ["jpeg", "jpg", "png", "bmp", "gif", "svg"]
    if (fileFormats.includes(extension) && fileSize <= 4) {
      setLoading(true)
      let tipsData: any
      if (type === "new") {
        tipsData = newTipsData
        file &&
          getBase64(file, (result: any) => {
            tipsData[0].image = result
            setNewTipsData([...tipsData])
            setLoading(false)
          })
      } else if (type === "icon") {
        file &&
          getBase64(
            file,
            (result: any) => {
              setCategoryImage(result)
              setLoading(false)
            },
            "icon"
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
      enqueueSnackbar("Images should be in the format jpeg/png/bmp/gif/svg and the size should not exceed 4 MB.", {
        variant: "error",
      })
    }
  }

  const handleSaveTips = (duplicate = false) => {
    let duplicates = []
    if (
      (typeof newTipText !== "undefined" && newTipText?.trim() !== "") ||
      (typeof duplicateTipText !== "undefined" && duplicateTipText?.trim() !== "")
    ) {
      duplicates = categoryArray.filter((x) =>
        !!activities
          ? x.name.toLowerCase() === duplicateTipText?.trim().toLowerCase()
          : x.name.toLowerCase() === newTipText?.trim().toLowerCase()
      )

      if (duplicates.length > 0) {
        enqueueSnackbar("Activity with same name already exist.", { variant: "error" })
        return false
      }
    }
    setLoading(true)
    category === "add_new" || duplicate
      ? onSave(
          {
            id: undefined,
            name: duplicate ? duplicateTipText : newTipText,
            spec: "lamp.tips",
            icon: categoryImage,
            schedule: [],
            settings: newTipsData,
            studyID: studyId,
          },
          false
        )
      : onSave(
          {
            id: activities?.id || category ? category : undefined,
            name: text,
            spec: "lamp.tips",
            icon: categoryImage,
            schedule: [],
            settings: activities?.id ? tipsDataArray : category ? tipsDataArray.concat(newTipsData) : newTipsData,
            studyID: studyId,
          },
          false
        )

    setLoading(true)
  }

  const deleteData = (id) => {
    if (activities) {
      if (Object.keys(selectedCategory).length > 0 && Object.keys(selectedCategory.settings).length <= 1)
        enqueueSnackbar("You are not allowed to delete all the details from the tip.", {
          variant: "error",
        })
      else {
        setLoading(true)
        setOpenDialog(false)
        setDeletedIds(id)
      }
    } else {
      setLoading(true)
      setOpenDialog(false)
      setDeletedIds(id)
    }
  }

  const validate = () => {
    let validationData = false
    if (Object.keys(selectedCategory).length > 0 && Object.keys(selectedCategory.settings).length > 0) {
      validationData = selectedCategory.settings.some(
        (item) => item.title === "" || item.text === "" || (item.link !== "" && !urlValidator(item.link))
      )
    }
    if (!!activities) {
      return !validationData
    } else {
      return !(
        typeof studyId == "undefined" ||
        studyId === null ||
        studyId === "" ||
        typeof category == "undefined" ||
        category === null ||
        category === "" ||
        (category == "add_new" && (newTipText === null || newTipText === "")) ||
        typeof newTipsData[0].title === "undefined" ||
        (typeof newTipsData[0].title !== "undefined" && newTipsData[0].title?.trim() === "") ||
        typeof newTipsData[0].text === "undefined" ||
        (typeof newTipsData[0].text !== "undefined" && newTipsData[0].text?.trim() === "") ||
        (newTipsData[0].link?.trim() !== "" && !urlValidator(newTipsData[0].link)) ||
        validationData
      )
    }
  }

  const removeImage = (type, id = 0) => {
    let tipsData
    if (type === "new") {
      tipsData = newTipsData
      tipsData[0].image = ""
      setNewTipsData([...tipsData])
    } else {
      tipsData = tipsDataArray
      tipsData[id].image = ""
      setTipsDataArray([...tipsData])
    }
  }

  const removeEventValue = (event) => {
    event.target.value = null
  }

  return (
    <Grid container direction="column" spacing={2} {...props}>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <MuiThemeProvider theme={theme}>
        <Container className={classes.containerWidth}>
          <Grid container spacing={2}>
            <Grid item xs sm={4} md={3} lg={2}>
              <Tooltip title={!categoryImage ? "Tap to select a photo." : "Tap to delete the photo."}>
                <Box
                  width={154}
                  height={154}
                  border={1}
                  borderRadius={4}
                  borderColor="text.secondary"
                  color="text.secondary"
                  style={{
                    background: !!categoryImage ? `url(${categoryImage}) center center/cover no-repeat` : undefined,
                    position: "relative",
                  }}
                >
                  {!categoryImage ? (
                    <label htmlFor="upload-image">
                      <TextField
                        variant="filled"
                        name="upload-image"
                        className={classes.uploadFile}
                        type="file"
                        onChange={(event) => uploadImageFile(event, "icon")}
                      />
                    </label>
                  ) : (
                    ""
                  )}
                  <ButtonBase
                    style={{ width: "100%", height: "100%" }}
                    onClick={(e) => {
                      setCategoryImage("")
                    }}
                  >
                    <Icon fontSize="large">
                      {categoryImage === "" || categoryImage === undefined ? "add_a_photo" : "delete_forever"}
                    </Icon>
                  </ButtonBase>
                </Box>
              </Tooltip>
            </Grid>
            <Grid item sm={8} md={9} lg={10}>
              <Grid container spacing={2}>
                <Grid item xs sm={6} md={6} lg={4}>
                  <TextField
                    error={typeof studyId == "undefined" || studyId === null || studyId === "" ? true : false}
                    id="filled-select-currency"
                    select
                    label="Study"
                    value={studyId || ""}
                    onChange={(e) => {
                      setStudyId(e.target.value)
                      setSelectedCategory({})
                      setCategory("")
                    }}
                    helperText={
                      typeof studyId == "undefined" || studyId === null || studyId === ""
                        ? "Please select the study"
                        : ""
                    }
                    variant="filled"
                    disabled={!!activities ? true : false}
                  >
                    {studies.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs sm={6} md={6} lg={4}>
                  <TextField
                    error={typeof category == "undefined" || category === null || category === "" ? true : false}
                    id="filled-select-currency"
                    select
                    label="Tip"
                    value={category || ""}
                    onChange={(event) => {
                      setCategory(event.target.value)
                    }}
                    helperText={
                      typeof category == "undefined" || category === null || category === ""
                        ? "Please select the tip"
                        : ""
                    }
                    variant="filled"
                    disabled={!!activities ? true : false}
                  >
                    <MenuItem value="add_new" key="add_new">
                      Add New
                    </MenuItem>
                    {categoryArray.map((x, idx) => (
                      <MenuItem value={`${x.id}`} key={`${x.id}`}>{`${x.name}`}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs sm={6} md={6} lg={4}>
                  {category === "add_new" ? (
                    <TextField
                      error={category == "add_new" && (newTipText === null || newTipText === "") ? true : false}
                      fullWidth
                      variant="filled"
                      label="New Tip"
                      defaultValue={newTipText}
                      onChange={(event) => setNewTipText(event.target.value)}
                      helperText={
                        category == "add_new" && (newTipText === null || newTipText === "") ? "Please add new tip" : ""
                      }
                    />
                  ) : (
                    ""
                  )}
                </Grid>
                {!!activities ? (
                  <Grid container spacing={2}>
                    <Grid item xs sm={6} md={6} lg={4}>
                      <Box mt={2}>
                        <Checkbox
                          onChange={(event) => setIsDuplicate(event.target.checked)}
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />{" "}
                        Duplicate
                      </Box>
                    </Grid>
                    <Grid item xs sm={6} md={6} lg={4}>
                      {isDuplicate ? (
                        <Box mb={3}>
                          <TextField
                            fullWidth
                            error={isDuplicate && (duplicateTipText === null || duplicateTipText === "") ? true : false}
                            variant="filled"
                            label="Tip"
                            className="Tips"
                            value={duplicateTipText}
                            onChange={(event) => setDuplicateTipText(event.target.value)}
                            helperText={
                              isDuplicate && (duplicateTipText === null || duplicateTipText === "")
                                ? "Please add new tip"
                                : ""
                            }
                          />
                        </Box>
                      ) : (
                        ""
                      )}
                    </Grid>
                  </Grid>
                ) : (
                  ""
                )}
              </Grid>
            </Grid>
          </Grid>

          {Object.keys(selectedCategory).length > 0 ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Divider />
                <Typography variant="h6">Tip Details</Typography>
              </Grid>
            </Grid>
          ) : (
            ""
          )}
          {Object.keys(selectedCategory).length > 0 && Object.keys(selectedCategory.settings).length > 0
            ? selectedCategory.settings.map((x, idx) => (
                <Grid container spacing={2} key={idx}>
                  <Grid item xs sm={4} md={3} lg={2}>
                    <Tooltip title={!x.image ? "Tap to select a photo." : "Tap to delete the photo."}>
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
                            removeImage("all", idx)
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
                      <Grid item lg={4} md={6} sm={6} xs={12}>
                        <Box>
                          <TextField
                            error={
                              typeof x.title === "undefined" ||
                              (typeof x.title !== "undefined" && x.title?.trim() === "")
                                ? true
                                : false
                            }
                            fullWidth
                            variant="filled"
                            label="Tips Title"
                            value={x.title}
                            className="tipsTitle"
                            onChange={(e) => {
                              handleTipsData(e, "title", idx)
                            }}
                            helperText={
                              typeof x.title === "undefined" ||
                              (typeof x.title !== "undefined" && x.title?.trim() === "")
                                ? "Please enter Tips Title"
                                : ""
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid item lg={4} md={6} sm={6} xs={12}>
                        <Box>
                          <TextField
                            error={x.link !== "" && !urlValidator(x.link) ? true : false}
                            fullWidth
                            variant="filled"
                            label="Tips Link"
                            value={x.link}
                            className="tipsLink"
                            onChange={(e) => {
                              handleTipsData(e, "link", idx)
                            }}
                            helperText={x.link !== "" && !urlValidator(x.link) ? "Please enter valid link" : ""}
                          />
                        </Box>
                      </Grid>
                      <Grid item lg={4} md={6} sm={6} xs={12}>
                        <Box>
                          <TextField
                            fullWidth
                            variant="filled"
                            label="Tips Author"
                            value={x.author}
                            className="tipsAutor"
                            onChange={(e) => {
                              handleTipsData(e, "author", idx)
                            }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <Box>
                          <TextField
                            error={
                              typeof x.text === "undefined" || (typeof x.text !== "undefined" && x.text?.trim() === "")
                                ? true
                                : false
                            }
                            fullWidth
                            variant="filled"
                            label="Tips Description"
                            rows={2}
                            value={x.text}
                            onChange={(e) => {
                              handleTipsData(e, "text", idx)
                            }}
                            multiline
                            helperText={
                              typeof x.text === "undefined" || (typeof x.text !== "undefined" && x.text?.trim() === "")
                                ? "Please enter Tips Description"
                                : ""
                            }
                          />
                        </Box>
                      </Grid>
                      <Grid item lg={3} md={6} sm={6}>
                        <Box>
                          <Tooltip title="Delete">
                            <Fab
                              className={classes.btnText}
                              aria-label="Delete"
                              variant="extended"
                              onClick={() => {
                                setOpenDialog(true)
                                setClickDeleteId(idx)
                              }}
                            >
                              <DeleteIcon /> Delete
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
              ))
            : ""}

          {!activities ? (
            <Grid container spacing={2}>
              {Object.keys(selectedCategory).length === 0 ? (
                <Grid item xs={12}>
                  <Divider />
                  <Typography variant="h6">Tip Details</Typography>
                </Grid>
              ) : (
                ""
              )}
              <Grid item xs sm={4} md={3} lg={2}>
                <Tooltip title={!newTipsData[0].image ? "Tap to select a photo." : "Tap to delete the photo."}>
                  <Box
                    width={154}
                    height={154}
                    border={1}
                    borderRadius={4}
                    borderColor="text.secondary"
                    color="text.secondary"
                    style={{
                      background: !!newTipsData[0].image
                        ? `url(${newTipsData[0].image}) center center/cover no-repeat`
                        : undefined,
                      position: "relative",
                    }}
                  >
                    {!newTipsData[0].image ? (
                      <label htmlFor="upload-image">
                        <TextField
                          name="upload-image"
                          className={classes.uploadFile}
                          variant="filled"
                          type="file"
                          onClick={(event) => removeEventValue(event)}
                          onChange={(event) => handleNewTips(event, "image")}
                        />
                      </label>
                    ) : (
                      ""
                    )}
                    <ButtonBase
                      style={{ width: "100%", height: "100%" }}
                      onClick={(e) => {
                        removeImage("new")
                      }}
                    >
                      <Icon fontSize="large">
                        {newTipsData[0].image === "" || newTipsData[0].image === undefined
                          ? "add_a_photo"
                          : "delete_forever"}
                      </Icon>
                    </ButtonBase>
                  </Box>
                </Tooltip>
              </Grid>
              <Grid item sm={8} md={9} lg={10}>
                <Grid container spacing={2}>
                  <Grid item xs sm={6} md={6} lg={4}>
                    <Box>
                      <TextField
                        error={
                          typeof newTipsData[0].title === "undefined" ||
                          (typeof newTipsData[0].title !== "undefined" && newTipsData[0].title?.trim() === "")
                            ? true
                            : false
                        }
                        variant="filled"
                        label="Tips Title"
                        onChange={(e) => {
                          handleNewTips(e, "title")
                        }}
                        helperText={
                          typeof newTipsData[0].title === "undefined" ||
                          (typeof newTipsData[0].title !== "undefined" && newTipsData[0].title?.trim() === "")
                            ? "Please enter Tips Title"
                            : ""
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <Box>
                      <TextField
                        error={newTipsData[0].link !== "" && !urlValidator(newTipsData[0].link) ? true : false}
                        variant="filled"
                        label="Tips Link"
                        onChange={(e) => {
                          handleNewTips(e, "link")
                        }}
                        helperText={
                          newTipsData[0].link !== "" && !urlValidator(newTipsData[0].link)
                            ? "Please enter valid link"
                            : ""
                        }
                      />
                    </Box>
                  </Grid>
                  <Grid item lg={4} md={6} sm={6} xs={12}>
                    <Box>
                      <TextField
                        variant="filled"
                        label="Tips Author"
                        onChange={(e) => {
                          handleNewTips(e, "author")
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Box>
                      <TextField
                        error={
                          typeof newTipsData[0].text === "undefined" ||
                          (typeof newTipsData[0].text !== "undefined" && newTipsData[0].text?.trim() === "")
                            ? true
                            : false
                        }
                        variant="filled"
                        multiline
                        rows={2}
                        label="Tips Description"
                        onChange={(e) => {
                          handleNewTips(e, "text")
                        }}
                        helperText={
                          typeof newTipsData[0].text === "undefined" ||
                          (typeof newTipsData[0].text !== "undefined" && newTipsData[0].text?.trim() === "")
                            ? "Please enter Tips Description"
                            : ""
                        }
                      />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          ) : (
            ""
          )}
        </Container>
      </MuiThemeProvider>
      <Grid
        container
        direction="column"
        alignItems="flex-end"
        spacing={1}
        style={{ position: "fixed", bottom: 24, right: 24, width: "auto" }}
      >
        {!!activities ? (
          <Grid item>
            <Tooltip title="Duplicate this activity.">
              <span>
                <Fab
                  color="secondary"
                  aria-label="Duplicate"
                  variant="extended"
                  onClick={() => {
                    if (validate()) handleSaveTips(true)
                  }}
                  disabled={
                    !validate() || (activities && !isDuplicate) || duplicateTipText === null || duplicateTipText === ""
                  }
                >
                  Duplicate
                  <span style={{ width: 8 }} />
                  <Icon>save</Icon>
                </Fab>
              </span>
            </Tooltip>
          </Grid>
        ) : (
          ""
        )}
        <Grid item>
          <Tooltip title="Save this activity.">
            <span>
              <Fab
                color="secondary"
                aria-label="Save"
                variant="extended"
                onClick={() => {
                  if (validate()) handleSaveTips()
                }}
                disabled={!validate()}
              >
                Save
                <span style={{ width: 8 }} />
                <Icon>save</Icon>
              </Fab>
            </span>
          </Tooltip>
        </Grid>
      </Grid>

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
            <Typography variant="body2">Are you sure you want to delete this ?</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mb={3}>
            <Button onClick={() => deleteData(clickDeleteId)} color="primary" autoFocus>
              Yes
            </Button>
            <Button
              onClick={() => {
                setOpenDialog(false)
              }}
              color="secondary"
              autoFocus
            >
              No
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </Grid>
  )
}
