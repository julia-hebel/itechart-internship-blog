import { useState, useEffect, KeyboardEvent } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { useSelector } from 'react-redux';
import {
  getCurrentUser,
  getIsLoggedIn,
  updateUser,
} from '../../redux/userSlice';
import axios from 'axios';
import { USERS_URL } from '../../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
const bcrypt = require('bcryptjs');

function EditProfile() {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const currentUser = useSelector(getCurrentUser);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [username, setUsername] = useState(currentUser.username);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profileImageURL, setProfileImageURL] = useState(
    currentUser.profilePictureURL
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn]);

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

  const renderConfirmationMessage = () => {
    return (
      <Snackbar
        open={confirmationMessage}
        autoHideDuration={6000}
        onClose={() => setConfirmationMessage(false)}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={() => setConfirmationMessage(false)}
          severity='success'
        >
          Saved successfully
        </MuiAlert>
      </Snackbar>
    );
  };

  const usernameError = () => {
    const contains = errorMessage.toLowerCase().includes('username');
    return contains;
  };

  const passwordError = () => {
    const contains = errorMessage.toLowerCase().includes('password');
    return contains;
  };

  const preventInvalidCharsUsername = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ') {
      e.preventDefault();
      setErrorMessage('Username cannot contain space');
    }
    if (e.key === '"') {
      e.preventDefault();
      setErrorMessage('Username cannot contain "');
    }
  };

  const preventInvalidCharsPassword = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '"') {
      e.preventDefault();
      setErrorMessage('Password cannot contain "');
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

  const verifyPassword = async (password: string) => {
    try {
      const response = await axios.get(`${USERS_URL}/${currentUser.id}`);
      if (bcrypt.compareSync(password, response.data.password)) {
        return true;
      }
      return false;
    } catch (error: any) {
      return error.message;
    }
  };

  const onSubmitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username) {
      setErrorMessage('Required fields cannot be empty!');
      return;
    }

    if (username !== currentUser.username) {
      const isUsernameTaken = await checkIfUsernameExists(username);
      if (isUsernameTaken) {
        setErrorMessage('Username already taken');
        return;
      }

      if (username.length > 30) {
        setErrorMessage('Username too long');
        return;
      }
    }

    if (oldPassword || newPassword || confirmNewPassword) {
      if (!oldPassword || !newPassword || !confirmNewPassword) {
        setErrorMessage('To change password all 3 fields must be filled');
        return;
      }

      const doesOldPasswordMatch = await verifyPassword(oldPassword);
      if (!doesOldPasswordMatch) {
        setErrorMessage('Old password incorrect!');
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setErrorMessage('New passwords do not match');
        return;
      }

      if (newPassword.length < 8) {
        setErrorMessage('New password should contain at least 8 characters');
        return;
      }

      if (newPassword.length > 30) {
        setErrorMessage('New password too long');
        return;
      }
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
      setErrorMessage('URL is invalid, please try another');
      return;
    }

    // add user to database
    let password = currentUser.password;
    if (newPassword) {
      const salt = bcrypt.genSaltSync(10);
      password = bcrypt.hashSync(newPassword, salt);
    }

    const updatedUser = {
      id: currentUser.id,
      username: username,
      password: password,
      profilePictureURL: profileImageURL
        ? profileImageURL
        : 'https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg',
    };

    dispatch(updateUser(updatedUser));
    setOldPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setErrorMessage('');
    setConfirmationMessage(true);
  };

  return (
    <main className='pb-0.5 max-w-[500px] m-auto'>
      <form
        onSubmit={(e) => onSubmitEdit(e)}
        className='m-3 sm:m-6 px-4 py-2 bg-[rgb(43,44,45)] rounded-lg'
      >
        <div className='my-3 mb-16'>
          <h3 className='text-xl font-bold text-center mb-2'>
            Change username?
          </h3>
          <label htmlFor='username' className='block mb-1 ml-0.5'>
            Username<span className='text-red-500'>*</span>
          </label>
          <input
            type='text'
            name='username'
            placeholder='Username'
            className={`w-full bg-[rgb(62,63,64)] rounded-lg p-2 sm:text-lg ${
              usernameError() && 'border border-red-500'
            }`}
            onKeyDown={(e) => preventInvalidCharsUsername(e)}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className='my-3'>
          <h3 className='text-xl font-bold text-center mb-2'>
            Change password?
          </h3>
          <label htmlFor='password' className='block mb-1 ml-0.5'>
            Old Password
          </label>
          <input
            type='password'
            name='password'
            placeholder='Old Password'
            className={`w-full bg-[rgb(62,63,64)] rounded-lg p-2 sm:text-lg ${
              passwordError() && 'border border-red-500'
            }`}
            onKeyDown={(e) => preventInvalidCharsPassword(e)}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className='my-3'>
          <label htmlFor='password' className='block mb-1 ml-0.5'>
            New Password
          </label>
          <input
            type='password'
            name='password'
            placeholder='New Password'
            className={`w-full bg-[rgb(62,63,64)] rounded-lg p-2 sm:text-lg ${
              passwordError() && 'border border-red-500'
            }`}
            onKeyDown={(e) => preventInvalidCharsPassword(e)}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className='my-3 mb-16'>
          <label htmlFor='confirmPassword' className='block mb-1 ml-0.5'>
            Confirm New Password
          </label>
          <input
            type='password'
            name='confirmPassword'
            placeholder='Confirm New Password'
            className={`w-full bg-[rgb(62,63,64)] rounded-lg p-2 sm:text-lg ${
              passwordError() && 'border border-red-500'
            }`}
            onKeyDown={(e) => preventInvalidCharsPassword(e)}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <div className='mt-3 mb-12'>
          <h3 className='text-xl font-bold text-center mb-4'>
            Change or remove profile picture?
          </h3>
          <label htmlFor='image' className='block mb-1 ml-0.5'>
            Profile photo URL (optional)
          </label>
          <input
            type='text'
            name='image'
            className={`w-full bg-[rgb(62,63,64)] rounded-lg p-2 sm:text-lg ${
              errorMessage === 'URL is invalid, please try another' &&
              'border border-red-500'
            }`}
            placeholder='Image URL'
            value={profileImageURL}
            onChange={(e) => setProfileImageURL(e.target.value)}
          />
        </div>
        {renderErrorMessage()}
        <button
          type='submit'
          className='w-full h-10 sm:h-11 text-center bg-green-600 rounded-lg py-2 mt-4 mb-2 disabled:bg-zinc-700 sm:text-lg'
        >
          Save
        </button>
      </form>
      {renderConfirmationMessage()}
    </main>
  );
}

export default EditProfile;
