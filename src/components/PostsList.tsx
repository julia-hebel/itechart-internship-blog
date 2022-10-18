import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPosts } from '../redux/postsSlice';
import Post from './Post';

function PostsList() {
  const dispatch = useDispatch<any>();
  const posts = useSelector((state: any) => state.posts.posts);

  useEffect(() => {
    dispatch(getPosts());
  }, [dispatch]);

  console.log('posts', posts);
  const date = new Date().toISOString();
  console.log(date);

  return <div>{posts.map((post: any) => {
    return (
        <Post key={post.id} post={post} />
    )
  })}</div>;
}

export default PostsList;