import React from 'react'
import { Link } from 'react-router-dom'

const Notfound = () => {
  return (
    <div>
      <div
       style={{
        width:"100%",
        height:"100vh",
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        flexDirection:"column"
      }}
      >
      <h1>404</h1> 
      <h2>Not Found</h2>
      <Link to="/"
      style={{
        color:"#3BB77E",
        fontSize:"1.5vmax",
        fontFamily:"sans-serif",
        padding:"1vmax 0"
      }}
      >Go Back to Home</Link>
      </div>
    </div>
  )
}

export default Notfound