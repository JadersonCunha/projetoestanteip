import '../styles/globals.css';
import 'simplebar-react/dist/simplebar.min.css';
import SimpleBar from 'simplebar-react';

export default function App({ Component, pageProps }) {
  return (
    <SimpleBar style={{ maxHeight: '100vh' }} autoHide={false}>
      <Component {...pageProps} />
    </SimpleBar>
  );
}
