import { useState } from 'react';

import { useAppDispatch } from '../../app/hooks';
import { nanoid } from '@reduxjs/toolkit';
import { addNewPost } from '../../redux/postsSlice';

import { FormattedMessage, useIntl } from 'react-intl';

import userTypes from '../../types/userTypes';

import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import MuiAlert from '@mui/material/Alert';

import { CgClose } from 'react-icons/cg';

interface propsTypes {
  currentUser: userTypes;
  modalOpen: boolean;
  setModalOpen: Function;
  setConfirmationMessage: Function;
}

function CreatePostModal({
  currentUser,
  modalOpen,
  setModalOpen,
  setConfirmationMessage,
}: propsTypes) {
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImageURL, setPostImageURL] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const dispatch = useAppDispatch();

  const intl = useIntl();

  const renderErrorMessage = () => {
    if (errorMessage) {
      return (
        <MuiAlert
          elevation={6}
          variant='filled'
          severity='error'
          sx={{ borderRadius: '0.5rem', marginTop: '4px' }}
        >
          {errorMessage}
        </MuiAlert>
      );
    } else {
      return null;
    }
  };

  const onSubmitPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setConfirmationMessage(false);

    if (!postTitle) {
      setErrorMessage(
        intl.formatMessage({
          id: 'CreatePostModal.errorMessage.titleEmpty',
          defaultMessage: 'Title input cannot be empty!',
        })
      );
      return;
    }

    if (
      postImageURL &&
      !(
        postImageURL.includes('.jpg') ||
        postImageURL.includes('.jpeg') ||
        postImageURL.includes('.png') ||
        postImageURL.includes('.gif')
      )
    ) {
      setErrorMessage(
        intl.formatMessage({
          id: 'CreatePostModal.errorMessage.invalidURL',
          defaultMessage: 'URL is invalid, please try another',
        })
      );
      return;
    }

    // in case of double quotes add backslash
    setPostTitle(postTitle.replace('"', '\\"'));
    setPostContent(postContent.replace('"', '\\"'));

    const newPost = {
      id: nanoid() as string,
      title: postTitle,
      content: postContent,
      image: postImageURL,
      date: new Date().toUTCString(),
      reactions: {
        like: [] as string[],
        love: [] as string[],
        wow: [] as string[],
        sad: [] as string[],
        dislike: [] as string[],
      },
      user: {
        userId: currentUser.id,
      },
    };

    try {
      dispatch(addNewPost(newPost));
      setPostTitle('');
      setPostContent('');
      setPostImageURL('');
      setErrorMessage('');
      setConfirmationMessage(true);
      setModalOpen(false);
    } catch (error: any) {
      console.error('Failed to save the post', error);
      setErrorMessage(
        intl.formatMessage({
          id: 'CreatePostModal.errorMessage.failedAddPost',
          defaultMessage: 'Post failed to add',
        })
      );
    }
  };

  return (
    <Modal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={modalOpen}>
        <Box
          sx={{
            position: 'absolute' as 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 500,
            boxShadow: 24,
          }}
          className='pt-3 pb-5 px-5 rounded-xl bg-foreground-dark text-white'
          aria-label={intl.formatMessage({
            id: 'CreatePostModal.aria.modal',
            defaultMessage: 'Opened modal - creating a new post',
          })}
        >
          <div className='w-full grid grid-cols-5'>
            <span className='col-span-1'></span>
            <h2 className='col-span-3 font-bold text-xl text-center'>
              <FormattedMessage
                id='CreatePostModal.createPost'
                defaultMessage='Create a new post'
              />
            </h2>
            <div className='col-span-1 flex items-center justify-end h-8'>
              <button
                onClick={() => setModalOpen(false)}
                className='h-8 w-8 bg-interactive-dark hover:bg-interactive-dark-hover rounded-full'
                aria-label={intl.formatMessage({
                  id: 'CreatePostModal.aria.closeButton',
                  defaultMessage: 'Close modal - creating a new post',
                })}
              >
                <CgClose className='h-full w-full p-1' />
              </button>
            </div>
          </div>
          <hr className='my-4 border-zinc-600' />
          <div>
            <div className='w-full mb-3 mt-1 flex items-center justify-start'>
              <img
                src={currentUser.profilePictureURL}
                alt={intl.formatMessage({
                  id: 'AddNewPost.profilePicAlt',
                  defaultMessage: 'Your profile picture',
                })}
                className='object-cover rounded-full h-10 w-10'
              />
              <span className='ml-3 flex flex-col justify-center font-bold'>
                {currentUser.username}
              </span>
            </div>
            <form onSubmit={(e) => onSubmitPost(e)} className='mt-3'>
              <div className='my-3'>
                <label htmlFor='title' className='block mb-1 ml-0.5'>
                  <FormattedMessage
                    id='CreatePostModal.title'
                    defaultMessage='Title'
                  />
                  <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='title'
                  className='w-full bg-interactive-dark rounded-lg p-2 sm:text-xl'
                  placeholder={intl.formatMessage({
                    id: 'CreatePostModal.titlePlaceholder',
                    defaultMessage: 'Post title',
                  })}
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  required
                  aria-required={true}
                />
              </div>
              <div className='my-3'>
                <label htmlFor='content' className='block mb-1 ml-0.5'>
                  <FormattedMessage
                    id='CreatePostModal.content'
                    defaultMessage='Content'
                  />
                </label>
                <textarea
                  name='content'
                  cols={30}
                  rows={8}
                  className='w-full bg-interactive-dark rounded-lg p-2 text-sm sm:text-base resize-none'
                  placeholder={intl.formatMessage({
                    id: 'CreatePostModal.contentPlacehonder',
                    defaultMessage: 'Post content',
                  })}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  aria-label={intl.formatMessage({
                    id: 'CreatePostModal.contentPlacehonder',
                    defaultMessage: 'Post content',
                  })}
                />
              </div>
              <div className='my-3'>
                <label htmlFor='image' className='block mb-1 ml-0.5'>
                  <FormattedMessage
                    id='CreatePostModal.image'
                    defaultMessage='Image URL (optional)'
                  />
                </label>
                <input
                  type='text'
                  name='image'
                  className={`w-full bg-interactive-dark rounded-lg p-2 text-sm sm:text-base ${
                    errorMessage === 'URL is invalid, please try another' &&
                    'border border-red-500'
                  }`}
                  placeholder={intl.formatMessage({
                    id: 'CreatePostModal.imagePlaceholder',
                    defaultMessage: 'Image URL',
                  })}
                  value={postImageURL}
                  onChange={(e) => setPostImageURL(e.target.value)}
                  aria-label={intl.formatMessage({
                    id: 'CreatePostModal.image',
                    defaultMessage: 'Image URL (optional)',
                  })}
                />
              </div>
              {renderErrorMessage()}
              <button
                type='submit'
                className='w-full h-12 text-center bg-green-600 rounded-lg py-2 mt-4 disabled:bg-zinc-700'
                disabled={!postTitle}
              >
                <FormattedMessage
                  id='CreatePostModal.addPostButton'
                  defaultMessage='Add a new post'
                />
              </button>
            </form>
          </div>
        </Box>
      </Fade>
    </Modal>
  );
}

export default CreatePostModal;
