import { useState } from 'react';
import { Link } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const preventSpace = (e: any) => {
    if (e.key === ' ') {
      e.preventDefault();
      setErrorMessage('Username cannot contain space');
    }
  };

  const renderErrorMessage = () => {
    return (
      <Snackbar
        open={errorMessage !== '' ? true : false}
        autoHideDuration={5000}
        onClose={() => setErrorMessage('')}
      >
        <MuiAlert
          elevation={6}
          variant='filled'
          onClose={() => setErrorMessage('')}
          severity='error'
        >
          {errorMessage}
        </MuiAlert>
      </Snackbar>
    );
  };
  return (
    <div className='pb-2 max-w-[500px] m-auto'>
      <div className='m-3 sm:m-6 px-4 py-2 bg-[rgb(43,44,45)] rounded-lg'>
        <div className='text-center my-2'>
          <h2 className='ml-0.5 text-xl sm:text-2xl font-bold'>
            Welcome back!
          </h2>
        </div>
        <form>
          <div className='my-3'>
            <label htmlFor='username' className='block mb-1 ml-0.5'>
              Username
            </label>
            <input
              type='text'
              name='username'
              placeholder='Username'
              className='w-full bg-[rgb(62,63,64)] rounded-lg p-2 sm:text-lg'
              onKeyDown={(e) => preventSpace(e)}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className='my-3'>
            <label htmlFor='password' className='block mb-1 ml-0.5'>
              Password
            </label>
            <input
              type='password'
              name='password'
              placeholder='Password'
              className='w-full bg-[rgb(62,63,64)] rounded-lg p-2 sm:text-lg'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type='submit'
            className='w-full h-10 sm:h-11 text-center bg-green-600 rounded-lg py-2 mt-4 disabled:bg-zinc-700 sm:text-lg'
          >
            Log in
          </button>
        </form>
      </div>
      <hr className='border-zinc-500 mt-10 mb-8' />
      <div className='px-4 w-full text-center'>
        <div className='text-lg sm:text-xl'>Don't have an account?</div>
        <Link to='/register'>
          <div className='h-10 sm:h-11 p-2 mt-3 mx-3 sm:mx-6 bg-blue-700 rounded-lg sm:text-lg'>
            Register
          </div>
        </Link>
      </div>
      {renderErrorMessage()}
    </div>
  );
}

export default Login;
