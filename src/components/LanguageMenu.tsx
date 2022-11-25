import { useState } from 'react';

import { useAppDispatch } from '../app/hooks';
import { useSelector } from 'react-redux';
import { getLanguage, setLanguage } from '../redux/languageSlice';

import { useIntl } from 'react-intl';

import { languages } from '../languages/languages';

import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { IoLanguageOutline } from 'react-icons/io5';
import { FiCheck } from 'react-icons/fi';

function LanguageMenu() {
  const dispatch = useAppDispatch();
  const currentLanguage = useSelector(getLanguage);

  const [showSelectionMessage, setShowSelectionMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const intl = useIntl();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const ariaOnSelectLanguage = () => {
    setTimeout(() => {
      setShowSelectionMessage('');
    }, 10);
  };

  return (
    <div className='justify-self-start my-auto'>
      <Button
        id='language-menu-button'
        aria-label={`
          ${
            showSelectionMessage &&
            intl.formatMessage({
              id: 'LanguageMenu.aria.selectedMessage',
              defaultMessage: 'Selected ',
            }) + showSelectionMessage
          }. 
          ${intl.formatMessage({
            id: 'LanguageMenu.aria.button',
            defaultMessage: 'Open language selection menu',
          })}
        `}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : 'false'}
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
        role='menu'
        aria-label={intl.formatMessage({
          id: 'LanguageMenu.aria.menu',
          defaultMessage: 'List of languages',
        })}
        MenuListProps={{
          'aria-labelledby': 'language-menu-button',
        }}
      >
        {languages.map((language) => (
          <MenuItem
            key={language.name}
            onClick={() => {
              setShowSelectionMessage(language.label);
              ariaOnSelectLanguage();
              dispatch(setLanguage(language.name));
              handleClose();
            }}
            tabIndex={0}
            aria-selected={currentLanguage === language.name ? 'true' : 'false'}
          >
            <button className='px-3 pt-1 pb-1.5 w-full rounded-md flex items-center hover:bg-element-dark-hover cursor-pointer'>
              <FiCheck
                className={`mt-1 mr-3 ${
                  currentLanguage !== language.name ? 'invisible' : ''
                }`}
              />
              <span className='mr-3'>{language.label}</span>
            </button>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}

export default LanguageMenu;
