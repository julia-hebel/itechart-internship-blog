import AddNewPost from '../components/posts/AddNewPost';
import PostsList from '../components/posts/PostsList';

function Home() {
  return (
    <main>
      <AddNewPost />
      <PostsList />
    </main>
  );
}

export default Home;
