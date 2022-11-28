import { useState } from 'react';

import { FormattedMessage, useIntl } from 'react-intl';

import postTypes from '../../types/postTypes';

import EditPostModal from './EditPostModal';
import DeletePostModal from './DeletePostModal';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface propsTypes {
  post: postTypes;
}

function PostMenu({ post }: propsTypes) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const intl = useIntl();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const renderConfirmationMessage = () => {
    return (
      <Snackbar
        open={confirmationMessage ? true : false}
        autoHideDuration={6000}
        onClose={() => setConfirmationMessage('')}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={() => setConfirmationMessage('')}
          severity='success'
        >
          {confirmationMessage}
        </MuiAlert>
      </Snackbar>
    );
  };

  return (
    <div className='h-max'>
      <IconButton
        aria-label={intl.formatMessage({
          id: 'PostMenu.aria.button',
          defaultMessage: 'Open your post management menu',
        })}
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : 'false'}
        aria-haspopup='true'
        onClick={handleClick}
        sx={{
          color: 'rgb(210,210,210)',
          padding: '0',
          '&:hover': { backgroundColor: 'rgb(74,75,76)' },
        }}
        tabIndex={0}
      >
        <MoreVertIcon sx={{ height: '30px', width: '30px' }} />
      </IconButton>
      <Menu
        id='post-menu'
        MenuListProps={{
          'aria-labelledby': 'long-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() =>
            document.getElementById('postmenu-editbutton')?.click()
          }
        >
          <button
            id='postmenu-editbutton'
            className='px-1 py-1 w-full flex items-center rounded-md hover:bg-element-dark-hover cursor-pointer'
            onClick={() => {
              setEditModalOpen(true);
              handleClose();
            }}
          >
            <EditIcon className='p-[2px] ml-1' />
            <span className='mx-4 mb-[1px] w-full text-left'>
              <FormattedMessage id='PostMenu.editLabel' defaultMessage='Edit' />
            </span>
          </button>
        </MenuItem>
        <MenuItem
          onClick={() =>
            document.getElementById('postmenu-deletebutton')?.click()
          }
        >
          <button
            id='postmenu-deletebutton'
            className='px-1 py-1 w-full flex items-center rounded-md hover:bg-element-dark-hover cursor-pointer'
            onClick={() => {
              setDeleteModalOpen(true);
              handleClose();
            }}
          >
            <DeleteIcon className='p-[2px] ml-1' />
            <span className='mx-4 mb-[1px] w-full text-left'>
              <FormattedMessage
                id='PostMenu.deleteLabel'
                defaultMessage='Delete'
              />
            </span>
          </button>
        </MenuItem>
      </Menu>
      <EditPostModal
        post={post}
        editModalOpen={editModalOpen}
        setEditModalOpen={setEditModalOpen}
        setConfirmationMessage={setConfirmationMessage}
      />
      <DeletePostModal
        post={post}
        deleteModalOpen={deleteModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setConfirmationMessage={setConfirmationMessage}
      />
      {renderConfirmationMessage()}
    </div>
  );
}

export default PostMenu;
