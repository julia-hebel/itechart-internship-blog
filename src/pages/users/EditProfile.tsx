import { useState, useEffect, KeyboardEvent } from 'react';

import { useAppDispatch } from '../../app/hooks';
import { useSelector } from 'react-redux';
import {
  getCurrentUser,
  getIsLoggedIn,
  updateUser,
  USERS_URL,
} from '../../redux/userSlice';

import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import { FormattedMessage, useIntl } from 'react-intl';

import DeleteUserModal from '../../components/users/DeleteUserModal';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const bcrypt = require('bcryptjs');

function EditProfile() {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const currentUser = useSelector(getCurrentUser);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const intl = useIntl();

  const [username, setUsername] = useState(currentUser.username);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [profileImageURL, setProfileImageURL] = useState(
    currentUser.profilePictureURL
  );
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn]);

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
          <FormattedMessage
            id='EditProfile.confirmationMessage'
            defaultMessage='Saved successfully'
          />
        </MuiAlert>
      </Snackbar>
    );
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

    setUsername(username.toLowerCase());
    if (!username) {
      setErrorMessage(
        intl.formatMessage({
          id: 'Register.error.requiredFieldsEmpty',
          defaultMessage: 'Required fields cannot be empty!',
        })
      );
      document
        .getElementsByName('username')[0]
        .classList.add('border', 'border-red-500');
      return;
    }

    if (username !== currentUser.username) {
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
    }

    if (oldPassword || newPassword || confirmNewPassword) {
      if (!oldPassword || !newPassword || !confirmNewPassword) {
        setErrorMessage(
          intl.formatMessage({
            id: 'EditProfile.error.notAllPasswordsFilled',
            defaultMessage: 'To change password all 3 fields must be filled',
          })
        );

        !oldPassword &&
          document
            .getElementsByName('oldPassword')[0]
            .classList.add('border', 'border-red-500');

        !newPassword &&
          document
            .getElementsByName('password')[0]
            .classList.add('border', 'border-red-500');

        !confirmNewPassword &&
          document
            .getElementsByName('confirmPassword')[0]
            .classList.add('border', 'border-red-500');
        return;
      }

      const doesOldPasswordMatch = await verifyPassword(oldPassword);
      if (!doesOldPasswordMatch) {
        setErrorMessage(
          intl.formatMessage({
            id: 'EditProfile.error.notAllPasswordsFilled',
            defaultMessage: 'EditProfile.error.oldPasswordIncorrect',
          })
        );
        document
          .getElementsByName('oldPassword')[0]
          .classList.add('border', 'border-red-500');
        return;
      }

      if (newPassword !== confirmNewPassword) {
        setErrorMessage(
          intl.formatMessage({
            id: 'EditProfile.error.newPasswordsDoNotMatch',
            defaultMessage: 'New passwords do not match',
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

      if (newPassword.length < 8) {
        setErrorMessage(
          intl.formatMessage({
            id: 'EditProfile.error.newPasswordTooShort',
            defaultMessage: 'New password should contain at least 8 characters',
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

      if (newPassword.length > 30) {
        setErrorMessage(
          intl.formatMessage({
            id: 'EditProfile.error.newPasswordTooLong',
            defaultMessage: 'New password too long',
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
    <main
      className='px-3 sm:px-6 pb-0.5 max-w-[500px] m-auto mt-6'
      tabIndex={-1}
      aria-label={intl.formatMessage({
        id: 'EditProfile.aria.main',
        defaultMessage: 'Profile editing page',
      })}
      aria-live='polite'
      aria-atomic={true}
    >
      <form
        onSubmit={(e) => onSubmitEdit(e)}
        className='px-4 py-2 bg-foreground-dark rounded-lg'
      >
        <div className='my-3 mb-16'>
          <h3 className='text-xl font-bold text-center mb-2' tabIndex={0}>
            <FormattedMessage
              id='EditProfile.changeUsername'
              defaultMessage='Change username?'
            />
          </h3>
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
            className={`w-full bg-interactive-dark rounded-lg p-2 sm:text-lg`}
            onKeyDown={(e) => preventInvalidCharsUsername(e)}
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            required
            aria-required={true}
          />
        </div>
        <div className='my-3'>
          <h3 className='text-xl font-bold text-center mb-2' tabIndex={0}>
            <FormattedMessage
              id='EditProfile.changePassword'
              defaultMessage='Change password?'
            />
          </h3>
          <label htmlFor='password' className='block mb-1 ml-0.5'>
            <FormattedMessage
              id='EditProfile.oldPassword'
              defaultMessage='Old Password'
            />
          </label>
          <input
            type='password'
            name='oldPassword'
            placeholder={intl.formatMessage({
              id: 'EditProfile.oldPassword',
              defaultMessage: 'Old Password',
            })}
            className={`w-full bg-interactive-dark rounded-lg p-2 sm:text-lg`}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div className='my-3'>
          <label htmlFor='password' className='block mb-1 ml-0.5'>
            <FormattedMessage
              id='EditProfile.newPassword'
              defaultMessage='New Password'
            />
          </label>
          <input
            type='password'
            name='password'
            placeholder={intl.formatMessage({
              id: 'EditProfile.newPassword',
              defaultMessage: 'New Password',
            })}
            className={`w-full bg-interactive-dark rounded-lg p-2 sm:text-lg`}
            onKeyDown={(e) => preventInvalidCharsPassword(e)}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className='my-3 mb-16'>
          <label htmlFor='confirmPassword' className='block mb-1 ml-0.5'>
            <FormattedMessage
              id='EditProfile.confirmNewPassword'
              defaultMessage='Confirm New Password'
            />
          </label>
          <input
            type='password'
            name='confirmPassword'
            placeholder={intl.formatMessage({
              id: 'EditProfile.confirmNewPassword',
              defaultMessage: 'Confirm New Password',
            })}
            className={`w-full bg-interactive-dark rounded-lg p-2 sm:text-lg`}
            onKeyDown={(e) => preventInvalidCharsConfirmPassword(e)}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <div className='mt-3 mb-12'>
          <h3 className='text-xl font-bold text-center mb-4' tabIndex={0}>
            <FormattedMessage
              id='EditProfile.changeProfilePicture'
              defaultMessage='Change or remove profile picture?'
            />
          </h3>
          <label htmlFor='image' className='block mb-1 ml-0.5'>
            <FormattedMessage
              id='Register.profilePhotoURLLabel'
              defaultMessage='Profile photo URL (optional)'
            />
          </label>
          <input
            type='text'
            name='image'
            className={`w-full bg-interactive-dark rounded-lg p-2 sm:text-lg ${
              errorMessage.includes('URL') && 'border border-red-500'
            }`}
            placeholder={intl.formatMessage({
              id: 'Register.URL',
              defaultMessage: 'URL',
            })}
            value={profileImageURL}
            onChange={(e) => setProfileImageURL(e.target.value)}
          />
        </div>
        {renderErrorMessage()}
        <button
          type='submit'
          className='w-full h-10 sm:h-11 text-center bg-green-600 rounded-lg py-2 mt-4 mb-2 disabled:bg-zinc-700 sm:text-lg'
        >
          <FormattedMessage id='EditProfile.save' defaultMessage='Save' />
        </button>
      </form>
      {renderConfirmationMessage()}
      <div className='my-16 text-center font-bold text-xl' tabIndex={0}>
        <FormattedMessage id='EditProfile.or' defaultMessage='or' />
      </div>
      <div className='flex justify-center mx-3'>
        <button
          onClick={() => setDeleteModalOpen(true)}
          className='w-full h-10 sm:h-11 text-center bg-red-600 rounded-lg py-2 mb-10 sm:text-lg'
          aria-haspopup={true}
        >
          <FormattedMessage
            id='EditProfile.deleteAccount'
            defaultMessage='Delete my account'
          />
        </button>
        <DeleteUserModal
          user={currentUser}
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
        />
      </div>
    </main>
  );
}

export default EditProfile;
