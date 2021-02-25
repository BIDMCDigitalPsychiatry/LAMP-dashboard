// Core Imports
import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Grid,
  Button,
  MenuItem,
  Icon,
  TextField,
  ButtonBase,
  InputBase,
  Container,
} from "@material-ui/core"
import { makeStyles, createStyles, withStyles } from "@material-ui/core/styles"
import { useSnackbar } from "notistack"
import { TargetDialog, EmotionDialog } from "./Dialog"
import Close from "@material-ui/icons/Close"
import AddCircleOutline from "@material-ui/icons/AddCircleOutline"
import { useTranslation } from "react-i18next"

const CssTextField = withStyles({
  root: {
    "label + &": {},
  },
  input: {
    fontSize: 20,
    fontFamily: "Inter",
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.75)",
  },
})(InputBase)

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "center",
    },

    buttonContainer: {
      width: 200,
      height: 50,
      marginTop: 91,
      background: "#7599FF",
      boxShadow: "0px 10px 15px rgba(96, 131, 231, 0.2)",
      borderRadius: 25,
    },
    buttonText: {
      fontWeight: "bold",
      fontSize: 16,
      color: "white",
    },
    backContainer: {
      width: 200,
      height: 50,
      borderRadius: 25,
      backgroundColor: "transparent",
      marginTop: 10,
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
    },
    backText: {
      fontWeight: "bold",
      fontSize: 16,
      color: "#4C66D6",
    },
    buttonsContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      marginTop: 55,
      marginBottom: 55,
      alignItems: "center",
      justifyContent: "center",
    },
    headerButton: {
      position: "absolute",
      width: 168,
      height: 50,
      right: 60,
      top: 25,
      background: "#7599FF",
      boxShadow: "0px 10px 15px rgba(96, 131, 231, 0.2)",
      borderRadius: 25,
      zIndex: 1111,
      "&:hover": { background: "#5680f9" },
    },
    sectionTitle: {
      color: "rgba(0, 0, 0, 0.75)",
      fontSize: 25,
      fontWeight: "bold",
      marginTop: 50,
    },
    inputContainer: {
      backgroundColor: "#F5F5F5",
      borderRadius: 10,
      marginTop: 37,
      height: 141,
      marginBottom: 70,
    },
    inputDescription: {
      fontSize: 12,
      color: "rgba(0, 0, 0, 0.5)",
      fontWeight: "bold",
      width: "100%",
      textAlign: "right",
    },
    contentContainer: {
      margin: 20,
      marginBottom: 10,
      display: "flex",
      flexDirection: "column",
      paddingTop: 20,
    },
    groupTitle: {
      fontSize: 12,
      color: "rgba(0, 0, 0, 0.4)",
      textTransform: "uppercase",
    },
    rowContainer: {
      display: "flex",
      width: "100%",
      alignItems: "center",
      height: 36,
      fontWeight: 600,
    },
    contentText: {
      color: "rgba(0, 0, 0, 0.75)",
      fontWeight: "bold",
      fontSize: 14,
      marginLeft: 10,
    },
    deleteButton: {
      width: 16,
      height: 16,
      color: "rgba(0, 0, 0, 0.45)",
      marginRight: 10,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    addContainer: {
      display: "flex",
      alignItems: "center",
    },
    addButtonTitle: {
      color: "#5784EE",
      fontWeight: 600,
      fontSize: 14,
    },
    addButton: {
      marginRight: 19,
      color: "#5784EE",
      width: 22,
      height: 22,
      marginLeft: 6,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    containerWidth: { maxWidth: 1055 },
    inputWidth: { width: "100%" },
  })
)

function compress(file, width, height) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    const fileName = file.name
    const extension = fileName.split(".").reverse()[0].toLowerCase()
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

export default function GameCreator({
  activities,
  value,
  onSave,
  onCancel,
  activitySpecId,
  details,
  studies,
  study,
  ...props
}: {
  activities?: any
  value?: any
  onSave?: any
  onCancel?: any
  activitySpecId?: string
  details?: any
  studies?: any
  study?: any
}) {
  const classes = useStyles()
  const [activity, setActivity] = useState(value ?? null)
  const [targetDialog, setTargetDialog] = React.useState(false)
  const [emotionDialog, setEmotionDialog] = React.useState(false)
  const [studyId, setStudyId] = useState(!!value ? value.parentID : study)
  const [config, setConfig] = useState(!!value ? value?.settings : {})
  const [text, setText] = useState(!!value ? value.name : undefined)
  const { enqueueSnackbar } = useSnackbar()
  const { t } = useTranslation()

  useEffect(() => {
    setConfig(!!value ? value?.settings : {})
  }, [])

  const openTargetDialog = (type) => {
    setTargetDialog(type)
  }

  const openEmotionDialog = () => {
    setEmotionDialog(true)
  }

  const onAddTarget = ({ type, target, measure, customUnit }) => {
    setTargetDialog(false)
    if (target.trim() === "") {
      return
    }

    if (type === "effective") {
      let targets = config?.targetEffective ?? []

      targets.push({ target, measure, customUnit })
      setConfig({ ...config, targetEffective: targets })
    } else {
      let targets = config?.targetIneffective ?? []
      targets.push({ target, measure, customUnit })
      setConfig({ ...config, targetIneffective: targets })
    }
  }

  const onAddEmotion = (emotion) => {
    setEmotionDialog(false)

    if (emotion.trim() === "") {
      return
    }
    let emotions = config?.emotions ?? []
    emotions.push({ emotion })
    setConfig({ ...config, emotions: emotions })
  }

  const removeEmotion = (index) => {
    let emotions = config?.emotions ?? []
    emotions.splice(index, 1)
    setConfig({ ...config, emotions: emotions })
  }

  const removeTarget = (type, index) => {
    if (type === "effective") {
      let targets = config?.targetEffective ?? []
      targets.splice(index, 1)
      setConfig({ ...config, targetEffective: targets })
    } else {
      let targets = config?.targetIneffective ?? []
      targets.splice(index, 1)
      setConfig({ ...config, targetIneffective: targets })
    }
  }

  const validate = () => {
    let duplicates = []
    if (typeof text !== "undefined" && text?.trim() !== "") {
      duplicates = activities.filter(
        (x) =>
          (!!value
            ? x.name.toLowerCase() === text?.trim().toLowerCase() && x.id !== value?.id
            : x.name.toLowerCase() === text?.trim().toLowerCase()) && studyId === x.parentID
      )
      if (duplicates.length > 0) {
        enqueueSnackbar(t("Activity with same name already exist."), { variant: "error" })
      }
    }

    return !(
      typeof studyId == "undefined" ||
      studyId === null ||
      studyId === "" ||
      duplicates.length > 0 ||
      typeof text === "undefined" ||
      (typeof text !== "undefined" && text?.trim() === "")
    )
  }

  return (
    <div className={classes.root}>
      <Container className={classes.containerWidth}>
        <Button
          className={classes.headerButton}
          onClick={() => {
            if (validate()) {
              onSave(
                {
                  id: activity?.id ?? undefined,
                  name: text,
                  spec: activity?.spec ?? activitySpecId,
                  schedule: [],
                  settings: config,
                  studyID: studyId,
                },
                false /* overwrite */
              )
            }
          }}
        >
          {/* <Link href='/clinician'> */}
          <Typography className={classes.buttonText}>{t("Save")}</Typography>
          {/* </Link> */}
        </Button>
        {/* </div> */}

        <Grid container spacing={0}>
          <Grid item xs={8}>
            <TextField
              error={typeof studyId == "undefined" || studyId === null || studyId === "" ? true : false}
              id="filled-select-currency"
              select
              label={t("Study")}
              className={classes.inputWidth}
              value={studyId}
              onChange={(e) => setStudyId(e.target.value)}
              helperText={
                typeof studyId == "undefined" || studyId === null || studyId === "" ? t("Please select the Study") : ""
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
          <Grid item xs={8}>
            <Box mb={3} style={{ marginTop: "50px" }}>
              <TextField
                error={
                  typeof text === "undefined" || (typeof text !== "undefined" && text?.trim() === "") ? true : false
                }
                fullWidth
                variant="filled"
                label={t("Activity Title")}
                defaultValue={text}
                onChange={(event) => setText(event.target.value)}
                inputProps={{ maxLength: 80 }}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography className={classes.sectionTitle}>{t("Life worth living goal")}</Typography>
            <Grid container spacing={0}>
              <Grid item xs={10} sm={8}>
                <div className={classes.inputContainer}>
                  <div className={classes.contentContainer}>
                    <CssTextField
                      defaultValue={config?.livingGoal ?? ""}
                      onChange={(event) => setConfig({ ...config, livingGoal: event.target.value })}
                      inputProps={{ disableunderline: "true", maxLength: 300 }}
                      multiline
                      rows={4}
                    />
                    <Typography className={classes.inputDescription}>
                      {`${(config?.livingGoal || "").length} / ` + t("300 max characters")}
                    </Typography>
                  </div>
                </div>
              </Grid>
              <Grid item xs={10} sm={2} />
            </Grid>
            <div style={{ border: "1px solid #C7C7C7", height: 0, width: "100%" }} />

            <Typography className={classes.sectionTitle}>{t("Target behaviors")}</Typography>
            <Grid container spacing={0}>
              <Grid item xs={10} sm={8}>
                <div className={classes.rowContainer} style={{ marginTop: 55, height: 40 }}>
                  <Typography className={classes.groupTitle}>{t("effective")}</Typography>
                </div>
                {(config?.targetEffective ?? []).map((item, index) => {
                  return (
                    <div
                      key={item.id}
                      className={classes.rowContainer}
                      style={{ backgroundColor: index % 2 == 0 ? "#ECF4FF" : "transparent" }}
                    >
                      <Typography className={classes.contentText} style={{ flex: 1 }}>
                        {item.target}
                      </Typography>
                      <Typography className={classes.contentText} style={{ width: 150 }}>
                        {t(item.measure)}
                      </Typography>
                      <ButtonBase onClick={() => removeTarget("effective", index)} className={classes.deleteButton}>
                        <Close />
                      </ButtonBase>
                    </div>
                  )
                })}
                <ButtonBase className={classes.addContainer} style={{ marginBottom: 52, marginTop: 15 }}>
                  <div onClick={() => openTargetDialog("effective")} className={classes.addButton}>
                    <AddCircleOutline />
                  </div>
                  <Typography onClick={() => openTargetDialog("effective")} className={classes.addButtonTitle}>
                    {t("Add item")}
                  </Typography>
                </ButtonBase>

                <div className={classes.rowContainer} style={{ marginTop: 55, height: 40 }}>
                  <Typography className={classes.groupTitle}>{t("Ineffective")}</Typography>
                </div>
                {(config?.targetIneffective ?? []).map((item, index) => {
                  return (
                    <div
                      key={item.id}
                      className={classes.rowContainer}
                      style={{ backgroundColor: index % 2 == 0 ? "#ECF4FF" : "transparent" }}
                    >
                      <Typography className={classes.contentText} style={{ flex: 1 }}>
                        {item.target}
                      </Typography>
                      <Typography className={classes.contentText} style={{ width: 150 }}>
                        {t(item.measure)}
                      </Typography>
                      <ButtonBase onClick={() => removeTarget("ineffective", index)} className={classes.deleteButton}>
                        <Close />
                      </ButtonBase>
                    </div>
                  )
                })}
                <ButtonBase className={classes.addContainer} style={{ marginBottom: 49, marginTop: 15 }}>
                  <div onClick={() => openTargetDialog("ineffective")} className={classes.addButton}>
                    <AddCircleOutline />
                  </div>
                  <Typography onClick={() => openTargetDialog("ineffective")} className={classes.addButtonTitle}>
                    {t("Add item")}
                  </Typography>
                </ButtonBase>
              </Grid>
              <Grid item xs={10} sm={2} />
            </Grid>

            <div style={{ border: "1px solid #C7C7C7", height: 0, width: "100%" }} />

            <Typography className={classes.sectionTitle} style={{ marginBottom: 34 }}>
              {t("Emotions")}
            </Typography>
            <Grid container spacing={0}>
              <Grid item xs={10} sm={8}>
                {(config?.emotions ?? []).map((item, index) => {
                  return (
                    <div
                      key={item.id}
                      className={classes.rowContainer}
                      style={{ backgroundColor: index % 2 == 0 ? "#ECF4FF" : "transparent" }}
                    >
                      <Typography className={classes.contentText} style={{ flex: 1 }}>
                        {item.emotion}
                      </Typography>
                      <ButtonBase onClick={() => removeEmotion(index)} className={classes.deleteButton}>
                        <Close />
                      </ButtonBase>
                    </div>
                  )
                })}
                <ButtonBase className={classes.addContainer} style={{ marginBottom: 52, marginTop: 15 }}>
                  <div onClick={openEmotionDialog} className={classes.addButton}>
                    <AddCircleOutline />
                  </div>
                  <Typography onClick={openEmotionDialog} className={classes.addButtonTitle}>
                    {t("Add item")}
                  </Typography>
                </ButtonBase>
              </Grid>
              <Grid item xs={10} sm={2} />
            </Grid>

            <div style={{ border: "1px solid #C7C7C7", height: 0, width: "100%" }} />
            <div className={classes.buttonsContainer}>
              <Button
                className={classes.buttonContainer}
                onClick={() => {
                  if (validate()) {
                    onSave(
                      {
                        id: activity?.id ?? undefined,
                        name: text,
                        spec: activity?.spec ?? activitySpecId,
                        schedule: [],
                        settings: config,
                        studyID: studyId,
                      },
                      false /* overwrite */
                    )
                  }
                }}
              >
                <Typography className={classes.buttonText}>{t("Save")}</Typography>
              </Button>
              <Button
                className={classes.backContainer}
                onClick={() => {
                  setConfig(!!value ? value?.settings : {})
                  onCancel()
                }}
              >
                <Typography className={classes.backText}>{t("Cancel")}</Typography>
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} sm={1} />
        </Grid>
        <TargetDialog dialogOpen={targetDialog} onClose={onAddTarget} />
        <EmotionDialog dialogOpen={emotionDialog} onClose={onAddEmotion} />
      </Container>
    </div>
  )
}
