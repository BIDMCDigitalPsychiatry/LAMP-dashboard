export const baseScript = 'library(ggplot2)\n' +
    'library(anytime)\n' +
    'library(corrplot)\n' +
    'library(ggcorrplot)\n' +
    '\n' +
    '# Convert from UNIX Epoch Time to a Date string.\n' +
    'time_convert <- function(t) if(is.numeric(t) == T) anydate(t / 1000) else (as.numeric(as.POSIXct(t)) * 1000)\n' +
    '\n' +
    '# Construct Result statistics dataframes for the Participant.\n' +
    'patient_table <- function(result) {\n' +
    '  # The mapping dataframe between Activity IDs and names.\n' +
    '  activity_map <- function(a) {\n' +
    '    map <- c()\n' +
    '    for (i in 1 : length(a))\n' +
    '      map <- cbind(map, c(a[i]$`id`, a[i]$name))\n' +
    '    setNames(data.frame(map), c(\'id\', \'activity\'))\n' +
    '  }\n' +
    '  \n' +
    '  # Get the Activity ID of a game or the Survey name (FIXME).\n' +
    '  activity_get <- function(chunk, map) {\n' +
    '    if(is.na(chunk$activity) == F)\n' +
    '      c(toString(map$activity[map$id == chunk$activity]), length(chunk$temporal_events), \'game\')\n' +
    '    else c(chunk$static_data$survey_name, length(chunk$temporal_events), \'survey\')\n' +
    '  }\n' +
    '  \n' +
    '  # Use separate dataframes for the game-type and survey-type Activity Results.\n' +
    '  game_table <- c()\n' +
    '  survey_table <- c()\n' +
    '  \n' +
    '  # Separate Activities and Results from the input.\n' +
    '  map <- activity_map(result$activities)\n' +
    '  info <- result$participant$results\n' +
    '  \n' +
    '  # Apply the appropriate summarizer function to the Activity type.\n' +
    '  for(i in 1 : nrow(info)) {\n' +
    '    chunk <- info[i,]\n' +
    '    activity <- activity_get(chunk, map)\n' +
    '    if(activity[3] == \'game\')\n' +
    '      game_table <- rbind(game_table, game_summary(chunk, activity[1]))\n' +
    '    if(activity[3] == \'survey\')\n' +
    '      survey_table <- rbind(survey_table, survey_summary(chunk))\n' +
    '  }\n' +
    '  tables <- list(\'survey\' = survey_reform(survey_table), \'game\' = game_reform(game_table))\n' +
    '}\n' +
    '\n' +
    '# Summarize all temporal events in the Result.\n' +
    'game_summary <- function(chunk,name) {\n' +
    '  temp <- chunk$temporal_events[[1]]\n' +
    '  if(is.null(temp)) return(NULL)\n' +
    '  if(nrow(temp) <= 1) return(NULL)\n' +
    '\n' +
    '  # Unpack all temporal events into a single dataframe. (discard static data!)\n' +
    '  form <- c()\n' +
    '  for(i in 1 : nrow(temp)) {\n' +
    '    dat <- temp[i,]\n' +
    '    form <- rbind(form, c(name, dat$`item`, dat$type, dat$elapsed_time, dat$level, chunk$start_time))\n' +
    '  }\n' +
    '\n' +
    '  # Reformat the dataframe.\n' +
    '  form <- setNames(data.frame(form), c(\'name\', \'item\', \'correct\', \'time\', \'level\', \'start\'))\n' +
    '  form$item <- as.numeric(as.character(form$item))\n' +
    '  form$time <- as.numeric(as.character(form$time))\n' +
    '  form$level <- as.numeric(as.character(form$level))\n' +
    '  form$start <- time_convert(as.numeric(as.character(form$start)))\n' +
    '\n' +
    '  form\n' +
    '}\n' +
    '\n' +
    '# same logic as game_summary\n' +
    'survey_summary=function(chunk){\n' +
    '  temp <- chunk$temporal_events[[1]]\n' +
    '  if(is.null(temp)) return(NULL)\n' +
    '  if(nrow(temp) <= 1) return(NULL)\n' +
    '  \n' +
    '  form=c()\n' +
    '  for(i in 1:nrow(temp)){\n' +
    '    dat = temp[i,]\n' +
    '    form=rbind(form,c(dat$`item`,dat$value,dat$elapsed_time,chunk$start_time))\n' +
    '  }\n' +
    '  form = data.frame(form)\n' +
    '  colnames(form)=c(\'question\',\'answer\',\'time\',\'start\')\n' +
    '  \n' +
    '  q=c(\n' +
    '  "Last night I had trouble falling asleep",                          \n' +
    '  "Last night I had trouble staying asleep",                               \n' +
    '  "This morning I was up earlier than I wanted",                           \n' +
    '  "In the last THREE DAYS, I have taken my medications as scheduled",      \n' +
    '  "In the last THREE DAYS, during the daytime I have gone outside my home",\n' +
    '  "In the last THREE DAYS, I have preferred to spend time alone",          \n' +
    '  "In the last THREE DAYS, I have had arguments with other people",        \n' +
    '  "Today I have heard voices or saw things others cannot",                 \n' +
    '  "Today I have had thoughts racing through my head",                      \n' +
    '  "Today I feel I have special powers",                                   \n' +
    '  "Today I feel people are watching me",                                  \n' +
    '  "Today I feel people are against me",                                    \n' +
    '  "Today I feel confused or puzzled",                                      \n' +
    '  "Today I feel unable to cope and have difficulty with everyday tasks" ,  \n' +
    '  "In the last THREE DAYS, I have had someone to talk to",                 \n' +
    '  "In the last THREE DAYS, I have felt uneasy with groups of people",      \n' +
    '  "Today I feel little interest or pleasure",                              \n' +
    '  "Today I feel depressed" ,                                               \n' +
    '  "Today I had trouble sleeping" ,                                         \n' +
    '  "Today I feel tired or have little energy"  ,                            \n' +
    '  "Today I have a poor appetite or am overeating"   ,                      \n' +
    '  "Today I feel bad about myself or that I have let others down"  ,        \n' +
    '  "Today I have trouble focusing or concentrating" ,                       \n' +
    '  "Today I feel too slow or too restless" ,                                \n' +
    '  "Today I have thoughts of self-harm",                                    \n' +
    '  "Today I feel anxious" ,                                                 \n' +
    '  "Today I cannot stop worrying" ,                                         \n' +
    '  "Today I am worrying too much about different things",                   \n' +
    '  "Today I have trouble relaxing"  ,                                       \n' +
    '  "Today I feel so restless it\'s hard to sit still"  ,                     \n' +
    '  "Today I am easily annoyed or irritable" ,                               \n' +
    '  "Today I feel afraid something awful might happen" )\n' +
    '  cat = c("sleep","sleep","sleep","medication", "social", "social","social","psychosis","psychosis", \n' +
    '          "psychosis","psychosis","psychosis","psychosis","psychosis","social","social" ,"depression","depression",\n' +
    '          "depression" ,"depression", "depression", "depression", "depression","depression","depression","anxiety",\n' +
    '          "anxiety","anxiety","anxiety","anxiety","anxiety","anxiety" )\n' +
    '  survey_key=data.frame(cbind(q,cat))\n' +
    '  colnames(survey_key)=c("question","category")\n' +
    '  name=rep(NA,nrow(form))\n' +
    '  for(i in 1:nrow(form)){\n' +
    '    name[i]=as.character(survey_key$category)[survey_key$question==as.character(form$question)[i]]\n' +
    '  }\n' +
    '  form$name = name\n' +
    '  form$time = as.numeric(as.character(form$time))\n' +
    '  form$start = time_convert(as.numeric(as.character(form$start)))\n' +
    '  form\n' +
    '}\n' +
    '\n' +
    'game_reform <- function(game) {\n' +
    '  # Append statistics to the unique\'d temporal events.\n' +
    '  cat = c(\'Spatial Span Forward\', \'Spatial Span Backward\', \'Jewels Trails A\', \'Jewels Trails B\')\n' +
    '  unique_t <- unique(game$start)\n' +
    '  time_table <- matrix(0, nrow <- length(unique_t), ncol <- length(cat) * 3)\n' +
    '  for(i in 1 : length(unique_t)) {\n' +
    '    for(j in 1 : length(cat)) {\n' +
    '      temp <- subset(game, start == unique_t[i] & name == cat[j])\n' +
    '      time_table[i, 3 * (j - 1) + 1]= mean(temp$correct == \'TRUE\')\n' +
    '      time_table[i, 3 * (j - 1) + 2]= mean(temp$time / 1000)\n' +
    '      time_table[i, 3 * (j - 1) + 3]= sd(temp$time / 1000)\n' +
    '    }\n' +
    '  }\n' +
    '\n' +
    '  # Create specific column names for the new statistics columns.\n' +
    '  column <- c()\n' +
    '  for (i in 1 : length(cat))\n' +
    '    column <- c(column, c(paste0(cat[i], \'_accuracy\'), paste0(cat[i], \'_mtime\'), paste0(cat[i], \'_sdtime\')))\n' +
    '\n' +
    '  # Update and return the new dataframe.\n' +
    '  time_table <- setNames(data.frame(time_table), column)\n' +
    '  time_table$date <- unique_t\n' +
    '  row.names(time_table) <- NULL\n' +
    '  time_table\n' +
    '}\n' +
    '\n' +
    '# This function neeeds to be changed once we figure out how medication is coded\n' +
    'answer_to_score=function(survey){\n' +
    '  score=rep(NA,nrow(survey))\n' +
    '  score[survey$answer==\'Not at all\']=0\n' +
    '  score[survey$answer==\'Several Times\']=1\n' +
    '  score[survey$answer==\'More than Half the Time\']=2\n' +
    '  score[survey$answer==\'Nearly All the Time\']=3\n' +
    '  score[survey$name==\'medication\']=3-score[survey$name==\'medication\']\n' +
    '  score\n' +
    '}\n' +
    '\n' +
    '#  same logic as game_reform\n' +
    'survey_reform=function(survey){\n' +
    '  survey$answer=as.numeric(as.character(survey$answer))\n' +
    '  cat = c(\'sleep\',\'medication\',\'social\',\'psychosis\',\'depression\',\'anxiety\')\n' +
    '  unique_t = unique(survey$start)\n' +
    '  time_table = matrix(0,nrow = length(unique_t), ncol=length(cat)*3)\n' +
    '  for(i in 1:length(unique_t)){\n' +
    '    for(j in 1:length(cat)){\n' +
    '      temp = subset(survey,start==unique_t[i] & name==cat[j])\n' +
    '      time_table[i,3*(j-1)+1]= mean(temp$answer)\n' +
    '      time_table[i,3*(j-1)+2]= mean(temp$time)/1000\n' +
    '      time_table[i,3*(j-1)+3]= nrow(temp)\n' +
    '    }\n' +
    '  }\n' +
    '  time_table=data.frame(time_table)\n' +
    '  column = c()\n' +
    '  for (i in 1:length(cat)){\n' +
    '    column=c(column,c(paste0(cat[i],\'_score\'),paste0(cat[i],\'_time\'),paste0(cat[i],\'_row\')))\n' +
    '  }\n' +
    '  colnames(time_table)=column\n' +
    '  time_table$date = unique_t\n' +
    '  row.names(time_table)=NULL\n' +
    '  time_table\n' +
    '}\n' +
    '\n' +
    '\n' +
    '# Anonymous helper function to make a column-labeled dataframe.\n' +
    'make_df <- function(x, y, x_name = x, y_name = y, source) {\n' +
    '  index <- !is.na(source[[y]])\n' +
    '  return(setNames(data.frame(\n' +
    '    source[[x]][index],\n' +
    '    source[[y]][index]\n' +
    '  ), c(x_name, y_name)))\n' +
    '}\n' +
    '\n' +
    '# 3 options in this function: accuracy, mean, sd\n' +
    'game_plot <- function(table,option) {\n' +
    '  name = c(\'Spatial Span Forward\',\'Spatial Span Backward\',\'Jewels Trails A\',\'Jewels Trails B\')\n' +
    '  if(option==\'accuracy\'){\n' +
    '    new_name=paste0(name,\'_accuracy\')\n' +
    '    title_name = "Average Accuracy"\n' +
    '    y_name = "Accuracy"\n' +
    '  }\n' +
    '  if(option==\'mean\'){\n' +
    '    new_name=paste0(name,\'_mtime\')\n' +
    '    title_name = "Mean Response Time"\n' +
    '    y_name = "second"\n' +
    '  }\n' +
    '  if(option==\'sd\'){\n' +
    '    new_name=paste0(name,\'_sdtime\')\n' +
    '    title_name = "SD of Response Time"\n' +
    '    y_name = "second"\n' +
    '  }\n' +
    '  # Make the DFs to be drawn in the chart.\n' +
    '  spatialF <- make_df(\'date\', new_name[1], y_name = \'value\', source = table)\n' +
    '  spatialF$map=\'Forward\'\n' +
    '  spatialB <- make_df(\'date\', new_name[2], y_name = \'value\', source = table)\n' +
    '  spatialB$map=\'Backward\'\n' +
    '  trailsA <- make_df(\'date\',  new_name[3], y_name = \'value\', source = table)\n' +
    '  trailsA$map=\'Trails A\'\n' +
    '  trailsB <- make_df(\'date\',  new_name[4], y_name = \'value\', source = table)\n' +
    '  trailsB$map=\'Trails B\'\n' +
    '  # Create a GGPlot with each line chart.\n' +
    '  ggplot() + \n' +
    '    geom_line(data = spatialF, \n' +
    '      aes(x = date, y = value, color = map)) +\n' +
    '    geom_line(data = spatialB, \n' +
    '      aes(x = date, y = value, color = map)) +\n' +
    '    geom_line(data = trailsA, \n' +
    '      aes(x = date, y = value, color = map)) +\n' +
    '    geom_line(data = trailsB, \n' +
    '      aes(x = date, y = value, color = map)) +\n' +
    '    geom_point(data = spatialF, \n' +
    '              aes(x = date, y = value, color = map)) +\n' +
    '    geom_point(data = spatialB, \n' +
    '              aes(x = date, y = value, color = map)) +\n' +
    '    geom_point(data = trailsA, \n' +
    '              aes(x = date, y = value, color = map)) +\n' +
    '    geom_point(data = trailsB, \n' +
    '              aes(x = date, y = value, color = map)) +\n' +
    '    labs(title=title_name, x="Date", y=y_name) +\n' +
    '    scale_colour_manual("", values = c("Forward"="black","Backward"="red", \n' +
    '                    "Trails A"="blue","Trails B"="green"))\n' +
    '}\n' +
    '\n' +
    '\n' +
    '# also three options here: score, time\n' +
    'survey_plot=function(table,option){\n' +
    '  name = c(\'sleep\',\'psychosis\',\'medication\',\'anxiety\',\'social\',\'depression\')\n' +
    '  if (option==\'score\'){\n' +
    '    new_name = paste0(name,\'_score\')\n' +
    '    title_name = \'Score\'\n' +
    '    y_name = "Score"\n' +
    '  }\n' +
    '  if (option==\'time\'){\n' +
    '    new_name = paste0(name,\'_time\')\n' +
    '    title_name = \'Mean Response Time\'\n' +
    '    y_name = \'second\'\n' +
    '  }\n' +
    '  sleep_dat <- make_df(\'date\',new_name[1],y_name=\'value\', source = table)\n' +
    '  sleep_dat$map=\'Sleep\'\n' +
    '  psychosis_dat <- make_df(\'date\',new_name[2],y_name=\'value\', source = table)\n' +
    '  psychosis_dat$map=\'Psychosis\'\n' +
    '  medication_dat <- make_df(\'date\',new_name[3],y_name=\'value\', source = table)\n' +
    '  medication_dat$map=\'Medication\'\n' +
    '  anxiety_dat <- make_df(\'date\',new_name[4],y_name=\'value\', source = table)\n' +
    '  anxiety_dat$map=\'Anxiety\'\n' +
    '  social_dat <- make_df(\'date\',new_name[5],y_name=\'value\', source = table)\n' +
    '  social_dat$map=\'Social\'\n' +
    '  depression_dat <- make_df(\'date\',new_name[6],y_name=\'value\', source = table)\n' +
    '  depression_dat$map=\'Depression\'\n' +
    '  # Create a GGPlot with each line chart.\n' +
    '  ggplot() + \n' +
    '    geom_line(data = sleep_dat, \n' +
    '              aes(x = date, y = value, color = map)) +\n' +
    '    geom_line(data = psychosis_dat, \n' +
    '              aes(x = date, y = value, color = map)) +\n' +
    '    geom_line(data = medication_dat, \n' +
    '              aes(x = date, y = value, color = map)) +\n' +
    '    geom_line(data = anxiety_dat, \n' +
    '              aes(x = date, y = value, color = map)) +\n' +
    '    geom_line(data = social_dat, \n' +
    '              aes(x = date, y = value, color = map)) +\n' +
    '    geom_line(data = depression_dat, \n' +
    '              aes(x = date, y = value, color = map)) +\n' +
    '    geom_point(data = sleep_dat, \n' +
    '              aes(x = date, y = value, color = map)) +\n' +
    '    geom_point(data = psychosis_dat, \n' +
    '              aes(x = date, y = value, color = map)) +\n' +
    '    geom_point(data = medication_dat, \n' +
    '              aes(x = date, y = value, color = map)) +\n' +
    '    geom_point(data = anxiety_dat, \n' +
    '              aes(x = date, y = value, color = map)) +\n' +
    '    geom_point(data = social_dat, \n' +
    '              aes(x = date, y = value, color = map)) +\n' +
    '    geom_point(data = depression_dat, \n' +
    '              aes(x = date, y = value, color = map)) +\n' +
    '    labs(title=title_name, x="Date", y=y_name) +\n' +
    '    scale_colour_manual("", values = c("Sleep"="black","Psychosis"="red", "Medication"="blue",\n' +
    '                                       "Anxiety"="green","Social"="orange",\'Depression\'=\'purple\'))\n' +
    '}\n' +
    '\n' +
    '\n' +
    'survey_heatmap=function(survey_table){\n' +
    '  current_date = survey_table$date[1]\n' +
    '  last_date = survey_table$date[nrow(survey_table)]\n' +
    '  ## get the mean of sleep/psychosis/... score every week\n' +
    '  weeklyscore=c()\n' +
    '  i=1 ## ith week since enrolled\n' +
    '  while(current_date<last_date){\n' +
    '    week_dat = subset(survey_table,date>=current_date & date<current_date+7)\n' +
    '    score = colMeans(week_dat[,c(1,4,7,10,13,16)],na.rm=T)\n' +
    '    weeklyscore=rbind(weeklyscore,c(i,score))\n' +
    '    i = i+1\n' +
    '    current_date = current_date+7\n' +
    '  }\n' +
    '  weeklyscore=data.frame(weeklyscore)\n' +
    '  colnames(weeklyscore)=c(\'week\',\'sleep\',\'medication\',\'social\',\'psychosis\',\'depression\',\'anxiety\')\n' +
    '  weeklyscore=weeklyscore[complete.cases(weeklyscore),]\n' +
    '  M=cor((weeklyscore[,-1]))\n' +
    '  #corrplot(M, type="upper",title = paste0(\'Based on data of \',nrow(weeklyscore),\' weeks\'),mar=c(0,0,1.5,0))\n' +
    '  ggcorrplot(M)\n' +
    '}\n' +
    '\n' +
    '\n'

export const accuracyPlot = baseScript + 'game_plot(patient_table(commandArgs()$result)$game,\'accuracy\')'

export const meanPlot = baseScript + 'game_plot(patient_table(commandArgs()$result)$game,\'mean\')'

export const variancePlot = baseScript + 'game_plot(patient_table(commandArgs()$result)$game,\'sd\')'

export const surveyScorePlot = baseScript + 'survey_plot(patient_table(commandArgs()$result)$survey,\'score\')'

export const surveyTimePlot = baseScript + 'survey_plot(patient_table(commandArgs()$result)$survey,\'time\')'

export const corrPlot = baseScript + 'survey_heatmap(patient_table(commandArgs()$result)$survey)'

export const plotGallery = [accuracyPlot, meanPlot, variancePlot, surveyScorePlot, surveyTimePlot, corrPlot]

export const plotArgs = 'ggplot2,anytime,corrplot,ggcorrplot'
