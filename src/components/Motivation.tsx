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

export default function Motivation({ ...props }) {
  const classes = useStyles()

  return (
    <Grid container direction="row">
      <Box p={4} my={4} width="100%">
        <Grid container direction="row" alignItems="stretch">
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images.unsplash.com/photo-1520170851591-43094f4d218e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  "You may encounter many defeats but you must not be defeated." <br /> Dr. Maya Angelou
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images.unsplash.com/photo-1529528744093-6f8abeee511d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  "Once you replace negative thoughts with positive ones, you'll start having positive results." <br />
                  Willie Nelson
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images.unsplash.com/photo-1486673748761-a8d18475c757?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  "Your present circumstances don't determine where you can go; they merely determine where you start."
                  <br />
                  Nido Qubein
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images.unsplash.com/photo-1458014854819-1a40aa70211c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  "Every day begins with an act of courage and hope: getting out of bed." <br /> Mason Cooley
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images.unsplash.com/photo-1534577403868-27b805ca4b9c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  "This feeling will pass. The fear is real but the danger is not." <br /> Cammie McGovern
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  "Your illness is not your identity. Your chemistry is not your character." <br /> Pastor Rick Warren
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images.unsplash.com/photo-1517014398630-12a36115e4f5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  "One small crack does not mean that you are broken, it means that you were put to the test and you
                  didn't fall apart." <br /> Linda Poindexter
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Box>
    </Grid>
  )
}
