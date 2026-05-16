import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sensora - AI Career Companion",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider appearance={{
      baseTheme: "dark",
    }}>
      <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`${inter.className} `}

      >
        <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen flex justify-center items-center">{children}</main>
            <footer className="bg-muted/50 py-12">
              <div className="container mx-auto text-center px-4 text-gray-200">
                <p>Simplifying  the complexity. One feature at a time.</p>
              </div>
            </footer>
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  );
}
