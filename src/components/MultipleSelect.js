
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

// TODO: Selected should switch fontWeightRegular vs fontWeightMedium

export default class MultipleSelect extends React.Component {
  render = () =>
  <FormControl style={{ width: '100%' }}>
    <InputLabel htmlFor="select-multiple-chip">{this.props.title}</InputLabel>
    <Select
      multiple
      value={this.props.selected || []}
      onChange={event => this.props.onChange(event.target.value)}
      input={<Input id="select-multiple-chip" />}
      renderValue={selected => (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {selected.map(value => (
            <Chip key={value} label={value} />
          ))}
        </div>
      )}
      MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 48 * 4.5 + 8,
              width: 250,
            },
          },
        }}
    >
      {(this.props.items || []).map(item => (
        <MenuItem key={item} value={item}>
          <Checkbox checked={this.props.selected.indexOf(item) > -1} />
          <ListItemText primary={item} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
}
