// Core Imports
import React from "react"
import {
  Typography,
  makeStyles,
  Box,
  Grid,
  Card,
  CardMedia,
  CardActionArea,
  Icon,
  CardContent,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
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
    <Grid container direction='row'>
      <Box p={4} my={4} width='100%'>
        <div className={classes.root}>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
              <Typography className={classes.heading}>Sleep</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container direction='row' alignItems='stretch'>
                <Card className={classes.root2}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image='https://cdn.shopify.com/s/files/1/1140/3964/products/AC08-BL-Blue-Retro-Alarm-Clock-UPDATE_1200x1200.jpg?v=1571269433'
                    />
                    <CardContent>
                      <Typography gutterBottom variant='h5' component='h2'>
                        Weekends
                      </Typography>
                      <Typography variant='body2' color='textSecondary' component='p'>
                        Dr. Epstein explains that psychiatric and psychological problems can be related to sleep. To
                        improve your sleep, try sticking to a sleep schedule even on the weekends. If you sleep in on
                        the weekends, it will be difficult to get back to your routine during the week. Waking up within
                        the same hour everyday can help both your physical and mental health over time. For the next
                        seven days, try waking up at the same time every day.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Card className={classes.root2}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image='https://cdn.newsapi.com.au/image/v1/76826605623796ad4bf6016ffab69172'
                    />
                    <CardContent>
                      <Typography gutterBottom variant='h5' component='h2'>
                        7-9 Hours
                      </Typography>
                      <Typography variant='body2' color='textSecondary' component='p'>
                        Adults are recommended to have 7-9 hours of sleep without interruption [National Sleep
                        Foundation]. Think about how many hours of sleep you get every night. Is this more or less than
                        7-9 hours? Sleeping this suggested amount can make you feel rejuvenated, motivated, and focused
                        during the day. A lack of sleep can negatively impact your mood. Try sleeping the suggested
                        amount of sleep tonight and note how you feel when you wake up.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Card className={classes.root2}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image='https://www.uos.ac.uk/sites/www.uos.ac.uk/files/styles/blog_article_main_image/public/studybreaks.jpg?itok=OklwfD8V'
                    />
                    <CardContent>
                      <Typography gutterBottom variant='h5' component='h2'>
                        Take Breaks
                      </Typography>
                      <Typography variant='body2' color='textSecondary' component='p'>
                        Taking intermittent breaks can help you feel rejuvenated throughout the day. Dr. Boyes explains
                        that “taking breaks help prevent tunnel vision.” A break can clear your mind. Taking time for
                        yourself can make you more productive. Try to take a few 10-minute breaks today and reflect on
                        how you feel.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
              <Typography className={classes.heading}>Social</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container direction='row' alignItems='stretch'>
                <Card className={classes.root2}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image='https://www.chparks.com/ImageRepository/Document?documentID=181'
                    />
                    <CardContent>
                      <Typography gutterBottom variant='h5' component='h2'>
                        Go Outside
                      </Typography>
                      <Typography variant='body2' color='textSecondary' component='p'>
                        Going outside for just 20 minutes a day can improve your mood. The fresh air can increase your
                        ability to stay focused and your attention span. The time spent outside can give your mind
                        relief, encourage exercise, and provide room to socialize. Whether it’s going to the store or
                        going to the mailbox, try to leave the house.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Card className={classes.root2}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image='https://kajabi-storefronts-production.global.ssl.fastly.net/kajabi-storefronts-production/blogs/11694/images/XB4FWEKPSoGAxk6l99Bx_file.jpg'
                    />
                    <CardContent>
                      <Typography gutterBottom variant='h5' component='h2'>
                        Emotional Connections
                      </Typography>
                      <Typography variant='body2' color='textSecondary' component='p'>
                        Research shows that social support can improve both mental and general health. Make a commitment
                        to meet up with or contact someone this week. To connect with people far away, consider using
                        web-based methods of communication such as social media, email, or text.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Card className={classes.root2}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image='https://marketingland.com/wp-content/ml-loads/2016/08/social-media-mobile-icons-snapchat-facebook-instagram-ss-800x450-3-800x450.jpg'
                    />
                    <CardContent>
                      <Typography gutterBottom variant='h5' component='h2'>
                        Social Media
                      </Typography>
                      <Typography variant='body2' color='textSecondary' component='p'>
                        Social connections with others can bring joy, prevent loneliness and depression, and ease
                        stress. Today, social media is one of the main ways people stay connected. Although social media
                        can enable you to stay in contact with friends and family, it can sometimes lead to feelings of
                        inadequacy and isolation. This week use an app to track how much time you spend on social media
                        each day. Then, set a goal to reduce this number. At the end of the week, reflect on your mood
                        and the impact this modification has had.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<Icon>expand_more</Icon>}>
              <Typography className={classes.heading}>Mood</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <Grid container direction='row' alignItems='stretch'>
                <Card className={classes.root2}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image='https://agingwithdignity.org/wp-content/uploads/2017/11/culture-of-hope.jpg'
                    />
                    <CardContent>
                      <Typography gutterBottom variant='h5' component='h2'>
                        Hope
                      </Typography>
                      <Typography variant='body2' color='textSecondary' component='p'>
                        What gives you hope? This can look different for everyone. For some it is gardening, for others
                        it is making progress towards a goal. Life always has its ups and downs, but hope can push us
                        through the low moments. Think about what makes you hopeful and cultivate it. Take a few minutes
                        to write about what gives you hope. Next time you feel down, look for what you wrote to remind
                        yourself that even when things get tough there is hope for a better day.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Card className={classes.root2}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image='https://content.linkedin.com/content/dam/me/learning/blog/2017/april/Goal-Setting.jpg'
                    />
                    <CardContent>
                      <Typography gutterBottom variant='h5' component='h2'>
                        Goals
                      </Typography>
                      <Typography variant='body2' color='textSecondary' component='p'>
                        Some goals can feel unattainable. To make the goal seem more reasonable follow these steps.
                        First, choose one goal you hope to achieve. Next, create a plan consisting of small actions that
                        move you closer to your goal. The last and most important step is to write down 3 short
                        statements to remind you that you are capable. For example, “I have potential.”
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
                <Card className={classes.root2}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image='https://s23916.pcdn.co/wp-content/uploads/2017/12/how-to-encourage-optimism-and-positive-thoughts-in-children.jpeg'
                    />
                    <CardContent>
                      <Typography gutterBottom variant='h5' component='h2'>
                        Optimism
                      </Typography>
                      <Typography variant='body2' color='textSecondary' component='p'>
                        Look at the glass half full today. Write down three things every day that weren't so bad. Try to
                        shift your focus from the bad to the good. This can help bring positivity into your life. Think
                        about what you're grateful for, such as the ability to walk, having a place to stay, and food to
                        eat.
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </Box>
    </Grid>
  )
}
