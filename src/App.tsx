import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from './app/hooks';
import { getUserStatus, loadUserFromCookie } from './redux/userSlice';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/users/Login';
import Register from './pages/users/Register';
import Home from './pages/Home';
import Layout from './pages/Layout';
import PageNotFound from './pages/PageNotFound';
import { CircularProgress } from '@mui/material';

function App() {
  const dispatch = useAppDispatch();

  const userStatus = useSelector(getUserStatus);

  useEffect(() => {
    if (userStatus === 'idle') {
      dispatch(loadUserFromCookie());
    }
  }, [dispatch, userStatus]);

  return (
    <div
      className='bg-[rgb(24,25,26)] min-h-screen text-white'
      style={{ fontFamily: "'Lato', sans-serif" }}
    >
      {userStatus === 'succeeded' ? (
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route index element={<Home />} />
              <Route path='login' element={<Login />} />
              <Route path='register' element={<Register />} />
            </Route>
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      ) : (
        <div className='fixed top-0 left-0 h-full w-full flex flex-col justify-center items-center'>
          <CircularProgress size='4rem' />
        </div>
      )}
    </div>
  );
}

export default App;
