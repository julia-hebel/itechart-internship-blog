import { Link } from 'react-router-dom';
import { BiBook } from 'react-icons/bi';
import { HiMenu } from 'react-icons/hi';

function Header() {
  return (
    <header className='flex items-center justify-between px-3 h-12 bg-[rgb(117,11,150)]'>
      <button className='h-9'>
        <HiMenu className='h-full w-full' />
      </button>
      <Link to='/' className='flex items-center text-2xl h-8'>
        <BiBook className='mr-1 h-full w-full' />
        <h1 className='mb-1'>PostBook</h1>
      </Link>
      <Link to='/login' className='mr-2'>
        Login
      </Link>
    </header>
  );
}

export default Header;
