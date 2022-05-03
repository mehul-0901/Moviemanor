import React, {useState} from "react"
import { Typography, Button } from "@mui/material"
import { makeStyles } from '@material-ui/core';


const useStyles = makeStyles({
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: "2rem"
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
            <div style={{display: "flex", columnGap: "3rem", justifyContent: "center", width: "auto", maxWidth: "1000px", margin: "auto"}}>
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
            <div style={{display: "flex", columnGap: "3rem", justifyContent: "center", width: "auto", maxWidth: "1000px", margin: "auto"}}>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(710356)
                }}>Romantic</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(14267)
                }}>Glamorous</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(128)
                }}>Powerful</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(5590)
                }}>Euphoric</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(26302)
                }}>Trippy</Button>
            </div>
        )
    }

    const sadMood = () => {
        return (
            <div style={{display: "flex", columnGap: "3rem", justifyContent: "center", width: "auto", maxWidth: "1000px", margin: "auto"}}>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(892772)
                }}>Ashamed</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(2039)
                }}>Lonely</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(62215)
                }}>Depressed</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(1807)
                }}>Empty</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(544)
                }}>Devastated</Button>
            </div>
        )
    }

    const angryMood = () => {
        return (
            <div style={{display: "flex", columnGap: "3rem", justifyContent: "center", width: "auto", maxWidth: "1000px", margin: "auto"}}>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(9067)
                }}>Tough</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(36850)
                }}>Grumpy</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(11524)
                }}>Riled Up</Button>
            </div>
        )
    }

    const neutralMood = () => {
        return (
            <div style={{display: "flex", columnGap: "3rem", justifyContent: "center", width: "auto", maxWidth: "1000px", margin: "auto"}}>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(103328)
                }}>Bored</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(24192)
                }}>Skeptical</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(2105)
                }}>Horny</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(44479)
                }}>Curious</Button>
                <Button className={classes.button} onClick={(e) => {
                    e.preventDefault()
                    props.setMoodId(9353)
                }}>Safe</Button>
            </div>
        )
    }

    return(
        <div style={{marginTop: "11rem"}}>
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
            {backOption && <Button sx={{fontSize: "1rem"}} onClick={(e) => {
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