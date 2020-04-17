// Core Imports
import React from "react"
import { Typography, makeStyles, Box, Grid, Card, CardMedia, CardActionArea, CardContent } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  root2: {
    maxWidth: 345,
    margin: "16px",
    maxLength: 500,
  },
  media: {
    height: 140,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}))

export default function Tips({ ...props }) {
  const classes = useStyles()

  return (
    <Grid container direction="row">
      <Box p={4} my={4} width="100%">
        <Grid container direction="row" alignItems="stretch">
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://agingwithdignity.org/wp-content/uploads/2017/11/culture-of-hope.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Hope
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  What gives you hope? This can look different for everyone. For some it is gardening, for others it is
                  making progress towards a goal. Life always has its ups and downs, but hope can push us through the
                  low moments. Think about what makes you hopeful and cultivate it. Take a few minutes to write about
                  what gives you hope. Next time you feel down, look for what you wrote to remind yourself that even
                  when things get tough there is hope for a better day.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://content.linkedin.com/content/dam/me/learning/blog/2017/april/Goal-Setting.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Goals
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Some goals can feel unattainable. To make the goal seem more reasonable follow these steps. First,
                  choose one goal you hope to achieve. Next, create a plan consisting of small actions that move you
                  closer to your goal. The last and most important step is to write down 3 short statements to remind
                  you that you are capable. For example, “I have potential.”
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://s23916.pcdn.co/wp-content/uploads/2017/12/how-to-encourage-optimism-and-positive-thoughts-in-children.jpeg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Optimism
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Look at the glass half full today. Write down three things every day that weren't so bad. Try to shift
                  your focus from the bad to the good. This can help bring positivity into your life. Think about what
                  you're grateful for, such as the ability to walk, having a place to stay, and food to eat.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Box>
    </Grid>
  )
}
