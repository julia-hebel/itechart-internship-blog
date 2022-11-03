import { useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { getPostsStatus } from '../../redux/postsSlice';
import Post from './Post';
import postTypes from '../../types/postTypes';

function PostsList({ postsToShow }: any) {
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
            No posts to show
          </div>
        );
      }
    }
  };

  return <section className='pb-2'>{renderPostListContent()}</section>;
}

export default PostsList;
