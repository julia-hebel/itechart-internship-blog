import { useState, KeyboardEvent } from 'react';

import { useAppDispatch } from '../../app/hooks';
import { useSelector } from 'react-redux';
import { getIsLoggedIn, USERS_URL, addNewUser } from '../../redux/userSlice';
import { nanoid } from '@reduxjs/toolkit';

import axios from 'axios';

import { Link, useNavigate } from 'react-router-dom';

import { FormattedMessage, useIntl } from 'react-intl';

import { Helmet } from 'react-helmet-async';

import MuiAlert from '@mui/material/Alert';

const bcrypt = require('bcryptjs');

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImageURL, setProfileImageURL] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(getIsLoggedIn);

  const navigate = useNavigate();

  const intl = useIntl();

  const preventInvalidCharsUsername = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault();
      setErrorMessage(
        intl.formatMessage({
          id: 'Register.error.usernameNoSpace',
          defaultMessage: 'Username cannot contain space',
        })
      );
      document
        .getElementsByName('username')[0]
        .classList.add('border', 'border-red-500');
    } else if (e.key === '"') {
      e.preventDefault();
      setErrorMessage(
        intl.formatMessage({
          id: 'Register.error.usernameNoQuotation',
          defaultMessage: 'Username cannot contain "',
        })
      );
      document
        .getElementsByName('username')[0]
        .classList.add('border', 'border-red-500');
    } else if (e.keyCode >= 33) {
      setErrorMessage('');
      document
        .getElementsByName('username')[0]
        .classList.remove('border', 'border-red-500');
    }
  };

  const preventInvalidCharsPassword = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '"') {
      e.preventDefault();
      setErrorMessage(
        intl.formatMessage({
          id: 'Register.error.passwordNoQuotation',
          defaultMessage: 'Password cannot contain "',
        })
      );
      document
        .getElementsByName('password')[0]
        .classList.add('border', 'border-red-500');
    } else if (e.keyCode >= 33) {
      setErrorMessage('');
      document
        .getElementsByName('password')[0]
        .classList.remove('border', 'border-red-500');
    }
  };

  const preventInvalidCharsConfirmPassword = (
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === '"') {
      e.preventDefault();
      setErrorMessage(
        intl.formatMessage({
          id: 'Register.error.passwordNoQuotation',
          defaultMessage: 'Password cannot contain "',
        })
      );
      document
        .getElementsByName('confirmPassword')[0]
        .classList.add('border', 'border-red-500');
    } else if (e.keyCode >= 33) {
      setErrorMessage('');
      document
        .getElementsByName('confirmPassword')[0]
        .classList.remove('border', 'border-red-500');
    }
  };

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

  const checkIfUsernameExists = async (username: string) => {
    try {
      const response = await axios.get(`${USERS_URL}?username=${username}`);
      if (response.data.length === 0) {
        return false;
      } else {
        return true;
      }
    } catch (error: any) {
      return error.message;
    }
  };

  const onSubmitRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      setErrorMessage(
        intl.formatMessage({
          id: 'Register.error.requiredFieldsEmpty',
          defaultMessage: 'Required fields cannot be empty!',
        })
      );
      return;
    }

    const isUsernameTaken = await checkIfUsernameExists(username);
    if (isUsernameTaken) {
      setErrorMessage(
        intl.formatMessage({
          id: 'Register.error.usernameTaken',
          defaultMessage: 'Username already taken',
        })
      );
      document
        .getElementsByName('username')[0]
        .classList.add('border', 'border-red-500');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(
        intl.formatMessage({
          id: 'Register.error.passwordsDoNotMatch',
          defaultMessage: 'Passwords do not match',
        })
      );
      document
        .getElementsByName('password')[0]
        .classList.add('border', 'border-red-500');
      document
        .getElementsByName('confirmPassword')[0]
        .classList.add('border', 'border-red-500');
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        intl.formatMessage({
          id: 'Register.error.passwordTooShort',
          defaultMessage: 'Password should contain at least 8 characters',
        })
      );
      document
        .getElementsByName('password')[0]
        .classList.add('border', 'border-red-500');
      document
        .getElementsByName('confirmPassword')[0]
        .classList.add('border', 'border-red-500');
      return;
    }

    if (username.length > 30) {
      setErrorMessage(
        intl.formatMessage({
          id: 'Register.error.usernameTooLong',
          defaultMessage: 'Username too long',
        })
      );
      document
        .getElementsByName('username')[0]
        .classList.add('border', 'border-red-500');
      return;
    }

    if (password.length > 30) {
      setErrorMessage(
        intl.formatMessage({
          id: 'Register.error.passwordTooLong',
          defaultMessage: 'Password too long',
        })
      );
      document
        .getElementsByName('password')[0]
        .classList.add('border', 'border-red-500');
      document
        .getElementsByName('confirmPassword')[0]
        .classList.add('border', 'border-red-500');
      return;
    }

    if (
      (profileImageURL &&
        !(
          profileImageURL.includes('.jpg') ||
          profileImageURL.includes('.jpeg') ||
          profileImageURL.includes('.png') ||
          profileImageURL.includes('.gif')
        )) ||
      profileImageURL.includes('"')
    ) {
      setErrorMessage(
        intl.formatMessage({
          id: 'Register.error.URLinvalid',
          defaultMessage: 'URL is invalid, please try another',
        })
      );
      return;
    }

    // add user to database
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = {
      id: nanoid(),
      username: username,
      password: hashedPassword,
      profilePictureURL: profileImageURL
        ? profileImageURL
        : 'https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg',
    };

    dispatch(addNewUser(newUser));
    navigate('/');
  };

  if (isLoggedIn) {
    return (
      <>
        <Helmet>
          <title>
            {intl.formatMessage({
              id: 'Register.register',
              defaultMessage: 'Register',
            })}
          </title>
        </Helmet>
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
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>
          {intl.formatMessage({
            id: 'Register.register',
            defaultMessage: 'Register',
          })}
        </title>
        <meta
          name='description'
          content={intl.formatMessage({
            id: 'Register.description',
            defaultMessage:
              "Create an account to add your own posts or react to others' ones",
          })}
        />
        <link rel='canonical' href='http://localhost:3000/register' />
      </Helmet>
      <main
        className='pb-2 max-w-[500px] m-auto'
        tabIndex={-1}
        aria-label={intl.formatMessage({
          id: 'Register.aria.main',
          defaultMessage: 'Register page',
        })}
        aria-live='polite'
        aria-atomic={true}
      >
        <div className='m-3 sm:m-6 px-4 py-2 bg-foreground-dark rounded-lg'>
          <div className='text-center my-2'>
            <h2 className='ml-0.5 text-xl sm:text-2xl font-bold'>
              <FormattedMessage
                id='Register.register'
                defaultMessage='Register here'
              />
            </h2>
          </div>
          <form onSubmit={(e) => onSubmitRegister(e)}>
            <div className='my-3'>
              <label htmlFor='username' className='block mb-1 ml-0.5'>
                <FormattedMessage
                  id='Register.usernameLabel'
                  defaultMessage='Username'
                />
                <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='username'
                placeholder={intl.formatMessage({
                  id: 'Register.usernameLabel',
                  defaultMessage: 'Username',
                })}
                className={`w-full bg-[rgb(62,63,64)] rounded-lg p-2 sm:text-lg`}
                onKeyDown={(e) => preventInvalidCharsUsername(e)}
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase())}
                required
                aria-required={true}
              />
            </div>
            <div className='my-3'>
              <label htmlFor='password' className='block mb-1 ml-0.5'>
                <FormattedMessage
                  id='Register.passwordLabel'
                  defaultMessage='Password'
                />
                <span className='text-red-500'>*</span>
              </label>
              <input
                type='password'
                name='password'
                placeholder={intl.formatMessage({
                  id: 'Register.passwordLabel',
                  defaultMessage: 'Password',
                })}
                className={`w-full bg-[rgb(62,63,64)] rounded-lg p-2 sm:text-lg`}
                onKeyDown={(e) => preventInvalidCharsPassword(e)}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-required={true}
              />
            </div>
            <div className='my-3'>
              <label htmlFor='confirmPassword' className='block mb-1 ml-0.5'>
                <FormattedMessage
                  id='Register.confirmPasswordLabel'
                  defaultMessage='Confirm Password'
                />
                <span className='text-red-500'>*</span>
              </label>
              <input
                type='password'
                name='confirmPassword'
                placeholder={intl.formatMessage({
                  id: 'Register.confirmPasswordLabel',
                  defaultMessage: 'Confirm Password',
                })}
                className={`w-full bg-[rgb(62,63,64)] rounded-lg p-2 sm:text-lg`}
                onKeyDown={(e) => preventInvalidCharsConfirmPassword(e)}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                aria-required={true}
              />
            </div>
            <div className='mt-3 mb-4'>
              <label htmlFor='image' className='block mb-1 ml-0.5'>
                <FormattedMessage
                  id='Register.profilePhotoURLLabel'
                  defaultMessage='Profile photo URL (optional)'
                />
              </label>
              <input
                type='text'
                name='image'
                className={`w-full bg-[rgb(62,63,64)] rounded-lg p-2 sm:text-lg ${
                  errorMessage.includes('URL') && 'border border-red-500'
                }`}
                placeholder={intl.formatMessage({
                  id: 'Register.URL',
                  defaultMessage: 'URL',
                })}
                value={profileImageURL}
                onChange={(e) => setProfileImageURL(e.target.value)}
                aria-label={intl.formatMessage({
                  id: 'Register.profilePhotoURLLabel',
                  defaultMessage: 'Profile photo URL (optional)',
                })}
              />
            </div>
            {renderErrorMessage()}
            <button
              type='submit'
              className='w-full h-10 sm:h-11 text-center bg-green-600 rounded-lg py-2 mt-4 mb-2 disabled:bg-zinc-700 sm:text-lg'
            >
              <FormattedMessage
                id='Register.register'
                defaultMessage='Register'
              />
            </button>
          </form>
        </div>
        <hr className='border-zinc-500 mt-5 mb-4 sm:mt-10 sm:mb-8' />
        <div className='px-4 w-full text-center'>
          <div className='text-lg sm:text-xl' tabIndex={0}>
            <FormattedMessage
              id='Register.alreadyHaveAccount'
              defaultMessage='Already have an account?'
            />
          </div>
          <Link
            to='/login'
            role='link'
            onClick={() => document.getElementsByTagName('main')[0]?.focus()}
          >
            <div className='h-10 sm:h-11 p-2 mt-3 mx-3 sm:mx-6 bg-blue-700 rounded-lg sm:text-lg'>
              <FormattedMessage
                id='Register.loginHere'
                defaultMessage='Log in here'
              />
            </div>
          </Link>
        </div>
      </main>
    </>
  );
}

export default Register;
