import React, { useState, useEffect } from "react"
import { ReactComponent as Background01 } from "../icons/scratch/Background-01.svg"
import { ReactComponent as Background02 } from "../icons/scratch/Background-02.svg"
import { ReactComponent as Background03 } from "../icons/scratch/Background-03.svg"
import { ReactComponent as Background04 } from "../icons/scratch/Background-04.svg"
import { ReactComponent as Background05 } from "../icons/scratch/Background-05.svg"
import { ReactComponent as Background06 } from "../icons/scratch/Background-06.svg"
import circle from "../icons/scratch/circle.svg"
import ScratchCover from "../icons/scratch/ScratchCover.svg"

import { useTranslation } from "react-i18next"
import {
  Typography,
  makeStyles,
  Box,
  AppBar,
  Icon,
  IconButton,
  Toolbar,
  Backdrop,
  CircularProgress,
  Link,
  Fab,
} from "@material-ui/core"
import LAMP from "lamp-core"

const useStyles = makeStyles((theme) => ({
  toolbardashboard: {
    minHeight: 65,
    padding: "0 15px",
    "& h5": {
      color: "rgba(0, 0, 0, 0.75)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      width: "calc(100% - 96px)",
    },
  },
  btnpeach: {
    background: "#FFAC98",
    padding: "15px 25px 15px 25px",
    borderRadius: "40px",
    minWidth: "200px",
    boxShadow: " 0px 10px 15px rgba(255, 172, 152, 0.25)",
    lineHeight: "22px",
    display: "inline-block",
    textTransform: "capitalize",
    fontSize: "16px",
    color: "rgba(0, 0, 0, 0.75)",
    fontWeight: "bold",
    "&:hover": {
      background: "#FFAC98",
      boxShadow:
        "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
    },
  },
  background: {
    background: "#e0e0e0",
    minHeight: "calc(100vh - 65px)",
  },
  svgouter: {
    "& svg": { width: "100%", maxHeight: "calc(100vh - 70px)" },
    background: "#FFF",
  },
  scratchCompleteMsg: {
    minHeight: "calc(100vh - 65px)",
    background: "rgba(255,255,255,0.9)",

    bottom: 0,
    left: 0,
    width: "100%",
    textAlign: "center",
    position: "absolute",
    "& h4": { fontSize: 30, fontWeight: 600, marginBottom: 60 },
  },
  linkpeach: { fontSize: 16, color: "#BC453D", fontWeight: 600 },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },
}))

function CanvasElement({ setCanvas, ...props }) {
  return <canvas style={{ position: "absolute", zIndex: 2, width: "100%" }} ref={(el) => setCanvas(el)} />
}
function BrushElement({ setBrush, ...props }) {
  return <img ref={(el) => setBrush(el)} width={150} height={150} src={circle} style={{ display: "none" }} />
}
function CoverElement({ setCover, ...props }) {
  return <img ref={(el) => setCover(el)} src={ScratchCover} style={{ display: "none" }} />
}
const background = () => {
  const images = [
    <Background01 />,
    <Background02 />,
    <Background03 />,
    <Background04 />,
    <Background05 />,
    <Background06 />,
  ]
  return images[Math.floor(Math.random() * images.length)]
}
export default function ScratchImage({ participant, activity, ...props }) {
  let lastPoint, isDrawing, context
  const [canvas, setCanvas] = useState(null)
  const [visibility, setVisibility] = useState(false)
  const [done, setDone] = useState(false)
  const [canvasComponent, setCanvasComponent] = useState(<CanvasElement setCanvas={setCanvas} />)
  const [image, setImage] = useState(null)
  const { t } = useTranslation()
  const [time, setTime] = useState(new Date().getTime())
  const [loading, setLoading] = useState(true)
  const [savedX, setSavedx] = useState([])
  const [savedY, setSavedY] = useState([])
  const [brush, setBrush] = useState(null)
  const [cover, setCover] = useState(null)
  const [brushComponent, setBrushComponent] = useState(<BrushElement setBrush={setBrush} />)
  const [coverComponent, setCoverComponent] = useState(<CoverElement setCover={setCover} />)
  const classes = useStyles()
  let area = 0
  let val = 0

  useEffect(() => {
    setBrushComponent(<BrushElement setBrush={setBrush} />)
    setCanvasComponent(<CanvasElement setCanvas={setCanvas} />)
    setCoverComponent(<CoverElement setCover={setCover} />)
  }, [])

  const getPosition = (event: any) => {
    let target = canvas
    let offsetX = 0
    let offsetY = 0

    if (target.offsetParent !== undefined) {
      while ((target = target.offsetParent)) {
        offsetX += target.offsetLeft
        offsetY += target.offsetTop
      }
    }
    const x = (event.pageX || (event.touches && event.touches[0].clientX)) - offsetX
    const y = (event.pageY || (event.touches && event.touches[0].clientY)) - offsetY
    return { x, y }
  }
  useEffect(() => {
    if (done) {
      let duration = new Date().getTime() - time
      let data = {
        timestamp: new Date().getTime(),
        duration: duration,
        activity: activity.id,
        static_data: {},
      }
      LAMP.ActivityEvent.create(participant.id, data)
        .catch((e) => console.dir(e))
        .then((x) => {
          setCanvasComponent(null)
          setBrushComponent(null)
          setCoverComponent(null)
          cover.remove()
          brush.remove()
          canvas.remove()
        })
    }
  }, [done])

  const touchMove = (event: any) => {
    if (!isDrawing) return
    event.preventDefault()
    if (lastPoint != null) {
      const a = lastPoint
      const b = getPosition(event)
      const dist = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
      const angle = Math.atan2(b.x - a.x, b.y - a.y)
      const offsetX = (brush.width - 80) / 2
      const offsetY = (brush.height - 40) / 2
      for (let x, y, i = 0; i < dist; i++) {
        x = a.x + Math.sin(angle) * i - offsetX
        y = a.y + Math.cos(angle) * i - offsetY
        context.drawImage(brush, x, y, 80, 80)
        if (!savedX.includes(x) && !savedY.includes(y)) {
          let xValues = savedX
          let yValues = savedY
          xValues.push(y)
          yValues.push(y)
          setSavedx(xValues)
          setSavedY(yValues)
          val = val + 80
          area = canvas.width * canvas.height
          if (val > (area * (activity?.settings?.threshold ?? 80)) / 100) {
            setDone(true)
          }
        }
      }
      lastPoint = b
    }
  }

  const touchEnd = (event: any) => {
    isDrawing = false
  }

  useEffect(() => {
    if (canvas != null && cover !== null && brush !== null) {
      canvas.width = window.innerWidth
      canvas.height = document.getElementById("canvasDiv").clientHeight
      context = canvas.getContext("2d")
      canvas.addEventListener("mousedown", touchStart)
      canvas.addEventListener("touchstart", touchStart)
      canvas.addEventListener("mousemove", touchMove)
      canvas.addEventListener("touchmove", touchMove)
      canvas.addEventListener("mouseup", touchEnd)
      canvas.addEventListener("touchend", touchEnd)
      cover.onload = () => {
        context.drawImage(cover, 0, 0, canvas.width, canvas.height)
        context.textAlign = "center"
        context.font = "bold 30px inter"
        context.fillText(t("Swipe around the"), canvas.width / 2, canvas.height / 2 - 35)
        context.fillText(t("Screen to reveal"), canvas.width / 2, canvas.height / 2)
        context.fillText(t("The hidden image"), canvas.width / 2, canvas.height / 2 + 35)
        setImage(background())
        setLoading(false)
      }
    }
  }, [canvas])

  const touchStart = (event: any) => {
    isDrawing = true
    setVisibility(true)
    lastPoint = getPosition(event)
    if (context != null) {
      context.globalCompositeOperation = "destination-out"
    }
  }

  return (
    <div>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {brushComponent}
      {coverComponent}
      <AppBar position="static" style={{ background: "#FBF1EF", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton onClick={props.onComplete} color="default" aria-label="Menu">
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h5">{t("Scratch card")}</Typography>
        </Toolbar>
      </AppBar>
      <div id="canvasDiv" className={classes.background}>
        {canvasComponent}
        <Box className={classes.svgouter} style={{ display: visibility ? "block" : "none" }}>
          {image}
        </Box>
        <Box display={done ? "flex" : "none"} alignItems="center" className={classes.scratchCompleteMsg}>
          <Box width={1}>
            <Typography variant="h4">{t("Well done!")}</Typography>
            <Fab className={classes.btnpeach} onClick={props.onComplete}>
              {t("Close")}
            </Fab>
            <Box width={1} mt={3}>
              <Link
                className={classes.linkpeach}
                onClick={() => {
                  setBrushComponent(<BrushElement setBrush={setBrush} />)
                  setCanvasComponent(<CanvasElement setCanvas={setCanvas} />)
                  setCoverComponent(<CoverElement setCover={setCover} />)
                  setVisibility(false)
                  setDone(false)
                }}
              >
                {t("Do another one")}
              </Link>
            </Box>
          </Box>
        </Box>
      </div>
    </div>
  )
}
