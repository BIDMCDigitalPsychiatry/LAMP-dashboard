import React from "react"
import { makeStyles, IconButton, Box, Icon, MuiThemeProvider, createTheme, Button } from "@material-ui/core"
import { Widgets } from "@rjsf/material-ui"
import { useTranslation } from "react-i18next"

const useStyles = makeStyles((theme) => ({
  imgInnerBox: { display: "inline-block", position: "relative" },
  closeButton: {
    position: "absolute",
    right: "5px",
    background: "rgba(255, 255, 255, 0.8)",
    padding: "5px",
    top: "5px",
    cursor: "pointer",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.8)",
    },
  },
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
    position: "absolute",
    top: 25,
    "&:hover": { background: "#5680f9" },
    [theme.breakpoints.down("sm")]: {
      minWidth: "auto",
    },
  },
  imgBox: { padding: "20px 0 0 0" },
  closeIcon: { color: "red", cursor: "pointer" },
}))

function processFile(files) {
  const f = files[0]
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      resolve(event.target.result)
    }
    reader.readAsDataURL(f)
  })
}

import locale_lang from "../../locale_map.json"
import { zhCN, enUS, koKR, hiIN, deDE, daDK, frFR, itIT, esES } from "@mui/material/locale"
const userLanguages = ["en-US", "es-ES", "hi-IN", "de-DE", "da-DK", "fr-FR", "ko-KR", "it-IT", "zh-CN"]
const languageObjects = {
  "en-US": enUS,
  "es-ES": esES,
  "hi-IN": hiIN,
  "de-DE": deDE,
  "da-DK": daDK,
  "fr-FR": frFR,
  "ko-KR": koKR,
  "it-IT": itIT,
  "zh-CN": zhCN,
}

export default function CustomFileWidget(props) {
  const classes = useStyles()
  const ref = React.useRef(props.value)
  const { t, i18n } = useTranslation()

  const getSelectedLanguage = () => {
    const matched_codes = Object.keys(locale_lang).filter((code) => code.startsWith(navigator.language))
    const lang = matched_codes.length > 0 ? matched_codes[0] : "en-US"
    return i18n.language ? i18n.language : userLanguages.includes(lang) ? lang : "en-US"
  }

  const onClick = () => {
    ref.current.value = ""
    props.onChange("")
  }
  const formTheme = createTheme(
    {
      props: {
        MuiTextField: {
          variant: "filled",
        },
        MuiPaper: {
          variant: "outlined",
        },
      },

      overrides: {
        MuiFilledInput: {
          root: {
            border: 0,
            backgroundColor: "#f4f4f4",
            "& textarea": {
              resize: "vertical",
            },
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
        MuiTypography: {
          h5: { fontSize: 16, fontWeight: 600, marginBottom: 10 },
        },
      },
    },
    languageObjects[getSelectedLanguage()]
  )

  return (
    <Box>
      <Button
        variant="outlined"
        onClick={() => {
          if (!!ref?.current) ref.current.click()
        }}
      >
        {`${t("Choose File")}`}
      </Button>
      <input
        type="file"
        required={props.required}
        ref={ref}
        accept={
          props.options.accept.includes(".mp3") ? "audio/*" : props.options.accept.includes(".png") ? "image/*" : "*"
        }
        name="file"
        style={{ display: "none" }}
        onChange={(event) => {
          processFile(event.target.files).then(props.onChange)
        }}
      />
      {props?.value && (
        <Box className={classes.imgBox}>
          <Box className={classes.imgInnerBox}>
            {props.options.accept.includes(".mp3") ? (
              <audio controls={true}>
                <source src={props?.value ?? ""} />
              </audio>
            ) : (
              <img src={props?.value ?? ""} height="150" />
            )}
            <IconButton onClick={onClick} className={classes.closeButton}>
              <Icon className={classes.closeIcon}>close</Icon>
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  )
}
