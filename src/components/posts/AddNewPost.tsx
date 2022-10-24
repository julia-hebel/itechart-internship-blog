import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { addNewPost } from '../../redux/postsSlice';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { CgClose } from 'react-icons/cg';

function AddNewPost() {
  const [modalOpen, setModalOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postImageURL, setPostImageURL] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState(false);

  const dispatch = useDispatch<any>();
  const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);

  const navigate = useNavigate();

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

    if (!postTitle || !postContent) {
      setErrorMessage('Title and content inputs cannot be empty!');
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
      setErrorMessage('URL is invalid, please try another');
      return;
    }

    // in case of double quotes add backslash
    setPostTitle(postTitle.replace('"', '"'));
    setPostContent(postContent.replace('"', '"'));

    const newPost = {
      id: nanoid(),
      userId: 1,
      title: postTitle,
      content: postContent,
      image: postImageURL,
      date: new Date().toUTCString(),
      reactions: {
        like: 0,
        love: 0,
        wow: 0,
        sad: 0,
        dislike: 0,
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
      setErrorMessage('Post failed to add');
    }
  };
  return (
    <div className='max-w-[640px] m-auto'>
      <div className='mx-5 mt-6 px-4 py-2 bg-[rgb(43,44,45)] rounded-lg'>
        <div className='w-full h-10 my-1 flex items-center justify-start'>
          <img
            src='https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg'
            alt='profile pic'
            className='rounded-full h-full'
          />
          <button
            className='ml-3 pl-4 pb-[1px] w-full h-full bg-[rgb(62,63,64)] hover:bg-[rgb(74,75,76)] text-zinc-400 text-left text-sm sm:text-base rounded-full'
            onClick={() =>
              isLoggedIn ? setModalOpen(!modalOpen) : navigate('/login')
            }
          >
            What's on your mind?
          </button>
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
                  bgcolor: 'rgb(36,37,38)',
                  boxShadow: 24,
                  color: 'white',
                }}
                className='pt-3 pb-5 px-5 rounded-xl'
              >
                <div className='w-full grid grid-cols-5'>
                  <span className='col-span-1'></span>
                  <h2 className='col-span-3 font-bold text-xl text-center'>
                    Create a new post
                  </h2>
                  <div className='col-span-1 flex items-center justify-end h-8'>
                    <button
                      onClick={() => setModalOpen(false)}
                      className='h-8 w-8 bg-[rgb(62,63,64)] hover:bg-[rgb(80,81,82)] rounded-full'
                    >
                      <CgClose className='h-full w-full p-1' />
                    </button>
                  </div>
                </div>
                <hr className='my-4 border-zinc-600' />
                <div>
                  <div className='w-full mb-3 mt-1 flex items-center justify-start'>
                    <img
                      src='https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg'
                      alt='profile pic'
                      className='rounded-full h-10'
                    />
                    <span className='ml-3 flex flex-col justify-center font-bold'>
                      Author
                    </span>
                  </div>
                  <form onSubmit={(e) => onSubmitPost(e)} className='mt-3'>
                    <div className='my-3'>
                      <label htmlFor='title' className='block mb-1 ml-0.5'>
                        Title<span className='text-red-500'>*</span>
                      </label>
                      <input
                        type='text'
                        name='title'
                        className='w-full bg-[rgb(62,63,64)] rounded-lg p-2 sm:text-xl'
                        placeholder='Post title'
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className='my-3'>
                      <label htmlFor='content' className='block mb-1 ml-0.5'>
                        Content<span className='text-red-500'>*</span>
                      </label>
                      <textarea
                        name='content'
                        cols={30}
                        rows={8}
                        className='w-full bg-[rgb(62,63,64)] rounded-lg p-2 text-sm sm:text-base resize-none'
                        placeholder='Post content'
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        required
                      />
                    </div>
                    <div className='my-3'>
                      <label htmlFor='image' className='block mb-1 ml-0.5'>
                        Photo URL (optional)
                      </label>
                      <input
                        type='text'
                        name='image'
                        className={`w-full bg-[rgb(62,63,64)] rounded-lg p-2 text-sm sm:text-base ${
                          errorMessage ===
                            'URL is invalid, please try another' &&
                          'border border-red-500'
                        }`}
                        placeholder='Image URL'
                        value={postImageURL}
                        onChange={(e) => setPostImageURL(e.target.value)}
                      />
                    </div>
                    {renderErrorMessage()}
                    <button
                      type='submit'
                      className='w-full h-12 text-center bg-green-600 rounded-lg py-2 mt-4 disabled:bg-zinc-700'
                      disabled={!(postTitle && postContent)}
                    >
                      Add a new post
                    </button>
                  </form>
                </div>
              </Box>
            </Fade>
          </Modal>
          <Snackbar
            open={confirmationMessage}
            autoHideDuration={6000}
            onClose={() => setConfirmationMessage(false)}
          >
            <MuiAlert
              elevation={6}
              variant='filled'
              onClose={() => setConfirmationMessage(false)}
              severity='success'
            >
              Post was successfully added
            </MuiAlert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
}

export default AddNewPost;
