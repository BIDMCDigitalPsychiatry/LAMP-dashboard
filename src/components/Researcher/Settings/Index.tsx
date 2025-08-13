import React, { useState, useCallback } from "react"
import {
  Box,
  makeStyles,
  Theme,
  createStyles,
  Backdrop,
  CircularProgress,
  Button,
  ButtonBase,
  Grid,
  Icon,
  Tooltip,
} from "@material-ui/core"
import { useTranslation } from "react-i18next"
import { useSnackbar } from "notistack"
import TextField from "@mui/material/TextField"
import Header from "./Header"
import { useDropzone } from "react-dropzone"
import { compress } from "../ActivityList/ActivityHeader"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: 111111,
      color: "#fff",
    },
  })
)

export default function Settings({ title, researcherId, ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [bannerGreeting, setBannerGreeting] = useState("")
  const [bannerHeading, setBannerHeading] = useState("")
  const [bannerSubHeading, setBannerSubHeading] = useState("")
  const [photo, setPhoto] = useState(null)

  const { getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
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

  const handleSaveSettings = () => {
    const data = {
      researcherId: researcherId,
      bannerGreeting: bannerGreeting,
      bannerHeading: bannerHeading,
      bannerSubHeading: bannerSubHeading,
      photo: photo,
    }
  }

  return (
    <React.Fragment>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Header />
      <h3>Banner Settings</h3>
      <Box>
        <Box mb={2} mt={3}>
          <TextField
            // error={!validate()}
            autoFocus
            fullWidth
            variant="outlined"
            label={`${t("Banner greeting")}`}
            value={bannerGreeting}
            onChange={(e) => {
              setBannerGreeting(e.target.value)
            }}
            inputProps={{ maxLength: 50 }}
            helperText={`${t("Max 50 characters")}`}
          />
        </Box>
        <Box mb={2} mt={3}>
          <TextField
            // error={!validate()}
            autoFocus
            fullWidth
            variant="outlined"
            label={`${t("Banner heading")}`}
            value={bannerHeading}
            onChange={(e) => {
              setBannerHeading(e.target.value)
            }}
            inputProps={{ maxLength: 80 }}
            helperText={`${t("Max 80 characters")}`}
          />
        </Box>
        <Box mb={2} mt={3}>
          <TextField
            // error={!validate()}
            autoFocus
            fullWidth
            variant="outlined"
            label={`${t("Banner subheading")}`}
            value={bannerSubHeading}
            onChange={(e) => {
              setBannerSubHeading(e.target.value)
            }}
            inputProps={{ maxLength: 80 }}
            helperText={`${t("Max 80 characters")}`}
          />
        </Box>
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
        <Box textAlign="right" width={1} mt={3} mb={3} mx={3}>
          <Button color="primary">{`${t("Cancel")}`}</Button>
          <Button
            onClick={() => {
              enqueueSnackbar(`${t("Settings saved successfully")}`, { variant: "success" })
            }}
            color="primary"
            disabled
            autoFocus
          >
            {`${t("Save")}`}
          </Button>
        </Box>
      </Box>
    </React.Fragment>
  )
}
