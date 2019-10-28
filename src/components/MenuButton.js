
// Core Imports
import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Icon from '@material-ui/core/Icon'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

export default function MenuButton({ title, icon, color, items, onClick, onAction, ...props }) {
  const [anchorEl, setAnchorEl] = useState(null)
  return (
    <React.Fragment>
      <ButtonGroup variant="contained" color={color || 'secondary'}>
        <Button 
            {...props}
            variant="contained"
            color={color || 'secondary'}
            aria-haspopup="true" 
            onClick={event => !!onAction && onAction()}
        >
          {title}
        </Button>
        <Button
            color={color || 'secondary'}
            size="small"
            aria-haspopup="true"
            onClick={event => setAnchorEl(event.currentTarget)}
          >
            {icon || <Icon>arrow_drop_down</Icon>}
          </Button>
      </ButtonGroup>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {(items || []).map(x => (
            <MenuItem onClick={() => setAnchorEl(null) || onClick(x)}>
                {x}
            </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  )
}