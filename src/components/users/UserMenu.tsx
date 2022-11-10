import { useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { logoutUser } from '../../redux/userSlice';
import { Link } from 'react-router-dom';
import userTypes from '../../types/userTypes';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className='justify-self-end my-auto'>
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
          className='object-cover rounded-full h-9 w-9 sm:w-10 sm:h-10'
        />
      </Button>
      <Menu
        id='user-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <div className='pb-2 px-2 border-b border-zinc-500'>
          <Link
            to={`/profile/${currentUser.username}`}
            className='px-3 py-1 w-full rounded-md flex items-center hover:bg-[rgb(74,75,76)] cursor-pointer'
          >
            <img
              src={currentUser.profilePictureURL}
              alt='profile pic'
              className='object-cover rounded-full w-10 h-10'
            />
            <span className='ml-5 mr-2 font-bold'>{currentUser.username}</span>
          </Link>
        </div>
        <div className='px-2 mt-2'>
          <Link
            to='/editprofile'
            className='mt-1 px-3 pt-1 pb-1.5 w-full rounded-md flex items-center hover:bg-[rgb(74,75,76)] cursor-pointer'
            onClick={handleClose}
          >
            <span className='w-10 text-center'>
              <EditIcon />
            </span>
            <span className='ml-5 mr-3'>Manage Profile</span>
          </Link>
          <button
            className='mt-1 px-3 pt-1 pb-1.5 w-full rounded-md flex items-center hover:bg-[rgb(74,75,76)] cursor-pointer'
            onClick={() => {
              dispatch(logoutUser());
              setShowLogoutMessage(true);
            }}
          >
            <span className='w-10 text-center'>
              <LogoutIcon />
            </span>
            <span className='ml-5 mr-3'>Logout</span>
          </button>
        </div>
      </Menu>
    </div>
  );
}

export default UserMenu;
