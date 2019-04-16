import LAMP from '../lamp.js';

// Note the surveys we want to use in the average plot with their initial slot number as well as expected length.
const usableSurveys = {
    'ANXIETY, PSYCHOSIS, AND SOCIAL': [0, 16],
    'MOOD, SLEEP, AND SOCIAL': [16, 16],
    'ANXIETY': [0, 7],
    'PSYCHOSIS AND SOCIAL': [7, 9],
    'MOOD': [16, 9],
    'SLEEP AND SOCIAL': [25, 7],
}

// //Create new categories based on individuals questions
// let eventDataDict = {}
// event.detail.map(question => {
// if (question.item in surveyCatMap) {
//     let category = surveyCatMap[question.item]
//     //Flip social score
//     if (category == 'Social_Reverse') { 
//         question.value = 3 - question.value
//         category = 'Social'
//     }

//     if (category in eventDataDict) {
//         eventDataDict[category].push(question) 
//     }
//     else { 
//         eventDataDict[category] = [question] 
//     }
// }
// })


// Note the short-name mappings for the above survey questions.
const surveyCatMap = {'Today I feel little interest or pleasure':'Mood',
                      'Today I feel depressed':'Mood',
                      'Today I had trouble sleeping':'Mood',
                      'Today I had feel tired or have little energy':'Mood',
                      'Today I have poor appetite or am overeating':'Mood',
                      'Today I feel bad about myself or that I have let others down':'Mood',
                      'Today I have trouble focusing or concentrating':'Mood',
                      'Today I feel too slow or too restless':'Mood',
                      'Today I have thoughts of self-harm':'Mood',
                      'Last night I had trouble staying asleep':'Sleep',
                      'Last night I had trouble falling asleep':'Sleep',
                      'This morning I was up earlier than I wanted':'Sleep',
                      'In the last THREE DAYS, I have taken my medications as scheduled':'Medication',
                      'In the last THREE DAYS, during the daytime I have gone outside my home':'Social_Reverse',
                      'In the last THREE DAYS, I have had someone to talk to':'Social_Reverse',
                      'In the last THREE DAYS, I have preferred to spend time alone':'Social',
                      'In the last THREE DAYS, I have felt uneasy with groups of people':'Social',
                      'In the last THREE DAYS, I have had arguments with other people':'Social',
                      'Today I feel anxious':'Anxiety',
                      'Today I cannot stop worrying':'Anxiety',
                      'Today I am worrying too much about different things':'Anxiety',
                      'Today I have trouble relaxing':'Anxiety',
                      'Today I feel so restless it\'s hard to sit still':'Anxiety',
                      'Today I am easily annoyed or irritable':'Anxiety',
                      'Today I feel afraid something awful might happen':'Anxiety',
                      'Today I have heard voices or saw things others cannot':'Psychosis',
                      'Today I have had thoughts racing through my head':'Psychosis',
                      'Today I feel I have special powers':'Psychosis',
                      'Today I feel people are watching me':'Psychosis',
                      'Today I feel people are against me':'Psychosis',
                      'Today I feel confused or puzzled':'Psychosis',
                      'Today I feel unable to cope and have difficulty with everyday tasks':'Psychosis'}


// Note the short-name mappings for the above survey questions.
const surveyMap = {
    "Today I feel anxious": "Anxious",
    "Today I cannot stop worrying": "Constant Worry",
    "Today I am worrying too much about different things": "Many Worries",
    "Today I have trouble relaxing": "Can't Relax",
    "Today I feel so restless it's hard to sit still": "Restless",
    "Today I am easily annoyed or irritable": "Irritable",
    "Today I feel afraid something awful might happen": "Afraid",
    "Today I have heard voices or saw things others cannot": "Voices",
    "Today I have had thoughts racing through my head": "Racing Thoughts",
    "Today I feel I have special powers": "Special Powers",
    "Today I feel people are watching me": "People watching me",
    "Today I feel people are against me": "People against me",
    "Today I feel confused or puzzled": "Confused",
    "Today I feel unable to cope and have difficulty with everyday tasks": "Unable to cope",
    "In the last THREE DAYS, I have had someone to talk to": "Someone to talk to",
    "In the last THREE DAYS, I have felt uneasy with groups of people": "Uneasy in groups",
    "Today I feel little interest or pleasure": "Low interest",
    "Today I feel depressed": "Depressed",
    "Today I had trouble sleeping": "Trouble Sleeping",
    "Today I feel tired or have little energy": "Low Energy",
    "Today I have a poor appetite or am overeating": "Low/High Appetite",
    "Today I feel bad about myself or that I have let others down": "Poor self-esteem",
    "Today I have trouble focusing or concentrating": "Can't focus",
    "Today I feel too slow or too restless": "Feel slow",
    "Today I have thoughts of self-harm": "Self-harm",
    "Last night I had trouble falling asleep": "Can't fall asleep",
    "Last night I have had trouble falling asleep": "Can't fall asleep",
    "Last night I had trouble staying asleep": "Can't stay asleep",
    "This morning I was up earlier than I wanted": "Waking up early",
    "In the last THREE DAYS, I have taken my medications as scheduled": "Medication",
    "In the last THREE DAYS, during the daytime I have gone outside my home": "Spent time outside",
    "In the last THREE DAYS, I have preferred to spend time alone": "Prefer to be alone",
    "In the last THREE DAYS, I have had arguments with other people": "Arguments with others",
    "I trust this app to guide me towards my personal goals" : "Goals",
    "I believe this app's tasks will help me to address my problem" : "Tasks",
    "This app encourages me to accomplish tasks and make progress" : "Encouragement",
    "I agree that the tasks within this app are important for my goals" : "Tasks match goals",
    "This app is easy to use and operate" : "Usability",
    "This app supports me to overcome challenges" : "Support",
    "When I see others who are doing better than I am, I realize it's possible to improve" : "Can improve",
    "When I see others who are doing better than I am, I feel frustrated about my own situation" : "Frustrated",
    "When I see others who are doing worse than I am, I feel fear that my future will be similar to them" : "Similar future",
    "When I see others who are doing worse than I am, I feel relieved about my own situation" : "Relieved"
}

export async function downloadParticipantEvents(id) {
                // Fetch all participant-related data streams.
        return await Promise.all([
            LAMP.Activity.all_by_participant(id), 
            LAMP.ResultEvent.all_by_participant(id), 
            LAMP.SensorEvent.all_by_participant(id)
        ])

}

export async function downloadStudyEvents(id) {

    async function downloadEvents(ids) {
        let resultEvents = []
        let sensorEvents = []

        for (var i = 0; i < ids.length; i++) {
            try {
                resultEvents.push(await LAMP.ResultEvent.all_by_participant(ids[i], undefined, {untyped: true}))
                sensorEvents.push(await LAMP.SensorEvent.all_by_participant(ids[i], undefined, {untyped: true}))
            }
            catch {}
        }
        return [resultEvents, sensorEvents]
     }

     // Fetch all participant-related data streams.
     let test = await Promise.all([LAMP.Study.view(id)])
     let participants = []
     if (!!test) {
        participants = test[0][0].participants
     }
    
    let activities = await LAMP.Activity.all_by_study(id)

    let res = await downloadEvents(participants)

    res.unshift(activities)
    res[1] = [].concat(...Object.values(res[1]))
    res[2] = [].concat(...Object.values(res[2]))
    return res
}

export function participantTimeline(inputData, catMap) {
        const [activities, result_events, sensor_events] = inputData

        // If a category map is not specified, use our default map.
        // Alternatively, if it is `true`, we could substitute it then.
        if (!catMap) // FIXME, TODO
            catMap = surveyCatMap

        // Flatten all linked activities' names into each Result object.
        let res1 = result_events.map(x => ({
            event_type: 'result',
            timestamp: x.timestamp,
            duration: x.duration,
            activity_type: (
                    !!x.activity ? null : activities.find(y => {
                        return x.activity === y.id
                    }).spec
            ),
            name: (
                !!x.static_data.survey_name ? 
                x.static_data.survey_name :
               (activities.find(y => x.activity === y.id) || {}).name
            ),
            summary: x.activity === null ? null : x.static_data,
            detail: x.temporal_events
        }))

        let res2 = sensor_events.map(x => {
            x.event_type = 'sensor'
            return x
        })

        // Compute a timeline data stream sorted by timestamp.
        let resT = [].concat(res1, res2)
                         .sort((a, b) => b.timestamp - a.timestamp)

        // Create sub-slices into the timeline grouped by environmental context.
        let timeline = []
        for (var i = 1, sliceIdx = 0; i <= resT.length - 2; i++) {
            var diff = resT[i - 1].timestamp - resT[i].timestamp

            // Determine whether this is a new sub-slice point (or the end of the timeline).
            if (Math.floor(diff / (60 * 60 * 1000)) > 0) {
                timeline.push(resT.slice(sliceIdx, i))
                sliceIdx = i
            }
            if (i == resT.length - 3)
                timeline.push(resT.slice(sliceIdx, resT.length))
        }

        // Accumulate the uniqued set of questions for every survey for this study.
        // This represents every possible question a participant might have.
        let questions = activities
                            .filter(x => x.spec === 'QWN0aXZpdHlTcGVjOjE~')
                            .map(x => x.settings)
                            .reduce((prev, curr) => prev.concat(curr), [])
                            .map(x => x.text)
        if (!!catMap)
            questions = questions.map(x => (!!catMap ? (catMap[x] || x) : x))

        // Accumulate the set of responses to every question in this study.
        // This represents every possible answer a participant may have given.
        let answers = result_events
                        .filter(x => !!x.static_data && !!x.static_data.survey_name)
                        .map(x => x.temporal_events.map(y => ({ ...y, timestamp: x.timestamp })))
                        .reduce((prev, curr) => prev.concat(curr), [])

        // Zip-reduce every answer with its matching question and convert format.
        // This represents the X->Y map with optional bar width.
        let data = questions
                      .reduce((prev, curr) => ({
                          ...prev,
                          [curr]: answers.filter(a => (!!catMap ? (catMap[a.item] || a.item) : a.item) === curr)
                      }), {})

        // Average each question's answer array and convert it to the right format.
        // This produces an average whole-study event for every answer given.
        let avgData = Object.values(data).map(a => ({
            item: a.length > 0 ? a[0].item : '',
            value: a.reduce((a, b) => a + parseInt(b.value), 0) / a.length,
            duration: Math.floor(a.reduce((a, b) => a + b.duration, 0) / a.length)
        }))

        // "Rephrase" the zippered data for the mini sparkline plots.
        let surveyData = Object.entries(data)
                            .map(x => [x[0], Object.values(x[1]
                                .reduce((prev, curr) => {
                                    prev[curr.timestamp] = [...(prev[curr.timestamp] || []), curr]
                                    return prev
                                }, {}))
                            ])
                            .map(x => { console.log(JSON.stringify(x[1], 0, 4)); return x })
                            .map(x => [x[0], x[1].map(y => ({
                                    category: x[0],
                                    value: y.reduce((a, b) => a + b.value, 0) / y.length,
                                    date: new Date(y[0].timestamp)
                                }))
                            ])
                            .reduce((prev, curr) => ({ ...prev, [curr[0]]: curr[1] }), {})


    return {timeline, avgData, surveyData}
}

// Convert a Result timeline event into a VariableBarGraph object.
    export function convertGraphData(e) { 
        return !e ? [] : e.map(x => !!x ?
        ({
            x: isNaN(x.duration) ? 0 : x.duration || 0,
            y: (e.activity_type != null ? (isNaN(parseFloat(x.item)) ? 0 : parseFloat(x.item)  || 0) : isNaN(x.value) ? 0 : x.value || 0),
            longTitle: x.item || '',
            shortTitle: surveyMap[x.item] || '',
        }) : ({ x: 0, y: 0, longTitle: '', shortTitle: '' }))
    }
