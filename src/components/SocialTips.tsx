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
              image="https://www.chparks.com/ImageRepository/Document?documentID=181"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Go Outside
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Going outside for just 20 minutes a day can improve your mood. The fresh air can increase your ability
                to stay focused and your attention span. The time spent outside can give your mind relief, encourage
                exercise, and provide room to socialize. Whether it’s going to the store or going to the mailbox, try to
                leave the house.
              </Typography>
              <Link href="https://earthobservatory.nasa.gov/images/145305/green-space-is-good-for-mental-health">
                More information
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://kajabi-storefronts-production.global.ssl.fastly.net/kajabi-storefronts-production/blogs/11694/images/XB4FWEKPSoGAxk6l99Bx_file.jpg"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Emotional Connections
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Research shows that social support can improve both mental and general health. Make a commitment to meet
                up with or contact someone this week. To connect with people far away, consider using web-based methods
                of communication such as social media, email, or text.
              </Typography>
              <Link href="https://www.mhanational.org/stay-connected">More information</Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://marketingland.com/wp-content/ml-loads/2016/08/social-media-mobile-icons-snapchat-facebook-instagram-ss-800x450-3-800x450.jpg"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Social Media
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Social connections with others can bring joy, prevent loneliness and depression, and ease stress. Today,
                social media is one of the main ways people stay connected. Although social media can enable you to stay
                in contact with friends and family, it can sometimes lead to feelings of inadequacy and isolation. This
                week use an app to track how much time you spend on social media each day. Then, set a goal to reduce
                this number. At the end of the week, reflect on your mood and the impact this modification has had.
              </Typography>
              <Link href="https://www.helpguide.org/articles/mental-health/social-media-and-mental-health.htm">
                More information
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1545396047-67fb8c80f6e5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Family and friends
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Connect with family and friends either in-person or virtually through a call, text, or video chat.
              </Typography>
              <Link href="https://www.purewow.com/wellness/ways-to-mitigate-anxiety?amphtml=true">
                More information
              </Link>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card className={classes.root2}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image="https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                Increase social interactions
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Low level of social interaction was found to have an impact on lifespan equivalent to smoking nearly a
                pack of cigarettes a day or being an alcoholic, and was twice as harmful as being obese.
              </Typography>
              <Link href="https://www.mhanational.org/stay-connected">More information</Link>
            </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    </Box>
  )
}
