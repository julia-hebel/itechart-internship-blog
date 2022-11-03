import AddNewPost from '../components/posts/AddNewPost';
import PostsList from '../components/posts/PostsList';

function Home() {
  return (
    <main className='max-w-[640px] m-auto'>
      <AddNewPost />
      <PostsList />
    </main>
  );
}

export default Home;
