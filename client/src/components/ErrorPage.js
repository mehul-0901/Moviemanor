import React, {useEffect, useState, useContext} from "react";
import '../App.css';
import queries from '../queries';
import {useQuery, useMutation, useLazyQuery} from '@apollo/client';
import {AuthContext} from '../firebase/Auth';
import { makeStyles } from '@material-ui/core';
import HomeDataGrid from "./HomeDataGrid";
import MoodDetector from "./MoodDetector";



const ErrorPage = (props) => {
return(<div>ERROR</div>)
}



export default ErrorPage;