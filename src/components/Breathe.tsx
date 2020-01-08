import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

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
  Background: {
    background: '#000',
    display: 'flex',
    alignItems: 'center',
    height: '100vh',
    justifyContent: 'center'
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
  }
}))

export default function Breathe({ onComplete, ...props }) {
  const classes = useStyles(props)
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
    </div>
  )
}
