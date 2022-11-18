import { useState, useEffect } from 'react';

import { useAppDispatch } from '../../app/hooks';
import { useSelector } from 'react-redux';
import { getCurrentUser, USERS_URL } from '../../redux/userSlice';
import { getAllPosts, updatePostAuthor } from '../../redux/postsSlice';

import { Link } from 'react-router-dom';

import { FormattedMessage, useIntl } from 'react-intl';

import axios from 'axios';

import postTypes from '../../types/postTypes';

import PostMenu from './PostMenu';
import PostReactions from './PostReactions';
import TimeAgo from './TimeAgo';

interface propsTypes {
  key: string;
  post: postTypes;
}

function Post({ post }: propsTypes) {
  const [showMore, setShowMore] = useState(false);

  const posts = useSelector(getAllPosts);
  const currentUser = useSelector(getCurrentUser);

  const dispatch = useAppDispatch();

  const intl = useIntl();

  useEffect(() => {
    const fetchAuthor = async () => {
      if (!post.user.username || !post.user.profilePictureURL) {
        const author = {
          userId: post.user.userId,
          username: '',
          profilePictureURL: '',
        };
        const prevPostByUser = posts.find(
          (postInArray: postTypes) =>
            postInArray.user.userId === post.user.userId &&
            postInArray.user.username &&
            postInArray.user.profilePictureURL
        );

        if (prevPostByUser) {
          author.username = prevPostByUser.user.username;
          author.profilePictureURL = prevPostByUser.user.profilePictureURL;
        } else {
          try {
            const response = await axios.get(
              `${USERS_URL}/${post.user.userId}`
            );
            author.username = response.data.username;
            author.profilePictureURL = response.data.profilePictureURL;
          } catch (error: any) {
            return error.message;
          }
        }
        dispatch(updatePostAuthor({ postId: post.id, author: author }));
      } else if (
        post.user.userId === currentUser.id &&
        (post.user.username !== currentUser.username ||
          post.user.profilePictureURL !== currentUser.profilePictureURL)
      ) {
        dispatch(
          updatePostAuthor({
            postId: post.id,
            author: {
              userId: currentUser.id,
              username: currentUser.username,
              profilePictureURL: currentUser.profilePictureURL,
            },
          })
        );
      }
    };
    fetchAuthor();
  }, [currentUser, post.user]);

  const renderPostContent = () => {
    if (post.content.length > 300) {
      if (!showMore) {
        return (
          <div className='text-sm sm:text-base'>
            <p className='text-justify' tabIndex={0}>
              {post.content.substring(0, 300)}...
            </p>
            <div className='text-center'>
              <button
                className='mt-1 font-bold text-blue-400 hover:underline'
                onClick={() => setShowMore(true)}
              >
                <FormattedMessage
                  id='Post.showMoreButton'
                  defaultMessage='Show more'
                />
              </button>
            </div>
          </div>
        );
      }
      return (
        <div className='text-sm sm:text-base'>
          <p className='text-justify' tabIndex={0}>
            {post.content}
          </p>
          <div className='text-center'>
            <button
              className='mt-1 font-bold text-blue-400 hover:underline'
              onClick={() => setShowMore(false)}
            >
              <FormattedMessage
                id='Post.showLessButton'
                defaultMessage='Show less'
              />
            </button>
          </div>
        </div>
      );
    }
    return (
      <p className='text-justify text-sm sm:text-base' tabIndex={0}>
        {post.content}
      </p>
    );
  };

  return (
    <article
      className='my-5 px-4 py-2 bg-[rgb(43,44,45)] rounded-lg'
      tabIndex={0}
      aria-label={
        intl.formatMessage({
          id: 'Post.aria.article',
          defaultMessage: 'Post by ',
        }) + post.user.username
      }
    >
      <div className='w-full mb-3 mt-1 flex items-center justify-start'>
        <Link to={`/profile/${post.user.username}`} className='w-10 h-10'>
          <img
            src={post.user.profilePictureURL}
            alt={
              post.user.username +
              intl.formatMessage({
                id: 'Post.profilePicAlt',
                defaultMessage: `'s profile picture`,
              })
            }
            className='object-cover rounded-full h-10 w-10'
          />
        </Link>
        <div className='flex-grow flex items-center justify-between'>
          <div className='ml-3 pb-[3px] flex flex-col justify-center'>
            <Link
              to={`/profile/${post.user.username}`}
              className='font-bold hover:underline'
            >
              {post.user.username}
            </Link>
            <span className='text-sm' tabIndex={0}>
              <TimeAgo date={post.date} />
            </span>
          </div>
          {post.user.userId === currentUser.id ? (
            <PostMenu post={post} />
          ) : null}
        </div>
      </div>
      <div className='mb-2'>
        <h2 className='text-xl sm:text-2xl font-bold mb-1.5' tabIndex={0}>
          {post.title}
        </h2>
        {renderPostContent()}
        {post.image && (
          <img
            src={post.image}
            alt={
              intl.formatMessage({
                id: 'Post.postImageAlt',
                defaultMessage: 'Image posted by',
              }) + post.user.username
            }
            className='object-cover mt-4 mx-auto max-h-[400px]'
            tabIndex={0}
          />
        )}
      </div>
      <PostReactions post={post} currentUser={currentUser} />
    </article>
  );
}

export default Post;
