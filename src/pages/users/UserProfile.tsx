import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/hooks';
import { getAllPosts, getPosts, getPostsStatus } from '../../redux/postsSlice';
import { getCurrentUser, USERS_URL } from '../../redux/userSlice';

import axios from 'axios';

import { useParams } from 'react-router-dom';

import { FormattedMessage, useIntl } from 'react-intl';

import { Helmet } from 'react-helmet-async';

import postTypes from '../../types/postTypes';

import AddNewPost from '../../components/posts/AddNewPost';
import PostsList from '../../components/posts/PostsList';

import { CircularProgress } from '@mui/material';

interface userInterface {
  id?: string;
  username?: string;
  profilePictureURL?: string;
}

function UserProfile() {
  const dispatch = useAppDispatch();
  const posts = useSelector(getAllPosts);
  const postsStatus = useSelector(getPostsStatus);
  const currentUser = useSelector(getCurrentUser);

  const { username } = useParams();

  const [user, setUser] = useState({} as userInterface);
  const [fetchingUser, setFetchingUser] = useState(true);

  const intl = useIntl();

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(getPosts());
    }

    document.getElementById('user-banner')?.focus();

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${USERS_URL}?username=${username}`);
        setUser(
          (({ id, username, profilePictureURL }) => ({
            id,
            username,
            profilePictureURL,
          }))(response.data[0])
        );
        return response.data[0];
      } catch (error: any) {
        return error.message;
      } finally {
        setFetchingUser(false);
      }
    };
    fetchUser();
  }, [username]);

  if (fetchingUser || postsStatus === 'loading') {
    return (
      <main className='fixed top-0 left-0 h-full w-full flex flex-col justify-center items-center'>
        <CircularProgress size='4rem' />
      </main>
    );
  } else if (Object.keys(user).length === 0) {
    return (
      <main className='h-screen w-full flex flex-col justify-center items-center'>
        <span className='text-xl font-bold mb-12' tabIndex={0}>
          <FormattedMessage
            id='UserProfile.userDoesNotExist'
            defaultMessage='This user does not exist'
          />
        </span>
      </main>
    );
  }

  const userPosts = posts
    .slice()
    .filter((post: postTypes) => post.user.userId === user.id)
    .sort((a: postTypes, b: postTypes) => b.date.localeCompare(a.date));

  return (
    <>
      <Helmet>
        <title>{user.username} | PostBook</title>
        <link rel='canonical' href={`http://localhost:3000/profile/${username}`} />
      </Helmet>
      <main className='max-w-[640px] m-auto p-5'>
        <div
          id='user-banner'
          className='w-full flex flex-col items-center pt-5 pb-1 bg-foreground-dark rounded-lg'
          tabIndex={0}
          aria-label={
            intl.formatMessage({
              id: 'UserProfile.aria.userProfilePage',
              defaultMessage: 'Profile page of user - ',
            }) +
            user.username +
            (user.id === currentUser.id
              ? intl.formatMessage({
                  id: 'UserProfile.aria.yourProfilePage',
                  defaultMessage: 'Your profile page',
                })
              : '')
          }
          aria-live='polite'
          aria-atomic={true}
        >
          <img
            src={user.profilePictureURL}
            alt='profile pic'
            className='object-cover rounded-full h-40 w-40'
            width='160'
            height='160'
          />
          <h2 className='text-2xl font-bold mt-4 mb-2'>{user.username}</h2>
          {user.username === currentUser.username ? <AddNewPost /> : null}
        </div>
        <PostsList postsToShow={userPosts} />
      </main>
    </>
  );
}

export default UserProfile;
