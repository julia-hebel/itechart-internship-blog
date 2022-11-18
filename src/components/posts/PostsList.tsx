import { useSelector } from 'react-redux';
import { getPostsStatus } from '../../redux/postsSlice';

import postTypes from '../../types/postTypes';

import { FormattedMessage } from 'react-intl';

import Post from './Post';

import { CircularProgress } from '@mui/material';

interface propsTypes {
  postsToShow: postTypes[];
}

function PostsList({ postsToShow }: propsTypes) {
  const postsStatus = useSelector(getPostsStatus);

  const renderPostListContent = () => {
    if (postsStatus === 'loading') {
      return (
        <div className='fixed top-0 left-0 h-full w-full flex flex-col justify-center items-center'>
          <CircularProgress size='4rem' />
        </div>
      );
    } else if (postsStatus === 'succeeded') {
      if (postsToShow.length > 0) {
        return postsToShow.map((post: postTypes) => {
          return <Post key={post.id} post={post} />;
        });
      } else {
        return (
          <div className='w-full text-center text-lg font-bold mt-8'>
            <FormattedMessage
              id='PostsList.noPosts'
              defaultMessage='No posts to show'
            />
          </div>
        );
      }
    }
  };

  return <section className='pb-2'>{renderPostListContent()}</section>;
}

export default PostsList;
