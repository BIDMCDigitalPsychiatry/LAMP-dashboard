import React, { useState, useEffect } from 'react'

export default function useAudio(audioURL: string, initialState: boolean = false, loop: boolean = false): [boolean, (boolean) => void] {
  const [audio] = useState(new Audio(audioURL))
  const [playing, setPlaying] = useState(initialState)
  audio.loop = loop
  useEffect(() => { playing ? audio.play() : audio.pause() }, [playing])
  useEffect(() => {
    audio.addEventListener('ended', () => setPlaying(false))
    return () => { audio.removeEventListener('ended', () => setPlaying(false)) }
  }, [])
  return [playing, setPlaying]
}
