// Core Imports
import React, { useState, useEffect } from "react"
import { Box, Typography, ButtonBase } from "@material-ui/core"

// TODO: Settings!

const makeJewels = () =>
  Array.rangeTo(Math.floor(Math.random() * 100)).map((i) => ({
    i,
    x: Math.random(),
    y: Math.random(),
  }))

export default function Jewels({ onComplete, ...props }) {
  // eslint-disable-next-line
  const [jewels, setJewels] = useState(makeJewels())
  const [actions, setActions] = useState([])
  // eslint-disable-next-line
  const [activity, setActivity] = useState({})

  useEffect(() => {
    //activity.start()
    return () => {} //activity.stop()
  }, [])

  const onTap = (idx) => {
    setActions((actions) => [...actions, idx])
    //activity.emit(0, 0, 0, 0)
    if (jewels.filter((x) => actions.find((y) => y === x.i) === undefined).length === 0) {
      //activity.stop()
      !!onComplete && onComplete(activity)
    }
  }

  return (
    <Box>
      {jewels.map((x) => (
        <ButtonBase
          key={x.i}
          style={{
            position: "absolute",
            left: x.x * (window.innerWidth - 25),
            top: x.y * (window.innerHeight - 25),
            width: 32,
            height: 32,
            borderRadius: "50%",
            opacity: actions.find((y) => y === x.i) === undefined ? 1.0 : 0.2,
          }}
          onClick={() => onTap(x.i)}
        >
          {/* eslint-disable-next-line */}
          <span style={{ position: "absolute", fontSize: 32 }}>💎</span>
          <Typography style={{ position: "absolute", fontSize: 18 }}>
            <b>{x.i + 1}</b>
          </Typography>
        </ButtonBase>
      ))}
    </Box>
  )
}
