import { Link, useParams,useNavigate } from 'react-router-dom';
import '../App.css';
import queries from '../queries';
import {useLazyQuery, useMutation, useQuery} from '@apollo/client';
import React, { useEffect ,useContext, useState} from 'react';
import {AuthContext} from '../firebase/Auth';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader ,Box} from '@material-ui/core';
import noImage from '../img/download.jpeg';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import Avatar from '@mui/material/Avatar';
import { blue,red } from '@mui/material/colors';
import CommentIcon from '@mui/icons-material/Comment';
import { Button, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField } from '@mui/material';


const useStyles = makeStyles({
	
	card: {
		maxWidth: 700,
		height: 'auto',
		marginLeft: 'auto', 
		marginRight: 'auto',
		marginTop:'10rem',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold',
		fontSize: 'x',

		},
		title:{
			fontSize:"xx-large",
			font:'bold'
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
	},
	
});

function MovieById()
{
    const classes = useStyles();

    const {id}=useParams();
    const {currentUser} = useContext(AuthContext);
	const [checked,setChecked] = useState(false);
	let displayComment=null;
	const [defaultVal,setDefault]=useState("");
    const [getMoviesById, {loading, error, data}] = useLazyQuery(
        queries.GET_MOVIES_BY_ID,
        {
            fetchPolicy:"cache-and-network",
        }
      );

	  const [showComments, {loading:loading1, error:error1, data:comments,refetch:refetch1}] = useLazyQuery(
        queries.SHOW_COMMENTS,
        {
            fetchPolicy:"cache-and-network",

        }
      );

	  const [addCommentDB, {loading:loading2, error:error2, data:add}] = useMutation(
        queries.ADD_COMMENT,
        {
            fetchPolicy:"network-only",
			onCompleted:refetch1
        }
      );


      useEffect(() => {
		console.log('on load useeffect');
        console.log(id);
		async function fetchData() 
        {
            if(currentUser)
            {
                console.log(currentUser.email);
                getMoviesById({variables:{id:id}});
                console.log("sfdhfgdgs",data);
            }
		}
		fetchData();

    }	, [id]);

	const showCommentsOfMovie=()=>{
		setChecked((prev)=>!prev);
		showComments({variables:{movieId:id}})
		console.log(comments);

	}
	const addComment=()=>{
		
		let com=(document.getElementById("comment").value);
		addCommentDB({variables:{movieId: id, userId: currentUser.displayName, comment: com}})
		
		document.getElementById("comment").value="";


	}
const commentCard = (comment)=>{
	return(
		<Paper sx={{m:1}} elevation={4}>
			<List sx={{width:'100%', maxwidth:360, bgcolor:'background.paper'}}>
				<ListItem alignItems="flex-start">
					<ListItemAvatar>
						<Avatar sx={{ bgcolor: "blue" }} >
							 {comment.UserID?comment.UserID.charAt(0):" "}
						</Avatar>
					</ListItemAvatar>
					<ListItemText
						  primary={comment.UserID}
						  secondary={
						<React.Fragment>
						  <Typography
						sx={{ display: 'inline' }}
						component="span"
						variant="body2"
						color="text.primary"
					  ></Typography>
						  {comment.comment}
						</React.Fragment>}/>
				</ListItem>
			</List>
		</Paper>
	 );
	}



	if(comments && comments.listOfComments && comments.listOfComments.comment){
		displayComment =comments.listOfComments.comment.map((comment)=>{
			return commentCard(comment);
		})
	}

    if(data && currentUser)
    {
        return(
			<div className='homeWithoutLogin'>
			<br/><br/><br/>
			<Card className={classes.card} variant='outlined' style={{marginBottom: "10rem"}}>
				<CardHeader className={classes.titleHead} classes={{title:classes.title}} title={data.movieById.title} avatar={
                <Avatar sx={{ bgcolor: data.movieById.adult ? red[500] : blue[500] ,width: 55, height: 55,fontSize:"small"}} aria-label="recipe">
                  {data.movieById.adult?"ADULT MOVIE":"FAMILY MOVIE"}
                </Avatar>
              } action={
				<Box sx={{ width: 200, sizeWidth:800, alignItems: 'center', alignSelf:'center', marginTop:'0.5cm',}} title='TMDB Rating'>		  
					<Rating
						name="text-feedback"
						value={Number(data.movieById.tmDbRating)/2}
						readOnly
						precision={0.5}
						emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
						size='large'
					/>
				</Box>}>
				</CardHeader>
				
				
				<CardMedia
					className={classes.media}
					component='img'
					image={data.movieById.image!=="0"?data.movieById.image:noImage  }
					title='show image'  
				/>

				<CardContent>
					
				<Typography className='tagline'>
					<div className='tagline'> {data.movieById.tagline}</div>
				</Typography>
				
					<Typography variant='body2' color='textPrimary' component='span'>
						<dl>
                            
                            <h1>{data.movieById.name}</h1>
							<p>
								<dt className='title'>Description:</dt><br></br>
								{data.movieById && data.movieById.plot ? <dd>{data.movieById.plot}</dd> : <dd>N/A</dd>}
							</p>
						
						</dl>
					</Typography>
					<Typography >
					<div className='releaseDate' >Release Date : {data.movieById.releaseDate}</div>
				</Typography>
					<Link to={"/"} style={{textDecoration: "none", color: "brown"}}>Back to all shows...</Link>

				</CardContent>
				<div><Button checked={checked} onClick={()=>showCommentsOfMovie()}><CommentIcon/>Comment</Button></div>
				{checked?<div>
					<TextField required id="comment" label="Enter Comment" />
					<button onClick={addComment}>Submit</button></div>
				:<div></div>}
				  {checked?displayComment:<div></div>}
			</Card>
			<br />
		</div>
        );
    }
    else
    {
        return(
            <div>Error</div>
        );
    }
}
export default MovieById;