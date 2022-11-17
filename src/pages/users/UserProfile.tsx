import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/hooks';
import { getAllPosts, getPosts, getPostsStatus } from '../../redux/postsSlice';
import { getCurrentUser, USERS_URL } from '../../redux/userSlice';

import axios from 'axios';

import { useParams } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';

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

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(getPosts());
    }

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
        <span className='text-xl font-bold mb-12'>
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
    <main className='max-w-[640px] m-auto p-5'>
      <div className='w-full flex flex-col items-center pt-5 pb-1 bg-[rgb(43,44,45)] rounded-lg'>
        <img
          src={user.profilePictureURL}
          alt='profile pic'
          className='object-cover rounded-full h-40 w-40'
        />
        <h2 className='text-2xl font-bold mt-4 mb-2'>{user.username}</h2>
        {user.username === currentUser.username ? <AddNewPost /> : null}
      </div>
      <PostsList postsToShow={userPosts} />
    </main>
  );
}

export default UserProfile;
