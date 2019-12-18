
// Core Imports
import React, { useState, useEffect } from 'react'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'

export default function EditField({ text, defaultValue, onChange, ...props }) {
  const [currentText, setText] = useState(text || defaultValue)
  const [editing, setEditing] = useState(false)
  useEffect(() => {
    if (currentText !== (text || defaultValue))
      onChange(currentText)
  }, [editing])
  return (
    <Tooltip title={<span>{defaultValue}<br /><br />Press the pencil icon to edit this value.<br />Saving an empty text box will reset this value.</span>}>
      <span>
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
    </Tooltip>
  )
}
