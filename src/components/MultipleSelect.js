
// Core Imports
import React from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import ListItemText from '@material-ui/core/ListItemText'
import Select from '@material-ui/core/Select'
import Checkbox from '@material-ui/core/Checkbox'
import Chip from '@material-ui/core/Chip'

export default class MultipleSelect extends React.Component {
  render = () =>
  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
  {(this.props.items || []).map(item => (
      <Chip 
        key={item} label={item} 
        style={{ margin: 4 }}
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
  ))}
  </div>
}
