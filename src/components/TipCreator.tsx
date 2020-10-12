// Core Imports
import React, { useState, useEffect, useCallback, useRef } from "react"
import {
  Box,
  Tooltip,
  Typography,
  Grid,
  Fab,
  Divider,
  IconButton,
  Icon,
  Button,
  ButtonGroup,
  TextField,
  InputAdornment,
  Stepper,
  Step,
  StepLabel,
  StepButton,
  StepContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Select,
  TextareaAutosize,
  ButtonBase,
  Container,
  MenuItem
} from "@material-ui/core"
import LAMP from "lamp-core"
import { useDropzone } from "react-dropzone"
import { makeStyles, Theme, createStyles, createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles"

const theme = createMuiTheme({
  palette: {
    secondary: {
      main: "#333",
    },
  },
  overrides: {
    MuiFilledInput: {
      root: {
        border: 0,
        backgroundColor: "#f4f4f4",
      },
      underline: {
        "&&&:before": {
          borderBottom: "none",
        },
        "&&:after": {
          borderBottom: "none",
        },
      },
    },
    MuiTextField: {
      root: { width: "100%" },
    },
    MuiDivider: {
      root: { margin: "25px 0" },
    },
  },
})

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    containerWidth: { maxWidth: 1055 },
  })
)

function compress(file, width, height) {

  console.log(3546, file) 

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onerror = (error) => reject(error)
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result as string
      img.onload = () => {
        const elem = document.createElement("canvas")
        elem.width = width
        elem.height = height
        const ctx = elem.getContext("2d")
        ctx.drawImage(img, 0, 0, width, height)
        resolve(ctx.canvas.toDataURL())
      }
    }
  })
}

export default function TipCreator({
  activities,
  onSave,
  onCancel,
  studyID,
  ...props
}: {
  activities?: any
  onSave?: any
  onCancel?: any
  studyID?: any
}) {

  //console.log(100, value, props, 101)
    
  const classes = useStyles()
  const [activeStep, setActiveStep] = useState(0)
  const [category, setCategory] = useState('')
  const [text, setText] = useState(!!activities ? activities.name : undefined)
  /*
  const [text, setText] = useState(!!value ? value.name : undefined)
  const [description, setDescription] = useState(!!value ? value.description : undefined)
  const [questions, setQuestions] = useState(!!value ? value.settings : [])
  */
  const [tipsTitle, setTipsTitle] = useState()
  const [tipsLink, setTipsLink] = useState()
  const [tipsDescription, setTipsDescription] = useState()
  const [categoryArray, setCategoryArray] = useState([])
  const [newTipText, setNewTipText] = useState('')
  const [selectedCategory, setSelectedCategory]: any = useState({})
  const [selectedTipsCount, setSelectedTipsCount]: any = useState(0)
  const [photo, setPhoto] = useState()
  const [selectedPhotoArray, setSelectedPhotoArray] = useState([])
  const [selectedPhotoId, setSelectedPhotoId] = useState('')
  //const [tipsDataArray, setTipsDataArray] = useState([])
  //const [tipsDataArray, setTipsDataArray] = useState([ { tipsTitle: '', tipsLink: '', tipsDescription: '' }])
  const [tipsDataArray, setTipsDataArray] = useState([ { title: '', link: '', text: '', image:'' }])
  const [newTipsData, setNewTipsData] = useState([{ title: '', link: '', text: '', image:'' }])

  /*
  const [state, setState] = useState({
    tips: [{tipsTitle:"", tipsLink:"", tipsDescription: ""}],
  })
  */
  const inputRef = useRef(null)

  /*
  const onDropAccepted = useCallback((acceptedFiles,  item) => compress(acceptedFiles[0], 64, 64, item).then((res) => {
      
      console.log(2050, item.id, item)
      

    })
  , [])
  */
  



  const onDrop = useCallback((acceptedFiles, rejected, item) => compress(acceptedFiles[0], 64, 64).then((res: any) => {
         

       // console.log(1421, item.target.id, tipsDataArray, selectedTipsCount)  

       // console.log(1422, item.target.id, selectedCategory)   

        //setPhoto(res) 
        
        /*  
        let itemId = item.target.id
        let tipsData = tipsDataArray

        console.log(1423, tipsData)

        if(tipsData.length > 0){
          //tipsData[itemId].image =  res
          //setTipsDataArray(tips => ([...tipsData]));

          
        }
        */

        //funUpdate(item.target.id, res)

        let itemId = item.target.id
        let tipsData = tipsDataArray

        //console.log(1423, tipsData)

        if(selectedPhotoId === ""){
          setPhoto(res);
        }
        
     
        if(tipsData.length > 0){
          if(selectedPhotoId !== ""){
            tipsData[selectedPhotoId].image =  res
            setTipsDataArray(tips => ([...tipsData]));
          }
          
        }


        
        console.log(1425, itemId, res)   
        

        console.log(1426, tipsData)   
       /**/

      console.log(1427, item, itemId)   

      console.log(1428, selectedPhotoId)    


    })
    //, [tipsDataArray])
  , [tipsDataArray, selectedPhotoId]) 



  // eslint-disable-next-line
  const { acceptedFiles, getRootProps, getInputProps, isDragActive, isDragAccept } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 2 * 1024 * 1024 /* 5MB */,
    //onDropAccepted
  })
  


  useEffect(() => {
    ;(async () => {
        let activityData = await LAMP.Activity.allByStudy(studyID)
        //let b = a.filter((x) => ["lamp.survey"].includes(x.spec))
        let tipsCategoryData = activityData.filter((activity) => activity.spec === "lamp.tips")
        setCategoryArray(tipsCategoryData)
        //let tipsFormat = tipsData.reduce((prev, curr) => ({ ...prev, [curr.id]: curr.name }), {})

        //console.log(90, tipsData)

      console.log(89, typeof activities)

      if(!!activities) { 
        //console.log(91, tipsCategoryData)
        if(Object.keys(activities.settings).length > 0){
          setCategory(activities.id)
          setSelectedCategory(activities) 
          setTipsDataArray(activities.settings)

          console.log(113, activities.settings)
        }
      } 
      
      


    })()
  }, [])

/*    
  useEffect(() => {
    console.log(410, tipsDataArray)

  }, [tipsDataArray])
*/

  const handleCategory = (event) => {
    setCategory(event.target.value)

     console.log(102, event.target.value) 
    if((event.target.value !== "add_new")){
      let existsData = categoryArray.find(o => o.id === event.target.value);

      console.log(125, existsData)

      if(Object.keys(existsData).length > 0){
        console.log(103, existsData)
        setSelectedCategory(existsData) 

        setSelectedTipsCount(Object.keys(existsData.settings).length)

        /*
        if(Object.keys(existsData.settings).length > 0){
          setTipsDataArray(existsData.settings)

          let photoArray = existsData.settings.map(function(obj) {return obj.image });
          setSelectedPhotoArray(photoArray)

          console.log(107, existsData.settings, photoArray)
        }else{

        }
        */
        
        setTipsDataArray(existsData.settings)


      }
    }
  }


  const handleTipsData = (e :any , type, id) => {

    console.log(306, e) 
    
    let tipsData = tipsDataArray

    //tipsData[id].type =  e.target.value
    if(type === "title")
    tipsData[id].title =  e.target.value

    if(type === "link")
    tipsData[id].link =  e.target.value

    if(type === "text")
    tipsData[id].text =  e.target.value

    if(type === "image"){

      if(e.target.value === undefined){
        tipsData[id].image =  ""
      }else{
        tipsData[id].image =  e.target.value
      }

      setSelectedPhotoId(id)
    }
    
    console.log(303, tipsData)

    setTipsDataArray(tips => ([...tipsData]));


  }

  const handleNewTips = (e , type) => {
    
    let tipsData: any = newTipsData 

    console.log(300, tipsData)


    //tipsData[id].type =  e.target.value
    if(type === "title")
    tipsData[0].title =  e.target.value

    if(type === "link")
    tipsData[0].link =  e.target.value

    if(type === "text")
    tipsData[0].text =  e.target.value

    if(type === "image")
    tipsData[0].image =  e.target.value

    //setNewTipsData([tipsData])
    //setTipsDataArray(tips => ([...tipsData]));

    setNewTipsData(tips => ([...tipsData]));

    console.log(301, tipsData)

  }


  const handleSaveTips = () => {

    console.log(1100, selectedCategory);

    if(selectedCategory === "add_new"){
      //if()
      onSave(
        {
          id: undefined,
          name: text,
          spec: "lamp.tips",
          schedule: [],
          settings: newTipsData,
        },
        false /* overwrite */
      )
    }else{
      
      onSave(
        {
          id: undefined,
          name: text,
          spec: "lamp.tips",
          schedule: [],
          settings: tipsDataArray.concat(newTipsData),
        },
        false /* overwrite */
      )
    }
    
    return false;

  }
  






  return (
    <Grid container direction="column" spacing={2} {...props}>
      <MuiThemeProvider theme={theme}>
        <Container className={classes.containerWidth}>
          <Grid container spacing={2}>
            
            <Grid item md={10}>
              <Box mb={3}>                        
                <Select
                  labelId="demo-simple-select-error-label"
                  id="demo-simple-select-error"
                  value={category}
                  onChange={handleCategory}
                >
                  {categoryArray.map((x, idx) => (
                    <MenuItem value={`${x.id}`} key={`${x.id}`}>{`${x.name}`}</MenuItem>
                  ))}
                  <MenuItem value="add_new" key="add_new"> Add New</MenuItem>
                </Select>
                { category === "add_new" ?
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="New Tip"
                    defaultValue={newTipText}
                    onChange={(event) => setNewTipText(event.target.value)}
                  />
                : ""
                }

              </Box>
            </Grid>
          </Grid>
          

          { (Object.keys(selectedCategory).length > 0 && Object.keys(selectedCategory.settings).length > 0)  ?
            selectedCategory.settings.map((x, idx) => (
              <Grid container spacing={2}>
                <Grid item xs key={idx}>
                  <Tooltip
                    title={
                      !photo
                        ? "Drag a photo or tap to select a photo."
                        : "Drag a photo to replace the existing photo or tap to delete the photo."
                    }
                  >
                    <Box                    
                      {...getRootProps({
                        onClick: event =>  {
                            setSelectedPhotoId(() => (idx))
                            console.log(2223, event, " === ", idx, " *** ", selectedPhotoId)
                          }
                        })}
                      my={2}
                      width={128}
                      height={128}
                      border={1}
                      borderRadius={4}
                      //borderColor={!(isDragActive || isDragAccept || !!photo) ? "text.secondary" : "#fff"}
                      borderColor={!(isDragActive || isDragAccept || !!tipsDataArray[idx].image) ? "text.secondary" : "#fff"}
                      bgcolor={isDragActive || isDragAccept ? "text.secondary" : undefined}
                      color={!(isDragActive || isDragAccept || !!photo) ? "text.secondary" : "#fff"}
                      style={{  
                        //background: !!photo ? `url(${photo}) center center/contain no-repeat` : undefined,
                        background: !!tipsDataArray[idx] ?  `url(${tipsDataArray[idx].image}) center center/contain no-repeat` : 
                        (!!photo ? `url(${photo}) center center/contain no-repeat` : undefined),  
                      }}
                    > 
                      {/*
                        <ButtonBase style={{ width: "100%", height: "100%" }} onClick={() => !!photo && setPhoto(undefined)}>
                          {!photo && <input {...getInputProps()} />}
                          <Icon fontSize="large">{!photo ? "add_a_photo" : "delete_forever"}</Icon>
                        </ButtonBase>
                      */}

                      <ButtonBase style={{ width: "100%", height: "100%" }} 
                        //onClick={() => !!photo && setPhoto(undefined)}
                        //onClick={(e) => !!tipsDataArray[idx] && tipsDataArray[idx].image && handleTipsData(undefined, 'image', idx)}
                        //onClick={(e) => !!tipsDataArray[idx] && tipsDataArray[idx].image && handleTipsData(e, 'image', idx)}
                        /*
                        onClick={(e: any) => {
                          console.log(411, e, e.target.value)
                        }}
                        */
                        onClick={(e) => !!tipsDataArray[idx] && tipsDataArray[idx].image && handleTipsData(e, 'image', idx)}
                      > 
                          {/* !tipsDataArray[idx].image && !photo && <input {...getInputProps()} /> */}
                          
                        {/* !tipsDataArray[idx].image && !photo && <input {...getInputProps({id: idx})} data-idx={idx}/> */} 

                        {/* !tipsDataArray[idx].image && !photo && <input name="AbCdEf"  data-set={idx} id="AbCdEf" {...getInputProps({refKey: 'abcdef'})} data-idx={idx}/> */} 

                        {/* !tipsDataArray[idx].image && !photo && <input {...getInputProps({id: idx})} data-idx={idx}/> */} 

                          <input name={"name_" + idx} {...getInputProps({id: idx})} data-idx={idx}/>

                          <Icon fontSize="large">{!tipsDataArray[idx].image && !photo ? "add_a_photo" : "delete_forever"}</Icon>
                      </ButtonBase>

                    </Box>
                  </Tooltip>
                </Grid>
                <Grid item md={10}>
                  <Box>              
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Tips Title"
                      data-id={idx}
                      defaultValue={ (tipsDataArray[idx]) ? tipsDataArray[idx].title : x.title}
                      className="tipsTitle"
                      onChange={(e) => { handleTipsData(e, 'title', idx)}}  
                    />
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Tips Link"
                      data-id={idx}
                      defaultValue={ (tipsDataArray[idx]) ? tipsDataArray[idx].link : x.link}
                      className="tipsLink"
                      onChange={(e) => { handleTipsData(e, 'link', idx)}} 
                    />
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label="Tips Description"
                      rows={2}
                      defaultValue={ (tipsDataArray[idx]) ? tipsDataArray[idx].text : x.text }
                      onChange={(e) => { handleTipsData(e, 'text', idx)}} 
                      multiline
                    />
                  </Box>
                </Grid>                    
                <Grid item xs={12}>
                  <Divider />
                </Grid>                
              </Grid>
            ))
            : ""
          }


          
          
          { !activities ?  
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Divider />
                <Typography variant="h6">Game duration</Typography>
              </Grid>
              <Grid item xs >

                <Tooltip
                  title={
                    !photo
                      ? "Drag a photo or tap to select a photo."
                      : "Drag a photo to replace the existing photo or tap to delete the photo."
                  }
                >
                  <Box
                    {...getRootProps()}
                    my={2}
                    width={128}
                    height={128}
                    border={1}
                    borderRadius={4}
                    borderColor={!(isDragActive || isDragAccept || !!photo) ? "text.secondary" : "#fff"}
                    bgcolor={isDragActive || isDragAccept ? "text.secondary" : undefined}
                    color={!(isDragActive || isDragAccept || !!photo) ? "text.secondary" : "#fff"}
                    style={{
                      background: !!photo ? `url(${photo}) center center/contain no-repeat` : undefined,
                    }}
                  >
                    <ButtonBase style={{ width: "100%", height: "100%" }} 
                    onClick={() => {!!photo && setPhoto(undefined); setSelectedPhotoId("")}
                      //&& selectedPhotoId(undefined)
                    }
                    >
                      {!photo && <input {...getInputProps()} />}
                      <Icon fontSize="large">{!photo ? "add_a_photo" : "delete_forever"}</Icon>
                    </ButtonBase>
                  </Box>
                </Tooltip>

              </Grid>
              <Grid item md={10}>
                <Box>   
                  <TextField                  
                    error={
                      typeof newTipsData[0].title === "undefined" || (typeof newTipsData[0].title !== "undefined" && newTipsData[0].title?.trim() === "") ? true : false
                    } 
                    variant="outlined"
                    label="Tips Title"
                    /*defaultValue={settings?.beginner_seconds ?? 90}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      max: 300,
                    }}
                    onChange={(e) => setSettings({ ...settings, beginner_seconds: Number(e.target.value) })}
                    */
                    onChange={(e) => { handleNewTips(e, 'title') }}
                  />
                </Box>
                <Box>
                <TextField
                  /*error={
                    settings.intermediate_seconds > 300 ||
                    settings.intermediate_seconds === 0 ||
                    settings.intermediate_seconds === ""
                      ? true
                      : false
                  }*/
                  variant="outlined"
                  label="Tips Link"
                  /*defaultValue={settings?.intermediate_seconds ?? 30}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: 300,
                  }}
                  onChange={(e) => setSettings({ ...settings, intermediate_seconds: Number(e.target.value) })}
                  */
                  onChange={(e) => { handleNewTips(e, 'link') }}
                />
              </Box>
              <Box>
                <TextField
                  variant="outlined"
                  label="Tips Description"
                  onChange={(e) => { handleNewTips(e, 'text') }}  
                />
              </Box>
              </Grid>
              <Grid item lg={3}>
                <TextField
                  /*error={
                    settings.advanced_seconds > 300 ||
                    settings.advanced_seconds === 0 ||
                    settings.advanced_seconds === ""
                      ? true
                      : false
                  }*/
                  type="number"
                  variant="filled"
                  id="advanced_seconds"
                  label="Advanced seconds"
                  /*defaultValue={settings?.advanced_seconds ?? 120}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: 300,
                  }}
                  onChange={(e) => setSettings({ ...settings, advanced_seconds: Number(e.target.value) })}*/
                />
              </Grid>
              <Grid item xs={12}>
                <Divider />
                <Typography variant="h6">Settings</Typography>
              </Grid>
              <Grid item lg={3}>
                <TextField
                  /*error={
                    settings.diamond_count > 25 || settings.diamond_count === 0 || settings.diamond_count === ""
                      ? true
                      : false
                  }*/
                  type="number"
                  variant="filled"
                  id="diamond_count"
                  label="Number of diamonds for level 1"
                  /*defaultValue={settings?.diamond_count ?? 15}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: 25,
                  }}
                  onChange={(e) => setSettings({ ...settings, diamond_count: Number(e.target.value) })}
                  */
                />
              </Grid>
              <Grid item lg={6}>
                <TextField
                  //error={settings.bonus_point_count === 0 || settings.bonus_point_count === "" ? true : false}
                  type="number"
                  id="bonus_point_count"
                  label="Bonus points for next level"
                  /*defaultValue={settings?.bonus_point_count ?? 50}
                  variant="filled"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: 500,
                  }}
                  onChange={(e) => setSettings({ ...settings, bonus_point_count: Number(e.target.value) })}*/
                />
              </Grid>
              <Grid item lg={3}>
                <TextField
                  /*error={
                    settings.shape_count > 4 || settings.shape_count === 0 || settings.shape_count === "" ? true : false
                  }*/
                  type="number"
                  variant="filled"
                  id="shape_count"
                  label="Number of shapes"
                  /*InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: 4,
                  }}
                  defaultValue={settings?.shape_count ?? 1}
                  onChange={(e) => setSettings({ ...settings, shape_count: Number(e.target.value) })}*/
                />
              </Grid>
              <Grid item lg={3}>
                <TextField
                  type="number"
                  variant="filled"
                  id="x_changes_in_level_count"
                  label="X changes in level count"
                  /*defaultValue={settings?.x_changes_in_level_count ?? 1}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: 25,
                  }}
                  onChange={(e) => setSettings({ ...settings, x_changes_in_level_count: Number(e.target.value) })}
                  */
                />
              </Grid>
              <Grid item lg={3}>
                <TextField
                  type="number"
                  variant="filled"
                  id="x_diamond_count"
                  label="X diamond count"
                  /*
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: 25,
                  }}
                  defaultValue={settings?.x_diamond_count ?? 4}
                  onChange={(e) => setSettings({ ...settings, x_diamond_count: Number(e.target.value) })}
                  */
                />
              </Grid>
              <Grid item lg={3}>
                <TextField
                  type="number"
                  variant="filled"
                  id="y_changes_in_level_count"
                  label="Y changes in level count"
                  /*
                  defaultValue={settings?.y_changes_in_level_count ?? 2}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: 25,
                  }}
                  onChange={(e) => setSettings({ ...settings, y_changes_in_level_count: Number(e.target.value) })}
                  */
                />
              </Grid>
              <Grid item lg={3}>
                <TextField
                  type="number"
                  variant="filled"
                  id="y_shape_count"
                  label="Y shape count"
                  /*
                  defaultValue={settings?.y_shape_count ?? 1}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    max: 4,
                  }}
                  onChange={(e) => setSettings({ ...settings, y_shape_count: Number(e.target.value) })}
                  */
                />
              </Grid>
            </Grid>
          //)
        
        : "" }
        </Container>
      </MuiThemeProvider>

      <Grid
        container
        direction="column"
        alignItems="flex-end"
        spacing={1}
        style={{ position: "fixed", bottom: 24, right: 24, width: "auto" }}
      >
        { // !!value && (
          <Grid item>
            <Tooltip title="Duplicate this survey instrument and save it with a new title.">
              <Fab
                color="primary"
                aria-label="Duplicate"
                variant="extended"
                /*onClick={() => {
                  if (validate()) {
                    onSave(
                      {
                        id: undefined,
                        name: text,
                        spec: value?.spec,
                        schedule: [],
                        settings: settings,
                        description: description,
                        photo: photo,
                      },
                      true 
                    )
                  }
                }}*/
                //disabled={!onSave || !text || value.name.trim() === text.trim()}
              >
                Duplicate
                <span style={{ width: 8 }} />
                <Icon>file_copy</Icon>
              </Fab>
            </Tooltip>
          </Grid>
        //)
        }
        <Grid item>
          <Tooltip title="Save this activity.">
            <Fab
              color="secondary"
              aria-label="Save"
              variant="extended"
              /*onClick={() => {
                if (validate()) {
                  onSave(
                    {
                      id: value?.id ?? undefined,
                      name: text,
                      spec: value?.spec ?? activitySpecId,
                      schedule: [],
                      settings: settings,
                      description: description,
                      photo: photo,
                    },
                    false /
                  )
                }
              }}*/
              //disabled={!onSave || !text}
            >
              Save
              <span style={{ width: 8 }} />
              <Icon>save</Icon>
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>
    </Grid>
  )
}
