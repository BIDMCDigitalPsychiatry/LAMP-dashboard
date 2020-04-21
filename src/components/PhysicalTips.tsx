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
              image="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Exercise
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Exercise has the ability to ease stress, improve mood, and minimize chronic pain. Working out is proven
                to improve and normalize the neurotransmitter levels in your body. Neurotransmitter levels increased by
                exercise include serotonin, dopamine, and norepinephrine. This increase in neurotransmitters has a
                positive impact on your mental health.
              </Typography>
              <Link href="https://kids.frontiersin.org/article/10.3389/frym.2019.00035">More information</Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1554140426-5e830b73a5e8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Drink Water
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                "Drink a glass of water as soon as you wake up" - Vandana R. Sheth, RDN. Improve your mornings by
                drinking a cup of water when you wake up. Your body is usually dehydrated from sleeping and this small
                act can help you start the day feeling energized.
              </Typography>
              <Link href="https://www.womenshealthmag.com/health/a24886599/self-care-routine-tips/">
                More information
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1495837174058-628aafc7d610?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Have a one-minute dance party!
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                We can be so busy every day that we forget to move around and have fun. Take this time to put on your
                favorite song and get moving! You can do this on your own, with a friend, or a family member.
              </Typography>
              <Link href="https://www.womenshealthmag.com/health/a24886599/self-care-routine-tips/">
                More information
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1487956382158-bb926046304a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Have you moved today?
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Sometimes we get so caught up in our daily routine that we forget to be active. If you don’t have time
                in your schedule for exercising today, try going on a short stroll to stretch your legs. Even this
                little bit of exercise a few times a day can have a positive impact on your health. Over time, increase
                the amount of time you dedicate to exercising. The more you do, the more benefits you will gain.
              </Typography>
              <Link href="https://www.helpguide.org/articles/healthy-living/the-mental-health-benefits-of-exercise.htm">
                More information
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1464618055434-20b22e97995a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                How many steps did you get today?
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Your smartphone can help you track how many steps you have taken. Try guessing how many steps you have
                taken today, then check your step-count estimate on your phone. Did you take more or less steps than you
                thought you did? This week, set a goal to increase your amount of steps. You can accomplish this by
                taking the stairs instead of the elevator, or walking a pet. Get creative! Check your step-count to see
                if you are hitting your goal.
              </Typography>
              <Link href="https://www.howtogeek.com/238904/how-to-track-your-steps-with-just-an-iphone-or-android-phone/">
                Steps on how to to check your step-count on an iPhone or Android
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1512314889357-e157c22f938d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Exercise can improve your memory
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Endorphins are hormones in our body that are released during exercise. They are known for making you
                feel good, but they also help you concentrate. Working out also helps prevent memory loss from old age.
              </Typography>
              <Link href="https://www.helpguide.org/articles/healthy-living/the-mental-health-benefits-of-exercise.htm">
                More information
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1495364141860-b0d03eccd065?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Too tired or stressed to exercise?
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Exercise can actually increase your energy and make you feel less tired. The next time you feel too
                exhausted to exercise, push yourself to just do 5 minutes. Examples of how you can spend this time
                include walking, jumping rope, and at-home exercises. See how you feel after 5 minutes. You might be
                surprised to find that you can go even longer.
              </Typography>
              <Link href="https://www.helpguide.org/articles/healthy-living/the-mental-health-benefits-of-exercise.htm">
                More information{" "}
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Don’t compare yourself to others
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Everyone is on a unique fitness journey so do not compare yourself to someone at a different fitness
                level. No matter your current shape, there are always others who have a similar goal as you. Try
                following along to workout videos online. Doing exercises in private can help you build the confidence
                you need to further your fitness journey.
              </Typography>
              <Link href="https://www.helpguide.org/articles/healthy-living/the-mental-health-benefits-of-exercise.htm">
                More information
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1473221326025-9183b464bb7e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Working out can be fun!
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Exercise should be a pleasant experience, especially when you are just getting started. Think about what
                exercise-related activities bring you joy. Maybe you love gardening, walking along the beach, or playing
                fetch with a dog. These activities are fun and get you moving. Brainstorm three activities that you
                enjoy and get you moving.
              </Typography>
              <Link
                href="https://www.helpguide.org/articles/healthy-living/the-mental-health-benefits-of-exercise.htm
"
              >
                More information
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Invite someone to exercise with you
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Having company while exercising can make the activity more enjoyable. This sense of companionship will
                motivate you to complete your workout routine. Set up a date and time with a friend, roommate, or family
                member this week. Having a date scheduled will help hold you accountable.
              </Typography>
              <Link href="https://www.helpguide.org/articles/healthy-living/the-mental-health-benefits-of-exercise.htm">
                More information
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1562771379-eafdca7a02f8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Stretch to calm your mind
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                When we get stressed out, the muscles in our body tense up. This is because our muscles are reacting to
                our emotional stress. Release this tension by stretching your neck, shoulders, and back. While you
                stretch, focus on mindfulness exercises or listen to calming sounds to relax your mind.
              </Typography>
              <Link href="https://www.healthline.com/health/benefits-of-stretching#safety-tips">More information</Link>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Box>
  )
}
