import React, { useState, useCallback, useEffect } from "react"
import makeStyles from "@material-ui/core/styles/makeStyles"
import createStyles from "@material-ui/core/styles/createStyles"
import { Theme } from "@material-ui/core/styles/createTheme"

import Switch from "@material-ui/core/Switch"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Grid from "@material-ui/core/Grid"
import Divider from "@material-ui/core/Divider"
import Typography from "@material-ui/core/Typography"
import ButtonBase from "@material-ui/core/ButtonBase"
import Icon from "@material-ui/core/Icon"
import Tooltip from "@material-ui/core/Tooltip"
import Box from "@material-ui/core/Box"

import { useSnackbar } from "notistack"
import Jewels from "../../../icons/VisualPopup/Jewels.svg"
import Maze from "../../../icons/VisualPopup/Maze.svg"
import SpatialSpan from "../../../icons/VisualPopup/SpatialSpan.svg"
import SpinWheel from "../../../icons/VisualPopup/SpinWheel.svg"
import Symbol_Digit from "../../../icons/VisualPopup/Symbol_Digit.svg"
import { useTranslation } from "react-i18next"
import { useDropzone } from "react-dropzone"
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    menuitemsul: {
      width: "100%",
    },
    dividerRoot: { marginTop: 10 },
    marginTop10: { marginTop: "10px" },
    gridFlex: { display: "flex" },
  })
)

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
export default function ActivityImage({ ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [image, setImage] = useState(props.value?.image ?? "")
  const [checked, setChecked] = useState(props.value?.checked ?? false)
  const { enqueueSnackbar } = useSnackbar()

  const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDropAccepted: useCallback((acceptedFiles) => {
      compress(acceptedFiles[0], 64, 64).then(setImage)
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

  useEffect(() => {
    props.onChange({ image, checked })
  }, [image, checked])

  useEffect(() => {
    switch (props.activitySpecId) {
      case "lamp.jewels_a":
      case "lamp.jewels_b":
        setImage(Jewels)
        break
      case "lamp.spatial_span":
        setImage(SpatialSpan)
        break
      case "lamp.maze_game":
        setImage(Maze)
        break
      case "lamp.symbol_digit_substitution":
        setImage(Symbol_Digit)
        break
      case "lamp.spin_wheel":
        setImage(SpinWheel)
        break
    }
  }, [])

  return (
    <Grid item lg={12} md={9} xs={12}>
      <Typography variant="h6">{`${t("Visual popup settings")}`}</Typography>
      <Divider classes={{ root: classes.dividerRoot }} />
      <Grid container spacing={2}>
        <Grid item alignItems="center" lg={3} sm={3} xs={12} className={classes.gridFlex}>
          <FormControlLabel
            control={<Switch checked={checked} onChange={() => setChecked(!checked)} name="image" />}
            label={!!checked ? `${t("Visual popup on")}` : `${t("Visual popup off")}`}
          />
        </Grid>

        {!!checked && (
          <Grid container style={{ marginLeft: "-15px" }}>
            <Tooltip
              title={
                !image
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
                borderColor={!(isDragActive || isDragAccept || !!image) ? "text.secondary" : "#fff"}
                bgcolor={isDragActive || isDragAccept ? "text.secondary" : undefined}
                color={!(isDragActive || isDragAccept || !!image) ? "text.secondary" : "#fff"}
                style={{
                  background: !!image ? `url(${image}) center center/contain no-repeat` : undefined,
                }}
              >
                <ButtonBase style={{ width: "100%", height: "100%" }} onClick={() => !!image && setImage(undefined)}>
                  {!image && <input {...getInputProps()} />}
                  <Icon fontSize="large">{!image ? "add_a_photo" : "delete_forever"}</Icon>
                </ButtonBase>
              </Box>
            </Tooltip>
          </Grid>
        )}
      </Grid>
    </Grid>
  )
}
