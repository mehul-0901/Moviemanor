import React, {useEffect, useState, useContext} from "react";
import '../App.css';
// import Dropzone from 'react-dropzone-uploader'
import {AuthContext} from '../firebase/Auth';
import { makeStyles } from '@material-ui/core';
import {Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, Typography, Grid, Button, Pagination} from '@mui/material';
import noImage from '../img/profile_icon.png';
import {addProfilePic} from '../firebase/FirebaseFunctions';
import { Navigate, useNavigate } from "react-router-dom";
// var fs = require('fs')
//   , gm = require('gm').subClass({imageMagick: true});
//   module.exports = {
//     //...
//     resolve: {
//       fallback: {
//         "path":false  
//       }
//     }
//   };


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
    // const classes = useStyles();
    // let card=null;
    let {currentUser} = useContext(AuthContext);
    // console.log(currentUser);
    const email = currentUser.email || "Email not found";
    const name = currentUser.displayName || "Name not found"
    const photoURL = currentUser.photoURL || noImage
    const [image,setImage]=useState();
    const navigate=useNavigate();
    const onImageChange=async (e)=>{
      console.log(image);
      try {
        await addProfilePic(image,currentUser.email);
        document.getElementsByName("getImage").value=null;
        navigate('/userProfile');
      } catch (error) {
        console.log(error);
      }
       
   
    }
      return (
        <div style={{marginTop: "5rem"}}>
          <div className="container">
            <div className="main-body">
              <div className="row gutters-sm">
                <div className="col-md-4 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex flex-column align-items-center text-center">
                        <img
                          src={photoURL}
                          alt="Admin"
                          
                          width="150"
                        />
                        <div className="mt-3">
                          <h4> {name} </h4>
                       
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-8">
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="row">
                       
                          <h6 className="mb-0">Name</h6>
                        
                        <div className="col-sm-9">{name}</div>
                      </div>
                      <hr />
                      <div className="row">
                      
                          <h6 className="mb-0">Email</h6>
                   
                        <div className="col-sm-9">
                         {email}
                        </div>
                      </div>
                      <hr />
                      <input type="file" name="getImage" accept="image/*" onChange={e=> setImage(e.target.files[0])} required/><br/><br/>
                      <button type="submit" onClick={onImageChange}>SAVE PROFILE PIC</button>
             
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
    
}

export default UserProfile