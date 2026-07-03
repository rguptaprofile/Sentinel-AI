// Suppress TS error for side-effect CSS import when no type declarations are present
// @ts-ignore
import "../styles/globals.css";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      html: any;
      body: any;
    }
  }
}

export const metadata = {
  title: "SentinelAI",
  description: "Digital public safety intelligence platform scaffold",
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
