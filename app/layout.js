import { AuthProvider } from "./Providers";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin: "0px"}}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
