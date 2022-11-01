import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getCurrentUser, getIsLoggedIn } from '../redux/userSlice';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LoginIcon from '@mui/icons-material/Login';
import { BiBook } from 'react-icons/bi';
import { HiMenu } from 'react-icons/hi';

function Header() {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const currentUser = useSelector(getCurrentUser);

  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

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
          Logged out successfully
        </MuiAlert>
      </Snackbar>
    );
  };

  return (
    <header className='flex items-center justify-between px-3 h-12 bg-[rgb(117,11,150)]'>
      <button className='h-9'>
        <HiMenu className='h-full w-full' />
      </button>
      <Link to='/' className='flex items-center text-2xl h-8'>
        <BiBook className='mr-1 h-full w-full' />
        <h1 className='mb-1'>PostBook</h1>
      </Link>
      {isLoggedIn ? (
        <UserMenu
          currentUser={currentUser}
          setShowLogoutMessage={setShowLogoutMessage}
        />
      ) : (
        <Link to='/login' className='mr-2 flex items-center hover:underline'>
          <LoginIcon className='mr-2' />
          <span className='mb-1'>Login</span>
        </Link>
      )}
      {renderLogoutMessage()}
    </header>
  );
}

export default Header;
