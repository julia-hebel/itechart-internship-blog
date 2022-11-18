import { Link } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';

function PageNotFound() {
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center'>
      <h1 className='text-8xl my-4'>404</h1>
      <div className='text-3xl my-4'>
        <FormattedMessage
          id='PageNotFound.pageNotFound'
          defaultMessage='Page Not Found'
        />
      </div>
      <div className='my-4'>
        <FormattedMessage
          id='PageNotFound.resourceMessage'
          defaultMessage='The resource could not be found on this server'
        />
      </div>
      <Link
        to='/'
        className='my-4 border border-zinc-500 rounded-lg bg-[rgb(117,11,150)] p-2'
      >
        <FormattedMessage
          id='PageNotFound.takeMeHome'
          defaultMessage='Take me home'
        />
      </Link>
    </div>
  );
}

export default PageNotFound;
