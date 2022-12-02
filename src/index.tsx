import ReactDOM from 'react-dom/client';
import './index.css';
import store from './app/store';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </Provider>
);

// service worker
// registerServiceWorker();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
