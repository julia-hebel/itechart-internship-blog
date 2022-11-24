import { useState } from 'react';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/hooks';
import { updatePost } from '../../redux/postsSlice';
import { getIsLoggedIn } from '../../redux/userSlice';

import { FormattedMessage, useIntl } from 'react-intl';

import postTypes, { reactionsTypes } from '../../types/postTypes';
import userTypes from '../../types/userTypes';

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Tooltip from '@mui/material/Tooltip';

import { AiFillLike, AiFillHeart, AiFillDislike } from 'react-icons/ai';
import { ImShocked2 } from 'react-icons/im';
import { FaSadTear } from 'react-icons/fa';

const reactionEmoji = {
  like: <AiFillLike className='h-5 sm:h-6 w-6 text-blue-500' />,
  love: <AiFillHeart className='h-5 sm:h-6 w-6 text-red-500' />,
  wow: <ImShocked2 className='h-5 sm:h-6 w-6 py-[1px] text-yellow-400' />,
  sad: <FaSadTear className='h-5 sm:h-6 w-6 pb-[1px] text-yellow-400' />,
  dislike: <AiFillDislike className='h-5 sm:h-6 w-6 text-red-400' />,
};

interface propsTypes {
  post: postTypes;
  currentUser: userTypes;
}

function PostReactions({ post, currentUser }: propsTypes) {
  const [notLoggedInMessage, setNotLoggedInMessage] = useState(false);

  const isLoggedIn = useSelector(getIsLoggedIn);

  const dispatch = useAppDispatch();

  const intl = useIntl();

  const getCurrentReaction = () => {
    const arrayOfReactionArrays = Object.entries(post.reactions);
    for (const reactionArray of arrayOfReactionArrays) {
      if (reactionArray[1].includes(currentUser.username)) {
        return reactionArray[0];
      }
    }
    return null;
  };

  const giveReaction = (reactionName: string) => {
    if (!isLoggedIn) {
      setNotLoggedInMessage(true);
      return;
    }

    const currentReaction = getCurrentReaction();
    let updatedReactions = { ...post.reactions };
    let updatedPost = { ...post };

    if (currentReaction) {
      const updatedUsersArray = post.reactions[
        currentReaction as keyof reactionsTypes
      ].filter((user) => user !== currentUser.username);
      updatedReactions = {
        ...updatedReactions,
        [currentReaction]: updatedUsersArray,
      };
      updatedPost = { ...post, reactions: updatedReactions };
    }

    if (currentReaction !== reactionName) {
      const updatedUsersArray = [
        ...post.reactions[reactionName as keyof reactionsTypes],
        currentUser.username,
      ];
      updatedReactions = {
        ...updatedReactions,
        [reactionName]: updatedUsersArray,
      };
      updatedPost = { ...post, reactions: updatedReactions };
    }

    dispatch(updatePost(updatedPost));
  };

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
            id='PostReactions.notLoggedInMessage'
            defaultMessage='You must be logged in to react'
          />
        </MuiAlert>
      </Snackbar>
    );
  };

  return (
    <ul
      className='w-full flex items-center justify-around text-center py-2'
      aria-label={intl.formatMessage({
        id: 'PostReactions.aria.reactionList',
        defaultMessage: 'List of reactions. ',
      })}
      tabIndex={0}
    >
      {Object.entries(reactionEmoji).map(([reactionName, emoji]) => {
        return (
          <li key={reactionName}>
            <Tooltip
              title={intl.formatMessage({
                id: `PostReactions.${reactionName}`,
                defaultMessage:
                  reactionName.charAt(0).toUpperCase() + reactionName.slice(1),
              })}
              placement='top'
              arrow
            >
              <button
                className={`py-1.5 px-2 sm:px-3 text-sm sm:text-base hover:bg-zinc-600 rounded-md ${
                  getCurrentReaction() === reactionName && 'bg-zinc-600'
                }`}
                onClick={() => giveReaction(reactionName)}
                aria-label={
                  intl.formatMessage({
                    id: `PostReactions.${reactionName}`,
                    defaultMessage:
                      reactionName.charAt(0).toUpperCase() +
                      reactionName.slice(1),
                  }) +
                  intl.formatMessage({
                    id: 'PostReactions.aria.numberOfReactions',
                    defaultMessage: '. Number of reactions: ',
                  }) +
                  post.reactions[
                    reactionName as keyof reactionsTypes
                  ].length.toString() +
                  (getCurrentReaction() === reactionName
                    ? intl.formatMessage({
                        id: 'PostReactions.aria.reactionGiven',
                        defaultMessage: 'Your reaction given',
                      })
                    : '')
                }
                aria-live='polite'
                aria-atomic={true}
              >
                <div className='mx-1 mb-1'>{emoji}</div>
                <span className='mx-1'>
                  {post.reactions[reactionName as keyof reactionsTypes].length}
                </span>
              </button>
            </Tooltip>
          </li>
        );
      })}
      {renderNotLoggedInMessage()}
    </ul>
  );
}

export default PostReactions;
