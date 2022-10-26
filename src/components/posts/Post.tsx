import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../../redux/userSlice';
import postTypes from '../../types/postTypes';
import PostReactions from './PostReactions';
import TimeAgo from './TimeAgo';

interface propsTypes {
  key: string;
  post: postTypes;
}

function Post({ post }: propsTypes) {
  const [showMore, setShowMore] = useState(false);
  const currentUser = useSelector(getCurrentUser);

  const renderPostContent = () => {
    if (post.content.length > 300) {
      if (!showMore) {
        return (
          <div className='text-sm sm:text-base'>
            <p className='text-justify'>{post.content.substring(0, 300)}...</p>
            <div className='text-center'>
              <button
                className='mt-1 font-bold text-blue-400 hover:underline'
                onClick={() => setShowMore(true)}
              >
                Show more
              </button>
            </div>
          </div>
        );
      }
      return (
        <div className='text-sm sm:text-base'>
          <p className='text-justify'>{post.content}</p>
          <div className='text-center'>
            <button
              className='mt-1 font-bold text-blue-400 hover:underline'
              onClick={() => setShowMore(false)}
            >
              Show less
            </button>
          </div>
        </div>
      );
    }
    return <p className='text-justify text-sm sm:text-base'>{post.content}</p>;
  };

  return (
    <article className='mx-5 my-6 px-4 py-2 bg-[rgb(43,44,45)] rounded-lg'>
      <div className='w-full mb-3 mt-1 flex items-center justify-start'>
        <img
          src={post.user.profilePictureURL}
          alt='profile pic'
          className='object-cover rounded-full h-10 w-10'
        />
        <div className='ml-3 pb-[3px] flex flex-col justify-center'>
          <span className='font-bold'>{post.user.username}</span>
          <span className='text-sm'>
            <TimeAgo date={post.date} />
          </span>
        </div>
      </div>
      <div className='mb-2'>
        <h2 className='text-xl sm:text-2xl font-bold mb-1.5'>{post.title}</h2>
        {renderPostContent()}
        {post.image && (
          <img
            src={post.image}
            alt={post.title}
            className='object-cover mt-4 mx-auto max-h-[400px]'
          />
        )}
      </div>
      <PostReactions post={post} currentUser={currentUser} />
    </article>
  );
}

export default Post;
