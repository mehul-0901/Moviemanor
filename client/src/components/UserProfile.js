import React, {useEffect, useState, useContext} from "react";
// import Dropzone from 'react-dropzone-uploader'
import {AuthContext} from '../firebase/Auth';
import { makeStyles } from '@material-ui/core';
import {Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, Typography, Grid, Button, Pagination} from '@mui/material';
import noImage from '../img/profile_icon.png';
const useStyles = makeStyles({
    card: {
      maxWidth: 450,
      height: 'auto',
      marginLeft: 'auto',
      marginRight: 'auto',
      borderRadius: 5,
      border: '1px solid #1e8678',
      boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
    },
    titleHead: {
      borderBottom: '1px solid #1e8678',
      fontWeight: 'bold'
    },
    grid: {
      flexGrow: 1,
      flexDirection: 'row'
    },
    media: {
      height: '100%',
      width: '100%'
    },
    button: {
      color: '#1e8678',
      fontWeight: 'bold',
      fontSize: 12
    }
    
  });



const UserProfile = () =>{
    const classes = useStyles();
    let card=null;
    const {currentUser} = useContext(AuthContext);
    console.log(currentUser);
    const email = currentUser.email || "Email not found";
    const name = currentUser.displayName || "Name not found"
    const photoURL = currentUser.photoURL || noImage
    return (
       
        <div style={{color:"white", justifyContent: "center"}}>
        <Grid item key={email} sx={{paddingLeft: "0px"}}>
        <Card  className={classes.card} sx={{ maxWidth: 345 }} >
        
            <CardHeader 
              avatar={
                <Avatar sx={{ bgcolor: "#e72400" }} aria-label="recipe">
                  {name.charAt(0)}
                </Avatar>
              }
              title={name}
            />
            <CardMedia
              component="img"
              height="300"
              width="300"
              image={photoURL }
              alt={name}
            />
              
        
         
              <CardContent>
                <Typography variant='body2' color='textSecondary' component='span'>
                {email}

                </Typography>
              </CardContent>
            
        </Card>
        <br></br>
      </Grid>

        </div>
       
        


    )
}

export default UserProfile