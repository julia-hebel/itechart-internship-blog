import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/hooks';
import { getAllPosts, getPosts, getPostsStatus } from '../../redux/postsSlice';
import { USERS_URL } from '../../redux/userSlice';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress } from '@mui/material';

interface userTypes {
  id?: string;
  username?: string;
  password?: string;
  profilePictureURL?: string;
}

function UserProfile() {
  const dispatch = useAppDispatch();
  const posts = useSelector(getAllPosts);
  const postsStatus = useSelector(getPostsStatus);

  const { username } = useParams();

  const [user, setUser] = useState({} as userTypes);
  const [fetchingUser, setFetchingUser] = useState(true);

  useEffect(() => {
    if (postsStatus === 'idle') {
      dispatch(getPosts());
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get(`${USERS_URL}?username=${username}`);
        setUser(
          (({ username, profilePictureURL }) => ({
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
  }, []);

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
          This user does not exist
        </span>
      </main>
    );
  }

  return (
    <main className='max-w-[640px] m-auto'>
      <div className='mt-6 w-full'>
        <img
          src={user.profilePictureURL}
          alt='profile pic'
          className='object-cover rounded-full h-10 w-10'
        />
      </div>
    </main>
  );
}

export default UserProfile;
