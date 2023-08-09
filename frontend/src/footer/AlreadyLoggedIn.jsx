import React from 'react'
import { Link } from 'react-router-dom'

const AlreadyLoggedIn = () => {
  return (
    <>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '50px'
        }}>
            <h1>User's Already LoggedIn. </h1>
        </div>
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Link to="/" style={{
                fontWeight: 'bold',
                fontSize: '30px',
                fontFamily: 'sans-serif',
                color: 'rgb(83, 192, 142)'
            }}>Redirect To Home</Link>
        </div>
    </>
  )
}

export default AlreadyLoggedIn;