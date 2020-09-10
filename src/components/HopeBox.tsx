import React from "react"
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles"
import GridList from "@material-ui/core/GridList"
import GridListTile from "@material-ui/core/GridListTile"
import { ReactComponent as HopeBoxHeader } from "../icons/HopeBoxHeader.svg"

import { Typography, AppBar, Toolbar, IconButton, Icon, Grid } from "@material-ui/core"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-around",
      overflow: "hidden",
      backgroundColor: theme.palette.background.paper,
    },
    singletile: { padding: "0 8px 15px 8px  !important", "& div": { borderRadius: 10 } },

    gridList: {
      width: "100%",
      height: "100%",
      padding: "0 10px",
    },

    toolbardashboard: {
      minHeight: 65,
      padding: "0 10px",

      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "center",
        fontWeight: "600",
        fontSize: 18,
        width: "calc(100% - 96px)",
      },
    },
  })
)

const tileData = [
  {
    img: "https://www.success.com/wp-content/uploads/legacy/sites/default/files/new2.jpg",
    title: "Motivation",
    author: "BrainyQuote",
    featured: true,
  },
  {
    img: "https://i.pinimg.com/originals/38/93/be/3893be88133b4a0c306e6950aaac4e1b.jpg",
    title: "Happiness",
    author: "director90",
  },
  {
    img: "https://cdn2.vectorstock.com/i/1000x1000/98/21/mental-health-quotes-type-vector-22179821.jpg",
    title: "Feelings",
    author: "Danson67",
  },
  {
    img:
      "https://cdn4.vectorstock.com/i/1000x1000/75/33/inspirational-quotes-for-mental-health-day-vector-21917533.jpg",
    title: "Not Alone",
    author: "fancycrave1",
    featured: true,
  },
  {
    img: "https://www.guidingeyes.org/wp-content/uploads/2020/01/1-1.jpg",
    title: "Dog",
    author: "Hans",
  },
  {
    img: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/life-quotes-albert-einstein-1561406885.png",
    title: "Quote",
    author: "fancycravel",
  },
  {
    img:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRTs7YrFRD-q0rdaMBN--nPgSXSUA0d2mkouEGTZzY4rfbp-_k3&usqp=CAU",
    title: "",
    author: "jill111",
  },
  {
    img: "https://cdn.mos.cms.futurecdn.net/ntFmJUZ8tw3ULD3tkBaAtf.jpg",
    title: "Mountain",
    author: "BkrmadtyaKarki",
  },
  {
    img:
      "https://www.oberlin.edu/sites/default/files/styles/width_760/public/content/office/health-promotion/images/health_promotion_wellness.png?itok=U-NLXXza",
    title: "Wellness",
    author: "PublicDomainPictures",
  },
  {
    img:
      "https://images.theconversation.com/files/194855/original/file-20171115-19836-uy2yzs.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1200&h=1200.0&fit=crop",
    title: "Candle",
    author: "congerdesign",
  },
  {
    img: "https://material-ui.com/static/images/grid-list/star.jpg",
    title: "Sea star",
    author: "821292",
  },
  {
    img: "https://material-ui.com/static/images/grid-list/bike.jpg",
    title: "Bike",
    author: "danfador",
  },
]
export default function HopeBox({ ...props }) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <AppBar position="static" style={{ background: "#FBF1EF", boxShadow: "none" }}>
        <Toolbar className={classes.toolbardashboard}>
          <IconButton color="default" onClick={props.onComplete} aria-label="Menu">
            <Icon>arrow_back</Icon>
          </IconButton>
          <Typography variant="h5">Hope Box</Typography>
        </Toolbar>
        <HopeBoxHeader />
      </AppBar>
      <GridList cellHeight={180} spacing={2} className={classes.gridList} cols={3}>
        {tileData.map((tile) => (
          <GridListTile key={tile.img} cols={1} className={classes.singletile}>
            <img src={tile.img} alt={tile.title} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  )
}
