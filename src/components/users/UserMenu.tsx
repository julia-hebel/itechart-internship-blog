import { useState } from 'react';

import { useAppDispatch } from '../../app/hooks';
import { logoutUser } from '../../redux/userSlice';

import { Link } from 'react-router-dom';

import { FormattedMessage, useIntl } from 'react-intl';

import userTypes from '../../types/userTypes';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import LogoutIcon from '@mui/icons-material/Logout';

interface propsTypes {
  currentUser: userTypes;
  setShowLogoutMessage: Function;
}

function UserMenu({ currentUser, setShowLogoutMessage }: propsTypes) {
  const dispatch = useAppDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const intl = useIntl();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className='justify-self-end my-auto'>
      <Button
        id='user-menu-button'
        aria-label={intl.formatMessage({
          id: 'UserMenu.aria.openUserMenu',
          defaultMessage: 'Open user menu',
        })}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : 'false'}
        onClick={(e) => {
          handleClick(e);
        }}
        sx={{ minHeight: 0, minWidth: 0, padding: 0 }}
      >
        <img
          src={currentUser.profilePictureURL}
          alt={intl.formatMessage({
            id: 'AddNewPost.profilePicAlt',
            defaultMessage: 'Your profile picture',
          })}
          className='object-cover rounded-full h-9 w-9 sm:w-10 sm:h-10'
        />
      </Button>
      <Menu
        id='user-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => document.getElementById('profile-link')?.click()}
        >
          <div className='pb-2 px-2 w-full border-b border-zinc-500'>
            <Link
              id='profile-link'
              to={`/profile/${currentUser.username}`}
              className='px-3 py-1 w-full rounded-md flex items-center hover:bg-element-dark-hover cursor-pointer'
              onClick={handleClose}
              tabIndex={0}
              role='link'
              aria-label={intl.formatMessage({
                id: 'UserMenu.aria.profileLink',
                defaultMessage: 'Navigate to your profile page - link',
              })}
            >
              <img
                src={currentUser.profilePictureURL}
                alt={intl.formatMessage({
                  id: 'AddNewPost.profilePicAlt',
                  defaultMessage: 'Your profile picture',
                })}
                className='object-cover rounded-full w-10 h-10'
              />
              <span className='ml-5 mr-2 font-bold'>
                {currentUser.username}
              </span>
            </Link>
          </div>
        </MenuItem>
        <MenuItem
          sx={{ paddingX: '8px !important', marginTop: '8px' }}
          onClick={() => document.getElementById('editprofile-link')?.click()}
        >
          <Link
            id='editprofile-link'
            to='/editprofile'
            className='mt-1 px-3 pt-1 pb-1.5 w-full rounded-md flex items-center hover:bg-element-dark-hover cursor-pointer'
            onClick={() => {
              handleClose();
              document.getElementsByTagName('main')[0]?.focus();
            }}
            tabIndex={0}
            role='link'
            aria-label={intl.formatMessage({
              id: 'UserMenu.aria.manageAccount',
              defaultMessage: 'Manage account - link',
            })}
          >
            <span className='w-10 text-center'>
              <EditIcon />
            </span>
            <span className='ml-5 mr-3'>
              <FormattedMessage
                id='UserMenu.manageProfile'
                defaultMessage='Manage Profile'
              />
            </span>
          </Link>
        </MenuItem>
        <MenuItem
          sx={{ padding: '0 8px !important' }}
          onClick={() => document.getElementById('logout-button')?.click()}
        >
          <button
            id='logout-button'
            className='mt-1 px-3 pt-1 pb-1.5 w-full rounded-md flex items-center hover:bg-element-dark-hover cursor-pointer'
            onClick={() => {
              dispatch(logoutUser());
              setShowLogoutMessage(true);
            }}
          >
            <span className='w-10 text-center'>
              <LogoutIcon />
            </span>
            <span className='ml-5 mr-3'>
              <FormattedMessage id='UserMenu.logout' defaultMessage='Log Out' />
            </span>
          </button>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default UserMenu;
