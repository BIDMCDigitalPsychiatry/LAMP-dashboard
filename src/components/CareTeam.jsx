
// Core Imports
import React, { useState } from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import { useTheme } from '@material-ui/core/styles'

// Local Imports
import AvatarCircleGroup from './AvatarCircleGroup'
import Messages from './Messages'

// eslint-disable-next-line
const addAccountIndex = ({ id, accounts, addAccount, handleAdd }) => handleAdd(accounts.length - 1)
const addAccount = ({ id, addAccount, handleAdd }) => handleAdd()
var currentTheme = {} // FIXME
var accounts = (onClick = addAccount) => [
  { id: 0, name: "0", email: "test0@test.com", tooltip: 'You', children: ['ME'], style: { background: currentTheme.palette.primary.main } },
  { id: 1, name: "1", email: "test1@test.com", tooltip: 'Family Member', image: "https://uploads-ssl.webflow.com/5d321d55bdb594133bc03c07/5d55ab4fa082a5194a78925e_Aditya-p-800.jpeg" },
  { id: 2, name: "2", email: "test2@test.com", tooltip: 'Psychiatrist', image: "https://uploads-ssl.webflow.com/5d321d55bdb594133bc03c07/5d7958ecfedbb68c91822af2_00100dportrait_00100_W9YBE~2-p-800.jpeg" },
  { id: 3, name: "3", email: "test3@test.com", tooltip: 'Clinician', image: "https://uploads-ssl.webflow.com/5d321d55bdb594133bc03c07/5d7958d426acc67ee9e80527_00100dportrait_00100_eqH1k~2-p-800.jpeg" },
  { id: 4, name: "4", email: "test4@test.com", tooltip: 'Family Member', image: "https://uploads-ssl.webflow.com/5d321d55bdb594133bc03c07/5d8296b8eb8133e6074ec808_a_r%20copy-p-800.jpeg" },
  { id: 5, name: "5", email: "test5@test.com", tooltip: 'Psychiatrist', image: "https://uploads-ssl.webflow.com/5d321d55bdb594133bc03c07/5d55aa09aaff48c0af1f7b1a_John-p-800.jpeg" },
  { id: 6, name: "6", email: "test6@test.com", tooltip: 'Physician', image: "https://uploads-ssl.webflow.com/5d321d55bdb594133bc03c07/5d55ae18dd4be9bedc79ea69_Elena.jpg" },
  { id: 7, name: "7", email: "test7@test.com", tooltip: 'Family Member', image: "https://uploads-ssl.webflow.com/5d321d55bdb594133bc03c07/5d55ab00dd4be939b579b48f_Hannah-p-800.jpeg" },
  { id: 8, name: "8", email: "test8@test.com", tooltip: 'Family Member', image: "https://uploads-ssl.webflow.com/5d321d55bdb594133bc03c07/5d55ab6edd4be90af479b773_Phil-p-800.jpeg" },
  { id: 9, name: "+", onClick, tooltip: 'Add a family member.', children: ['+'], style: { background: currentTheme.palette.secondary.main } }
]

export default function CareTeam({ participant, ...props }) {
    const [showMessaging, setShowMessaging] = useState(false)

    currentTheme = useTheme() // FIXME

	return (
		<React.Fragment>
	        <Grid container direction="row" justify="space-between" spacing={2}>
	            <Grid container item direction="column" spacing={1} alignItems="start" style={{ maxWidth: 450 }}>
	                <Grid item>
	                    <Typography variant="h2" gutterBottom>
	                        Meet your care team.
	                    </Typography>
	                    <Typography variant="subtitle1">
	                        Your care team consists of your clinicians and family members you'd like to grant access to your data. 
	                        To add a family member, press the (+) icon to the right. 
	                    </Typography>
	                </Grid>
	                <Grid item>
	                    <Button variant="outlined" color="secondary" onClick={() => setShowMessaging(x => !x)}>
	                        {showMessaging ? 'Hide' : 'Show'} my conversations
	                    </Button>
	                </Grid>
	            </Grid>
	            <Grid item style={{ margin: 32 }}>
	                <AvatarCircleGroup accounts={accounts()} />
	            </Grid>
	        </Grid>
	        <Collapse in={showMessaging} collapsedHeight={0}>
	            <Messages participantOnly participant={participant.id} style={{ margin: -16 }} />
	        </Collapse>
        </React.Fragment>
	)
}