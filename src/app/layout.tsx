import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Forest Lakes Parks',
  description: 'Keep track of the Bears',
  viewport: 'width=device-width, initial-scale=1, user-scalable=no',
  icons: '/favicon.ico',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="dark">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}

      <head>
        <meta
          property="og:image:url"
          content="https://www.greenalgaebusiness.website/"
        />
      </head>
      <body>
        <main className="bg-park_bg_image w-full h-full bg-no-repeat bg-cover bg-center bg-fixed">
          {children}
        </main>
      </body>
    </html>
  );
}
