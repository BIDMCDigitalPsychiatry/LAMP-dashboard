import React from "react"
import {
  Typography,
  makeStyles,
  Box,
  Link,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Grid,
} from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  root2: {
    maxWidth: 345,
    minWidth: 344,
    margin: "16px",
    maxLength: 500,
  },
  media: {
    height: 500,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}))

export default function BookRecommendations({ ...props }) {
  const classes = useStyles()
  return (
    <Grid container direction="row">
      <Box p={4} my={4} width="100%">
        <Grid container direction="row" alignItems="stretch">
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images-na.ssl-images-amazon.com/images/I/81mOUEyj--L.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  What Doesn't Kill Us: The New Psychology of Posttraumatic Growth
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  "For the past twenty years, pioneering psychologist Stephen Joseph has worked with survivors of
                  trauma. His studies have yielded a startling discovery: that a wide range of traumatic events—from
                  illness, divorce, separation, assault, and bereavement to accidents, natural disasters, and
                  terrorism—can act as catalysts for positive change. Boldly challenging the conventional wisdom about
                  trauma and its aftermath, Joseph demonstrates that rather than ruining one's life, a traumatic event
                  can actually improve it."
                </Typography>
                <Link href=" https://www.amazon.com/What-Doesnt-Kill-Psychology-Posttraumatic/dp/0465032338">
                  Link to purchase
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images-na.ssl-images-amazon.com/images/I/71lfLzC9D8L.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  An Unquiet Mind
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  "Here Jamison examines bipolar illness from the dual perspectives of the healer and the healed,
                  revealing both its terrors and the cruel allure that at times prompted her to resist taking
                  medication. An Unquiet Mind is a memoir of enormous candor, vividness, and wisdom—a deeply powerful
                  book that has both transformed and saved lives."
                </Typography>
                <Link href="https://www.amazon.com/Unquiet-Mind-Memoir-Moods-Madness/dp/0679763309">
                  Link to purchase
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Box>
    </Grid>
  )
}
