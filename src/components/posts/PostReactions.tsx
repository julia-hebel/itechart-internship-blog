import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/hooks';
import { updatePost } from '../../redux/postsSlice';
import { getIsLoggedIn } from '../../redux/userSlice';
import postTypes, { reactionsTypes } from '../../types/postTypes';
import userTypes from '../../types/userTypes';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const reactionEmoji = {
  like: '👍',
  love: '❤️',
  wow: '😮',
  sad: '😢',
  dislike: '👎',
};

interface propsTypes {
  post: postTypes;
  currentUser: userTypes;
}

function PostReactions({ post, currentUser }: propsTypes) {
  const [notLoggedInMessage, setNotLoggedInMessage] = useState(false);

  const isLoggedIn = useSelector(getIsLoggedIn);

  const dispatch = useAppDispatch();

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
          You must be logged in to react
        </MuiAlert>
      </Snackbar>
    );
  };

  return (
    <div className='w-full flex items-center justify-around text-center py-2'>
      {Object.entries(reactionEmoji).map(([reactionName, emoji]) => {
        return (
          <button
            key={reactionName}
            className={`py-1.5 px-2 sm:px-3 text-sm sm:text-base hover:bg-zinc-600 rounded-md ${
              getCurrentReaction() === reactionName && 'bg-zinc-600'
            }`}
            onClick={() => giveReaction(reactionName)}
          >
            <div className='mx-1'>{emoji}</div>
            <div className='mx-1'>
              {post.reactions[reactionName as keyof reactionsTypes].length}
            </div>
          </button>
        );
      })}
      {renderNotLoggedInMessage()}
    </div>
  );
}

export default PostReactions;
