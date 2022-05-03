import React, {useEffect, useState, useContext} from "react";
import '../App.css';
import {useQuery, useMutation, useLazyQuery} from '@apollo/client';
import {Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, Typography, Grid, Button, Pagination} from '@mui/material';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineSharpIcon from '@mui/icons-material/RemoveCircleOutlineSharp';
import BookmarkRemoveSharpIcon from '@mui/icons-material/BookmarkRemoveSharp';
import {AuthContext} from '../firebase/Auth';
import { makeStyles } from '@material-ui/core';
import noImage from '../img/download.jpeg';
import { Link } from "react-router-dom";


const useStyles = makeStyles({
	card: {
		maxWidth: 300,
		height: 'auto',
		marginLeft: '2cm',
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

const HomeDataGrid = (props) => {
    const {currentUser} = useContext(AuthContext);
    let card=null;
    let pagination=null;
    const classes = useStyles();
    const regex = /(<([^>]+)>)/gi;

    const removeWatchList=(email,id)=> {
        props.removefromWatchList({
          variables: { userId:email, movieId: id},
          onCompleted: props.refetchWatched
       });
       props.getUserWatchedMovies({variables: { userId:currentUser.email}});
      }
  
      const addWatchList=(email,id)=>{ 
        props.addToWatchList({
          variables: { userId:email, movieId: id},
          onCompleted: props.refetchWatched
       });
       props.getUserWatchedMovies({variables: { userId:currentUser.email}});
      }
  
      const removeSave=(email,id)=>
      {
        props.removefromSave({
          variables: { userId:email, movieId: id},
          onCompleted: props.refetchSaved
       })
       props.getUserSavedMovies({ variables: { userId:currentUser.email}});
      }
  
      const addSave=(email,id)=>
      {
        console.log("here");
        props.addToSave({
          variables: { userId:email, movieId:id},
          onCompleted: props.refetchSaved
        })
        props.getUserSavedMovies({ variables: { userId:currentUser.email}});
      }
  
      const handlePageClick =(event, page)=>
      {
        props.setPageNum(page);
        if(props.moodData){
          props.getMoodBasedMovies({
            variables: {
              moodId: props.moodId,
              pageNum: page
            }
          })
        }else{
          props.getAllMovies({variables:{"title":props.searchTerm,"pageNum":props.pageNum}}); 
        }
      }

      
    const buildCard = (show,save,wishList) => {
        return (
          <Grid item key={show.id} sx={{paddingLeft: "0px"}}>
            <Card  className={classes.card} sx={{ maxWidth: 345 }} >
              <Link to={`/movie/${show.id}`} style={{textDecoration: "none"}} >

                <CardHeader 
                  avatar={
                    <Avatar sx={{ bgcolor: "#e72400" }} aria-label="recipe">
                      {show.title.charAt(0)}
                    </Avatar>
                  }
                  title={show.title}
                />
                <CardMedia
                  component="img"
                  height="400"
                  image={show.image!=="0"?show.image: noImage  }
                  alt={show.title}
                />
                  </Link>
                <CardActions disableSpacing>
                  {save? 
                
                    <Button aria-label="Remove saved movie" 
                    onClick={() => {removeSave(currentUser.email,show.id)}}>
                    <BookmarkRemoveSharpIcon/> Remove from Save
                    </Button>
                  :
                  <Button aria-label="Save for later" 
                  onClick={() => {addSave(currentUser.email,show.id)}}>
                  <BookmarkAddOutlinedIcon /> Add to Save
                  </Button>
                  
                  } 
                </CardActions>
                <CardActions >
                {wishList? <Button aria-label="Delete watchlist"
                onClick={(e) => {removeWatchList(currentUser.email,show.id) }}>
                  <RemoveCircleOutlineSharpIcon />Delete from watchlist
                </Button> : <Button aria-label="Add to watchlist" 
              onClick={(e) => {addWatchList(currentUser.email,show.id)}}>
                <AddIcon /> Add to watchlist</Button>
              
              }
              </CardActions>
                  <CardContent>
                    <Typography variant='body2' color='textSecondary' component='span'>
                    {show.plot ? show.plot.replace(regex, '').substring(0, 139) + '...' : `NA`}

                    </Typography>
                  </CardContent>
                
            </Card>
            <br></br>
          </Grid>
        );
      }
      if (props.moodData) {
        if (props.moodData.moodBasedMovies !== null) {
          card = props.moodData && props.moodData.moodBasedMovies.map((movie) =>{
            if (!currentUser) {
              return (buildCard(movie, false, false));
            }
          })
        }
      } else if (props.data && currentUser && props.searchTerm) {
        if(props.data.movieList!==null)
        {    
          card =
          props.data &&
          props.data.movieList.map((show) => {
            if(show!==null){
              let save=false;
              let wishList=false;
              if(props.data2 && props.data2.savedMovies) {  
                  if(props.data2.savedMovies.length !== 0){
                      for (const x of props.data2.savedMovies) {
                          if(x.id===show.id)
                          {
                              save=true;
                          }
                      }
                  }
              }
              if (props.data1 && props.data1.checkIfwatched) {
                  if(props.data1.checkIfwatched.length !== 0){
                      for (const x of props.data1.checkIfwatched) {
                          if(x.id===show.id) {
                          wishList=true;
                          }
                      }
                  } 
            }
            return (buildCard(show,save,wishList));
            }
          });
        }
      }

      //// PAGINATION STARTS ////
      // Pagination Function
      const paginate = (page) => {
          return (
          <div className="pagination"> 
              <Pagination 
              onChange={(event, page)=>handlePageClick(event, page)}
              count= {page}
              page={Number(props.pageNum)}
              variant="outlined"
              color="primary" ></Pagination>
          </div>
          );
      }
    
      // Checking If Data Exists And User Has Logged In And Setting Pagination
      if(props.data && currentUser) {
          if(props.data.movieList) {
              if(props.data.movieList.length!==0){
                  pagination=paginate(props.data.movieList[0].page)
              }
          }
      } else if (props.moodData) { //If Moods have been Selected And Setting Pagination
        if (props.moodData.moodBasedMovies && props.moodData.moodBasedMovies.length !== 0) {
          pagination=paginate(props.moodData.moodBasedMovies[0].page)
        }
      }
      //// PAGINATION ENDS ////

      return (
        <div>
            {pagination}
            <Grid container sx={{marginTop: 0, maxWidth: "1660px", marginLeft: "auto", marginRight: "auto", justifyContent: "center", gridGap: "3.5rem"}} className={classes.grid} spacing={3}>
                {card} 
            </Grid>
        </div>
      )
    }

export default HomeDataGrid