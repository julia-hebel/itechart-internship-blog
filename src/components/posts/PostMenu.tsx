import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditPostModal from './EditPostModal';
import DeletePostModal from './DeletePostModal';

function PostMenu({ post }: any) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
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
        aria-label='more'
        id='long-button'
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleClick}
        sx={{ color: 'rgb(210,210,210)', padding: '0' }}
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
        <button
          className='px-1 py-1 w-full flex items-center hover:bg-[rgb(74,75,76)] cursor-pointer'
          onClick={() => {
            setEditModalOpen(true);
            handleClose();
          }}
        >
          <EditIcon className='p-[2px] ml-1' />
          <span className='mx-4 mb-[3px] w-full text-left'>Edit</span>
        </button>
        <button
          className='px-1 py-1 w-full flex items-center hover:bg-[rgb(74,75,76)] cursor-pointer'
          onClick={() => {
            setDeleteModalOpen(true);
            handleClose();
          }}
        >
          <DeleteIcon className='p-[2px] ml-1' />
          <span className='mx-4 mb-[3px] w-full text-left'>Delete</span>
        </button>
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
