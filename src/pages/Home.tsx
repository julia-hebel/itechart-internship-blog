import { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '../app/hooks';
import { getAllPosts, getPosts, getPostsStatus } from '../redux/postsSlice';
import { getIsLoggedIn } from '../redux/userSlice';

import { useIntl } from 'react-intl';

import { Helmet } from 'react-helmet-async';

import postTypes from '../types/postTypes';

import AddNewPost from '../components/posts/AddNewPost';
import PostsList from '../components/posts/PostsList';

function Home() {
  const dispatch = useAppDispatch();
  const posts = useSelector(getAllPosts);
  const postsStatus = useSelector(getPostsStatus);
  const isLoggedIn = useSelector(getIsLoggedIn);

  const intl = useIntl();

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(getPosts());
    }
  }, []);

  const orderedPosts = posts
    .slice()
    .sort((a: postTypes, b: postTypes) => b.date.localeCompare(a.date));

  return (
    <>
      <Helmet>
        <title>PostBook</title>
      </Helmet>
      <main
        className='max-w-[640px] m-auto p-5'
        tabIndex={-1}
        aria-label={
          intl.formatMessage({
            id: 'Home.aria.main',
            defaultMessage: 'Home page',
          }) + (isLoggedIn ? 'zalogowano' : ' ')
        }
        aria-live='polite'
        aria-atomic={true}
      >
        <AddNewPost />
        <PostsList postsToShow={orderedPosts} />
      </main>
    </>
  );
}

export default Home;
