import { Link } from 'react-router-dom';

import { FormattedMessage } from 'react-intl';

function PageNotFound() {
  return (
    <main className='w-full h-screen flex flex-col justify-center items-center'>
      <div className='flex flex-col justify-center items-center' tabIndex={0}>
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
      </div>
      <Link
        to='/'
        role='link'
        className='my-4 border border-zinc-500 rounded-lg bg-[rgb(117,11,150)] p-2'
      >
        <FormattedMessage
          id='PageNotFound.takeMeHome'
          defaultMessage='Take me home'
        />
      </Link>
    </main>
  );
}

export default PageNotFound;
