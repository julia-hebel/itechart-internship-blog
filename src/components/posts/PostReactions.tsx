const reactionEmoji = {
  like: '👍',
  love: '❤️',
  wow: '😮',
  sad: '😢',
  dislike: '👎',
};

function PostReactions({ post }: any) {
  return (
    <div className='w-full text-center py-2'>
      {Object.entries(reactionEmoji).map(([name, emoji]) => {
        return (
          <button
            key={name}
            className='mx-1 sm:mx-5 text-sm sm:text-base hover:bg-zinc-600 rounded-md p-1'
          >
            <span className='mr-1'>{emoji}</span>
            <span className='mr-1'>{post.reactions[name]}</span>
          </button>
        );
      })}
    </div>
  );
}

export default PostReactions;
