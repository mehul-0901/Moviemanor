import '../App.css';




const Forbidden = (props) => {
return(
  
  <div style={{marginTop: "5rem"}}>
    <div className="mars"></div>
    {/* <img src="https://assets.codepen.io/1538474/404.svg" alt='img1' className="logo-404"  /> */}
    <img src="https://assets.codepen.io/1538474/meteor.svg" alt='img2' className="meteor" />
    <p className="title" style={{color:"#878b91"}}>Oh no!!</p>
    <p className="subtitle" style={{color:"#989ba1"}}>
     ERROR : 403 <br></br>Forbidden Access 
    </p>

    <img src="https://assets.codepen.io/1538474/astronaut.svg" alt='img3' className="astronaut" />
    <img src="https://assets.codepen.io/1538474/spaceship.svg" alt='img4' className="spaceship" />
  </div>
  )
}



export default Forbidden;