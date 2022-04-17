import React, {useEffect, useState} from "react";
import '../App.css';


const Home = (props) => {
    console.log(props.searchTerm+"vdjhvcdjhcv");
    return(
        <div className="homeWithoutLogin">
            <div style={{position: "absolute", margin: "auto", color: "white", width: "100%"}}>
              <h2>Moviemanor</h2>
            </div>
        </div>
    );
}

export default Home;