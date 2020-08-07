// Core Imports
import React, { useState } from "react"
import {
  Container,
  Typography,
  Grid,
  Card,
  Box,
  AppBar,
  Toolbar,
  Icon,
  IconButton,
  useMediaQuery,
  useTheme,
  ButtonBase,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@material-ui/core"
import CloseIcon from "@material-ui/icons/Close"
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles"
import { Participant as ParticipantObj } from "lamp-core"
import { ReactComponent as Book } from "../icons/Book.svg"
import { ReactComponent as MoodTips } from "../icons/MoodTips.svg"
import { ReactComponent as SleepTips } from "../icons/SleepTips.svg"
import { ReactComponent as Chat } from "../icons/Chat.svg"
import { ReactComponent as Wellness } from "../icons/Wellness.svg"
import { ReactComponent as PaperLens } from "../icons/PaperLens.svg"
import { ReactComponent as Info } from "../icons/Info.svg"
import { ReactComponent as Lightning } from "../icons/Lightning.svg"
import ResponsiveDialog from "./ResponsiveDialog"
import BottomMenu from "./BottomMenu"
import LearnTips from "./LearnTips"
import classnames from "classnames"
import Link from "@material-ui/core/Link"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardlabel: {
      fontSize: 16,
      padding: "0 18px",
      bottom: 15,
      position: "absolute",
      width: "100%",
      [theme.breakpoints.up("lg")]: {
        fontSize: 18,
      },
    },
    header: {
      background: "#FFF9E5",
      padding: 20,

      "& h2": {
        fontSize: 25,
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.75)",
      },
    },
    linkButton: {
      padding: "15px 25px 15px 25px",
    },
    dialogueContent: {
      padding: 20,
      "& h4": { fontSize: 16, fontWeight: "bold", marginBottom: 15 },
    },
    inlineHeader: {
      background: "#FFFFFF",
      boxShadow: "none",

      "& h5": { fontSize: 25, paddingLeft: 20, color: "rgba(0, 0, 0, 0.75)", fontWeight: 600 },
    },
    toolbardashboard: {
      minHeight: 65,
      "& h5": {
        color: "rgba(0, 0, 0, 0.75)",
        textAlign: "center",
        fontWeight: "600",
        fontSize: 18,
        width: "100%",
      },
    },
    closeButton: {
      position: "absolute",
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
    dialogueStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    dialogtitle: { padding: 0 },

    backbtn: { paddingLeft: 0, paddingRight: 0 },
    learn: {
      background: "#FFF9E5",
      padding: "10px 0",
      minHeight: 180,
      textAlign: "center",
      boxShadow: "none",
      borderRadius: 18,
      position: "relative",
      width: "100%",
      "& svg": {
        [theme.breakpoints.up("lg")]: {
          width: 150,
          height: 150,
        },
      },

      [theme.breakpoints.up("lg")]: {
        minHeight: 240,
      },
    },
    thumbMain: { maxWidth: 255 },
    thumbContainer: { maxWidth: 1055 },
    fullwidthBtn: { width: "100%" },
    topicon: {
      minWidth: 120,
    },
    tipicon: {
      minWidth: 200,
      minHeight: 200,

      [theme.breakpoints.down("xs")]: {
        minWidth: 180,
        minHeight: 180,
      },
    },

    btnyellow: {
      background: "#FFD645",
      borderRadius: "40px",
      minWidth: "200px",
      boxShadow: "0px 10px 15px rgba(255, 214, 69, 0.25)",
      lineHeight: "38px",
      marginTop: "15%",

      textTransform: "capitalize",
      fontSize: "16px",
      color: "rgba(0, 0, 0, 0.75)",
      "&:hover": { background: "#cea000" },
    },
  })
)

const data = {
  Motivation: {
    description: "Motivation",
    data: [
      {
        title: "",
        text: "“You may encounter many defeats but you must not be defeated.“",
        author: "Dr. Maya Angelou",
        link: "",
        image:
          "https://images.unsplash.com/photo-1520170851591-43094f4d218e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
      },
      {
        title: "",
        text:
          "“Once you replace negative thoughts with positive ones, you'll start having positive results.“ Willie Nelson",
        author: "Willie Nelson",
        link: "",
        image:
          "https://images.unsplash.com/photo-1529528744093-6f8abeee511d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
      },
      {
        title: "",
        text: "“Your present circumstances don't determine where you can go; they merely determine where you start.“ ",
        author: "Nido Qubein",
        link: "",
        image:
          "https://images.unsplash.com/photo-1529528744093-6f8abeee511d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
      },
      {
        title: "",
        text: "“Every day begins with an act of courage and hope: getting out of bed.“",
        author: "Mason Cooley",
        link: "",
        image:
          "https://images.unsplash.com/photo-1458014854819-1a40aa70211c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
      },
      {
        title: "",
        text: "“This feeling will pass. The fear is real but the danger is not.“",
        author: "Cammie McGovern",
        link: "",
        image:
          "https://images.unsplash.com/photo-1534577403868-27b805ca4b9c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
      },
      {
        title: "",
        text: "“Your illness is not your identity. Your chemistry is not your character.“",
        author: "Pastor Rick Warren",
        link: "",
        image:
          "https://images.unsplash.com/photo-1500964757637-c85e8a162699?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
      },
      {
        title: "",
        text:
          "“One small crack does not mean that you are broken, it means that you were put to the test and you didn't fall apart.“",
        author: "Linda Poindexter",
        link: "",
        image:
          "https://images.unsplash.com/photo-1517014398630-12a36115e4f5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60",
      },
    ],
  },
  Resources: {
    description: "Resources",
    data: [
      {
        title: "",
        text: "Department of Mental Health (DMH)",
        author: "",
        link: "https://www.mass.gov/orgs/massachusetts-department-of-mental-health",
        image: "https://d2q79iu7y748jz.cloudfront.net/s/_squarelogo/ca2246dc9b9d93d74e481c52903e7fea",
      },
      {
        title: "",
        text: "National Alliance on Mental Illness (NAMI)",
        author: "",
        link: "https://www.nami.org/#",
        image:
          "https://media-exp1.licdn.com/dms/image/C4D1BAQF0aQaDZZqoBg/company-background_10000/0?e=2159024400&v=beta&t=wng_qIGKZEkBnziD9RRSdEB60m-o_yICs1EN5WL9wWE",
      },
      {
        title: "",
        text: "NAMI Massachussetts",
        author: "",
        link: "https://namimass.org/",
        image:
          "https://media-exp1.licdn.com/dms/image/C4D1BAQF0aQaDZZqoBg/company-background_10000/0?e=2159024400&v=beta&t=wng_qIGKZEkBnziD9RRSdEB60m-o_yICs1EN5WL9wWE",
      },
    ],
  },
  Suggested_Reading: {
    description: "Suggested reading",
    data: [
      {
        title: "What Doesn't Kill Us: The New Psychology of Posttraumatic Growth",
        text:
          "For the past twenty years, pioneering psychologist Stephen Joseph has worked with survivors of " +
          "trauma. His studies have yielded a startling discovery: that a wide range of traumatic events—from " +
          "illness, divorce, separation, assault, and bereavement to accidents, natural disasters, and " +
          "terrorism—can act as catalysts for positive change. Boldly challenging the conventional wisdom about " +
          "trauma and its aftermath, Joseph demonstrates that rather than ruining one's life, a traumatic event " +
          "can actually improve it.",
        link: "https://www.amazon.com/What-Doesnt-Kill-Psychology-Posttraumatic/dp/0465032338",
      },
      {
        title: "An Unquiet Mind",
        text:
          "Here Jamison examines bipolar illness from the dual perspectives of the healer and the healed, " +
          "revealing both its terrors and the cruel allure that at times prompted her to resist taking " +
          "medication. An Unquiet Mind is a memoir of enormous candor, vividness, and wisdom—a deeply powerful " +
          "book that has both transformed and saved lives.",
        link: "https://www.amazon.com/Unquiet-Mind-Memoir-Moods-Madness/dp/0679763309",
      },
      {
        title: "The Center Cannot Hold: My Journey Through Madness",
        text:
          "The Center Cannot Hold is the eloquent, moving story of Elyn's life, from the first time that she " +
          "heard voices speaking to her as a young teenager, to attempted suicides in college, through learning " +
          "to live on her own as an adult in an often terrifying world. Saks discusses frankly the paranoia, the " +
          "inability to tell imaginary fears from real ones, the voices in her head telling her to kill herself " +
          "(and to harm others), as well as the incredibly difficult obstacles she overcame to become a highly " +
          "respected professional. This beautifully written memoir is destined to become a classic in its genre.",
        link:
          "https://www.amazon.com/Center-Cannot-Hold-Journey-Through-ebook/dp/B000WHVRZS/ref=sr_1_1?dchild=1&keywords=The+Center+Cannot+Hold%3A+My+Journey+Through+Madness&qid=1587412282&sr=8-1",
      },
      {
        title: "The Quiet Room: A Journey Out of the Torment of Madness",
        text:
          "At 17, Lori Schiller was the perfect child - the only daughter of an affluent, close-knit family. Six " +
          "years later she made her first suicide attempt, then wandered the streets of New York City dressed in " +
          "ragged clothes, tormenting voices crying out in her mind. Lori Schiller had entered the horrifying " +
          "world of full-blown schizophrenia. She began an ordeal of hospitalizations, halfway houses, relapses, " +
          "more suicide attempts, and constant, withering despair. But against all odds, she survived. In this " +
          "personal account, she tells how she did it, taking us not only into her own shattered world, but " +
          "drawing on the words of the doctors who treated her and family members who suffered with her.",
        link:
          "https://www.amazon.com/Quiet-Room-Journey-Torment-Madness/dp/B07CGXSW9W/ref=sr_1_1?dchild=1&keywords=The+Quiet+Room%3A+A+Journey+Out+of+the+Torment+of+Madness&qid=1587412330&sr=8-1",
      },
      {
        title: "Touched with Fire: Manic-Depressive Illness and the Artistic Temperament",
        text:
          "The anguished and volatile intensity associated with the artistic temperament was once thought to be " +
          "a symptom of genius or eccentricity peculiar to artists, writers, and musicians. Her work, based on " +
          "her study as a clinical psychologist and researcher in mood disorders, reveals that many artists " +
          "subject to exalted highs and despairing lows were in fact engaged in a struggle with clinically " +
          "identifiable manic-depressive illness.",
        link:
          "https://www.amazon.com/Touched-Fire-Manic-depressive-Artistic-Temperament-ebook/dp/B001D1YCM2/ref=sr_1_1?dchild=1&keywords=Touched+with+Fire%3A+Manic-Depressive+Illness+and+the+Artistic+Temperament&qid=1587412403&s=audible&sr=8-1",
      },
      {
        title: "Manic: A Memoir",
        text:
          "In bursts of prose that mirror the devastating highs and extreme lows of her illness, Cheney " +
          "describes her roller-coaster life with shocking honesty - from glamorous parties to a night in jail; " +
          "from flying 14 kites off the edge of a cliff in a thunderstorm to crying beneath her office desk; from " +
          "electroshock therapy to a suicide attempt fueled by tequila and prescription painkillers. With Manic, " +
          "Cheney gives voice to the unarticulated madness she endured.",
        link:
          "https://www.amazon.com/Manic-A-Memoir/dp/B07BR6GT34/ref=sr_1_2?dchild=1&keywords=Manic%3A+A+Memoir&qid=1587412462&sr=8-2",
      },
      {
        title: "Night Falls Fast",
        text:
          "An internationally acknowledged authority on depressive illnesses, Dr. Jamison has also known suicide " +
          "firsthand: after years of struggling with manic-depression, she tried at age 28 to kill herself. " +
          "Weaving together a historical and scientific exploration of the subject with personal essays on " +
          "individual suicides, she brings not only her remarkable compassion and literary skill but also all of " +
          "her knowledge and research to bear on this devastating problem. This is a book that helps us to " +
          "understand the suicidal mind, to recognize and come to the aid of those at risk, and to comprehend the " +
          "profound effects on those left behind. It is critical listening for parents, educators, and anyone " +
          "wanting to understand this tragic epidemic.",
        link:
          "https://www.amazon.com/Night-Falls-Fast-Understanding-Suicide/dp/B07VC9HXS6/ref=sr_1_1?dchild=1&keywords=Night+Falls+Fast+%28Suicide%29&qid=1587412552&s=audible&sr=1-1",
      },
      {
        title: "The Body Keeps the Score: Brain, Mind, and Body in the healing of Trauma",
        text:
          "A pioneering researcher and one of the world’s foremost experts on traumatic stress offers a bold new " +
          "paradigm for healing Trauma is a fact of life. Veterans and their families deal with the painful " +
          "aftermath of combat; one in five Americans has been molested; one in four grew up with alcoholics; one " +
          "in three couples have engaged in physical violence. Such experiences inevitably leave traces on minds, " +
          "emotions, and even on biology. Sadly, trauma sufferers frequently pass on their stress to their " +
          "partners and children. Renowned trauma expert Bessel van der Kolk has spent over three decades working " +
          "with survivors. In The Body Keeps the Score, he transforms our understanding of traumatic stress, " +
          "revealing how it literally rearranges the brain’s wiring - specifically areas dedicated to pleasure, " +
          "engagement, control, and trust. He shows how these areas can be reactivated through innovative " +
          "treatments including neuro feedback, mindfulness techniques, play, yoga, and other therapies.",
        link:
          "https://www.amazon.com/Body-Keeps-Score-Healing-Trauma/dp/B00OBT7KAO/ref=sr_1_1?dchild=1&keywords=The+Body+Keeps+the+Score%3A+Brain%2C+Mind%2C+and+Body+in+the+healing+of+Trauma&qid=1587412590&s=audible&sr=1-1",
      },
      {
        title: "Trauma and Recovery",
        text:
          "Trauma and Recovery is revered as the seminal text on understanding trauma survivors. By placing " +
          "individual experience in a broader political frame, Harvard psychiatrist Judith Herman argues that " +
          "psychological trauma is inseparable from its social and political context. Drawing on her own research " +
          "on incest, as well as a vast literature on combat veterans and victims of political terror, she shows " +
          "surprising parallels between private horrors like child abuse and public horrors like war.",
        link:
          "https://www.amazon.com/Trauma-Recovery-Aftermath-Violence-Political/dp/B081TPMLRT/ref=sr_1_1?dchild=1&keywords=trauma+and+recovery&qid=1587412647&s=audible&sr=1-1",
      },
      {
        title: "Supersurvivors: The Surprising Link Between Suffering and Success",
        text:
          "Starting where resiliency studies leave off, two psychologists explore the science of remarkable " +
          "accomplishment in the wake of trauma, revealing the surprising principles that allow people to " +
          "transform their lives and achieve extraordinary things.",
        link:
          "https://www.amazon.com/Supersurvivors-Surprising-Between-Suffering-Success-ebook/dp/B00FVW5G4M/ref=sr_1_1?dchild=1&keywords=Supersurvivors%3A+The+Surprising+Link+Between+Suffering+and+Success&qid=1587412741&s=instant-video&sr=8-1",
      },
    ],
  },
  Stress_Tips: {
    description: "Stress Tips",
    data: [
      {
        title: "Color or Doodle",
        text:
          "Coloring or drawing can help calm the mind. If facing a blank page is stressful, you can get a coloring " +
          "book or search ‘coloring book’ in your app store or play store. Turning an empty page into a piece of " +
          "art or completing a page in a coloring book allows you to be creative and give your mind a break.",
        link: "https://www.healthline.com/health/mindfulness-tricks-to-reduce-anxiety#1",
      },
      {
        title: "Meditate to let go of stress",
        text:
          "According to the United Kingdom National Health Service, potential triggers for psychotic episodes are " +
          "stressful life events. Although this does not cause schizophrenia, they can lead to its development. " +
          "Watch this one-minute meditation video to practice letting go of stress.",
        link: "https://www.youtube.com/watch?v=c1Ndym-IsQg",
      },
      {
        title: "Wish others happiness",
        text:
          "Chade-Meng Tan developed this practice of wishing others happiness. The beauty of this practice is it " +
          "only takes 10 seconds and is done completely in your head. You can do it anywhere. If you’re at the " +
          "grocery store, the gym, or your workplace, randomly wish for someone to be happy today. Challenge " +
          "yourself further by wishing someone that you are annoyed with happiness. For example, if someone who " +
          "cuts you off in line at the market, wish them well in your mind.",
        link: "https://www.healthline.com/health/mindfulness-tricks-to-reduce-anxiety#3",
      },
      {
        title: "Focus on one thing at a time",
        text:
          "Although multitasking is often thought of as a skill, it can also cause you to feel overwhelmed. " +
          "Consider focusing on one task at time to minimize stress. Choose a task and give it your undivided " +
          "attention. Set a timer on your phone and avoid checking it until the timer goes off.",
        link: "https://www.healthline.com/health/mindfulness-tricks-to-reduce-anxiety#5",
      },
      {
        title: "Focus on your breathing",
        text:
          "Low level of social interaction was found to have an impact on lifespan equivalent to smoking nearly a " +
          "pack of cigarettes a day or being an alcoholic, and was twice as harmful as being obese. ",
        link: "https://ggia.berkeley.edu/practice/mindful_breathing",
      },
      {
        title: "Log out of all your social media",
        text:
          "Social media can be a fun way to connect with others, but too much time spent on it can cause anxiety " +
          "and reduce productivity. It is known to cause feelings of inadequacy and loneliness. Log out of your " +
          "accounts for a period of time to give your mind a break. Logging out will slow down your access to " +
          "social media or stop you from seeing it altogether. Reflect on how you feel during your time away from " +
          "these accounts.",
        link: "https://www.healthline.com/health/mindfulness-tricks-to-reduce-anxiety#5",
      },
      {
        title: "Journaling can be healing",
        text:
          "Whether it’s writing what you are grateful for or what you did today, the act of writing in a journal " +
          "can be very therapeutic. There is no right or wrong topic to write about, making journaling care-free. " +
          "Sharing your thoughts can help ease your mind. Get out a piece of paper or open up the notes section in " +
          "your phone and write about anything for five minutes. Let your mind wander as you write, and then think " +
          "about what you wrote. If you prefer having something to write about consider getting a guided journal, " +
          "or search ‘Journal’ in your phone’s app store.",
        link: "https://www.healthline.com/health/mindfulness-tricks-to-reduce-anxiety#5",
      },
      {
        title: "Reduce your screen time",
        text:
          +"Whether it’s playing games or scrolling through social media, time flies while using our smartphones. " +
          "Stepping away from your phone can reduce the pressures that come with it. Minimize the amount of time " +
          "you spend by putting your phone on ‘do not disturb’ or ‘silent’. If you still want to receive " +
          "notifications from some features on your phone, another method is to turn off notifications from " +
          "specific apps. This can be done through the app itself or through the settings apps on your phone.",
        link: "https://www.cnet.com/how-to/screen-time-is-rising-and-its-ruining-us-here-are-11-ways-to-cut-back/",
      },
    ],
  },
  Sleep_Tips: {
    description: "Sleep Tips",
    data: [
      {
        title: "Weekends",
        text:
          "Dr. Epstein explains that psychiatric and psychological problems can be related to sleep. To improve " +
          "your sleep, try sticking to a sleep schedule even on the weekends. If you sleep in on the weekends, it " +
          "will be difficult to get back to your routine during the week. Waking up within the same hour everyday " +
          "can help both your physical and mental health over time. For the next seven days, try waking up at the " +
          "same time every day.",
        link:
          "https://www.insider.com/things-that-are-not-helping-your-mental-health-2018-9#those-retail-therapy-sessions-might-make-you-feel-poor-in-more-ways-than-one-5",
      },
      {
        title: "7-9 Hours",
        text:
          "Adults are recommended to have 7-9 hours of sleep without interruption [National Sleep Foundation]." +
          "Think about how many hours of sleep you get every night. Is this more or less than 7-9 hours? Sleeping " +
          "this suggested amount can make you feel rejuvenated, motivated, and focused during the day. A lack of " +
          "sleep can negatively impact your mood. Try sleeping the suggested amount of sleep tonight and note how " +
          "you feel when you wake up.",
        link:
          "https://www.forbes.com/sites/nomanazish/2018/09/25/how-to-overcome-mental-fatigue-according-to-an-expert/#1dd602164454",
      },
      {
        title: "Take Breaks",
        text:
          "Taking intermittent breaks can help you feel rejuvenated throughout the day. Dr. Boyes explains that " +
          "“taking breaks help prevent tunnel vision.” A break can clear your mind. Taking time for yourself can " +
          "make you more productive. Try to take a few 10-minute breaks today and reflect on how you feel.",
        link:
          "https://www.forbes.com/sites/nomanazish/2018/09/25/how-to-overcome-mental-fatigue-according-to-an-expert/#3b51c9751644",
      },
      {
        title: "Memory and learning are connected to sleep",
        text:
          "The deepest stage of sleep is known as Rapid Eye Movement (REM). This stage of sleep affects the parts " +
          "of the brain that are used for learning. Research shows that people deprived of REM sleep struggle with " +
          "recalling what they have learned. Uninterrupted sleep can help you think more clearly and remember more.",
        link: "https://www.neurocorecenters.com/blog/10-facts-might-not-know-sleep-mental-health",
      },
      {
        title: "Optimize your bedroom for sleep",
        text:
          "Caffeine is a stimulant that helps people feel alert. It is found in coffee, tea, chocolate, and more. " +
          "Although caffeine is safe to consume, it takes hours for half of it to be removed from the body. Having " +
          "food or drinks with high levels of caffeine close to your bedtime can make you feel anxious, irritable, " +
          "and disturb your sleep entirely. Get a more restful sleep by stopping your caffeine intake a few hours " +
          "before bed.",
        link: "https://www.sleepfoundation.org/articles/caffeine-and-sleep",
      },
      {
        title: "Use your bedroom only for sleep",
        text:
          "Treat your bed and bedroom as your sanctuary. It is your safe space away from all of the stresses in " +
          "your life. Try not to work or use electronics in your bedroom. Over time the brain will learn to " +
          "associate the room or the bed with sleeping, and therefore, makes it easier for you to fall asleep.",
        link:
          "https://www.sleepfoundation.org/press-release/americans-bedrooms-are-key-better-sleep-according-new-national-sleep-foundation-poll",
      },
      {
        title: "Establish a regular bedtime routine",
        text:
          "Routines help promote health and wellness. Think about the kind of bedtime routine that would help you " +
          "feel more relaxed before bed. Whether it’s not using electronics after a certain time or taking a warm " +
          "bath before bed, doing the same thing every night will help your brain and body know it’s time to rest. " +
          " Other examples include reading a book, meditating, and journaling. ",
        link: "https://www.sleepfoundation.org/articles/caffeine-and-sleep",
      },
    ],
  },
  Mood_Tips: {
    description: "Mood Tips",
    data: [
      {
        title: "Hope",
        text:
          "What gives you hope? This can look different for everyone. For some it is gardening, for others it is " +
          "making progress towards a goal. Life always has its ups and downs, but hope can push us through the " +
          "low moments. Think about what makes you hopeful and cultivate it. Take a few minutes to write about " +
          "what gives you hope. Next time you feel down, look for what you wrote to remind yourself that even " +
          "when things get tough there is hope for a better day.",
        link: "https://positivepsychology.com/hope-therapy/",
      },
      {
        title: "Goals",
        text:
          "Some goals can feel unattainable. To make the goal seem more reasonable follow these steps. First, " +
          "choose one goal you hope to achieve. Next, create a plan consisting of small actions that move you " +
          "closer to your goal. The last and most important step is to write down 3 short statements to remind " +
          "you that you are capable. For example, “I have potential.”",
        link: "https://positivepsychology.com/hope-therapy/",
      },
      {
        title: "Optimism",
        text:
          "Look at the glass half full today. Write down three things every day that weren't so bad. Try to shift " +
          "your focus from the bad to the good. This can help bring positivity into your life. Think about what " +
          "you're grateful for, such as the ability to walk, having a place to stay, and food to eat.",
        link: "https://www.womenshealthmag.com/health/a24886599/self-care-routine-tips/",
      },
      {
        title: "Don't be so hard to yourself",
        text:
          "Accept that you are going to make mistakes. No one is expected to be perfect, so try to give yourself " +
          "grace. Next time you are feeling down about something you did, reroute your energy to focus on how you " +
          "learned or grew from this experience.",
        link:
          "https://www.lifehack.org/articles/communication/10-great-lessons-highly-successful-people-have-learned-from-failure.html",
      },
    ],
  },
  Social_Tips: {
    description: "Social Tips",
    data: [
      {
        title: "Go outside",
        text:
          " Going outside for just 20 minutes a day can improve your mood. The fresh air can increase your ability " +
          "to stay focused and your attention span. The time spent outside can give your mind relief, encourage " +
          "exercise, and provide room to socialize. Whether it’s going to the store or going to the mailbox, try to " +
          "leave the house.",
        link: "https://earthobservatory.nasa.gov/images/145305/green-space-is-good-for-mental-health",
      },
      {
        title: "Emotional connections",
        text:
          " Research shows that social support can improve both mental and general health. Make a commitment to meet " +
          "up with or contact someone this week. To connect with people far away, consider using web-based methods " +
          "of communication such as social media, email, or text.",
        link: "https://www.mhanational.org/stay-connected",
      },
      {
        title: "Social media",
        text:
          " Social connections with others can bring joy, prevent loneliness and depression, and ease stress. Today, " +
          "social media is one of the main ways people stay connected. Although social media can enable you to stay " +
          "in contact with friends and family, it can sometimes lead to feelings of inadequacy and isolation. This " +
          "week use an app to track how much time you spend on social media each day. Then, set a goal to reduce " +
          "this number. At the end of the week, reflect on your mood and the impact this modification has had.",
        link: "https://www.helpguide.org/articles/mental-health/social-media-and-mental-health.htm",
      },
      {
        title: "Family and friends",
        text: " Connect with family and friends either in-person or virtually through a call, text, or video chat.",
        link: "https://www.purewow.com/wellness/ways-to-mitigate-anxiety?amphtml=true",
      },
      {
        title: "Increase social interactions",
        text:
          "Low level of social interaction was found to have an impact on lifespan equivalent to smoking nearly a " +
          "pack of cigarettes a day or being an alcoholic, and was twice as harmful as being obese. ",
        link: "https://www.mhanational.org/stay-connected",
      },
    ],
  },
  Definitions: {
    description: "Definitions",
    data: [
      {
        title: "CBT vs DBT",
        text:
          " Cognitive-behavioral therapy (CBT) is one of the most commonly practiced forms of psychotherapy today. " +
          "It’s focus is on helping people learn how their thoughts color and can actually change their feelings " +
          "and behaviors. It is usually time-limited and goal-focused as practiced by most psychotherapists in " +
          "the U.S. today. Dialectical behavior therapy (DBT) is a specific form of cognitive-behavioral therapy. " +
          "DBT seeks to build upon the foundation of CBT, to help enhance its effectiveness and address specific " +
          "concerns that the founder of DBT, psychologist Marsha Linehan, saw as deficits in CBT..",
        link: "https://psychcentral.com/lib/whats-the-difference-between-cbt-and-dbt/",
      },
      {
        title: "Psychologist vs Psychiatrist",
        text:
          " Psychiatrists have a medical degree along with advanced qualifications from residency and a specialty " +
          "in psychiatry. They use talk therapy, medications, and other treatments to treat people with mental " +
          "health conditions. Psychologists have an advanced degree, such as a PhD or PsyD. Most commonly, they " +
          "use talk therapy to treat mental health conditions. They may also act as consultants along with other " +
          "healthcare providers or study therapy for entire treatment programs. Both types of providers must be " +
          "licensed in their area to practice. Psychiatrists are also licensed as medical doctors.",
        link:
          "https://www.healthline.com/health/mental-health/what-is-the-difference-between-a-psychologist-and-a-psychiatrist#practice",
      },
    ],
  },
  Physical_Wellness: {
    description: "Physical Wellness",
    data: [
      {
        title: "Exercise",
        text:
          " Exercise has the ability to ease stress, improve mood, and minimize chronic pain. Working out is proven " +
          "to improve and normalize the neurotransmitter levels in your body. Neurotransmitter levels increased by " +
          "exercise include serotonin, dopamine, and norepinephrine. This increase in neurotransmitters has a " +
          "positive impact on your mental health.",
        link: "https://kids.frontiersin.org/article/10.3389/frym.2019.00035",
      },
      {
        title: "Drink Water",
        text:
          "'Drink a glass of water as soon as you wake up' - Vandana R. Sheth, RDN. Improve your mornings by " +
          "drinking a cup of water when you wake up. Your body is usually dehydrated from sleeping and this small " +
          "act can help you start the day feeling energized.",
        link: "https://www.womenshealthmag.com/health/a24886599/self-care-routine-tips/",
      },
      {
        title: "Have a one-minute dance party!",
        text:
          "We can be so busy every day that we forget to move around and have fun. Take this time to put on your " +
          "favorite song and get moving! You can do this on your own, with a friend, or a family member.",
        link: "https://www.womenshealthmag.com/health/a24886599/self-care-routine-tips/",
      },
      {
        title: "Have you moved today?",
        text:
          "Sometimes we get so caught up in our daily routine that we forget to be active. If you don’t have time " +
          "in your schedule for exercising today, try going on a short stroll to stretch your legs. Even this " +
          "little bit of exercise a few times a day can have a positive impact on your health. Over time, increase " +
          "the amount of time you dedicate to exercising. The more you do, the more benefits you will gain.",
        link: "https://www.helpguide.org/articles/healthy-living/the-mental-health-benefits-of-exercise.htm",
      },
      {
        title: "How many steps did you get today?",
        text:
          "Your smartphone can help you track how many steps you have taken. Try guessing how many steps you have " +
          "taken today, then check your step-count estimate on your phone. Did you take more or less steps than you " +
          "thought you did? This week, set a goal to increase your amount of steps. You can accomplish this by " +
          "taking the stairs instead of the elevator, or walking a pet. Get creative! Check your step-count to see " +
          "if you are hitting your goal.",
        link: "https://www.howtogeek.com/238904/how-to-track-your-steps-with-just-an-iphone-or-android-phone/",
      },
      {
        title: "Exercise can improve your memory",
        text:
          "Endorphins are hormones in our body that are released during exercise. They are known for making you " +
          "feel good, but they also help you concentrate. Working out also helps prevent memory loss from old age.",
        link: "https://www.helpguide.org/articles/healthy-living/the-mental-health-benefits-of-exercise.htm",
      },
      {
        title: "Too tired or stressed to exercise?",
        text:
          "Exercise can actually increase your energy and make you feel less tired. The next time you feel too " +
          "exhausted to exercise, push yourself to just do 5 minutes. Examples of how you can spend this time " +
          "include walking, jumping rope, and at-home exercises. See how you feel after 5 minutes. You might be " +
          "surprised to find that you can go even longer.",
        link: "https://www.helpguide.org/articles/healthy-living/the-mental-health-benefits-of-exercise.htm",
      },
      {
        title: "Don’t compare yourself to others",
        text:
          "Everyone is on a unique fitness journey so do not compare yourself to someone at a different fitness " +
          "level. No matter your current shape, there are always others who have a similar goal as you. Try " +
          "following along to workout videos online. Doing exercises in private can help you build the confidence " +
          "you need to further your fitness journey.",
        link: "https://www.helpguide.org/articles/healthy-living/the-mental-health-benefits-of-exercise.htm",
      },
      {
        title: "Working out can be fun!",
        text:
          "Exercise should be a pleasant experience, especially when you are just getting started. Think about what " +
          "exercise-related activities bring you joy. Maybe you love gardening, walking along the beach, or playing " +
          "fetch with a dog. These activities are fun and get you moving. Brainstorm three activities that you " +
          "enjoy and get you moving.",
        link: "https://www.helpguide.org/articles/healthy-living/the-mental-health-benefits-of-exercise.htm",
      },
      {
        title: "Invite someone to exercise with you",
        text:
          "Having company while exercising can make the activity more enjoyable. This sense of companionship will " +
          "motivate you to complete your workout routine. Set up a date and time with a friend, roommate, or family " +
          "member this week. Having a date scheduled will help hold you accountable.",
        link: "https://www.helpguide.org/articles/healthy-living/the-mental-health-benefits-of-exercise.htm",
      },
      {
        title: "Stretch to calm your mind",
        text:
          "When we get stressed out, the muscles in our body tense up. This is because our muscles are reacting to " +
          "our emotional stress. Release this tension by stretching your neck, shoulders, and back. While you " +
          "stretch, focus on mindfulness exercises or listen to calming sounds to relax your mind.",
        link: "https://www.healthline.com/health/benefits-of-stretching#safety-tips",
      },
    ],
  },
}

export default function Learn({ participant, ...props }: { participant: ParticipantObj; activeTab: Function }) {
  const classes = useStyles()
  const [details, setDetails] = useState(null)
  const [openData, setOpenData] = useState(false)
  const supportsSidebar = useMediaQuery(useTheme().breakpoints.up("md"))
  const [open, setOpen] = useState(false)
  const [tip, setTip] = useState(null)
  const [icon, setIcon] = useState(null)

  const setData = (type: string) => {
    setTip(type.replace(/_/g, " "))
    setIcon(getIcon(type))
    Object.keys(data[type])?.forEach((key) => {
      setDetails(data[type][key])
    })
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "Suggested_Reading":
        return <Book className={classes.tipicon} />
      case "Mood_Tips":
        return <MoodTips className={classes.tipicon} />
      case "Stress_Tips":
        return <Lightning className={classes.tipicon} />
      case "Motivation":
        return <PaperLens className={classes.tipicon} />
      case "Physical_Wellness":
        return <Wellness className={classes.tipicon} />
      case "Resources":
        return <Info className={classes.tipicon} />
      case "Social_Tips":
        return <Chat className={classes.tipicon} />
      case "Sleep_Tips":
        return <SleepTips className={classes.tipicon} />
    }
  }

  return (
    <Container className={classes.thumbContainer}>
      <Grid container spacing={2} direction="row" justify="flex-start" alignItems="center">
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          className={classes.thumbMain}
          onClick={() => {
            setData("Mood_Tips")
            setOpen(true)
          }}
        >
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card className={classes.learn}>
              <Box mt={2} mb={1}>
                <MoodTips />
              </Box>
              <Typography className={classes.cardlabel}>Mood Tips</Typography>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          className={classes.thumbMain}
          onClick={() => {
            setData("Sleep_Tips")
            setOpen(true)
          }}
        >
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card className={classes.learn}>
              <Box mt={2} mb={1}>
                <SleepTips />
              </Box>
              <Typography className={classes.cardlabel}>Sleep Tips</Typography>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          className={classes.thumbMain}
          onClick={() => {
            setData("Social_Tips")
            setOpen(true)
          }}
        >
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card className={classes.learn}>
              <Box mt={2} mb={1}>
                <Chat />
              </Box>
              <Typography className={classes.cardlabel}>Social Tips</Typography>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          className={classes.thumbMain}
          onClick={() => {
            setData("Resources")
            setOpen(true)
          }}
        >
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card className={classes.learn}>
              <Box mt={1}>
                <Info />
              </Box>
              <Typography className={classes.cardlabel}>Mental Health Resources</Typography>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          className={classes.thumbMain}
          onClick={() => {
            setData("Physical_Wellness")
            setOpen(true)
          }}
        >
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card className={classes.learn}>
              <Box mt={2} mb={1}>
                <Wellness />
              </Box>
              <Typography className={classes.cardlabel}>Physical Wellness</Typography>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          className={classes.thumbMain}
          onClick={() => {
            setData("Suggested_Reading")
            setOpen(true)
          }}
        >
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card className={classes.learn}>
              <Box mt={1}>
                <Book />
              </Box>
              <Typography className={classes.cardlabel}>Suggested Reading</Typography>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          className={classes.thumbMain}
          onClick={() => {
            setData("Motivation")
            setOpen(true)
          }}
        >
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card className={classes.learn}>
              <Box mt={2} mb={1}>
                <PaperLens />
              </Box>
              <Typography className={classes.cardlabel}>Motivation</Typography>
            </Card>
          </ButtonBase>
        </Grid>
        <Grid
          item
          xs={6}
          sm={4}
          md={3}
          lg={3}
          className={classes.thumbMain}
          onClick={() => {
            setData("Stress_Tips")
            setOpen(true)
          }}
        >
          <ButtonBase focusRipple className={classes.fullwidthBtn}>
            <Card className={classes.learn}>
              <Box mt={2} mb={1}>
                <Lightning />
              </Box>
              <Typography className={classes.cardlabel}>Stress Tips</Typography>
            </Card>
          </ButtonBase>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        scroll="paper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        className={classes.dialogueStyle}
      >
        <DialogTitle id="alert-dialog-slide-title" className={classes.dialogtitle}>
          <IconButton aria-label="close" className={classes.closeButton} onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
          <div className={classes.header}>
            {icon}
            <Typography variant="h2">{tip}</Typography>
          </div>
        </DialogTitle>
        <DialogContent className={classes.dialogueContent}>Quick Tips to Improve Your {tip}</DialogContent>
        <DialogActions>
          <Box textAlign="center" width={1} mt={1} mb={4}>
            <Link
              onClick={() => {
                setOpen(false)
                setOpenData(true)
              }}
              underline="none"
              className={classnames(classes.btnyellow, classes.linkButton)}
            >
              Read
            </Link>
          </Box>
        </DialogActions>
      </Dialog>
      <ResponsiveDialog
        transient={false}
        animate
        fullScreen
        open={openData}
        onClose={() => {
          setOpenData(false)
        }}
        style={{ paddingLeft: supportsSidebar ? "100px" : "" }}
      >
        <AppBar position="static" className={classes.inlineHeader}>
          <Toolbar className={classes.toolbardashboard}>
            <IconButton
              onClick={() => setOpenData(false)}
              color="default"
              className={classes.backbtn}
              aria-label="Menu"
            >
              <Icon>arrow_back</Icon>
            </IconButton>
          </Toolbar>
          <Typography variant="h5">{tip}</Typography>
        </AppBar>
        {supportsSidebar && <BottomMenu activeTab={props.activeTab} tabValue={0} />}
        <LearnTips
          tip={tip}
          icon={icon}
          type={tip === "Motivation" || tip === "Resources" ? 2 : 1}
          details={details}
          closeDialog={() => setOpenData(false)}
        />
      </ResponsiveDialog>
    </Container>
  )
}
