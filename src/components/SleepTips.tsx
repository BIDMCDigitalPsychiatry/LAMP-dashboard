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
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Memory and learning are connected to sleep
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                The deepest stage of sleep is known as Rapid Eye Movement (REM). This stage of sleep affects the parts
                of the brain that are used for learning. Research shows that people deprived of REM sleep struggle with
                recalling what they have learned. Uninterrupted sleep can help you think more clearly and remember more.
              </Typography>
              <Link href="https://www.neurocorecenters.com/blog/10-facts-might-not-know-sleep-mental-health">
                More information
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Avoid caffeine before bed
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Caffeine is a stimulant that helps people feel alert. It is found in coffee, tea, chocolate, and more.
                Although caffeine is safe to consume, it takes hours for half of it to be removed from the body. Having
                food or drinks with high levels of caffeine close to your bedtime can make you feel anxious, irritable,
                and disturb your sleep entirely. Get a more restful sleep by stopping your caffeine intake a few hours
                before bed.
              </Typography>
              <Link href="https://www.sleepfoundation.org/articles/caffeine-and-sleep">More information</Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Use your bedroom only for sleep
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Treat your bed and bedroom as your sanctuary. It is your safe space away from all of the stresses in
                your life. Try not to work or use electronics in your bedroom. Over time the brain will learn to
                associate the room or the bed with sleeping, and therefore, makes it easier for you to fall asleep.
              </Typography>
              <Link href="https://www.sleepfoundation.org/press-release/americans-bedrooms-are-key-better-sleep-according-new-national-sleep-foundation-poll">
                More information
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Establish a regular bedtime routine
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Routines help promote health and wellness. Think about the kind of bedtime routine that would help you
                feel more relaxed before bed. Whether it’s not using electronics after a certain time or taking a warm
                bath before bed, doing the same thing every night will help your brain and body know it’s time to rest.
                Other examples include reading a book, meditating, and journaling.
              </Typography>
              <Link href="https://www.sleepfoundation.org/articles/caffeine-and-sleep">More information</Link>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Box>
  )
}
