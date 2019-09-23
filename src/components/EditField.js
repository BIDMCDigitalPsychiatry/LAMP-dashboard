
// Core Imports
import React, { useState, useEffect } from 'react'
import Chip from '@material-ui/core/Chip'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'

export default function EditField({ text, onChange, ...props }) {
  const [hover, setHover] = useState(false)
  const [currentText, setText] = useState(text)
  const [editing, setEditing] = useState(false)
  useEffect(() => {
    if (currentText !== text)
      onChange(currentText)
  }, [editing])
  return (
    <span onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
      {!editing ? currentText :
        <TextField
          value={currentText}
          onClick={(event) => { event.stopPropagation() }}
          onChange={(event) => setText(event.target.value)}
        />
      }
      <IconButton onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        setEditing(editing => !editing)
      }} style={{ margin: 'auto 0px' }}>
        <Icon fontSize="small">{editing ? 'check' : 'edit'}</Icon>
      </IconButton>
    </span>
  )
}
