// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  Tooltip,
  Grid,
  Icon,
  TextField,
  Checkbox,
  ButtonBase,
  Container,
  MenuItem,
  CircularProgress,
  Backdrop,
  FormControlLabel,
} from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import LAMP from "lamp-core"
import ActivityStreak from "./ActivityStreak"
import { makeStyles, Theme, createStyles, MuiThemeProvider } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import TipFooter from "./TipFooter"
import { Service } from "../../DBService/DBService"
import DynamicForm from "../../shared/DynamicForm"
import { SchemaList } from "./ActivityMethods"
import ActivityTab from "./ActivityTab"
import { createTheme } from "@material-ui/core/styles"

const theme = createTheme({
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
    containerWidth: { maxWidth: 1055, marginBottom: "80px" },
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

export default function Tips({
  value,
  onSave,
  onCancel,
  studies,
  allActivities,
  study,
  details,
  ...props
}: {
  value?: any
  onSave?: Function
  onCancel?: Function
  studies?: any
  allActivities?: any
  study?: string
  details: any
}) {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const [category, setCategory] = useState("")
  const [categoryImage, setCategoryImage] = useState("")
  const [text, setText] = useState(!!value ? value.name : undefined)
  const [loading, setLoading] = useState(false)
  const [categoryArray, setCategoryArray] = useState([])
  const [newTipText, setNewTipText] = useState("")
  const [duplicateTipText, setDuplicateTipText] = useState("")
  const [tipsDataArray, setTipsDataArray] = useState([{ title: "", text: "", image: "" }])
  const [studyId, setStudyId] = useState(!!value ? value.study_id : study)
  const [isDuplicate, setIsDuplicate] = useState(false)
  const [isError, setIsError] = useState(false)
  const [newSchemaList, setNewSchemaList] = useState({})
  const [isImagError, setIsImagError] = useState(false)
  const [showFeed, setShowFeed] = useState(
    typeof details?.showFeed !== "undefined" && details?.showFeed !== null ? details?.showFeed : true
  )

  const toBinary = (string) => {
    const codeUnits = new Uint16Array(string.length)
    for (let i = 0; i < codeUnits.length; i++) {
      codeUnits[i] = string.charCodeAt(i)
    }
  }
  const defaultBase64 = toBinary("data:image/png;base64,")
  const defaultSettingsArray: any = [
    {
      title: "",
      text: "",
      image: defaultBase64,
    },
  ]
  const { t } = useTranslation()

  const [data, setData] = useState({
    id: value?.id ?? undefined,
    name: value?.name ?? "",
    spec: value?.spec ?? "lamp.tips",
    schedule: value?.schedule ?? [],
    description: "",
    streak: details?.streak ?? null,
    settings: value?.settings ?? [],
    studyID: !!value ? value.study_id : study,
    category: value?.category ?? [],
  })

  const handleTabChange = (tab) => {
    setData({ ...data, category: tab })
    validate()
  }

  const handleStreakChange = (val) => {
    setData({ ...data, streak: val })
    validate()
  }

  useEffect(() => {
    validate()
  }, [categoryImage])

  useEffect(() => {
    if (category === "add_new") validate()
  }, [newTipText])

  useEffect(() => {
    if (isDuplicate) validate()
  }, [duplicateTipText])

  useEffect(() => {
    setLoading(true)
    setNewTipText("")
    ;(async () => {
      if (category && category !== "add_new") {
        if (categoryArray.length > 0) {
          let existsData = categoryArray.find((o) => o.id === category)
          if (Object.keys(existsData).length > 0) {
            if (existsData.id) {
              let iconsData: any = await LAMP.Type.getAttachment(existsData.id, "lamp.dashboard.activity_details")
              if (iconsData.hasOwnProperty("data")) {
                setCategoryImage(iconsData.data.icon)
              }
            }
            if (!value) {
              let settingsData = await LAMP.Activity.view(existsData.id)
              if (settingsData) {
                settingsData.settings = settingsData.settings.reduce((ds, d) => {
                  let newD = d
                  if (d.image === "") {
                    newD = Object.assign({}, d, { image: defaultBase64 })
                  }
                  return ds.concat(newD)
                }, [])
                existsData.settings = settingsData.settings.concat(defaultSettingsArray)
              } else {
                existsData.settings = defaultSettingsArray
              }
            }
            setTipsDataArray(existsData.settings)
            setData({ ...data, settings: existsData.settings })
          }
        }
      } else {
        if (!value) {
          setTipsDataArray(defaultSettingsArray)
          setData({ ...data, settings: defaultSettingsArray })
        }
      }
      setNewSchemaList(SchemaList())
      setLoading(false)
    })()
  }, [category])

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      if (studyId) {
        Service.getDataByKey("activities", [studyId], "study_id").then((activitiesObject) => {
          let tipActivities = activitiesObject.filter((x) => x.spec === "lamp.tips")
          setCategoryArray(tipActivities)
        })
      }
      if (!!value) {
        let activitiesData = JSON.parse(JSON.stringify(value))
        setCategory(activitiesData.id)
        if (Object.keys(activitiesData.settings).length > 0) {
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
      enqueueSnackbar(`${t("An error occured while uploading. Please try again.")}`, {
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
      enqueueSnackbar(
        `${t("Images should be in the format jpeg/png/bmp/gif/svg and the size should not exceed 4 MB.")}`,
        {
          variant: "error",
        }
      )
    }
  }

  const handleSaveTips = (duplicate = false) => {
    let duplicates = []
    if (
      (typeof newTipText !== "undefined" && newTipText?.trim() !== "") ||
      (typeof duplicateTipText !== "undefined" && duplicateTipText?.trim() !== "")
    ) {
      duplicates = categoryArray.filter((x) =>
        !!value
          ? x.name?.toLowerCase() === duplicateTipText?.trim().toLowerCase()
          : x.name?.toLowerCase() === newTipText?.trim().toLowerCase()
      )
      if (duplicates.length > 0) {
        enqueueSnackbar(`${t("Activity with same name already exist.")}`, { variant: "error" })
        return false
      }
    }
    let settingsObj = data.settings.reduce((ds, d) => {
      let newD = d
      if (d.image === defaultBase64) {
        newD = Object.assign({}, d, { image: "" })
      }
      return ds.concat(newD)
    }, [])
    setLoading(true)
    category === "add_new" || duplicate
      ? onSave(
          {
            id: undefined,
            name: duplicate ? duplicateTipText : newTipText,
            spec: "lamp.tips",
            icon: categoryImage,
            streak: data.streak,
            schedule: value?.schedule ?? [],
            settings: settingsObj,
            studyID: studyId,
            category: data.category,
            showFeed: showFeed,
          },
          false
        )
      : onSave(
          {
            id: value?.id || category ? category : undefined,
            name: text,
            spec: "lamp.tips",
            icon: categoryImage,
            streak: data.streak,
            schedule: value?.schedule ?? [],
            settings: settingsObj,
            studyID: studyId,
            category: data.category,
            showFeed: showFeed,
          },
          false
        )
    setLoading(false)
  }

  const handleSaveTipsData = () => {
    let duplicate = isDuplicate
    let settingsObj = data.settings.reduce((ds, d) => {
      let newD = d
      if (d.image === defaultBase64) {
        newD = Object.assign({}, d, { image: "" })
      }
      return ds.concat(newD)
    }, [])
    let dataObj =
      category === "add_new" || duplicate
        ? {
            id: undefined,
            name: duplicate ? duplicateTipText : newTipText,
            spec: "lamp.tips",
            icon: categoryImage,
            streak: data.streak,
            showFeed: showFeed,
            schedule: value?.schedule ?? [],
            settings: settingsObj,
            studyID: studyId,
            category: data.category,
          }
        : {
            id: value?.id || category ? category : undefined,
            spec: "lamp.tips",
            icon: categoryImage,
            streak: data.streak,
            schedule: value?.schedule ?? [],
            settings: settingsObj,
            studyID: studyId,
            showFeed: showFeed,
            category: data.category,
          }
    onSave(dataObj, duplicate)
  }

  useEffect(() => {
    validate()
  }, [data])

  const validate = () => {
    let validationData = false
    if (Object.keys(data.settings).length > 0) {
      validationData = data.settings.some((item) => {
        let sizeInBytes = 0
        let type = ""
        let imageTypes = ["jpeg", "jpg", "png", "gif", "svg+xml"]
        let base64Img = item.image
        if (base64Img !== "" && base64Img !== undefined) {
          let img = new Image()
          img.src = base64Img
          type = base64Img?.split(";")[0]?.split("/")[1]
          let stringLength = base64Img?.length - ("data:image/" + type + ";base64,").length
          sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812
          if ((type !== "" && !imageTypes.includes(type)) || sizeInBytes > 4194304) {
            setIsImagError(true)
          } else {
            setIsImagError(false)
          }
        }
        return (
          item.title === "" ||
          typeof item.title === "undefined" ||
          item.text === "" ||
          typeof item.text === "undefined" ||
          (type !== "" && !imageTypes.includes(type)) ||
          sizeInBytes > 4194304
        )
      })
    }

    let duplicates = []
    if (
      (typeof newTipText !== "undefined" && newTipText?.trim() !== "") ||
      (typeof duplicateTipText !== "undefined" && duplicateTipText?.trim() !== "")
    ) {
      duplicates = categoryArray.filter((x) => {
        return !!value
          ? x.name?.toLowerCase() === duplicateTipText?.trim().toLowerCase()
          : x.name?.toLowerCase() === newTipText?.trim().toLowerCase()
      })
    }
    !(
      typeof studyId == "undefined" ||
      studyId === null ||
      studyId === "" ||
      typeof category == "undefined" ||
      category === null ||
      category === "" ||
      (category == "add_new" && (newTipText === null || newTipText === "")) ||
      validationData ||
      (data.settings && data.settings.length === 0) ||
      duplicates.length > 0
    )
      ? setIsError(true)
      : setIsError(false)

    return !(
      typeof studyId == "undefined" ||
      studyId === null ||
      studyId === "" ||
      typeof category == "undefined" ||
      category === null ||
      category === "" ||
      (category == "add_new" && (newTipText === null || newTipText === "")) ||
      (data.settings && data.settings.length === 0) ||
      validationData ||
      duplicates.length > 0
    )
  }

  const handleType = (val) => {
    val === 1 ? handleSaveTips(isDuplicate) : handleSaveTipsData()
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
              <Tooltip title={!categoryImage ? `${t("Tap to select a photo.")}` : `${t("Tap to delete the photo.")}`}>
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
            </Grid>
            <Grid item sm={8} md={9} lg={10}>
              <Grid container spacing={2}>
                <Grid item xs sm={6} md={6} lg={6}>
                  <TextField
                    error={typeof studyId == "undefined" || studyId === null || studyId === "" ? true : false}
                    id="filled-select-currency"
                    select
                    label={`${t("Group")}`}
                    value={studyId || ""}
                    onChange={(e) => {
                      setStudyId(e.target.value)
                      setCategory("")
                      validate()
                    }}
                    helperText={
                      typeof studyId == "undefined" || studyId === null || studyId === ""
                        ? `${t("Please select the Group")}`
                        : ""
                    }
                    variant="filled"
                    disabled={!!value || !!study ? true : false}
                  >
                    {studies.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {t(option.name)}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item lg={6} sm={4} xs={12}>
                  <TextField
                    error={typeof category == "undefined" || category === null || category === "" ? true : false}
                    id="filled-select-currency"
                    select
                    label={`${t("Tip")}`}
                    value={category || ""}
                    onChange={(event) => {
                      setCategory(event.target.value)
                      validate()
                    }}
                    helperText={
                      typeof category == "undefined" || category === null || category === ""
                        ? `${t("Please select the tip")}`
                        : ""
                    }
                    variant="filled"
                    disabled={!!value ? true : false}
                  >
                    <MenuItem value="add_new" key="add_new">
                      {`${t("Add New")}`}
                    </MenuItem>
                    {categoryArray.map((x, idx) => (
                      <MenuItem value={`${x.id}`} key={`${x.id}`}>{`${x.name}`}</MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs sm={12}>
                  {category === "add_new" ? (
                    <TextField
                      error={category == "add_new" && (newTipText === null || newTipText === "") ? true : false}
                      fullWidth
                      variant="filled"
                      label={`${t("New Tip")}`}
                      defaultValue={newTipText}
                      onChange={(event) => {
                        setNewTipText(event.target.value)
                      }}
                      helperText={
                        category == "add_new" && (newTipText === null || newTipText === "")
                          ? `${t("Please add new tip.")}`
                          : ""
                      }
                    />
                  ) : (
                    ""
                  )}
                </Grid>
                {!!value ? (
                  <Grid container>
                    <Grid item xs sm={6} md={4} lg={3}>
                      <Box mt={2}>
                        <Checkbox
                          onChange={(event) => {
                            setIsDuplicate(event.target.checked)
                            setDuplicateTipText("")
                          }}
                          color="primary"
                          inputProps={{ "aria-label": "secondary checkbox" }}
                        />{" "}
                        {`${t("Duplicate")}`}
                      </Box>
                    </Grid>
                    <Grid item xs sm={6} md={8} lg={9}>
                      {isDuplicate ? (
                        <Box mb={3} pr={1}>
                          <TextField
                            fullWidth
                            error={isDuplicate && (duplicateTipText === null || duplicateTipText === "") ? true : false}
                            variant="filled"
                            label={`${t("Tip")}`}
                            className="Tips"
                            value={duplicateTipText}
                            onChange={(event) => {
                              setDuplicateTipText(event.target.value)
                              validate()
                            }}
                            helperText={
                              isDuplicate && (duplicateTipText === null || duplicateTipText === "")
                                ? `${t("Please add new tip.")}`
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
              <ActivityTab onChange={handleTabChange} activitySpecId="lamp.tips" value={value} />
            </Grid>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showFeed}
                  onChange={() => {
                    setShowFeed(!showFeed)
                  }}
                  name="showFeed"
                  color="primary"
                />
              }
              label={`${t("Show activity in the participant feed?")}`}
            />
          </Grid>

          <ActivityStreak onChange={handleStreakChange} value={details?.streak} />

          {data.settings && data.settings.length === 0 && (
            <Grid container spacing={2}>
              <Grid item xs sm={12}>
                <Alert severity="error">{`${t("Atleast one tip details required")}`}</Alert>
              </Grid>
            </Grid>
          )}
          {isImagError && (
            <Grid container spacing={2}>
              <Grid item xs sm={12}>
                <Alert severity="error">
                  {`${t("Images should be in the format .jpeg/.png/.gif/.svg and the size should not exceed 4 MB.")} `}
                </Alert>
              </Grid>
            </Grid>
          )}
          {((value?.spec && Object.keys(newSchemaList).includes(value.spec)) ||
            Object.keys(newSchemaList).includes("lamp.tips")) && (
            <DynamicForm
              schema={newSchemaList["lamp.tips"]}
              initialData={data}
              onChange={(x) => {
                setData(x)
                validate()
              }}
            />
          )}
        </Container>
      </MuiThemeProvider>
      <TipFooter
        value={value}
        isError={isError}
        isDuplicate={isDuplicate}
        duplicateTipText={duplicateTipText}
        validate={validate}
        handleType={handleType}
      />
    </Grid>
  )
}
