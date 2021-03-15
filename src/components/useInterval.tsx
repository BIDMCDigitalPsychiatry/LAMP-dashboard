// Core Imports
// eslint-disable-next-line
import React, { useState, useEffect, useRef } from "react"
export default function useInterval(callback, delay, now) {
  const savedCallback = useRef<any>()
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])
  useEffect(() => {
    function tick() {
      savedCallback.current?.()
    }
    if (delay !== null) {
      let id = setInterval(tick, delay)
      if (now) tick()
      return () => clearInterval(id)
    }
  }, [delay])
}
