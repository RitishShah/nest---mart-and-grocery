import React from 'react';
import store from '../../redux/store';
import { Provider } from 'react-redux';
import { Outlet } from 'react-router-dom';
import LoginSignup from '../Authentication/LoginSignup';

const LoginLAyout = () => {
  return (
    <>
      <Provider store={ store }>
          <LoginSignup/>
          <main>
              <Outlet/>
          </main>
      </Provider>
    </>
  )
}

export default LoginLAyout;