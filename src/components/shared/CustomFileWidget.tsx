import React from "react"
import { makeStyles, IconButton, Box, Icon } from "@material-ui/core"
import { Widgets } from "@rjsf/material-ui"

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

export default function CustomFileWidget(props) {
  const classes = useStyles()
  const ref = React.useRef(props.value)

  const onClick = () => {
    ref.current.value = ""
    props.onChange("")
  }
  return (
    <Box>
      <input
        type="file"
        required={props.required}
        ref={ref}
        accept={
          props.options.accept.includes(".mp3") ? "audio/*" : props.options.accept.includes(".png") ? "image/*" : "*"
        }
        name="file"
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
