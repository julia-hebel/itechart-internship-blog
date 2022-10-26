import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../app/hooks';
import { getCurrentUser, getIsLoggedIn, logoutUser } from '../redux/userSlice';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Menu from '@mui/material/Menu';
import Logout from '@mui/icons-material/Logout';
import { BiBook } from 'react-icons/bi';
import { HiMenu } from 'react-icons/hi';

function Header() {
  const isLoggedIn = useSelector(getIsLoggedIn);
  const currentUser = useSelector(getCurrentUser);

  const dispatch = useAppDispatch();

  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
        <div>
          <Button
            id='basic-button'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup='true'
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            sx={{ minHeight: 0, minWidth: 0, padding: 0 }}
          >
            <img
              src={currentUser.profilePictureURL}
              alt='profile pic'
              className='object-cover rounded-full w-10 h-10'
            />
          </Button>
          <Menu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <div className='pb-2 px-2 border-b border-zinc-500'>
              <button
                onClick={handleClose}
                className='px-3 py-1 w-full rounded-md flex items-center hover:bg-[rgb(74,75,76)] cursor-pointer'
              >
                <img
                  src={currentUser.profilePictureURL}
                  alt='profile pic'
                  className='object-cover rounded-full w-10 h-10'
                />
                <span className='mx-3 font-bold'>{currentUser.username}</span>
              </button>
            </div>
            <div className='px-2 mt-2'>
              <button
                className='px-5 py-1 w-full rounded-md flex items-center hover:bg-[rgb(74,75,76)] cursor-pointer'
                onClick={() => {
                  dispatch(logoutUser());
                  setShowLogoutMessage(true);
                }}
              >
                <Logout />
                <span className='mx-4 mb-[3px]'>Logout</span>
              </button>
            </div>
          </Menu>
        </div>
      ) : (
        <Link to='/login' className='mr-2'>
          Login
        </Link>
      )}
      {renderLogoutMessage()}
    </header>
  );
}

export default Header;
