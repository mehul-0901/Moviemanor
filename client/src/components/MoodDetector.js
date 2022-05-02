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
            <div style={{display: "flex", columnGap: "2rem", justifyContent: "center", width: "auto", maxWidth: "1000px", margin: "auto"}}>
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
            <div style={{display: "flex", columnGap: "2rem", justifyContent: "center", width: "auto", maxWidth: "1000px", margin: "auto"}}>
                <Button className={classes.button}>Romantic</Button>
                <Button className={classes.button}>Glamorous</Button>
                <Button className={classes.button}>Powerful</Button>
                <Button className={classes.button}>Euphoric</Button>
                <Button className={classes.button}>Trippy</Button>
            </div>
        )
    }

    const sadMood = () => {
        return (
            <div style={{display: "flex", columnGap: "2rem", justifyContent: "center", width: "auto", maxWidth: "1000px", margin: "auto"}}>
                <Button className={classes.button}>Ashamed</Button>
                <Button className={classes.button}>Lonely</Button>
                <Button className={classes.button}>Depressed</Button>
                <Button className={classes.button}>Empty</Button>
                <Button className={classes.button}>Devastated</Button>
            </div>
        )
    }

    const angryMood = () => {
        return (
            <div style={{display: "flex", columnGap: "2rem", justifyContent: "center", width: "auto", maxWidth: "1000px", margin: "auto"}}>
                <Button className={classes.button}>Tough</Button>
                <Button className={classes.button}>Grumpy</Button>
                <Button className={classes.button}>Riled Up</Button>
            </div>
        )
    }

    const neutralMood = () => {
        return (
            <div style={{display: "flex", columnGap: "2rem", justifyContent: "center", width: "auto", maxWidth: "1000px", margin: "auto"}}>
                <Button className={classes.button}>Bored</Button>
                <Button className={classes.button}>Skeptical</Button>
                <Button className={classes.button}>Horny</Button>
                <Button className={classes.button}>Curious</Button>
                <Button className={classes.button}>Safe</Button>
            </div>
        )
    }

    return(
        <div style={{marginTop: "10rem"}}>
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