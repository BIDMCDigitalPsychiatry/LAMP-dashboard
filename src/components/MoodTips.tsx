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
  CardContent,
  Link,
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
                <Link href="https://positivepsychology.com/hope-therapy/">More information</Link>
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
                <Link href="https://positivepsychology.com/hope-therapy/">More information</Link>
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
                image="https://images.unsplash.com/photo-1495573258723-2c7be7a646ce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1651&q=80"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Don't be so hard on yourself
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Accept that you are going to make mistakes. No one is expected to be perfect, so try to give yourself
                  grace. Next time you are feeling down about something you did, reroute your energy to focus on how you
                  learned or grew from this experience.
                </Typography>
                <Link href="https://www.lifehack.org/articles/communication/10-great-lessons-highly-successful-people-have-learned-from-failure.html">
                  More information
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images.unsplash.com/photo-1505455184862-554165e5f6ba?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Forgiveness
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Don't let your past control your future. To get into the mindset of forgiveness, begin by focusing
                  your attention to your breath. Doing so will help you be present in the moment. Think about someone
                  you hope to forgive and recite what you are forgiving them for doing. You may not feel immediate
                  relief, but after a few times the hope is to remove some negativity from your life.
                </Typography>
                <Link href="https://tinybuddha.com/blog/steps-let-go-stress-negativity-emotional-pain/">
                  More information
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images.unsplash.com/photo-1489367874814-f5d040621dd8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Think of something that makes you laugh
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Humor has a way of lifting spirits. If you can't remember a funny moment, take a few minutes today to
                  watch a funny video online. Laughter not only inspires hope, but it can also help minimize stress and
                  pain. Humor can also connect people. If you find a funny video or meme, share it with someone you
                  know.
                </Typography>
                <Link href="https://www.mentalhelp.net/blogs/how-to-be-more-hopeful/">More information</Link>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images.unsplash.com/photo-1544027993-37dbfe43562a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Do something for someone else
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Being a helping hand not only benefits the person you are assisting, but it can also help you feel
                  better about yourself. SAMHSA describes vocational wellness as the ability to feel fulfilled and
                  satisfied from the work we do. Work encompasses more than a paid occupation, it can involve volunteer
                  work and internships. Think about ways that you can volunteer your time this week to help someone. You
                  can do extra chores or you can volunteer at the local animal shelter. There is no right or wrong
                  activity to choose. Whatever you choose, commit to it. Afterwards, reflect on how you feel. This is a
                  great way to build self-esteem.
                </Typography>
                <Link href="https://www.goodtherapy.org/blog/8-dimensions-of-wellness-where-do-you-fit-in-0527164">
                  More information
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Box>
    </Grid>
  )
}
