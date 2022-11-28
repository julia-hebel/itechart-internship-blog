import postTypes from './postTypes';
import userTypes from './userTypes';

export default interface stateTypes {
  posts: {
    posts: postTypes;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: any;
  };
  user: {
    currentUser: userTypes;
    isLoggedIn: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: any;
  };
  language: {
    currentLanguage: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
  };
}
