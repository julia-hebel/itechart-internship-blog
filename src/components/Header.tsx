import { useState } from 'react';

import { useSelector } from 'react-redux';
import { getCurrentUser, getIsLoggedIn } from '../redux/userSlice';

import { Link } from 'react-router-dom';

import { FormattedMessage, useIntl } from 'react-intl';

import UserMenu from './users/UserMenu';
import LanguageMenu from './LanguageMenu';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { BiBook } from 'react-icons/bi';
import { VscAccount } from 'react-icons/vsc';

function Header() {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const currentUser = useSelector(getCurrentUser);

  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  const intl = useIntl();

  const renderLogoutMessage = () => {
    return (
      <Snackbar
        open={showLogoutMessage}
        autoHideDuration={6000}
        onClose={() => setShowLogoutMessage(false)}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={() => setShowLogoutMessage(false)}
          severity='success'
        >
          <FormattedMessage
            id='Header.logoutMessage'
            defaultMessage='Logged out successfully'
          />
        </MuiAlert>
      </Snackbar>
    );
  };

  return (
    <header className='grid grid-cols-4 grid-rows-1 justify-items-center content-center px-3 sm:px-4 h-12 bg-[rgb(117,11,150)]'>
      <LanguageMenu />
      <Link
        to='/'
        className='col-span-2 flex items-center text-2xl sm:text-3xl'
      >
        <BiBook className='mr-1 h-[32px] w-full' />
        <h1 className='mb-[3px]'>PostBook</h1>
      </Link>
      {isLoggedIn ? (
        <UserMenu
          currentUser={currentUser}
          setShowLogoutMessage={setShowLogoutMessage}
        />
      ) : (
        <Link
          to='/login'
          className='justify-self-end flex items-center sm:text-base'
        >
          <VscAccount className='h-8 sm:h-9 w-full mr-0.5' />
        </Link>
      )}
      {renderLogoutMessage()}
    </header>
  );
}

export default Header;
