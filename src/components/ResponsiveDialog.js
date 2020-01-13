
// Core Imports 
import React, { useState, useEffect } from 'react'
import Dialog from '@material-ui/core/Dialog'
import Icon from '@material-ui/core/Icon'
import IconButton from '@material-ui/core/IconButton'
import Slide from '@material-ui/core/Slide'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

const SlideUp = React.forwardRef((props, ref) => (
  <Slide direction="up" {...props} ref={ref} />
))

// 
export default function ResponsiveDialog({ transient, animate, fullScreen, children, ...props }) {
    const sm = useMediaQuery(useTheme().breakpoints.down('sm'))
    return (
        <Dialog {...props}
            fullScreen={!!fullScreen ? true : sm} 
            TransitionComponent={!!animate ? SlideUp : undefined}
        >
            {!!transient &&
                <IconButton 
                    style={{ 
                        position: 'fixed', 
                        left: 16, 
                        top: 16, 
                        background: '#ffffff66', 
                        WebkitBackdropFilter: 'blur(5px)' 
                    }} 
                    onClick={props.onClose} 
                    aria-label="Close"
                >
                    <Icon>close</Icon>
                </IconButton>
            }
            {children}
        </Dialog>
    )
}