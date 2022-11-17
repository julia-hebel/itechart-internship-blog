import postTypes from './postTypes';
import userTypes from './userTypes';

export default interface stateTypes {
  posts: {
    posts: postTypes;
    status: string;
    error: any;
  };
  user: {
    currentUser: userTypes;
    isLoggedIn: boolean;
    status: string;
    error: any;
  };
  language: {
    language: string;
    status: string;
  };
}
