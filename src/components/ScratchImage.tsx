import React, { useState, useEffect } from "react"
import { ReactComponent as Background } from "../icons/scratch/Background.svg"
import { Typography, makeStyles, Box, AppBar, Icon, IconButton, Toolbar } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  toolbardashboard: {
    minHeight: 65,
    "& h5": {
      color: "rgba(0, 0, 0, 0.75)",
      textAlign: "center",
      fontWeight: "600",
      fontSize: 18,
      width: "100%",
    },
  },
  backbtn: { paddingLeft: 0, paddingRight: 0 },
  background: {
    background: "#e0e0e0",
    minHeight: "calc(100vh - 65px)",
  },
  svgouter: {
    "& svg": { width: "100%" },
  },
}))

export default function ScratchImage({ ...props }) {
  let lastPoint, isDrawing, context
  const [canvas, setCanvas] = useState(null)
  const [visibility, setVisibility] = useState(false)
  let brush = new Image()
  let cover = new Image()
  const classes = useStyles()
  let area = 0
  let val = 0

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

    const x = (event.pageX || event.touches[0].clientX) - offsetX
    const y = (event.pageY || event.touches[0].clientY) - offsetY
    return { x, y }
  }

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
        val = val + 1
        area = canvas.width * canvas.height
        if (val > area / 150) {
          canvas.remove()
        }
      }
      lastPoint = b
    }
  }

  const touchEnd = (event: any) => {
    isDrawing = false
  }

  useEffect(() => {
    if (canvas != null) {
      canvas.width = window.innerWidth
      canvas.height = document.getElementById("canvasDiv").clientHeight
      context = canvas.getContext("2d")
      canvas.addEventListener("mousedown", touchStart)
      canvas.addEventListener("touchstart", touchStart)
      canvas.addEventListener("mousemove", touchMove)
      canvas.addEventListener("touchmove", touchMove)
      canvas.addEventListener("mouseup", touchEnd)
      canvas.addEventListener("touchend", touchEnd)
      brush.src = require("../icons/scratch/circle.svg")
      cover.src = require("../icons/scratch/ScratchCover.svg")
      cover.onload = () => context.drawImage(cover, 0, 0, canvas.width, canvas.height)
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
      <AppBar position="static" style={{ background: "#FBF1EF", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton onClick={props.goBack} color="default" className={classes.backbtn} aria-label="Menu">
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h5">Scratch card</Typography>
        </Toolbar>
      </AppBar>
      <div id="canvasDiv" className={classes.background}>
        <canvas style={{ position: "absolute", zIndex: 2, width: "100%" }} ref={(el) => setCanvas(el)} />
        <Box className={classes.svgouter} style={{ display: visibility ? "block" : "none" }}>
          <Background />
        </Box>
      </div>
    </div>
  )
}
