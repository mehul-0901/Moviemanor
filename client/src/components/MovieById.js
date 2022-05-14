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
import CommentIcon from '@mui/icons-material/CommentRounded'
import Avatar from '@mui/material/Avatar';
import { blue,red } from '@mui/material/colors';
import { Button, List, ListItem, ListItemAvatar, ListItemText, Paper, TextField } from '@mui/material';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import { Navigate } from 'react-router-dom';
import { textAlign } from '@mui/system';
import {alpha, styled} from '@mui/material/styles'


const useStyles = makeStyles({
	commenterName: {
		'& MuiTypography-root MuiTypography-body1 MuiListItemText-primary': {
			fontWeight: "bold !important"
		}
	},
	card: {	
		maxWidth: 400,
		height: 'auto',
		borderRadius: 15,
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
		color: '#676fe9',
		fontWeight: 'bold',
		fontSize: "1.5rem",
		borderRadius: "10px",
        '&:hover': {
            backgroundColor: "#676fe9",
            color: "white"
        }
	},
	commentLikeButton:
	{
		color: '#007b6d !important',
		fontWeight: 'bold',
		fontSize: 12,
		border:"none"
	},
	commentNormalLikeButton:
	{	
		color: '#007b6d !important',
		fontWeight: 'bold',
		fontSize: 12,
		border:"none"	
	},
	commentDisLikeButton:
	{
		color: '#de1818 !important',
		fontWeight: 'bold',
		fontSize: 12,
		border:"none"
	}
});

const RedditTextField = styled((props) => (
	<TextField InputProps={{ disableUnderline: true }} {...props} />
  ))(({ theme }) => ({
	  '& .MuiInputLabel-root': {
		color: "white !important"
	  },
	'& .MuiFilledInput-root': {
	  color: "white",	
	  overflow: 'hidden',
	  borderRadius: 10,
	  width: "900px",
	  backgroundColor: '#ffffff4d',
	  transition: theme.transitions.create([
		'border-color',
		'background-color',
		'box-shadow',
	  ]),
	},
  }));   

function MovieById(props)
{
    const classes = useStyles();
	const navigate=useNavigate()
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


	  const [addLikeToComment, {loading:loading3, error:error3, data:addLikeComment}] = useMutation(
        queries.ADD_LIKE,
        {
            fetchPolicy:"network-only",
			onCompleted:refetch1
        }
      );
	  const [addDisLikeToComment, {loading:loading4, error:error4, data:addDisLikeComment}] = useMutation(
        queries.ADD_DISLIKE,
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
			console.log(currentUser);
			getMoviesById({variables:{id:id}});
			showComments({variables:{movieId:id}})
		}
		fetchData();

    }	, [id]);

	// const showCommentsOfMovie=()=>{
	// 	setChecked((prev)=>!prev);
	// 	showComments({variables:{movieId:id}})
	// 	console.log("Comments:", comments);

	// }
	const addComment=()=>{
		
		let com=(document.getElementById("comment").value);
		if(currentUser){
		addCommentDB({variables:{movieId: id, userId: currentUser.displayName, comment: com}})
		}
		else{
			alert("Login to add a comment");
			navigate('/SignIn');
		}
		document.getElementById("comment").value="";


	}
	const likeComment=(commentID)=>{
		console.log("here");
		console.log(commentID);
		if(currentUser){
		addLikeToComment({variables:{movieID:id,  commentID: commentID, emailID: currentUser.email}})
		}else{
			alert("Login to add a comment");
			navigate('/SignIn');
		}

	}
	const dislikeComment=(commentID)=>{
		if(currentUser){
		addDisLikeToComment({variables:{movieID:id,  commentID: commentID, emailID: currentUser.email}})
		}
		else{
			alert("Login to add a comment");
			navigate('/SignIn');
		}
	}

const commentCardLoggedIn = (comment)=>{
	return(
		<Paper sx={{display: "flex", width: "1100px", borderRadius: "15px !important"}} elevation={4} key={comment.id}>
			<div style={{display: "flex", flexDirection: "column"}}>
				{comment.like.includes(currentUser.email) ?
					<Button sx={{display: "flex", flexDirection: "column"}} className={classes.commentLikeButton} onClick={()=>likeComment(comment.id)}>
						<ThumbUpAltIcon sx={{color: "#007b6d"}}/>Upvote
					</Button>
					:
					<Button sx={{display: "flex", flexDirection: "column"}} className={classes.commentLikeButton} onClick={()=>likeComment(comment.id)}>
						<ThumbUpOffAltIcon sx={{color: "#007b6d"}}/>Upvote
					</Button>
				}
				{comment.like.length-comment.dislike.length}
				{comment.dislike.includes(currentUser.email) ?
					<Button sx={{display: "flex", flexDirection: "column"}} className={classes.commentDisLikeButton} onClick={()=>dislikeComment(comment.id)}>
						<ThumbDownAltIcon sx={{color: "#de1818"}}/>Downvote
					</Button>
					:
					<Button sx={{display: "flex", flexDirection: "column"}} className={classes.commentDisLikeButton} onClick={()=>dislikeComment(comment.id)}>
						<ThumbDownOffAltIcon sx={{color: "#de1818"}}/>Downvote
					</Button>
				}	
			</div>
			<List sx={{width:'100%', borderRadius: "15px", bgcolor:'background.paper'}}>
				<ListItem sx={{alignItems:"center"}}>
					<ListItemAvatar>
						<Avatar sx={{ bgcolor: "blue" }} >
							{comment.UserID?comment.UserID.charAt(0):" "}
						</Avatar>
					</ListItemAvatar>
					<h4>{comment.UserID}</h4>	
				</ListItem>
				<Typography style={{fontSize: "23px", textAlign: "left", paddingLeft: "16px", paddingRight: "16px"}} variant='body2' component="div">
					{comment.comment}
				</Typography>
			</List>
		</Paper>
	 );
	}

	const commentCardNotLoggedIn = (comment)=>{
		return(
			<Paper sx={{display: "flex", width: "1100px", borderRadius: "15px !important"}} elevation={4} key={comment.id}>
				<div style={{display: "flex", flexDirection: "column"}}>
						<Button sx={{display: "flex", flexDirection: "column"}} className={classes.commentLikeButton} onClick={()=>likeComment(comment.id)}>
							<ThumbUpOffAltIcon sx={{color: "#007b6d"}}/>Upvote
						</Button>
					{comment.like.length-comment.dislike.length}
						<Button sx={{display: "flex", flexDirection: "column"}} className={classes.commentDisLikeButton} onClick={()=>dislikeComment(comment.id)}>
							<ThumbDownOffAltIcon sx={{color: "#de1818"}}/>Downvote
						</Button>	
				</div>
				<List sx={{width:'100%', borderRadius: "15px", bgcolor:'background.paper'}}>
					<ListItem sx={{alignItems:"center"}}>
						<ListItemAvatar>
							<Avatar sx={{ bgcolor: "blue" }} >
								{comment.UserID?comment.UserID.charAt(0):" "}
							</Avatar>
						</ListItemAvatar>
						<h4>{comment.UserID}</h4>	
					</ListItem>
					<Typography style={{fontSize: "23px", textAlign: "left", paddingLeft: "16px", paddingRight: "16px"}} variant='body2' component="div">
						{comment.comment}
					</Typography>
				</List>
			</Paper>
		 );
		}

	console.log(comments);
	if(comments && comments.listOfComments && comments.listOfComments.comment){
		if(currentUser){
			displayComment =comments.listOfComments.comment.map((comment)=>{
				return commentCardLoggedIn(comment);
			})
		} else {
			displayComment =comments.listOfComments.comment.map((comment)=>{
				return commentCardNotLoggedIn(comment);
			})
		}
	}

    if(data && !isNaN(id))
    {
        return(
			<div className='homeWithoutLogin' style={{marginTop: "5rem"}}>
				{/* Back Button */}
				<Link to={"/"} style={{textDecoration: "none", color: "#c384d2", fontSize: "larger", textAlign: "start"}}>Back to all shows...</Link>
				{/* Movie Poster */}
				<div className='movieDetailsBox'>
					<Card className={classes.card}>
						<CardMedia
							className={classes.media}
							component='img'
							height="700"
							image={data.movieById.image!=="NA"?data.movieById.image:noImage  }
							title={data.movieById.title}  
						/>
					</Card>
					{/* Movie Details */}
					<Typography variant='body1' component="div" color='primary' style={{width: "850px", display: "flex", flexDirection: "column", alignItems: "start"}}>
						<Typography variant='h2' component="h1" style={{color: "#676fe9", fontWeight: "bold", textAlign: "start"}}>
							{data.movieById.title}
						</Typography>
						<Typography variant='body2' component="div" style={{ display: "flex", width: "auto", columnGap: "1.7rem", maxWidth: "850px"}} >		  
							<Rating
								name="text-feedback"
								value={Number(data.movieById.tmDbRating)/2}
								readOnly
								precision={0.5}
								emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
								size='large'
								title='TMDB Rating'
							/>
							<Typography variant='h6' component="h2" style={{color: "#ffffffb5"}}>
								Released: {data.movieById.releaseDate}
							</Typography>
						</Typography>
						<Typography variant='body2' component="div" style={{display: "flex", fontSize: "30px", color: "whitesmoke", textAlign: "justify", marginTop: "1.8rem"}}>
							{data.movieById && data.movieById.plot ? data.movieById.plot : `N/A`}
						</Typography>
					</Typography>
				</div>
				{/* Comments */}
				<div className='commentsSection'>
					<Typography variant='h4' component="h3" style={{color: "whitesmoke"}}>
						Comments ({comments && comments.listOfComments ? comments.listOfComments.comment.length : 0} <CommentIcon />):
					</Typography>
					{error2 ? <div style={{color:"red"}}>{error2.message}</div>:<div></div>}
					<Typography variant='body2' component="div" style={{display: "flex", columnGap: "1rem", width: "1100px", color: "white"}}>
						<RedditTextField
							required
							label="Enter Comment"
							id="comment"
							variant="filled"
						/>
						<Button className={classes.button} onClick={addComment}>Submit</Button>
					</Typography>
					{comments ? displayComment : <div> No Comments </div>}
				</div>
				<br />
			</div>
        );
    }
    else
    {
        return(
            <div style={{color:"green"}}><h1>404 Error <br/> Wrong Id</h1> </div>
        );
    }
}
export default MovieById;