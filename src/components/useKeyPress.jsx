// Core Imports
import { useState, useEffect } from "react"

export default function useKeyPress(targetKey, onPressDown = () => {}, onPressUp = () => {}) {
  const [keyPressed, setKeyPressed] = useState(false)
  const downHandler = ({ key }) => {
    if (key !== targetKey) return
    setKeyPressed(true)
    onPressDown()
  }
  const upHandler = ({ key }) => {
    if (key !== targetKey) return
    setKeyPressed(false)
    onPressUp()
  }
  useEffect(() => {
    window.addEventListener("keydown", downHandler)
    window.addEventListener("keyup", upHandler)
    return () => {
      window.removeEventListener("keydown", downHandler)
      window.removeEventListener("keyup", upHandler)
    }
  })
  return keyPressed
}
