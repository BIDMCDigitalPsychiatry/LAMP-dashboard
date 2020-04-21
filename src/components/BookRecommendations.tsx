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
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images-na.ssl-images-amazon.com/images/I/51r0fm0Y82L._SX332_BO1,204,203,200_.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  The Center Cannot Hold: My Journey Through Madness
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  “The Center Cannot Hold is the eloquent, moving story of Elyn's life, from the first time that she
                  heard voices speaking to her as a young teenager, to attempted suicides in college, through learning
                  to live on her own as an adult in an often terrifying world. Saks discusses frankly the paranoia, the
                  inability to tell imaginary fears from real ones, the voices in her head telling her to kill herself
                  (and to harm others), as well as the incredibly difficult obstacles she overcame to become a highly
                  respected professional. This beautifully written memoir is destined to become a classic in its genre.”
                </Typography>
                <Link href="https://www.amazon.com/Center-Cannot-Hold-Journey-Through-ebook/dp/B000WHVRZS/ref=sr_1_1?dchild=1&keywords=The+Center+Cannot+Hold%3A+My+Journey+Through+Madness&qid=1587412282&sr=8-1">
                  Link to purchase
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images-na.ssl-images-amazon.com/images/I/51auWyHmnpL._SX323_BO1,204,203,200_.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  The Quiet Room: A Journey Out of the Torment of Madness
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  "At 17, Lori Schiller was the perfect child - the only daughter of an affluent, close-knit family. Six
                  years later she made her first suicide attempt, then wandered the streets of New York City dressed in
                  ragged clothes, tormenting voices crying out in her mind. Lori Schiller had entered the horrifying
                  world of full-blown schizophrenia. She began an ordeal of hospitalizations, halfway houses, relapses,
                  more suicide attempts, and constant, withering despair. But against all odds, she survived. In this
                  personal account, she tells how she did it, taking us not only into her own shattered world, but
                  drawing on the words of the doctors who treated her and family members who suffered with her."
                </Typography>
                <Link href="https://www.amazon.com/Quiet-Room-Journey-Torment-Madness/dp/B07CGXSW9W/ref=sr_1_1?dchild=1&keywords=The+Quiet+Room%3A+A+Journey+Out+of+the+Torment+of+Madness&qid=1587412330&sr=8-1">
                  Link to purchase
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images-na.ssl-images-amazon.com/images/I/81ca%2BpJwMxL.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Touched with Fire: Manic-Depressive Illness and the Artistic Temperament
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  “The anguished and volatile intensity associated with the artistic temperament was once thought to be
                  a symptom of genius or eccentricity peculiar to artists, writers, and musicians. Her work, based on
                  her study as a clinical psychologist and researcher in mood disorders, reveals that many artists
                  subject to exalted highs and despairing lows were in fact engaged in a struggle with clinically
                  identifiable manic-depressive illness.”
                </Typography>
                <Link href="https://www.amazon.com/Touched-Fire-Manic-depressive-Artistic-Temperament-ebook/dp/B001D1YCM2/ref=sr_1_1?dchild=1&keywords=Touched+with+Fire%3A+Manic-Depressive+Illness+and+the+Artistic+Temperament&qid=1587412403&s=audible&sr=8-1">
                  Link to purchase
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images-na.ssl-images-amazon.com/images/I/51qWDnalDgL._SX326_BO1,204,203,200_.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Manic: A Memoir
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  “In bursts of prose that mirror the devastating highs and extreme lows of her illness, Cheney
                  describes her roller-coaster life with shocking honesty - from glamorous parties to a night in jail;
                  from flying 14 kites off the edge of a cliff in a thunderstorm to crying beneath her office desk; from
                  electroshock therapy to a suicide attempt fueled by tequila and prescription painkillers. With Manic,
                  Cheney gives voice to the unarticulated madness she endured.”
                </Typography>
                <Link href="https://www.amazon.com/Manic-A-Memoir/dp/B07BR6GT34/ref=sr_1_2?dchild=1&keywords=Manic%3A+A+Memoir&qid=1587412462&sr=8-2">
                  Link to purchase
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images-na.ssl-images-amazon.com/images/I/71QdJeC0ZXL.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Night Falls Fast
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  “An internationally acknowledged authority on depressive illnesses, Dr. Jamison has also known suicide
                  firsthand: after years of struggling with manic-depression, she tried at age 28 to kill herself.
                  Weaving together a historical and scientific exploration of the subject with personal essays on
                  individual suicides, she brings not only her remarkable compassion and literary skill but also all of
                  her knowledge and research to bear on this devastating problem. This is a book that helps us to
                  understand the suicidal mind, to recognize and come to the aid of those at risk, and to comprehend the
                  profound effects on those left behind. It is critical listening for parents, educators, and anyone
                  wanting to understand this tragic epidemic.”
                </Typography>
                <Link href="https://www.amazon.com/Night-Falls-Fast-Understanding-Suicide/dp/B07VC9HXS6/ref=sr_1_1?dchild=1&keywords=Night+Falls+Fast+%28Suicide%29&qid=1587412552&s=audible&sr=1-1">
                  Link to purchase
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images-na.ssl-images-amazon.com/images/I/71oE1a7BYYL.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  The Body Keeps the Score: Brain, Mind, and Body in the healing of Trauma
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  “A pioneering researcher and one of the world’s foremost experts on traumatic stress offers a bold new
                  paradigm for healing Trauma is a fact of life. Veterans and their families deal with the painful
                  aftermath of combat; one in five Americans has been molested; one in four grew up with alcoholics; one
                  in three couples have engaged in physical violence. Such experiences inevitably leave traces on minds,
                  emotions, and even on biology. Sadly, trauma sufferers frequently pass on their stress to their
                  partners and children. Renowned trauma expert Bessel van der Kolk has spent over three decades working
                  with survivors. In The Body Keeps the Score, he transforms our understanding of traumatic stress,
                  revealing how it literally rearranges the brain’s wiring - specifically areas dedicated to pleasure,
                  engagement, control, and trust. He shows how these areas can be reactivated through innovative
                  treatments including neuro feedback, mindfulness techniques, play, yoga, and other therapies.”
                </Typography>
                <Link href="https://www.amazon.com/Body-Keeps-Score-Healing-Trauma/dp/B00OBT7KAO/ref=sr_1_1?dchild=1&keywords=The+Body+Keeps+the+Score%3A+Brain%2C+Mind%2C+and+Body+in+the+healing+of+Trauma&qid=1587412590&s=audible&sr=1-1">
                  Link to purchase
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images-na.ssl-images-amazon.com/images/I/51kPsWzROjL.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Trauma and Recovery
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  “Trauma and Recovery is revered as the seminal text on understanding trauma survivors. By placing
                  individual experience in a broader political frame, Harvard psychiatrist Judith Herman argues that
                  psychological trauma is inseparable from its social and political context. Drawing on her own research
                  on incest, as well as a vast literature on combat veterans and victims of political terror, she shows
                  surprising parallels between private horrors like child abuse and public horrors like war.”
                </Typography>
                <Link href="https://www.amazon.com/Trauma-Recovery-Aftermath-Violence-Political/dp/B081TPMLRT/ref=sr_1_1?dchild=1&keywords=trauma+and+recovery&qid=1587412647&s=audible&sr=1-1">
                  Link to purchase
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={classes.root2}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image="https://images-na.ssl-images-amazon.com/images/I/41H3QuwjI0L._SX332_BO1,204,203,200_.jpg"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  Supersurvivors: The Surprising Link Between Suffering and Success
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  “Starting where resiliency studies leave off, two psychologists explore the science of remarkable
                  accomplishment in the wake of trauma, revealing the surprising principles that allow people to
                  transform their lives and achieve extraordinary things.”
                </Typography>
                <Link href="https://www.amazon.com/Supersurvivors-Surprising-Between-Suffering-Success-ebook/dp/B00FVW5G4M/ref=sr_1_1?dchild=1&keywords=Supersurvivors%3A+The+Surprising+Link+Between+Suffering+and+Success&qid=1587412741&s=instant-video&sr=8-1">
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
