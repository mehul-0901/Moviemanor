import React from "react"
import { Typography } from "@mui/material"

const MoodDetector = (props) => {
    return(
        <div style={{marginTop: "10rem"}}>
            <Typography variant="h2" component="h1" sx={{color: "#fff", fontWeight: "bold !important"}}>
                Select your mood
            </Typography>
        </div>
    )
}

export default MoodDetector