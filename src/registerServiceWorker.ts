export default function registerServiceWorker() {
  let swURL = `${process.env.PUBLIC_URL}/serviceWorker.js`;
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register(swURL).then((res) => {
      console.warn('response', res);
    });
  }
}
