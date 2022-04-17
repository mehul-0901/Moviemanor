import React, {useEffect, useState} from "react";
import '../App.css';


const Home = (props) =>
{
    const x=props.searchTerm;
    console.log(props.searchTerm+"vdjhvcdjhcv");
    return(
      <div>
        {x}
      </div>
    );
}

export default Home;