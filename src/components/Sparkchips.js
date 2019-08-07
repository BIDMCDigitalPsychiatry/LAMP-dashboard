
// Core Imports
import React from 'react'
import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'

export default class Sparkchips extends React.Component {
  render = () =>
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
  {(this.props.items || []).map(item => (
  	  <Tooltip title={item.tooltip || ''}>
	      <Chip 
	        key={item.name} label={item.name} 
	        style={{ margin: 4, backgroundColor: item.color, color: item.textColor }}
	      />
      </Tooltip>
  ))}
  </div>
}
