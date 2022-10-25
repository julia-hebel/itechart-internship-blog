import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USERS_URL } from '../../redux/userSlice';
import { loginUser } from '../../redux/userSlice';
import MuiAlert from '@mui/material/Alert';
const bcrypt = require('bcryptjs');

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useDispatch<any>();

  const navigate = useNavigate();

  const preventSpace = (e: any) => {
    if (e.key === ' ') {
      e.preventDefault();
      setErrorMessage('Username cannot contain space');
    }
  };

  const renderErrorMessage = () => {
    if (errorMessage) {
      return (
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={() => setErrorMessage('')}
          severity='error'
          sx={{ borderRadius: '0.5rem' }}
        >
          {errorMessage}
        </MuiAlert>
      );
    } else {
      return null;
    }
  };

  const usernameError = () => {
    const contains = errorMessage.toLowerCase().includes('username');
    return contains;
  };

  const passwordError = () => {
    const contains = errorMessage.toLowerCase().includes('password');
    return contains;
  };

  const verifyLoginData = async (username: string, password: string) => {
    try {
      const response = await axios.get(`${USERS_URL}?username=${username}`);
      if (response.data.length === 1) {
        if (bcrypt.compareSync(password, response.data[0].password)) {
          return response.data[0];
        }
      }
      return null;
    } catch (error: any) {
      return error.message;
    }
  };

  const onSubmitLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage('Required fields cannot be empty!');
      return;
    }

    const loginDataResponse = await verifyLoginData(username, password);
    if (!loginDataResponse) {
      await setErrorMessage('Username or password incorrect!');
      return;
    }

    dispatch(loginUser(loginDataResponse));
    navigate('/');
  };

  return (
    <div className='pb-2 max-w-[500px] m-auto'>
      <div className='m-3 sm:m-6 px-4 py-2 bg-[rgb(43,44,45)] rounded-lg'>
        <div className='text-center my-2'>
          <h2 className='ml-0.5 text-xl sm:text-2xl font-bold'>
            Welcome back!
          </h2>
        </div>
        <form onSubmit={(e) => onSubmitLogin(e)}>
          <div className='my-3'>
            <label htmlFor='username' className='block mb-1 ml-0.5'>
              Username
            </label>
            <input
              type='text'
              name='username'
              placeholder='Username'
              className={`w-full bg-[rgb(62,63,64)] rounded-lg p-2 sm:text-lg ${
                usernameError() && 'border border-red-500'
              }`}
              onKeyDown={(e) => preventSpace(e)}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className='mt-3 mb-4'>
            <label htmlFor='password' className='block mb-1 ml-0.5'>
              Password
            </label>
            <input
              type='password'
              name='password'
              placeholder='Password'
              className={`w-full bg-[rgb(62,63,64)] rounded-lg p-2 sm:text-lg ${
                passwordError() && 'border border-red-500'
              }`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {renderErrorMessage()}
          <button
            type='submit'
            className='w-full h-10 sm:h-11 text-center bg-green-600 rounded-lg py-2 mt-4 mb-2 disabled:bg-zinc-700 sm:text-lg'
          >
            Log in
          </button>
        </form>
      </div>
      <hr className='border-zinc-500 mt-5 mb-4 sm:mt-10 sm:mb-8' />
      <div className='px-4 w-full text-center'>
        <div className='text-lg sm:text-xl'>Don't have an account?</div>
        <Link to='/register'>
          <div className='h-10 sm:h-11 p-2 mt-3 mx-3 sm:mx-6 bg-blue-700 rounded-lg sm:text-lg'>
            Register
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Login;
