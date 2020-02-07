
// Core Imports
import React, { useEffect } from 'react'
import { Typography, makeStyles } from '@material-ui/core'

// Local Imports
import useInterval from './useInterval'
import useAudio from './useAudio'

const useStyles = makeStyles(theme => ({
  '@keyframes Pulse': {
    '0%': { transform: 'scale(.15) rotate(180deg)' },
    '100%': { transform: 'scale(1)' }
  },
  '@keyframes Circle1': {
    '0%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(-35px, -50px)' }
  },
  '@keyframes Circle2': {
    '0%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(35px, 50px)' }
  },
  '@keyframes Circle3': {
    '0%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(-60px, 0)' }
  },
  '@keyframes Circle4': {
    '0%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(60px, 0)' }
  },
  '@keyframes Circle5': {
    '0%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(-35px, 50px)' }
  },
  '@keyframes Circle6': {
    '0%': { transform: 'translate(0, 0)' },
    '100%': { transform: 'translate(35px, -50px)' }
  },
  '@keyframes InhaleText': {
    '0%': { opacity: 0 },
    '10%': { opacity: 1, display: 'inline' },
    '30%': { opacity: 1 },
    '50%': { opacity: 0, display: 'none' },
    '100%': { opacity: 0 }
  },
  '@keyframes ExhaleText': {
    '0%': { opacity: 0 },
    '50%': { opacity: 0 },
    '60%': { opacity: 1, display: 'inline' },
    '90%': { opacity: 1 },
    '100%': { opacity: 0, display: 'none' }
  },
  Background: {
    background: '#000',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  Face: {
    height: '125px',
    width: '125px',
    animation: '$Pulse 4s cubic-bezier(0.5, 0, 0.5, 1) alternate infinite'
  },
  Circle: {
    height: '125px',
    width: '125px',
    borderRadius: '50%',
    position: 'absolute',
    mixBlendMode: 'screen',
    transform: 'translate(0, 0)',
    animation: 'center 6s infinite',

    '&:nth-child(odd)': { background: '#61bea2' },
    '&:nth-child(even)': { background: '#529ca0' },
    '&:nth-child(1)': { animation: '$Circle1 4s ease alternate infinite' },
    '&:nth-child(2)': { animation: '$Circle2 4s ease alternate infinite' },
    '&:nth-child(3)': { animation: '$Circle3 4s ease alternate infinite' },
    '&:nth-child(4)': { animation: '$Circle4 4s ease alternate infinite' },
    '&:nth-child(5)': { animation: '$Circle5 4s ease alternate infinite' },
    '&:nth-child(6)': { animation: '$Circle6 4s ease alternate infinite' }
  },
  InhaleContainer: {
    display: 'block',
    animation: '$InhaleText 8s ease infinite',
  },
  ExhaleContainer: {
    display: 'block',
    marginTop: '-2rem',
    animation: '$ExhaleText 8s ease infinite'
  }
}))

export default function Breathe({ onComplete, ...props }) {
  const classes = useStyles(props)
  const [playing, setPlaying] = useAudio('/calm.mp3', true, true)
  useEffect(() => () => setPlaying(false), [])
  useInterval(() => navigator.vibrate && navigator.vibrate([25, 400, 75, 400, 25]), 4000, true)
  
  return (
    <div className={classes.Background}>
      <div className={classes.Face}>
        <div className={classes.Circle} />
        <div className={classes.Circle} />
        <div className={classes.Circle} />
        <div className={classes.Circle} />
        <div className={classes.Circle} />
        <div className={classes.Circle} />
      </div>
      <div style={{ marginTop: 75 }}>
        <Typography variant="overline" className={classes.InhaleContainer}>Inhale</Typography>
        <Typography variant="overline" className={classes.ExhaleContainer}>Exhale</Typography>
      </div>
    </div>
  )
}
