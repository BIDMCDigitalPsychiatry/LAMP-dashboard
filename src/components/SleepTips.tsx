// Core Imports
import React from "react"
import {
  Typography,
  Link,
  makeStyles,
  Box,
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  CardContent,
} from "@material-ui/core"

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
    height: 200,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}))
export default function SleepTips({ ...props }) {
  const classes = useStyles()

  return (
    <Box p={4} my={4} width="100%">
      <Grid container direction="row" alignItems="stretch">
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://cdn.shopify.com/s/files/1/1140/3964/products/AC08-BL-Blue-Retro-Alarm-Clock-UPDATE_1200x1200.jpg?v=1571269433"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Weekends
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Dr. Epstein explains that psychiatric and psychological problems can be related to sleep. To improve
                your sleep, try sticking to a sleep schedule even on the weekends. If you sleep in on the weekends, it
                will be difficult to get back to your routine during the week. Waking up within the same hour everyday
                can help both your physical and mental health over time. For the next seven days, try waking up at the
                same time every day.
              </Typography>
              <Link href="https://www.insider.com/things-that-are-not-helping-your-mental-health-2018-9#those-retail-therapy-sessions-might-make-you-feel-poor-in-more-ways-than-one-5">
                More information
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://cdn.newsapi.com.au/image/v1/76826605623796ad4bf6016ffab69172"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                7-9 Hours
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Adults are recommended to have 7-9 hours of sleep without interruption [National Sleep Foundation].
                Think about how many hours of sleep you get every night. Is this more or less than 7-9 hours? Sleeping
                this suggested amount can make you feel rejuvenated, motivated, and focused during the day. A lack of
                sleep can negatively impact your mood. Try sleeping the suggested amount of sleep tonight and note how
                you feel when you wake up.
              </Typography>
              <Link href="https://www.forbes.com/sites/nomanazish/2018/09/25/how-to-overcome-mental-fatigue-according-to-an-expert/#1dd602164454">
                More information
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://www.uos.ac.uk/sites/www.uos.ac.uk/files/styles/blog_article_main_image/public/studybreaks.jpg?itok=OklwfD8V"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Take Breaks
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Taking intermittent breaks can help you feel rejuvenated throughout the day. Dr. Boyes explains that
                “taking breaks help prevent tunnel vision.” A break can clear your mind. Taking time for yourself can
                make you more productive. Try to take a few 10-minute breaks today and reflect on how you feel.
              </Typography>
              <Link href="https://www.forbes.com/sites/nomanazish/2018/09/25/how-to-overcome-mental-fatigue-according-to-an-expert/#3b51c9751644">
                More information
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Box>
  )
}
