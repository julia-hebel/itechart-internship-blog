import { useState } from 'react';

import { useSelector } from 'react-redux';
import { getCurrentUser, getIsLoggedIn } from '../../redux/userSlice';

import { Link } from 'react-router-dom';

import { FormattedMessage, useIntl } from 'react-intl';

import CreatePostModal from './CreatePostModal';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function AddNewPost() {
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState(false);
  const [notLoggedInMessage, setNotLoggedInMessage] = useState(false);

  const isLoggedIn = useSelector(getIsLoggedIn);
  const currentUser = useSelector(getCurrentUser);

  const intl = useIntl();

  const renderNotLoggedInMessage = () => {
    return (
      <Snackbar
        open={notLoggedInMessage}
        autoHideDuration={6000}
        onClose={() => setNotLoggedInMessage(false)}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={() => setNotLoggedInMessage(false)}
          severity='error'
        >
          <FormattedMessage
            id='AddNewPost.notLoggedInMessage'
            defaultMessage='You must be logged in to post'
          />
        </MuiAlert>
      </Snackbar>
    );
  };

  const renderConfirmationMessage = () => {
    return (
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
          <FormattedMessage
            id='AddNewPost.postAddedMessage'
            defaultMessage='Post was successfully added'
          />
        </MuiAlert>
      </Snackbar>
    );
  };

  return (
    <section
      className='w-full'
      tabIndex={0}
      aria-label={intl.formatMessage({
        id: 'AddNewPost.aria.section',
        defaultMessage: 'Adding a new post',
      })}
    >
      <div className='px-4 py-2 bg-foreground-dark rounded-lg'>
        <div className='w-full h-10 my-1 flex items-center justify-start'>
          {isLoggedIn ? (
            <Link to={`/profile/${currentUser.username}`}>
              <img
                src={currentUser.profilePictureURL}
                alt={
                  intl.formatMessage({
                    id: 'AddNewPost.profilePicAlt',
                    defaultMessage: 'Your profile picture',
                  }) +
                  intl.formatMessage({
                    id: 'UserMenu.aria.profileLink',
                    defaultMessage: 'Navigate to your profile page - link',
                  })
                }
                role='link'
                className='object-cover rounded-full h-10 w-10 mr-3'
                width='40'
                height='40'
              />
            </Link>
          ) : (
            <img
              src={
                'https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg'
              }
              alt={intl.formatMessage({
                id: 'AddNewPost.defaultProfilePicAlt',
                defaultMessage: 'Default profile picture',
              })}
              className='object-cover rounded-full h-10 w-10 mr-3 '
            />
          )}

          <button
            className='grow pl-4 pb-[1px] h-full bg-interactive-dark hover:bg-element-dark-hover text-[rgb(185,185,191)] text-left text-sm sm:text-base rounded-full'
            onClick={() =>
              isLoggedIn
                ? setModalOpen(!modalOpen)
                : setNotLoggedInMessage(true)
            }
            aria-haspopup='true'
            aria-label={intl.formatMessage({
              id: 'AddNewPost.aria.button',
              defaultMessage: 'Click to create a new post',
            })}
          >
            <FormattedMessage
              id='AddNewPost.postPlaceholder'
              defaultMessage="What's on your mind?"
            />
          </button>
          <CreatePostModal
            currentUser={currentUser}
            modalOpen={modalOpen}
            setModalOpen={setModalOpen}
            setConfirmationMessage={setConfirmationMessage}
          />
          {renderNotLoggedInMessage()}
          {renderConfirmationMessage()}
        </div>
      </div>
    </section>
  );
}

export default AddNewPost;
