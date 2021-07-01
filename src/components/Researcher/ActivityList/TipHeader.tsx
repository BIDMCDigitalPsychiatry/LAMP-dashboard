import React, { useCallback, useState, useEffect } from "react"
import {
  Grid,
  ButtonBase,
  Icon,
  TextField,
  Tooltip,
  Box,
  MenuItem,
  Checkbox,
  makeStyles,
  Theme,
  createStyles,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { useDropzone } from "react-dropzone"
import { Service } from "../../DBService/DBService"
import LAMP from "lamp-core"

function compress(file, width, height) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    const fileName = file.name
    const extension = fileName.split(".").reverse()[0]?.toLowerCase()
    reader.onerror = (error) => reject(error)
    if (extension !== "svg") {
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result as string
        img.onload = () => {
          const elem = document.createElement("canvas")
          elem.width = width
          elem.height = height
          const ctx = elem.getContext("2d")
          ctx.drawImage(img, 0, 0, width, height)
          resolve(ctx.canvas.toDataURL())
        }
      }
    } else {
      reader.onload = (event) => {
        resolve(reader.result)
      }
    }
  })
}

const removeExtraSpace = (s) => s?.trim().split(/ +/).join(" ")

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

export default function TipsHeader({
  studies,
  value,
  details,
  activitySpecId,
  study,
  onChange,
  image,
  tipsArrayValue,
  ...props
}) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [text, setText] = useState(!!value ? value.name : "")
  const [description, setDescription] = useState(details?.description ?? null)
  const [photo, setPhoto] = useState(details?.photo ? details?.photo : !!image ? image : null)
  const { enqueueSnackbar } = useSnackbar()
  const [studyId, setStudyId] = useState(!!value ? value.study_id : study)
  const [categoryArray, setCategoryArray] = useState([])
  const [newTipText, setNewTipText] = useState("")
  const [category, setCategory] = useState("")
  const [categoryImage, setCategoryImage] = useState("")
  const [loading, setLoading] = useState(false)
  const [tipsDataArray, setTipsDataArray] = useState([{ title: "", text: "", image: "" }])
  const [duplicateTipText, setDuplicateTipText] = useState("")
  const [isDuplicate, setIsDuplicate] = useState(false)
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
    setStudyId(studyId)
    if (activitySpecId === "lamp.tips") {
      getAllTips(studyId)
    }
  }, [studyId])

  useEffect(() => {
    setLoading(true)
    ;(async () => {
      if (category && category !== "add_new") {
        let existsData = categoryArray.find((o) => o.id === category)
        if (Object.keys(existsData).length > 0) {
          if (existsData.id) {
            let iconsData: any = await LAMP.Type.getAttachment(existsData.id, "lamp.dashboard.activity_details")
            if (iconsData.hasOwnProperty("data")) {
              setCategoryImage(iconsData.data.icon)
            }
          }
          if (!value) {
            let mergedSettings = existsData.settings.concat(defaultSettingsArray)
            existsData.settings = mergedSettings
          }
          setSelectedCategory(existsData)
          tipsArrayValue(existsData)
          setTipsDataArray(existsData.settings)
        }
      } else {
        setTipsDataArray(defaultSettingsArray)
        tipsArrayValue(defaultSettingsArray)
        setSelectedCategory(defaultSelectedCategory)
      }
      setLoading(false)
    })()
  }, [category])

  const getAllTips = (studyId = "") => {
    if (studyId) {
      Service.getDataByKey("activities", [studyId], "study_id").then((activitiesObject) => {
        let tipActivities = activitiesObject.filter((x) => x.spec === activitySpecId)
        setCategoryArray(tipActivities)
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

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      //if (studyId) {
      if (study) {
        setSelectedCategory(defaultSelectedCategory)
        //let activityData = await LAMP.Activity.allByStudy(studyId)
        let activityData = await LAMP.Activity.allByStudy(study)
        let tipsCategoryData = activityData.filter((activity) => activity.spec === "lamp.tips")
        setCategoryArray(tipsCategoryData)
      }
      /*
      if (!!activities) {
        let activitiesData = JSON.parse(JSON.stringify(activities))
        setCategory(activitiesData.id)
        if (Object.keys(activitiesData.settings).length > 0) {
          setSelectedCategory(activitiesData)
          setTipsDataArray(activitiesData.settings)
        }
        let iconsData: any = await LAMP.Type.getAttachment(activitiesData.id, "lamp.dashboard.activity_details")
        if (iconsData.hasOwnProperty("data")) {
          setCategoryImage(iconsData.data.photo)
        }
      }
      */
      if (!!value) {
        let activitiesData = JSON.parse(JSON.stringify(value))
        setCategory(activitiesData.id)
        if (Object.keys(activitiesData.settings).length > 0) {
          setSelectedCategory(activitiesData)
          setTipsDataArray(activitiesData.settings)
        }
        let iconsData: any = await LAMP.Type.getAttachment(activitiesData.id, "lamp.dashboard.activity_details")
        if (iconsData.hasOwnProperty("data")) {
          setCategoryImage(iconsData.data.photo)
        }
      }
      setLoading(false)
    })()
  }, [studyId])

  const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDropAccepted: useCallback((acceptedFiles) => {
      compress(acceptedFiles[0], 64, 64).then(setPhoto)
    }, []),
    onDropRejected: useCallback((rejectedFiles) => {
      if (rejectedFiles[0].size / 1024 / 1024 > 5) {
        enqueueSnackbar(t("Image size should not exceed 5 MB."), { variant: "error" })
      } else if ("image" !== rejectedFiles[0].type.split("/")[0]) {
        enqueueSnackbar(t("Not supported image type."), { variant: "error" })
      }
    }, []),
    accept: "image/*",
    maxSize: 2 * 1024 * 1024 /* 5MB */,
  })
  return (
    <Grid container spacing={2}>
      <Grid item xs md={2}>
        <Tooltip title={!categoryImage ? t("Tap to select a photo.") : t("Tap to delete the photo.")}>
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
                  onChange={(event) => uploadImageFile(event, "photo")}
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

        {/*
        <Tooltip
          title={
            !photo
              ? t("Drag a photo or tap to select a photo.")
              : t("Drag a photo to replace the existing photo or tap to delete the photo.")
          }
        >
          <Box
            {...getRootProps()}
            width={154}
            height={154}
            border={1}
            borderRadius={4}
            borderColor={!(isDragActive || isDragAccept || !!photo) ? "text.secondary" : "#fff"}
            bgcolor={isDragActive || isDragAccept ? "text.secondary" : undefined}
            color={!(isDragActive || isDragAccept || !!photo) ? "text.secondary" : "#fff"}
            style={{
              background: !!photo ? `url(${photo}) center center/contain no-repeat` : undefined,
            }}
          >
            <ButtonBase style={{ width: "100%", height: "100%" }} onClick={() => !!photo && setPhoto(undefined)}>
              {!photo && <input {...getInputProps()} />}
              <Icon fontSize="large">{!photo ? "add_a_photo" : "delete_forever"}</Icon>
            </ButtonBase>
          </Box>
        </Tooltip>
        */}
      </Grid>
      <Grid item md={10}>
        <Grid container spacing={2}>
          <Grid item lg={4}>
            <TextField
              error={typeof studyId == "undefined" || studyId === null || studyId === "" ? true : false}
              id="filled-select-currency"
              select
              label={t("Study")}
              value={studyId}
              onChange={(e) => {
                setStudyId(e.target.value)
              }}
              helperText={
                typeof studyId == "undefined" || studyId === null || studyId === "" ? t("Please select the Study") : ""
              }
              variant="filled"
              disabled={!!value ? true : false}
            >
              {studies.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {t(option.name)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs>
            <Box mb={3}>
              <TextField
                error={typeof category == "undefined" || category === null || category === "" ? true : false}
                id="filled-select-currency"
                select
                label={t("Tip")}
                value={category || ""}
                onChange={(event) => {
                  setCategory(event.target.value)
                }}
                helperText={
                  typeof category == "undefined" || category === null || category === ""
                    ? t("Please select the tip")
                    : ""
                }
                variant="filled"
                //disabled={!!activities ? true : false}
              >
                <MenuItem value="add_new" key="add_new">
                  {t("Add New")}
                </MenuItem>
                {categoryArray.map((x, idx) => (
                  <MenuItem value={`${x.id}`} key={`${x.id}`}>{`${x.name}`}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Grid>
        </Grid>
        <Grid item xs sm={6} md={6} lg={4}>
          {category === "add_new" ? (
            <TextField
              error={category == "add_new" && (newTipText === null || newTipText === "") ? true : false}
              fullWidth
              variant="filled"
              label={t("New Tip")}
              defaultValue={newTipText}
              onChange={(event) => setNewTipText(event.target.value)}
              helperText={
                category == "add_new" && (newTipText === null || newTipText === "") ? t("Please add new tip") : ""
              }
            />
          ) : (
            ""
          )}
        </Grid>
        {!!value ? (
          <Grid container spacing={2}>
            <Grid item xs sm={6} md={6} lg={4}>
              <Box mt={2}>
                <Checkbox
                  onChange={(event) => setIsDuplicate(event.target.checked)}
                  color="primary"
                  inputProps={{ "aria-label": "secondary checkbox" }}
                />{" "}
                {t("Duplicate")}
              </Box>
            </Grid>
            <Grid item xs sm={6} md={6} lg={4}>
              {isDuplicate ? (
                <Box mb={3}>
                  <TextField
                    fullWidth
                    error={isDuplicate && (duplicateTipText === null || duplicateTipText === "") ? true : false}
                    variant="filled"
                    label={t("Tip")}
                    className="Tips"
                    value={duplicateTipText}
                    onChange={(event) => setDuplicateTipText(event.target.value)}
                    helperText={
                      isDuplicate && (duplicateTipText === null || duplicateTipText === "")
                        ? t("Please add new tip")
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
  )
}
