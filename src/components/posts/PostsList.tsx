import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/hooks';
import { CircularProgress } from '@mui/material';
import { getAllPosts, getPosts, getPostsStatus } from '../../redux/postsSlice';
import Post from './Post';
import postTypes from '../../types/postTypes';

function PostsList() {
  const dispatch = useAppDispatch();
  const posts = useSelector(getAllPosts);
  const postsStatus = useSelector(getPostsStatus);

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(getPosts());
    }
  }, [dispatch, postsStatus]);

  const renderPostListContent = () => {
    if (postsStatus === 'loading') {
      return (
        <div className='fixed top-0 left-0 h-full w-full flex flex-col justify-center items-center'>
          <CircularProgress size='4rem' />
        </div>
      );
    } else if (postsStatus === 'succeeded') {
      const orderedPosts = posts
        .slice()
        .sort((a: postTypes, b: postTypes) => b.date.localeCompare(a.date));
      return orderedPosts.map((post: postTypes) => {
        return <Post key={post.id} post={post} />;
      });
    }
  };

  return (
    <section className='pb-2 max-w-[640px] m-auto'>
      {renderPostListContent()}
    </section>
  );
}

export default PostsList;
