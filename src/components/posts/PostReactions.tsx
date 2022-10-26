import postTypes, { reactionsTypes } from '../../types/postTypes';
import userTypes from '../../types/userTypes';

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
  const giveReaction = () => {};

  const getCurrentReaction = () => {
    const arrayOfReactionArrays = Object.entries(post.reactions);
    for (const reactionArray of arrayOfReactionArrays) {
      if (reactionArray[1].includes(currentUser.username)) {
        return reactionArray[0];
      }
    }
    return null;
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
            onClick={() => giveReaction()}
          >
            <div className='mx-1'>{emoji}</div>
            <div className='mx-1'>
              {post.reactions[reactionName as keyof reactionsTypes].length}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default PostReactions;
