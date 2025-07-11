import React, { useCallback, useState, useEffect } from "react"
import {
  Grid,
  ButtonBase,
  Icon,
  TextField,
  Tooltip,
  Box,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@material-ui/core"
import { useSnackbar } from "notistack"
import { useTranslation } from "react-i18next"
import { useDropzone } from "react-dropzone"
import ActivityTab from "./ActivityTab"
import ActivityStreak from "./ActivityStreak"
import ActivityImage from "./ActivityImage"
import BranchingSettings from "./BranchingSettings"

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
export const removeExtraSpace = (s) => s?.trim().split(/ +/).join(" ")

export default function ActivityHeader({
  studies,
  value,
  details,
  activitySpecId,
  study,
  onChange,
  image,
  onTabChange,
  ...props
}) {
  const { t } = useTranslation()
  const [text, setText] = useState(!!value ? value.name : "")
  const [description, setDescription] = useState(details?.description ?? null)
  const [photo, setPhoto] = useState(details?.photo ? details?.photo : !!image ? image : null)
  const { enqueueSnackbar } = useSnackbar()
  const [studyId, setStudyId] = useState(!!value ? value.study_id : study)
  const [streak, setStreak] = useState(details?.streak ? details?.streak : null)
  const [visualSettings, setVisualSettings] = useState(details?.visual_settings ? details?.visual_settings : null)
  const [showFeed, setShowFeed] = useState(
    typeof details?.showFeed !== "undefined" && details?.showFeed !== null ? details?.showFeed : true
  )
  const [branchingSettings, setBranchingSettings] = useState(
    details?.branchingSettings ? details?.branchingSettings : null
  )

  useEffect(() => {
    onChange({
      text,
      photo,
      description,
      studyId,
      streak,
      showFeed,
      visualSettings,
      branchingSettings,
    })
  }, [text, description, photo, studyId, streak, showFeed, visualSettings, branchingSettings])

  const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDropAccepted: useCallback((acceptedFiles) => {
      compress(acceptedFiles[0], 64, 64).then(setPhoto)
    }, []),
    onDropRejected: useCallback((rejectedFiles) => {
      if (rejectedFiles[0].size / 1024 / 1024 > 5) {
        enqueueSnackbar(`${t("Image size should not exceed 5 MB.")}`, { variant: "error" })
      } else if ("image" !== rejectedFiles[0].type.split("/")[0]) {
        enqueueSnackbar(`${t("Not supported image type.")}`, { variant: "error" })
      }
    }, []),
    accept: "image/*",
    maxSize: 2 * 1024 * 1024 /* 5MB */,
  })

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3} lg={2}>
        <Tooltip
          title={
            !photo
              ? `${t("Drag a photo or tap to select a photo.")}`
              : `${t("Drag a photo to replace the existing photo or tap to delete the photo.")}`
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
      </Grid>
      <Grid item lg={10} md={9} xs={12}>
        <Grid container spacing={2}>
          <Grid item lg={6} sm={6} xs={12}>
            <TextField
              error={typeof studyId == "undefined" || studyId === null || studyId === "" ? true : false}
              id="filled-select-currency"
              select
              label={`${t("Group")}`}
              value={studyId}
              onChange={(e) => {
                setStudyId(e.target.value)
              }}
              helperText={
                typeof studyId == "undefined" || studyId === null || studyId === ""
                  ? `${t("Please select the Group")}`
                  : ""
              }
              variant="filled"
              disabled={!!value ? true : false}
            >
              {(studies || []).map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {t(option.name)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item lg={6} sm={6} xs={12}>
            <TextField
              error={typeof text === "undefined" || (typeof text !== "undefined" && text?.trim() === "") ? true : false}
              fullWidth
              variant="filled"
              label={`${t("Activity Title")}`}
              defaultValue={text}
              onChange={(event) => setText(removeExtraSpace(event.target.value))}
              inputProps={{ maxLength: 80 }}
            />
          </Grid>
          <ActivityTab onChange={onTabChange} activitySpecId={activitySpecId} value={value} />
        </Grid>
        <Box style={{ marginTop: "15px" }}>
          <TextField
            fullWidth
            multiline
            label={`${t("Activity Description")}`}
            variant="filled"
            rows={2}
            defaultValue={description}
            onChange={(event) => setDescription(removeExtraSpace(event.target.value))}
            inputProps={{ maxLength: 2500 }}
          />
        </Box>

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
      {!["lamp.zoom_meeting"].includes(activitySpecId) && (
        <ActivityStreak onChange={(val) => setStreak(val)} value={details?.streak} />
      )}
      <Divider />
      {[
        "lamp.jewels_a",
        "lamp.jewels_b",
        "lamp.spatial_span",
        "lamp.maze_game",
        "lamp.symbol_digit_substitution",
        "lamp.spin_wheel",
      ].includes(activitySpecId) && (
        <ActivityImage
          onChange={(val) => setVisualSettings(val)}
          activitySpecId={activitySpecId}
          value={details?.visualSettings}
        />
      )}
      <Divider />
      {activitySpecId === "lamp.survey" && (
        <BranchingSettings
          studyId={studyId}
          branching_settings={branchingSettings}
          onChange={(val) => setBranchingSettings(val)}
        />
      )}
    </Grid>
  )
}
