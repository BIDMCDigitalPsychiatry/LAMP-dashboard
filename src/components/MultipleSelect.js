
// Core Imports
import React from 'react'
import Chip from '@material-ui/core/Chip'
import Tooltip from '@material-ui/core/Tooltip'
import Badge from '@material-ui/core/Badge'

// TODO: Change the items prop to: { name: string; selected: bool; badge: string; tooltip: string; }

export default class MultipleSelect extends React.Component {
  render = () =>
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
  {(this.props.items || []).map(item => (
      <Tooltip 
        key={item} 
        style={{ margin: 4 }}
        disableHoverListener={!this.props.tooltips} 
        title={(this.props.tooltips || {})[item] || this.props.defaultTooltip || item}
      >
        <Badge 
          showZero={this.props.showZeroBadges}
          badgeContent={(this.props.badges || {})[item] || this.props.defaultBadge || 0} 
          color="primary"
        >
          <Chip 
            label={item} 
            color={(this.props.selected || []).indexOf(item) >= 0 ? 'primary' : undefined}
            onClick={
              (this.props.selected || []).indexOf(item) >= 0 ? () => {} :
              () => this.props.onChange(!!this.props.singleSelect ? [item] : [...(this.props.selected || []), item])
            }
            onDelete={
              (this.props.selected || []).indexOf(item) < 0 ? undefined :
              () => this.props.onChange((this.props.selected || []).filter(x => x !== item))
            }
          />
        </Badge>
      </Tooltip>
  ))}
  </div>
}
