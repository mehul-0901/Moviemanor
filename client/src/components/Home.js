import React, {useEffect, useState} from "react";
import '../App.css';


const Home = (props) => {
    console.log(props.searchTerm+" Here");
    return(
        <div className="homeWithoutLogin">
            <div style={{position: "absolute", marginLeft: "auto", marginRight: "auto", marginTop: "20rem", width: "100%"}}>
              <h1 style={{ color: "white"}}>Moviemanor</h1>
            </div>
        </div>
    );
}

export default Home;