import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { getPosts } from '../../redux/postsSlice';
import Post from './Post';

function PostsList() {
  const dispatch = useDispatch<any>();
  const posts = useSelector((state: any) => state.posts.posts);
  const postsStatus = useSelector((state: any) => state.posts.status);

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
        .sort((a: any, b: any) => b.date.localeCompare(a.date));
      return orderedPosts.map((post: any) => {
        return <Post key={post.id} post={post} />;
      });
    }
  };

  return (
    <div className='pb-2 max-w-[640px] m-auto'>{renderPostListContent()}</div>
  );
}

export default PostsList;
