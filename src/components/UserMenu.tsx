import { useState } from 'react';
import { useAppDispatch } from '../app/hooks';
import { logoutUser } from '../redux/userSlice';
import userTypes from '../types/userTypes';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
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
            <LogoutIcon />
            <span className='mx-4 mb-[3px]'>Logout</span>
          </button>
        </div>
      </Menu>
    </div>
  );
}

export default UserMenu;
