export default interface postTypes {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  reactions: reactionsTypes;
  user: {
    userId: string;
    username: string;
    profilePictureURL: string;
  };
  slice?: any;
}

export interface reactionsTypes {
  like: string[];
  love: string[];
  wow: string[];
  sad: string[];
  dislike: string[];
}
