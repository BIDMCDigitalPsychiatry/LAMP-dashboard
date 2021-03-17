// Core Imports
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
import { useTranslation } from "react-i18next"

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
    height: 140,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}))
export default function Resources({ ...props }) {
  const classes = useStyles()
  const { t } = useTranslation()
  return (
    <Grid container direction="row">
      <Box p={4} my={4} width="100%">
        <Grid container direction="row" alignItems="stretch">
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/ca2246dc9b9d93d74e481c52903e7fea"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {t("Department of Mental Health (DMH)")}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {
                    //option for description text
                  }
                </Typography>
                <Link href="https://www.mass.gov/orgs/massachusetts-department-of-mental-health">
                  {t("Department of Mental Health (DMH)")}
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://media-exp1.licdn.com/dms/image/C4D1BAQF0aQaDZZqoBg/company-background_10000/0?e=2159024400&v=beta&t=wng_qIGKZEkBnziD9RRSdEB60m-o_yICs1EN5WL9wWE"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {t("National Alliance on Mental Illness (NAMI)")}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {
                    //option for description text
                  }
                </Typography>
                <Link href="https://www.nami.org/#">{t("National Alliance on Mental Illness (NAMI)")}</Link>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://media-exp1.licdn.com/dms/image/C4D1BAQF0aQaDZZqoBg/company-background_10000/0?e=2159024400&v=beta&t=wng_qIGKZEkBnziD9RRSdEB60m-o_yICs1EN5WL9wWE"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {t("NAMI Massachussetts")}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {
                    //option for description text
                  }
                </Typography>
                <Link href="https://namimass.org/">{t("NAMI Massachussetts")}</Link>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </Box>
    </Grid>
  )
}
