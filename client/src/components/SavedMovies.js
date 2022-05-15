import React, {useEffect, useContext} from "react";
import '../App.css';
import queries from '../queries';
import {  useParams } from 'react-router-dom';
import { useMutation, useLazyQuery} from '@apollo/client';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import BookmarkRemoveSharpIcon from '@mui/icons-material/BookmarkRemoveSharp';
import {AuthContext} from '../firebase/Auth';
import { makeStyles} from '@material-ui/core';
import { Grid } from "@mui/material";
import noImage from '../img/download.jpeg';
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import {Alert} from "@mui/material";



const useStyles = makeStyles({
	card: {
		maxWidth: 300,
		height: 'auto',
		marginLeft: '2cm',
		marginRight: 'auto',
		borderRadius: "10px",
    backgroundColor: "rgba(255,255,255,0) !important",
		boxShadow: '0 0px 0px rgba(255,255,255,0), 0 0px 0px rgba(255,255,255,0);',
    '&:hover': {
      color: "secondary !important"
    }
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
  link: {
    '&:hover': {
      color: "#9b27af !important"
    }
  },
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	},  
});

const SavedMovies = (props) => {

    const classes = useStyles();
    const regex = /(<([^>]+)>)/gi;
    let card = null
    const {id}=useParams();
    const {currentUser} = useContext(AuthContext);

      const [getmoviesbyIDS, {data: saved_movies,error:error2}] = useLazyQuery(
        queries.Get_Movies_By_IDS,
        {
        }
      ); 
      
    const [getusersavedmovies, {loading, error, data, refetch:refetchSaved}] = useLazyQuery(
        queries.GET_USER_SAVEDMOVIES,
        {
        }
      );

      const [removefromSave,{error:error3}] = useMutation(queries.REMOVE_SAVEFORLATER, {
    });

      useEffect(() => {
		console.log('on load useeffect1');
        console.log(id);
		async function fetchData() 
        {
            if(currentUser)
            {
                console.log(currentUser.email);
                getusersavedmovies({variables:{userId:currentUser.email}});
                console.log(data);
                const idArray = data?.savedMovies?.map((node)=> node.id)
            console.log(idArray);
                getmoviesbyIDS({variables:{ids:idArray}});
            }
		}
		fetchData();

    }	, [data]);

    const removeSave=(email,id)=>
    {
      removefromSave({
        variables: { userId:email, movieId: id},
        onCompleted: refetchSaved
     })
    }



    const buildCard = (show) => {
        return (
          <Grid item key={show.id} sx={{paddingLeft: "0px", padding: "0px !important"}}>
            <Card  className={classes.card} sx={{paddingLeft: "0px", maxWidth: 345, marginLeft: "0px !important" }} >
              <Link className={classes.link} to={`/movie/${show.id}`} style={{textDecoration: "none"}} >
                <CardMedia
                  component="img"
                  height="400"
                  image={show.image!=="0"?show.image: noImage  }
                  alt={show.title}
                  sx={{borderRadius: "10px"}}
                />
                <CardHeader sx={{width: "320px",paddingLeft: "0px", textAlign: "start"}}
                  title={show.title}
                />
              </Link>
              <CardActions sx={{padding: "0px"}}>
                  <Button aria-label="Remove saved movie" 
                    title="Remove from Save"
                    onClick={() => {removeSave(currentUser.email,show.id)}}>
                    <BookmarkRemoveSharpIcon sx={{color: "#9b27af"}} title="Remove from Save"/> {/*Remove from Save*/}
                  </Button>
              </CardActions>                
            </Card>
            <br></br>
          </Grid>
        )
    }

  if(saved_movies && saved_movies.moviesByIds.length!==0){
    card =
      saved_movies &&
      saved_movies.moviesByIds.map((show) => {
        return buildCard(show);
      });
  } else {
    return(
      <div style={{color:"white",marginTop:"250px"}}>
        "Kindly save movies to show!"
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if (error) {
    return (<Alert variat="filled" severity="error" style={{backgroundColor:"red",width:'1100px',textAlign:"center",marginLeft:"200px",marginTop:"200px"}}>{error.message}</Alert>);
  } 
  else if (error2) {
    return (<Alert variat="filled" severity="error" style={{backgroundColor:"red",width:'1100px',textAlign:"center",marginLeft:"200px",marginTop:"200px"}}>{error2.message}</Alert>);
  } 
  else if (error3) {
    return (<Alert variat="filled" severity="error" style={{backgroundColor:"red",width:'1100px',textAlign:"center",marginLeft:"200px",marginTop:"200px"}}>{error3.message}</Alert>);
  } else {
    return (
      <div style={{position: "absolute", marginLeft: "auto", marginRight: "auto", marginTop: "10rem", width: "100%"}}>
        <Grid container sx={{marginTop: 0, maxWidth: "1660px", marginLeft: "auto", marginRight: "auto", justifyContent: "center", gridGap: "3.5rem"}} className={classes.grid} spacing={3}>
          {card}
        </Grid>
      </div>
    );
  }
}

export default SavedMovies