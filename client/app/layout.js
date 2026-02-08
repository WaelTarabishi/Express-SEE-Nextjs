export const metadata = {
  title: 'Next SSE Listener',
  description: 'Simple Next.js app listening to Express SSE events'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'Arial, sans-serif', backgroundColor: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}
