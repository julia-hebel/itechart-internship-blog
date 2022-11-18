import { useState } from 'react';

import { useAppDispatch } from '../app/hooks';
import { useSelector } from 'react-redux';
import { getLanguage, setLanguage } from '../redux/languageSlice';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';

import { IoLanguageOutline } from 'react-icons/io5';
import { FiCheck } from 'react-icons/fi';

function LanguageMenu() {
  const dispatch = useAppDispatch();
  const language = useSelector(getLanguage);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className='justify-self-start my-auto'>
      <Button
        id='basic-button'
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ minHeight: 0, minWidth: 0, padding: 0 }}
        className='border border-white'
      >
        <IoLanguageOutline className='h-8 sm:h-9 w-full text-white' />
      </Button>
      <Menu
        id='language-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <li className='px-2'>
          <button
            onClick={() => {
              dispatch(setLanguage('English'));
              handleClose();
            }}
            className='px-3 pt-1 pb-1.5 w-full rounded-md flex items-center hover:bg-[rgb(74,75,76)] cursor-pointer'
          >
            <FiCheck
              className={`mt-1 mr-3 ${
                language !== 'English' ? 'invisible' : ''
              }`}
            />
            <span className='mr-3'>English</span>
          </button>
        </li>
        <li className='px-2'>
          <button
            onClick={() => {
              dispatch(setLanguage('Polish'));
              handleClose();
            }}
            className='px-3 pt-1 pb-1.5 w-full rounded-md flex items-center hover:bg-[rgb(74,75,76)] cursor-pointer'
          >
            <FiCheck
              className={`mt-1 mr-3 ${
                language !== 'Polish' ? 'invisible' : ''
              }`}
            />
            <span className='mr-3'>Polski</span>
          </button>
        </li>
      </Menu>
    </div>
  );
}

export default LanguageMenu;
