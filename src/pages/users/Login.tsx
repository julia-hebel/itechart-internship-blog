import { useState } from 'react';

import { useAppDispatch } from '../../app/hooks';
import { useSelector } from 'react-redux';
import { getIsLoggedIn, USERS_URL, loginUser } from '../../redux/userSlice';

import axios from 'axios';

import { Link, useNavigate } from 'react-router-dom';

import { FormattedMessage, useIntl } from 'react-intl';

import MuiAlert from '@mui/material/Alert';

const bcrypt = require('bcryptjs');

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn);

  const navigate = useNavigate();

  const intl = useIntl();

  const renderErrorMessage = () => {
    if (errorMessage) {
      return (
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={() => {
            setErrorMessage('');
            document.querySelectorAll('.border-red-500').forEach((element) => {
              element.classList.remove('border', 'border-red-500');
            });
          }}
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
      setErrorMessage(
        intl.formatMessage({
          id: 'Register.error.requiredFieldsEmpty',
          defaultMessage: 'Required fields cannot be empty!',
        })
      );
      return;
    }

    const loginDataResponse = await verifyLoginData(username, password);
    if (!loginDataResponse) {
      await setErrorMessage(
        intl.formatMessage({
          id: 'Login.incorrectUserData',
          defaultMessage: 'Username or password incorrect!',
        })
      );
      return;
    }

    dispatch(loginUser(loginDataResponse));
    navigate('/');
  };

  if (isLoggedIn) {
    return (
      <main
        className='h-screen w-full flex flex-col justify-center items-center'
        tabIndex={0}
        aria-label={intl.formatMessage({
          id: 'Register.alreadyLoggedIn',
          defaultMessage: 'Already logged in',
        })}
      >
        <span className='text-xl font-bold mb-12'>
          <FormattedMessage
            id='Register.alreadyLoggedIn'
            defaultMessage='Already logged in'
          />
        </span>
      </main>
    );
  }

  return (
    <main
      className='pb-2 max-w-[500px] m-auto'
      tabIndex={-1}
      aria-label={intl.formatMessage({
        id: 'Login.aria.main',
        defaultMessage: 'Login page',
      })}
      aria-live='polite'
      aria-atomic={true}
    >
      <div className='m-3 sm:m-6 px-4 py-2 bg-foreground-dark rounded-lg'>
        <div className='text-center my-2'>
          <h2 className='ml-0.5 text-xl sm:text-2xl font-bold'>
            <FormattedMessage
              id='Login.welcomeBack'
              defaultMessage='Welcome back!'
            />
          </h2>
        </div>
        <form onSubmit={(e) => onSubmitLogin(e)}>
          <div className='my-3'>
            <label htmlFor='username' className='block mb-1 ml-0.5'>
              <FormattedMessage
                id='Register.usernameLabel'
                defaultMessage='Username'
              />
            </label>
            <input
              type='text'
              name='username'
              placeholder={intl.formatMessage({
                id: 'Register.usernameLabel',
                defaultMessage: 'Username',
              })}
              className={`w-full bg-interactive-dark rounded-lg p-2 sm:text-lg`}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className='mt-3 mb-4'>
            <label htmlFor='password' className='block mb-1 ml-0.5'>
              <FormattedMessage
                id='Register.passwordLabel'
                defaultMessage='Password'
              />
            </label>
            <input
              type='password'
              name='password'
              placeholder={intl.formatMessage({
                id: 'Register.passwordLabel',
                defaultMessage: 'Password',
              })}
              className={`w-full bg-interactive-dark rounded-lg p-2 sm:text-lg`}
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
            <FormattedMessage id='Login.login' defaultMessage='Log in' />
          </button>
        </form>
      </div>
      <hr className='border-zinc-500 mt-5 mb-4 sm:mt-10 sm:mb-8' />
      <div className='px-4 w-full text-center'>
        <div className='text-lg sm:text-xl' tabIndex={0}>
          <FormattedMessage
            id='Login.doNotHaveAccount'
            defaultMessage="Don't have an account?"
          />{' '}
        </div>
        <Link
          to='/register'
          role='link'
          onClick={() => document.getElementsByTagName('main')[0]?.focus()}
        >
          <div className='h-10 sm:h-11 p-2 mt-3 mx-3 sm:mx-6 bg-blue-700 rounded-lg sm:text-lg'>
            <FormattedMessage
              id='Login.registerHere'
              defaultMessage='Register here'
            />
          </div>
        </Link>
      </div>
    </main>
  );
}

export default Login;
