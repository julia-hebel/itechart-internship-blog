import { useAppDispatch } from '../../app/hooks';
import { deletePost } from '../../redux/postsSlice';

import { FormattedMessage, useIntl } from 'react-intl';

import postTypes from '../../types/postTypes';

import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';

import { CgClose } from 'react-icons/cg';

interface propsTypes {
  post: postTypes;
  deleteModalOpen: boolean;
  setDeleteModalOpen: Function;
  setConfirmationMessage: Function;
}

function DeletePostModal({
  post,
  deleteModalOpen,
  setDeleteModalOpen,
  setConfirmationMessage,
}: propsTypes) {
  const dispatch = useAppDispatch();

  const intl = useIntl();

  const onDelete = () => {
    dispatch(deletePost(post.id));
    setConfirmationMessage(
      intl.formatMessage({
        id: 'DeletePostModal.confirmationMessage',
        defaultMessage: 'Post successfully deteted',
      })
    );
    setDeleteModalOpen(false);
  };

  return (
    <Modal
      open={deleteModalOpen}
      onClose={() => setDeleteModalOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={deleteModalOpen}>
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 500,
            bgcolor: 'rgb(36,37,38)',
            boxShadow: 24,
            color: 'white',
          }}
          className='pt-3 pb-5 px-5 rounded-xl'
          aria-label={intl.formatMessage({
            id: 'DeletePostModal.aria.modal',
            defaultMessage: 'Opened modal - deleting the post',
          })}
        >
          <div className='text-center'>
            <div className='w-full grid grid-cols-5'>
              <span className='col-span-1'></span>
              <h2
                className='col-span-3 font-bold text-xl text-center'
                tabIndex={0}
              >
                <FormattedMessage
                  id='DeletePostModal.heading'
                  defaultMessage='Are you sure to delete post?'
                />
              </h2>
              <div className='col-span-1 flex items-center justify-end h-8'>
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className='h-8 w-8 bg-[rgb(62,63,64)] hover:bg-[rgb(80,81,82)] rounded-full'
                  aria-label={intl.formatMessage({
                    id: 'DeletePostModal.aria.closeButton',
                    defaultMessage: 'Close modal - deleting the post',
                  })}
                >
                  <CgClose className='h-full w-full p-1' />
                </button>
              </div>
            </div>
            <hr className='mt-6 mb-8 border-zinc-600' />
            <div className='flex flex-row items-center justify-around'>
              <button
                className='w-[122px] py-2 px-4 border border-zinc-500 rounded-md bg-green-700'
                onClick={() => onDelete()}
              >
                <FormattedMessage
                  id='DeletePostModal.confirmButton'
                  defaultMessage='Yes, delete it'
                />
              </button>
              <button
                className='w-[122px] py-2 px-4 border border-zinc-500 rounded-md bg-red-700'
                onClick={() => setDeleteModalOpen(false)}
              >
                <FormattedMessage
                  id='DeletePostModal.cancelButton'
                  defaultMessage='No, go back'
                />
              </button>
            </div>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export default DeletePostModal;
