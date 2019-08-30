
// Core Imports
import React, { useState } from 'react'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

export default function MenuButton({ title, items, onClick, ...props }) {
  const [anchorEl, setAnchorEl] = useState(null)
  return (
    <React.Fragment>
      <Button 
          {...props}
          variant="contained"
          color="secondary"
          aria-haspopup="true" 
          onClick={event => setAnchorEl(event.currentTarget)}
      >
        {title}
      </Button>
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