
// Core Imports
import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import blue from '@material-ui/core/colors/blue'
import grey from '@material-ui/core/colors/grey'

// Local Imports
import LAMP from '../lamp'
import { mediumDateFormat } from '../components/Utils'

const capitalize = (x) => x.charAt(0).toUpperCase() + x.slice(1)

const MessageItem = ({ ...props }) => 
<div style={{ 
    padding: 8 
}}>
    <Typography style={{ 
        textAlign: props.flipped ? 'left' : 'right'
    }}>
        <b>{capitalize((props.from === 'researcher' ? 'clinician' : 'patient'))}</b>
        <div />
        <b>{(new Date(props.date || 0)).toLocaleString('en-US', mediumDateFormat)}</b>
    </Typography>
    <Card style={{ 
        padding: 8, 
        backgroundColor: props.flipped ? blue[600] : grey[100] 
    }}>
        <Typography 
            style={{ 
                wordWrap: 'break-word',
                textAlign: props.flipped ? 'left' : 'right', 
                color: props.flipped ? '#fff' : '#000' 
            }}
        >
            {props.text}
        </Typography>
    </Card>
</div>

class Messages extends React.Component {
    state = {}
    async componentWillMount() {
        await this.loadMessages()
        this.timeout = setInterval(async () => {
            await this.loadMessages()
        }, 10 * 1000)
    }

    componentWillUnmount() {
        if (!!this.timeout)
            clearInterval(this.timeout)
    }

    loadMessages = async () => {
        console.log('Fetching messages...')
        this.setState({ 
            messages: Object.fromEntries((await Promise.all([this.props.participant || '']
                        .map(async (x) => [x, await LAMP.Type.getAttachment(x, 'lamp.messaging').catch(e => [])])))
                        .filter(x => x[1].message !== '404.object-not-found')
                        .map(x => [x[0], x[1].data]))
        })
    }

    sendMessage = async () => {
        let msg = (this.state.currentMessage || '').trim()
        if (msg.length === 0 || !this.props.participant)
            return

        let all = this.getMessages()
        all.push({
            from: !!this.props.participantOnly ? 'participant' : 'researcher',
            type: (this.state.messageTab || 0) === 1 ? 'note' : 'message',
            date: new Date(),
            text: msg
        })
        LAMP.Type.setAttachment(this.props.participant, 'me', 'lamp.messaging', all)
        this.setState({ 
            currentMessage: undefined, 
            messages: {
                ...(this.state.messages || {}), 
                [this.props.participant]: all
            }
        })
    }

    getMessages = () => {
        let x = ((this.state.messages || {})[this.props.participant || ''] || [])
        if (!Array.isArray(x)) return []
        return x
    }

    render = () =>
    <React.Fragment>
        <Tabs
            value={this.state.messageTab || 0}
            onChange={(e, value) => this.setState({ messageTab: value })}
            indicatorColor="primary"
            textColor="primary"
            centered
        >
            <Tab label="Messages" index={0} />
            <Tab label={!!this.props.participantOnly ? 'My Journal' : 'Patient Notes'} index={1} />
        </Tabs>
        {this.getMessages()
            .filter(x => (this.state.messageTab || 0) === 0 
                ? (x.type === 'message') 
                : (x.type === 'note' && x.from === (!!this.props.participantOnly ? 'participant' : 'researcher')))
            .map(x => 
                <MessageItem {...x} 
                    flipped={
                        (!!this.props.participantOnly && x.from === 'researcher') || 
                        (!this.props.participantOnly && x.from === 'participant')
                    } 
                    key={JSON.stringify(x)} 
                />
        )}
        <TextField
            label="Send a message"
            style={{ margin: 8 }}
            placeholder="Message..."
            value={this.state.currentMessage || ''}
            onChange={(event) => this.setState({ currentMessage: event.target.value })}
            helperText={`Your ${!!this.props.participantOnly ? 'clinician' : 'patient'} will ${(this.state.messageTab || 0) === 0 ? 'be able to see your messages when they log in.' : 'not be able to see this message.'}`}
            margin="normal"
            variant="outlined"
            multiline
            rowsMax="4"
            InputLabelProps={{ shrink: true }}
        />
        <Button variant="contained" onClick={this.sendMessage}>Send</Button>
    </React.Fragment>
}

export default withRouter(Messages)
