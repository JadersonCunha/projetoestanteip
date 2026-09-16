import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <style dangerouslySetInnerHTML={{ __html: `
          .simplebar-content-wrapper::-webkit-scrollbar { display: none !important; width: 0 !important; }
          .simplebar-content-wrapper { scrollbar-width: none !important; -ms-overflow-style: none !important; }
          [data-simplebar]::-webkit-scrollbar { display: none !important; width: 0 !important; }
          [data-simplebar] { scrollbar-width: none !important; -ms-overflow-style: none !important; }
          body::-webkit-scrollbar { display: none !important; width: 0 !important; }
          body { scrollbar-width: none !important; -ms-overflow-style: none !important; }
        `}} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
