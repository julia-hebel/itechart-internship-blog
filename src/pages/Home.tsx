import { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '../app/hooks';
import { getAllPosts, getPosts, getPostsStatus } from '../redux/postsSlice';

import postTypes from '../types/postTypes';

import AddNewPost from '../components/posts/AddNewPost';
import PostsList from '../components/posts/PostsList';

function Home() {
  const dispatch = useAppDispatch();
  const posts = useSelector(getAllPosts);
  const postsStatus = useSelector(getPostsStatus);

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(getPosts());
    }
  }, []);

  const orderedPosts = posts
    .slice()
    .sort((a: postTypes, b: postTypes) => b.date.localeCompare(a.date));

  return (
    <main className='max-w-[640px] m-auto p-5'>
      <AddNewPost />
      <PostsList postsToShow={orderedPosts} />
    </main>
  );
}

export default Home;
