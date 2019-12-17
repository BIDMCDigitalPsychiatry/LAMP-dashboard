
// Core Imports
import React, { useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Divider from '@material-ui/core/Divider'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import InputAdornment from '@material-ui/core/InputAdornment'
import { deepOrange } from '@material-ui/core/colors';

// Local Imports
import LAMP from '../lamp'

export default function CredentialManager({ id, onComplete, onError, ...props }) {
  const [allCreds, setAllCreds] = useState([])
  const [selected, setSelected] = useState()
  const [resetCred, setResetCred] = useState()
  const [createNew, setCreateNew] = useState(false)
  const [showLink, setShowLink] = useState(false)
  const [name, setName] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => { 
    LAMP.Credential.list(id).then(setAllCreds) 
  }, [])
  useEffect(() => { 
    setShowLink(false)
    setCreateNew(false)
    setName('')
    setEmailAddress('')
    setPassword('') 
  }, [selected])
  useEffect(() => { 
    setCreateNew(false)
    setSelected() 
  }, [resetCred])
  useEffect(() => { 
    setSelected() 
  }, [createNew])

  const _submitCredential = async () => {
    try {
      if (!!resetCred && !!password) {
        if (!!(await LAMP.Credential.update(id, resetCred.access_key, { ...resetCred, secret_key: password })).message)
          return onError('could not change password')
      } else if (!!name && !!emailAddress && !!password) {
        if (!!(await LAMP.Credential.create(id, emailAddress, password, name)).message)
          return onError('could not create credential')
      } else { onError('could not perform operation') }
    } catch(err) { onError('credential management failed') }
    LAMP.Credential.list(id).then(setAllCreds) 
    return setResetCred()
  }

  const _deleteCredential = async () => {
    try {
      if (!!selected) {
        if (!!(await LAMP.Credential.delete(id, selected.item.access_key)).message)
          return onError('could not delete')
      } else { onError('could not perform operation') }
    } catch(err) { onError('credential management failed') }
    LAMP.Credential.list(id).then(setAllCreds) 
  }

  return (
    <React.Fragment>
      <Grid container justify="center" alignItems="center" spacing={2} style={{ marginBottom: 16 }}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center">
            Your <b>Care Team</b>.
          </Typography>
        </Grid>
        {allCreds.map(x => (
          <Grid item>
            <Tooltip title={[x.description, <br />, x.access_key]}>
              <IconButton onClick={event => setSelected({ item: x, target: event.currentTarget })}>
                <Avatar style={{ backgroundColor: deepOrange[500] }}>{x.description.substring(0, 1)}</Avatar>
              </IconButton>
            </Tooltip>
          </Grid>
        ))}
        <Grid item>
          <Tooltip title="Add a new member of your care team.">
            <IconButton onClick={() => setCreateNew(createNew => !createNew)}>
              <Avatar>+</Avatar>
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Menu
        anchorEl={selected ? selected.target : undefined}
        keepMounted
        open={selected && !!selected.target}
        onClose={() => setSelected()}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => setResetCred(selected.item) || setSelected()}>
          Reset Password
        </MenuItem>
        <MenuItem onClick={() => _deleteCredential() || setSelected()}>
          <b>Delete</b>
        </MenuItem>
      </Menu>
      {(resetCred || createNew) && <Divider style={{ margin: '0px -24px 32px -24px' }} />}
      {createNew && <TextField 
        fullWidth
        label={`Name`}
        type="text"
        variant="outlined"
        helperText="Enter the name here."
        value={name}
        onChange={event => setName(event.target.value)}
        style={{ marginBottom: 16 }}
      />}
      {createNew && <TextField 
        fullWidth
        label={`Email Address`}
        type="email"
        variant="outlined"
        helperText="Enter the email address here."
        value={emailAddress}
        onChange={event => setEmailAddress(event.target.value)}
        style={{ marginBottom: 16 }}
      />}
      {(resetCred || createNew) && <TextField 
        fullWidth
        label={`Password`}
        type="password"
        variant="outlined"
        helperText="Enter the new password here, and press the done button to the right of the box. Tap away if you don't want to change the password."
        value={password}
        onChange={event => setPassword(event.target.value)}
        InputProps={{
          endAdornment: [
            createNew ? undefined : <InputAdornment position="end">
              <Tooltip title="Copy one-time access link that can be used to log in without entering credentials.">
                <IconButton
                  edge="end"
                  aria-label="copy link"
                  onClick={() => setShowLink(showLink => !showLink)}
                  onMouseDown={event => event.preventDefault()}
                >
                  <Icon>save</Icon>
                </IconButton>
              </Tooltip>
            </InputAdornment>,
            <InputAdornment position="end">
              <Tooltip title="Save Credential">
                <IconButton
                  edge="end"
                  aria-label="submit credential"
                  onClick={_submitCredential}
                  onMouseDown={event => event.preventDefault()}
                >
                  <Icon>check_circle</Icon>
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ],
        }}
      />}
      {(showLink && password.length > 0) && 
        <TextField 
          fullWidth
          style={{ marginTop: 16 }}
          variant="outlined"
          value={'https://dashboard.lamp.digital/#/?a=' + btoa([id, password].join(':'))}
          onChange={event => {}}
        />
      }
    </React.Fragment>
  )
}
