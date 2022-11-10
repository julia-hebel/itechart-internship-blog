import { useState } from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import { IoLanguageOutline } from 'react-icons/io5';

function LanguageMenu() {

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
        <div className='px-2 flex flex-col gap-1'></div>
      </Menu>
    </div>
  );
}

export default LanguageMenu;
