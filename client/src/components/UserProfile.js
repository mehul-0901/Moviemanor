import React, {useEffect, useState, useContext} from "react";
import '../App.css';
import { AuthContext } from "../firebase/Auth";
import { makeStyles } from "@material-ui/core";
import { useMutation, useLazyQuery } from '@apollo/client';
import { Form} from "react-bootstrap";
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Grid,
  Button,
  Pagination,
} from "@mui/material";
import noImage from "../img/profile_icon.png";
import { Navigate, useNavigate } from "react-router-dom";
import queries from '../queries';
import AWS from 'aws-sdk'


const S3_BUCKET = process.env.REACT_APP_S3_BUCKET;
const REGION = process.env.REACT_APP_REGION;

AWS.config.update({
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY
})

const myBucket = new AWS.S3({
    params: { Bucket: S3_BUCKET},
    region: REGION,
})


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


const UserProfile = () => {
  // const classes = useStyles();
  // let card=null;
  let { currentUser } = useContext(AuthContext);
  const [progress , setProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState("");
  // console.log(currentUser);
  const email = currentUser.email || "Email not found";
  const name = currentUser.displayName || "Name not found";
  const photoURL = currentUser.photoURL || noImage;
  const [image, setImage] = useState();
  const navigate = useNavigate();
 // const [getImage,{data: data1, loading: getimageLoading, refetch:refetchgetImage}] = useLazyQuery(queries.GET_IMAGE, {});
  const [data1,{data,error:error1,refetch}] = useLazyQuery(queries.GET_IMAGE,{variables:{userId: currentUser.email}})
  const [addImage] = useMutation(queries.ADD_IMAGE,{})

  // const addnewImage=(email,id)=> {
  //   addImage({
  //     variables: { userId:email, Image: image},
  //     onCompleted: refetchgetImage
  //  });
  //  getImage({variables: { userId:currentUser.email}});
  // }
  // const onImageChange = async (e) => {
  //   console.log(image);
  //   try {
  //     await addProfilePic(image, currentUser.email);
  //     document.getElementsByName("getImage").value = null;
  //     navigate("/userProfile");
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
		console.log('on load useeffect');
        // console.log(id);
		async function fetchData() 
        {
			data1({variables:{userId: currentUser.email}})
      console.log(data);
		}
		fetchData();

    }	, []);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      let url = await uploadFile(selectedFile);
      console.log(url);

      if (url !== "") {
        const sendObj = {
          variables: {
            image: url,
          },
        };
        addImage({
          variables:{id:currentUser.email,image:sendObj.variables.image}, 
          onCompleted: refetch
        });
        console.log(sendObj);
        
      }
    };
  
    const handleFileInput = (e) => {
        setSelectedFile(e.target.files[0]);
        
    }

    const uploadFile = async (file) => {
        let url =  `https://${S3_BUCKET}.s3.amazonaws.com/${file.name}`;
        console.log(file.name);
    
        const params = {
          Body: file,
          Bucket: S3_BUCKET,
          Key: file.name,
        };
    
        await myBucket.putObject(params).send((err) => {
          if (err) {
            setError("Oops, somthing went wrong !");
            url = "";
          }
        });
    
        return url;
      };
  

  return (
  
    <Form method="POST"  onSubmit={handleSubmit}>

    <div style={{ marginTop: "5rem" }}>
      <div className="container">
        <div className="main-body">
          <div className="row gutters-sm">
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center">
                  
                    <img src={data&&data.getUserImage.image!=null?data.getUserImage.image:currentUser.photoURL} className="rounded-circle" alt={currentUser.displayName} width="150" />
                
                    <div className="mt-3">
                    <div> 
                    <label>Select File:</label>
                    <input type="file" onChange={handleFileInput} />
                    <br />
                    <br />
                    <Button type="submit" variant="primary">
                      Submit
                    </Button>
                    {error !== "" ? <span>{error}</span> : ""}
            
                     </div>
                      <h4> {name} </h4>
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
                      <hr/>
                      
             
                  </div>
                  <hr/>
                
                
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </Form>
   
  );
};

export default UserProfile