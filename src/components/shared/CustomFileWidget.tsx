import React from "react"
import { makeStyles, IconButton, Box, Icon, Button } from "@material-ui/core"
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
  errorText: { color: "red" },
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
export default function CustomFileWidget(props) {
  const classes = useStyles()
  const ref = React.useRef(props.value)
  const { t } = useTranslation()
  const [error, setError] = React.useState("")

  const onClick = () => {
    ref.current.value = ""
    props.onChange("")
  }

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
          if (event.target.files[0].size / 1024 > props.options.maxSize) {
            setError("Maximum file size should be 4MB")
            ref.current.value = ""
            props.onChange("")
          } else {
            setError("")
            processFile(event.target.files).then(props.onChange)
          }
        }}
      />
      <span className={classes.errorText}>
        <br />
        {error}
      </span>
      {props?.value && (
        <Box className={classes.imgBox}>
          <Box className={classes.imgInnerBox}>
            {props.options.accept.includes(".mp3") ? (
              <audio controls={true}>
                <source src={props?.value ?? ""} />
              </audio>
            ) : (
              props?.value.startsWith("data:image/") && (
                <img
                  src={props?.value ?? ""}
                  height="150"
                  onError={(e) => {
                    const image = e.target as HTMLImageElement
                    image.style.display = "none" // Hide broken images
                  }}
                />
              )
            )}
            {props?.value.startsWith("data:image/") && (
              <IconButton onClick={onClick} className={classes.closeButton}>
                <Icon className={classes.closeIcon}>close</Icon>
              </IconButton>
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}
