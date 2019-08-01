
// Core Imports
import React from 'react'
import Typography from '@material-ui/core/Typography'
import ButtonBase from '@material-ui/core/ButtonBase'

// Local Imports
import Activity from '../lamp/Activity'

// TODO: Settings!

export default class Jewels extends React.Component {
  state = {
    jewels: [],
    actions: [],
    activity: new Activity({})
  }

  componentDidMount() {
    for (let i = 0; i <= Math.floor(Math.random() * 100); i++)
      this.state.jewels.push({ i, x: Math.random(), y: Math.random() })
    this.state.activity.start()
  }

  componentWillUnmount() {
    this.state.activity.stop()
  }

  onTap(idx) {
    this.setState({ actions: [...this.state.actions, idx] })
    this.state.activity.emit(0, 0, 0, 0)
    if (this.state.jewels.filter(x => this.state.actions.find(y => y === x.i) === undefined).length === 0) {
      this.state.activity.stop()
      this.props.onComplete(this.state.activity)
    }
  }

  render = () => 
  <div>
    {this.state.jewels.map(x => (
      <ButtonBase
        key={x.i}
        style={{
          position: "absolute",
          left: x.x * (window.innerWidth - 25),
          top: x.y * (window.innerHeight - 25),
          width: 32,
          height: 32,
          borderRadius: "50%",
          opacity: this.state.actions.find(y => y === x.i) === undefined ? 1.0 : 0.2,
        }}
        onClick={() => this.onTap(x.i) }>
        <span style={{ position: 'absolute', fontSize: 32 }}>💎</span>
        <Typography style={{ position: 'absolute', fontSize: 18 }}><b>{x.i + 1}</b></Typography>
      </ButtonBase>
    ))}
  </div>
}
