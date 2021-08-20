import React from "react"
import {
  Box,
  LinearProgress,
  Typography,
  Card,
  Button,
  Grid,
  Switch,
  Icon,
  IconButton,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  Checkbox,
} from "@material-ui/core"
import { jsPDF } from "jspdf"
import vegaEmbed from "vega-embed"
import Vega from "./Vega"
import Editor from "./Editor"

export default function QueryRender(props) {
  if (props.loading && props.loading === true) {
    return (
      <Box style={{ flexGrow: 1, height: "100%", width: "100%" }}>
        <LinearProgress />
        <Typography>Please wait, your data is loading</Typography>
      </Box>
    )
  }

  function type(variable) {
    return Array.isArray(variable) ? "array" : typeof variable
  }

  //queryRes should be an array of objects
  //like what is returned from our calls below
  const saveVegaQueryResToPDF = async (queryRes, groupBy = "tag", graphsPerLine = 3, sortMethod = "height") => {
    let doc = new jsPDF()
    let name =
      groupBy === "tag"
        ? queryRes[0]["alias"]
          ? `${queryRes[0]["alias"]}_(${queryRes[0]["id"]})`
          : queryRes[0]["id"]
        : queryRes[0]["tag"]
    let cursorYLoc = 10
    doc.text(name, 10, cursorYLoc)
    let dateObj = new Date()
    let month = dateObj.getMonth() + 1 //months from 1-12
    let day = dateObj.getDate()
    let year = dateObj.getFullYear()
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    function numberSuffix(num) {
      if (num.toString().slice(-1) === "1" && num !== 11) return "st"
      else if (num.toString().slice(-1) === "2" && num !== 12) return "nd"
      else if (num.toString().slice(-1) === "3" && num !== 13) return "rd"
      else return "th"
    }

    //add date to upper right corner, adding new line if necessary
    let docHeight = doc.internal.pageSize.height
    let docWidth = doc.internal.pageSize.width
    let newdate = month + "_" + day + "_" + year
    let titleDate = `${dateObj.getHours()}:${dateObj.getMinutes()} ${monthNames[month - 1]} ${
      day.toString() + numberSuffix(day)
    }, ${year}`
    if (doc.getTextWidth(name + titleDate) > docWidth - 20) cursorYLoc += 10
    doc.text(titleDate, docWidth - doc.getTextWidth(titleDate) - 10, cursorYLoc)
    cursorYLoc += 10

    let chunkWidth = docWidth / graphsPerLine

    queryRes = queryRes.filter((elem) => elem["result"] !== null)
    const promises = []
    //add our queries in to array
    for (let index = 0; index < queryRes.length; index++) {
      let spec = queryRes[index]["result"]
      let canvas = document.createElement("div")
      canvas.id = "canvasID"
      promises.push(
        vegaEmbed(canvas, spec, {
          renderer: "canvas",
          actions: false,
        }).then(() => {
          let imgStream, cHeight, cWidth
          let targetCanvas = canvas.getElementsByTagName("canvas")[0]
          imgStream = targetCanvas.toDataURL("image/png")
          let imgHeight = targetCanvas.height
          let imgWidth = targetCanvas.width
          if (imgWidth >= imgHeight) {
            let scale = chunkWidth / imgWidth
            cHeight = scale * imgHeight
            cWidth = chunkWidth
          } else if (imgHeight > imgWidth) {
            let scale = chunkWidth / imgHeight
            cWidth = imgWidth * scale
            cHeight = chunkWidth
          }
          return {
            imgStream: imgStream,
            name: queryRes[index][groupBy].slice(queryRes[index][groupBy].lastIndexOf(".") + 1).replace("_graph", ""),
            width: cWidth,
            height: cHeight,
          }
        })
      )
    }
    //after promises complete, store all data in pdf
    Promise.all(promises).then((res) => {
      let graphArray
      switch (sortMethod) {
        case "height":
          graphArray = res.sort((x, y) => x.height - y.height)
          break
        case "width":
          graphArray = res.sort((x, y) => x.width - y.width)
          break
        default:
          graphArray = res
      }
      //res is now an array of images with 4 parameters we can use to build our pdf
      //So that we can chunk, we avoid using foreach. This is still tragic as I very much like foreach
      for (let i = 0; i < graphArray.length; i += graphsPerLine) {
        let singleLine = graphArray.slice(i, i + graphsPerLine)
        let maxHeight = singleLine.reduce((acc, x) => Math.max(acc, x.height), 0)

        //if we would overflow the page, we add a new one, and reset our cursor
        if (cursorYLoc + 15 + maxHeight > docHeight) {
          doc.addPage()
          cursorYLoc = 10
        }
        singleLine.forEach((spec, index) => {
          doc.text(spec.name, index * chunkWidth + (chunkWidth - doc.getTextWidth(spec.name)) / 2, cursorYLoc)
          doc.addImage(
            spec.imgStream,
            "PNG",
            index * chunkWidth + (chunkWidth - spec.width) / 2,
            cursorYLoc + 10,
            spec.width,
            spec.height
          )
        })
        cursorYLoc += maxHeight + 20
      }
      doc.save(`${name.replace(" ", "_")}_${newdate}.pdf`)
    })
  }

  //depending on the type of result, we can show different things!
  switch (type(props.queryResult)) {
    //arrays must be dealt with recursively
    //@ts-ignore: this fallthrough is intentional - if the array does not meet some specific conditions we
    // want to display it as a string anyway
    case "array":
      if (
        props.queryResult.filter((obj) => typeof obj === "object" && "result" in obj).length ===
        props.queryResult.length
      ) {
        //default is to display tags associated by ids
        const [groupByID, toggleGroupByID] = React.useState(true)

        const [displayMissingData, setDisplayMissingData] = React.useState(false)

        const [result, setResult] = React.useState(true)

        const [stringFilter, setStringFilter] = React.useState("")
        const filterRef = React.useRef(null)

        //set default scale to "Large"
        const [scale, setScale] = React.useState("6")

        //here, we calculate the size of the box containing the graph
        //this helps us determine which size options to display
        const boxRef = React.useRef(null)
        const [boxDimensions, setBoxDimensions] = React.useState({
          height: null,
          width: null,
        })
        const updateDimensions = () => {
          if (boxRef.current && boxRef.current.offsetWidth > 0) {
            setBoxDimensions({
              height: boxRef.current.offsetHeight,
              width: boxRef.current.offsetWidth,
            })
          }
        }
        let movement_timer = null
        React.useLayoutEffect(() => {
          updateDimensions()

          window.addEventListener("resize", () => {
            clearInterval(movement_timer)
            movement_timer = setTimeout(updateDimensions, 1000)
          })
        }, [])

        React.useEffect(() => {
          //if the window has become too narrow, we resize the graphs here

          if (typeof boxDimensions.width === "number" && boxDimensions.width < 400 && parseInt(scale) < 12)
            setScale("12")
          else if (typeof boxDimensions.width === "number" && boxDimensions.width < 550 && parseInt(scale) < 6)
            setScale("6")
          else if (typeof boxDimensions.width === "number" && boxDimensions.width < 700 && parseInt(scale) < 4)
            setScale("4")
        }, [boxDimensions])

        const handleChange = (event) => {
          setScale(event.target.value)
        }

        React.useEffect(() => {
          //Whether we sort by id or tag, let's pull the list here
          let filter = groupByID ? "id" : "tag"
          let subfilter = groupByID ? "tag" : "id"
          let targetList = props.queryResult.reduce(
            (acc, obj) => (acc.includes(obj[filter]) ? acc : acc.concat(obj[filter])),
            []
          )

          const adjustVegaTitle = (currentTitle) => {
            if (Array.isArray(currentTitle)) currentTitle = currentTitle.join(" ")

            //if there are multiple spaces in a row, replace them
            //with a single space
            currentTitle.replace(/ +/g, " ")
            //we get the width of each card
            let cardWidth = boxDimensions.width / (12 / parseInt(scale))
            return currentTitle.split(" ").reduce(
              (acc, elem) => {
                if (acc[acc.length - 1].length + elem.length > cardWidth / 11) {
                  acc.push("")
                }
                acc[acc.length - 1] = `${acc[acc.length - 1]} ${elem}`.replace(/ +/g, " ")
                return acc
              },
              [""]
            )
          }

          const formatName = (name) => {
            if (name.indexOf("lamp") !== -1) {
              name = name
                .slice(name.lastIndexOf(".") + 1)
                .replace(/_/g, " ")
                .replace(/gps/gi, "GPS")
            }
            let split = name.split(" ").map((elem) => elem.slice(0, 1).toUpperCase() + elem.slice(1))
            return split.reduce((acc, elem) => `${acc} ${elem}`, "").slice(1)
          }
          setResult(
            targetList.map((target) => {
              let selection = props.queryResult.filter((obj) => obj[filter] === target)

              //if all elements are null
              if (selection.length === selection.filter((obj) => obj["result"] === null).length && !displayMissingData)
                return null

              let targetName = groupByID
                ? selection[0]["alias"]
                  ? `${selection[0]["alias"]} (${target})`
                  : target
                : target

              if (stringFilter.length && groupByID && !(targetName.indexOf(stringFilter) !== -1)) return null

              const saveIndividualToPDF = async () => {
                await saveVegaQueryResToPDF(selection, subfilter)
              }

              return (
                <Card
                  key={`${targetName}-card`}
                  variant="outlined"
                  style={{ width: "100%", margin: "5px 0px 0px 0px" }}
                >
                  <Typography
                    style={{
                      marginLeft: "5px",
                      top: "3px",
                      position: "relative",
                      fontSize: "140%",
                      float: "left",
                    }}
                  >
                    <b>{formatName(targetName)}</b>
                  </Typography>

                  <Button style={{ float: "right" }} onClick={saveIndividualToPDF}>
                    Download PDF
                  </Button>
                  <Grid
                    container
                    spacing={3}
                    alignContent={"flex-start"}
                    style={{ height: "100%", width: "100%", margin: "5px 0" }}
                  >
                    {selection.map((elem) => {
                      if (elem["result"] == null && !displayMissingData) return null

                      let subFilterName
                      if (!groupByID) {
                        subFilterName = elem["alias"] ? `${elem["alias"]} (${elem[subfilter]})` : elem[subfilter]
                      } else {
                        subFilterName = elem[subfilter]
                      }

                      if (!groupByID && stringFilter.length && !(subFilterName.indexOf(stringFilter) !== -1))
                        return null

                      let result = elem["result"]
                      if (
                        elem["result"] !== null &&
                        typeof elem["result"] === "object" &&
                        "$schema" in elem["result"]
                      ) {
                        result = { ...elem["result"] }
                        result["width"] = "container"
                        //here, we attempt to make titles display better

                        if (result["layer"]) {
                          result.layer.forEach((layer) => {
                            if ("title" in layer && "text" in layer["title"]) {
                              layer["title"]["text"] = adjustVegaTitle(layer["title"]["text"])
                            }
                          })
                        } else {
                          if ("title" in result && "text" in result["title"]) {
                            result["title"]["text"] = adjustVegaTitle(result["title"]["text"])
                          }
                        }
                        //we alter the image height
                        result["height"] = `${50 * (parseInt(scale) / 3)}`
                      }
                      return (
                        <Grid
                          key={`${subFilterName}-box`}
                          item
                          //@ts-ignore: the only values this can return in normal use are 3,6,9,12 -- all valid
                          xs={parseInt(scale)}
                          style={{
                            flexGrow: 1,
                            width: "100%",
                            border: "1px solid black",
                          }}
                        >
                          <Typography>
                            <b
                              style={{
                                margin: "5px",
                                wordBreak: "break-all",
                              }}
                            >
                              {formatName(subFilterName)}
                            </b>
                          </Typography>
                          <QueryRender
                            key={`${subFilterName}-render`}
                            style={{ width: "100%", float: "top", paddingTop: "0%" }}
                            queryResult={result}
                          />
                        </Grid>
                      )
                    })}
                  </Grid>
                </Card>
              )
            })
          )
        }, [groupByID, displayMissingData, scale, props.queryResult, stringFilter])

        const setFilter = () => {
          let filterValue = filterRef.current.value
          if (!filterValue) {
            filterValue = ""
          }
          setStringFilter(filterValue)
        }

        const saveAllResults = async () => {
          let filter = groupByID ? "id" : "tag"
          let subfilter = groupByID ? "tag" : "id"
          let targetList = props.queryResult.reduce(
            (acc, obj) => (acc.includes(obj[filter]) ? acc : acc.concat(obj[filter])),
            []
          )
          targetList.forEach((target) => {
            let selection = props.queryResult.filter((obj) => obj[filter] === target)
            saveVegaQueryResToPDF(selection, subfilter)
          })
        }

        return (
          //@ts-ignore: We need to be able to reference this box to adjust sizing option availability
          <Box ref={boxRef} style={{ flexGrow: 1, height: "100%", width: "100%" }}>
            <div style={{ height: "70px", width: "100%", background: "white", margin: "0px 10px 0px 0px" }}>
              <div style={{ height: "60px", float: "left" }}>
                <Switch color="primary" checked={groupByID} onClick={() => toggleGroupByID(!groupByID)} />
                <Typography>Group by: {groupByID ? "ID#" : "Tag Name"}</Typography>
              </div>

              <div style={{ height: "60px", float: "left", margin: "-4px 0px 0px 20px" }}>
                <Checkbox checked={displayMissingData} onClick={() => setDisplayMissingData(!displayMissingData)} />
                <Typography>Show missing data</Typography>
              </div>

              <div style={{ height: "60px", float: "left" }}>
                <TextField
                  style={{ height: "0px", float: "left", margin: "10px 0px 0px 10px" }}
                  id="outlined-basic"
                  inputRef={filterRef}
                  defaultValue=""
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={setFilter}>
                        <Icon>filter_alt</Icon>
                      </IconButton>
                    ),
                  }}
                  label="Filter by ID/Name"
                  variant="outlined"
                />
              </div>

              <FormControl style={{ float: "right" }} component="fieldset">
                <RadioGroup aria-label="scale" name="scale" value={scale} onChange={handleChange} row>
                  {boxDimensions.width > 700 && (
                    <FormControlLabel value="3" labelPlacement="top" control={<Radio />} label="Small" />
                  )}
                  {boxDimensions.width > 550 && (
                    <FormControlLabel value="4" labelPlacement="top" control={<Radio />} label="Medium" />
                  )}
                  {boxDimensions.width > 400 && (
                    <FormControlLabel value="6" labelPlacement="top" control={<Radio />} label="Large" />
                  )}
                  <FormControlLabel value="12" labelPlacement="top" control={<Radio />} label="Fill" />
                </RadioGroup>
              </FormControl>
            </div>
            <div>{result}</div>
          </Box>
        )
      }
    //we intentionally fall through

    //other things give a more simple output
    //@ts-ignore. Intentional fallthrough - see above
    case "object":
      if (props.queryResult === null)
        return <Typography style={props.style ? props.style : {}}>No data found</Typography>

      if ("config" in props.queryResult)
        return (
          <Vega
            style={props.style ? props.style : {}}
            spec={props.queryResult}
            config={{ renderer: "canvas", actions: false }}
          />
        )

    //we intentionally fall through to here so that we always display something
    case "string":
    default:
      return (
        <Editor
          //@ts-ignore
          path="result"
          wordWrapBreakAfterCharacters="},"
          wordWrap="bounded"
          value={typeof props.queryResult === "string" ? props.queryResult : JSON.stringify(props.queryResult)}
          options={{ readOnly: true, wordWrapBreakAfterCharacters: ",", wordWrap: "bounded" }}
        />
      )
  }
}
