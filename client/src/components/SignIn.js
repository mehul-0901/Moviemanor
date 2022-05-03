import React, {useContext} from 'react';
import SocialSignIn from './SocialSignIn';
import {Navigate} from 'react-router-dom';
import {AuthContext} from '../firebase/Auth';
import { Button } from '@mui/material';
import {
  doSignInWithEmailAndPassword,
  doPasswordReset
} from '../firebase/FirebaseFunctions';


function SignIn() {
  const {currentUser} = useContext(AuthContext);

  const handleLogin = async (event) => {
    event.preventDefault();
    let {email, password} = event.target.elements;
    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      alert(error);
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    let email = document.getElementById('email').value;
    if (email) {
      doPasswordReset(email);
      alert('Password reset email was sent');
    } else {
      alert(
        'Please enter an email address below before you click the forgot password link'
      );
    }
  };

  if (currentUser) {
    return <Navigate to='/' />;
  }

  return (
    <div>
      <h1 style={{color: "#fff"}}>Log in</h1>
      <form onSubmit={handleLogin}>
        <div className='form-group'>
          <label style={{color: "#888989"}}>
            Email:
            <input
              className='form-control'
              name='email'
              id='email'
              type='email'
              placeholder='Email'
              required
            />
          </label>
        </div>
        <div className='form-group'>
          <label style={{color: "#888989"}}>
            Password:
            <input
              className='form-control'
              name='password'
              type='password'
              placeholder='Password'
              autoComplete='off'
              required
            />
          </label>
        </div>
        <Button className='loginBtn' type='submit'>Log in</Button>
        <br />
        <br />
        <Button className='forgotPassword' sx={{color: "#5089dc"}} onClick={passwordReset}>
          Forgot Password
        </Button>
      </form>

      <br />
      <SocialSignIn />
    </div>
  );
}

export default SignIn;