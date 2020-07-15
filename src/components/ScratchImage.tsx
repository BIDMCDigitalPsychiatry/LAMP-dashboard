import React, { useState, useEffect } from "react"
import { ReactComponent as Background } from "../icons/scratch/Background.svg"
import {
  Typography,
  makeStyles,
  Box,
  Slide,
  Radio,
  RadioProps,
  RadioGroup,
  FormControl,
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Button,
  Container,
  TextField,
  LinearProgress,
  createStyles,
  withStyles,
  Theme,
  AppBar,
  Icon,
  IconButton,
  Toolbar,
  Grid,
  Slider,
  Step,
  Stepper,
  StepLabel,
  StepContent,
  StepConnector,
  Menu,
  MenuItem,
  ListItemText,
  ListItem,
  List,
} from "@material-ui/core"

const noop = (o) => o
// export default function ScratchImage({...props}) {
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [lastPoint, setLastPoint] = useState(null);
//   const [context, setContext] = useState(null);
//   let canvas;
//   let brush = new Image();
//   let cover = new Image();
//   const noop = (o) => o

//   const defaultProps = {
//     onReveal: noop,
//   }

//   useEffect(() => {
//      if(canvas != null) {
//         canvas.width = window.innerWidth
//         canvas.height = window.innerHeight

//         canvas.addEventListener("mousedown", touchStart)
//         canvas.addEventListener("touchstart", touchStart)
//         canvas.addEventListener("mousemove", touchMove)
//         canvas.addEventListener("touchmove", touchMove)
//         canvas.addEventListener("mouseup", touchEnd)
//         canvas.addEventListener("touchend", touchEnd)
//         setContext(canvas.getContext('2d'));

//      }

// }, []);

// useEffect(() => {

//   if(canvas != null && context != null ) {
//     brush.src = require("../icons/scratch/circle.svg")
//     cover.src = require("../icons/scratch/ScratchCover.svg")
//     cover.onload = () => context.drawImage(cover, 0, 0, canvas.width, canvas.height)
//   }

// }, [context]);

// const getPosition = (event:any) => {
//   let target = canvas
//   let offsetX = 0
//   let offsetY = 0

//   if (target.offsetParent !== undefined) {
//     while ((target = target.offsetParent)) {
//       offsetX += target.offsetLeft
//       offsetY += target.offsetTop
//     }
//   }

//   const x = (event.pageX || event.touches[0].clientX) - offsetX
//   const y = (event.pageY || event.touches[0].clientY) - offsetY
//   return { x, y }
// }

// const touchStart = (event:any) => {
//   setIsDrawing(true)
//   setLastPoint(getPosition(event))
//   context.globalCompositeOperation = "destination-out"
// }

// const touchMove = (event:any) => {
//   if (!isDrawing) return
//   event.preventDefault()

//   const ctx = context
//   const a = lastPoint
//   const b = getPosition(event)
//   const dist = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
//   const angle = Math.atan2(b.x - a.x, b.y - a.y)
//   const offsetX = brush.width / 2
//   const offsetY = brush.height / 2

//   for (let x, y, i = 0; i < dist; i++) {
//     x = a.x + Math.sin(angle) * i - offsetX
//     y = a.y + Math.cos(angle) * i - offsetY
//     ctx.drawImage(this.brush, x, y)
//   }

//   setLastPoint(b);
// }

// const touchEnd = (event : any) => {
//   setIsDrawing(false);
// }

// return (
//     <div><canvas
//     style={{ position: "absolute", zIndex: 2, width: "100%", height: "100%" }}
//         ref={(el) => (canvas = el)}
//       />
//       <div className="secret absolute fill no-select flex justify-center items-center">
//         <Background />
//       </div>
//   </div>
// )
// }

export default class ScratchImage extends React.PureComponent {
  private isDrawing
  private lastPoint
  private canvas
  private ctx
  private brush
  private cover
  static defaultProps = {
    onReveal: noop,
  }

  constructor(props) {
    super(props)
    this.isDrawing = false
    this.lastPoint = null
    this.touchStart = this.touchStart.bind(this)
    this.touchMove = this.touchMove.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
  }

  componentDidMount() {
    const canvas = this.canvas
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    canvas.addEventListener("mousedown", this.touchStart)
    canvas.addEventListener("touchstart", this.touchStart)
    canvas.addEventListener("mousemove", this.touchMove)
    canvas.addEventListener("touchmove", this.touchMove)
    canvas.addEventListener("mouseup", this.touchEnd)
    canvas.addEventListener("touchend", this.touchEnd)

    this.ctx = canvas.getContext("2d")

    this.brush = new Image()
    this.brush.src = require("../icons/scratch/circle.svg")

    this.cover = new Image()
    this.cover.src = require("../icons/scratch/ScratchCover.svg")
    this.cover.onload = () => this.ctx.drawImage(this.cover, 0, 0, canvas.width, canvas.height)
  }

  componentWillUnmount() {
    const canvas = this.canvas
    canvas.removeEventListener("mousedown", this.touchStart)
    canvas.removeEventListener("touchstart", this.touchStart)
    canvas.removeEventListener("mousemove", this.touchMove)
    canvas.removeEventListener("touchmove", this.touchMove)
    canvas.removeEventListener("mouseup", this.touchEnd)
    canvas.removeEventListener("touchend", this.touchEnd)
  }

  getPosition(event) {
    let target = this.canvas
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

  touchStart(event) {
    this.isDrawing = true
    this.lastPoint = this.getPosition(event)
    this.ctx.globalCompositeOperation = "destination-out"
  }

  touchMove(event) {
    if (!this.isDrawing) return
    event.preventDefault()

    const ctx = this.ctx
    const a = this.lastPoint
    const b = this.getPosition(event)
    const dist = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2))
    const angle = Math.atan2(b.x - a.x, b.y - a.y)
    const offsetX = (this.brush.width - 80) / 2
    const offsetY = (this.brush.height - 49) / 2

    for (let x, y, i = 0; i < dist; i++) {
      x = a.x + Math.sin(angle) * i
      y = a.y + Math.cos(angle) * i
      ctx.drawImage(this.brush, x, y, 80, 80)
    }

    this.lastPoint = b
  }

  touchEnd(event) {
    this.isDrawing = false
  }

  render() {
    return (
      <div>
        {/* <AppBar position="static" style={{ background: "#E7F8F2", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton
            onClick={props.goBack}
            color="default"
            className={classes.backbtn}
            aria-label="Menu"
            style={{
              marginLeft: supportsSidebar ? 64 : undefined,
            }}
          >
            <Icon>arrow_back</Icon>
          </IconButton>

          <Typography
            variant="h5"
            style={{
              marginLeft: supportsSidebar ? 64 : undefined,
              color: "rgba(0, 0, 0, 0.75)",
              textAlign: "center",
              width: "100%",
            }}
          >
            {`${props.type.replace(/_/g, " ")}`}
          </Typography>
        </Toolbar>
     
      </AppBar> */}

        <canvas
          style={{ position: "absolute", zIndex: 2, width: "100%", height: "100%" }}
          ref={(el) => (this.canvas = el)}
        />
        <div className="secret absolute fill no-select flex justify-center items-center">
          <Background />
        </div>
      </div>
    )
  }
}
