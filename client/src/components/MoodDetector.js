import React, {useState} from "react"
import { Typography, Button } from "@mui/material"
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles({
	button: {
		color: '#676fe9',
		fontWeight: 'bold',
		fontSize: "2rem",
        '&:hover': {
            backgroundColor: "#676fe9",
            color: "white"
        }
	}
});


const MoodDetector = (props) => {
    const classes = useStyles()
    const [initialMoods, setInitialMoods] = useState(true)
    const [happyMoods, setHappyMoods] = useState(false)
    const [sadMoods, setSadMoods] = useState(false)
    const [angryMoods, setAngryMoods] = useState(false)
    const [neutralMoods, setNeutralMoods] = useState(false)
    const [backOption, setBackOption] = useState(false)

    const initialMood = () => {
        return (
            <div style={{display: "flex", columnGap: "3rem", justifyContent: "center", width: "auto", maxWidth: "1100px", margin: "auto"}}>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    setInitialMoods(false)
                    setHappyMoods(true)
                    setSadMoods(false)
                    setAngryMoods(false)
                    setNeutralMoods(false)
                    setBackOption(true)
                }}>Happy</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    setInitialMoods(false)
                    setHappyMoods(false)
                    setSadMoods(true)
                    setAngryMoods(false)
                    setNeutralMoods(false)
                    setBackOption(true)
                }}>Sad</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    setInitialMoods(false)
                    setHappyMoods(false)
                    setSadMoods(false)
                    setAngryMoods(true)
                    setNeutralMoods(false)
                    setBackOption(true)
                }}>Angry</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    setInitialMoods(false)
                    setHappyMoods(false)
                    setSadMoods(false)
                    setAngryMoods(false)
                    setNeutralMoods(true)
                    setBackOption(true)
                }}>Neutral</Button>
            </div>
        )
    }

    const happyMood = () => {
        return (
            <div style={{display: "flex", columnGap: "3rem", justifyContent: "center", width: "auto", maxWidth: "1100px", margin: "auto"}}>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(710356)
                    props.setMyMood("Romantic")
                }}>Romantic</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(14267)
                    props.setMyMood("Glamorous")
                }}>Glamorous</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(128)
                    props.setMyMood("Powerful")
                }}>Powerful</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(5590)
                    props.setMyMood("Euphoric")
                }}>Euphoric</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(26302)
                    props.setMyMood("Trippy")
                }}>Trippy</Button>
            </div>
        )
    }

    const sadMood = () => {
        return (
            <div style={{display: "flex", columnGap: "3rem", justifyContent: "center", width: "auto", maxWidth: "1100px", margin: "auto"}}>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(892772)
                    props.setMyMood("Ashamed")
                }}>Ashamed</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(2039)
                    props.setMyMood("Lonely")
                }}>Lonely</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(62215)
                    props.setMyMood("Depressed")
                }}>Depressed</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(1807)
                    props.setMyMood("Empty")
                }}>Empty</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(544)
                    props.setMyMood("Devastated")
                }}>Devastated</Button>
            </div>
        )
    }

    const angryMood = () => {
        return (
            <div style={{display: "flex", columnGap: "3rem", justifyContent: "center", width: "auto", maxWidth: "1100px", margin: "auto"}}>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(9067)
                    props.setMyMood("Tough")
                }}>Tough</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(36850)
                    props.setMyMood("Grumpy")
                }}>Grumpy</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(11524)
                    props.setMyMood("Riled Up")
                }}>Riled Up</Button>
            </div>
        )
    }

    const neutralMood = () => {
        return (
            <div style={{display: "flex", columnGap: "3rem", justifyContent: "center", width: "auto", maxWidth: "1100px", margin: "auto"}}>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(103328)
                    props.setMyMood("Bored")
                }}>Bored</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(24192)
                    props.setMyMood("Skeptical")
                }}>Skeptical</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(2105)
                    props.setMyMood("Horny")
                }}>Horny</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(44479)
                    props.setMyMood("Curious")
                }}>Curious</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setPageNum(1)
                    props.setMoodId(9353)
                    props.setMyMood("Safe")
                }}>Safe</Button>
            </div>
        )
    }

    if(!props.moodId){
        props.setPageNum()
    }
    return(
        <div style={{marginTop: "17rem"}}>
            <Typography variant="h2" component="h1" sx={{color: "#fff", fontWeight: "bold !important"}}>
                I am feeling...
            </Typography>
            <br />
            <br />
            
            {initialMoods && initialMood()}
            {happyMoods && happyMood()}
            {sadMoods && sadMood()}
            {angryMoods && angryMood()}
            {neutralMoods && neutralMood()}
            <br />
            <br />
            {backOption && <Button style={{textDecoration: "none", fontSize: "larger", textAlign: "start", color: "#c384d2"}} onClick={(e) => {
                e.preventDefault()
                setSadMoods(false)
                setAngryMoods(false)
                setHappyMoods(false)
                setNeutralMoods(false)
                setBackOption(false)
                setInitialMoods(true)
            }}>Go Back</Button>}
        </div>
    )
}

export default MoodDetector