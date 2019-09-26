
// Core Imports
import React, { useState } from 'react'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import TextField from '@material-ui/core/TextField'
import InputAdornment from '@material-ui/core/InputAdornment'

// Local Imports
import LAMP from '../lamp'

export default function CredentialManager({ id, onComplete, onError, ...props }) {
  const [password, setPassword] = useState('')

  const _changePassword = async () => {
    try {
      if (!!(await LAMP.Credential.create(id, password)).message) {
        let existing = (await LAMP.Credential.list(id))[0]
        if (!!(await LAMP.Credential.update(id, existing.access_key, { ...existing, secret_key: password })).message)
          return onError('could not change password')
        else return onComplete() 
      } else return onComplete() 
    } catch(err) { onError('could not change password') }
  }

  return (
    <TextField 
        fullWidth
        label={`New password for ${id}`}
        type="password"
        variant="outlined"
        helperText="Enter the new password here, and press the done button to the right of the box. Tap away if you don't want to change the password."
        value={password}
        onChange={event => setPassword(event.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                aria-label="submit password"
                onClick={_changePassword}
                onMouseDown={event => event.preventDefault()}
              >
                <Icon>check_circle</Icon>
              </IconButton>
            </InputAdornment>
          ),
        }}
    />
  )
}
