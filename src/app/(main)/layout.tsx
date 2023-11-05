import { Inter, Nunito } from "next/font/google";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/navigation/NavBar";
import ReactQueryProvider from "@/lib/reactQuery/reactQueryProvider";
import { AuthProvider } from "@/context/AuthProvider";
import { authOptions } from "@/api/auth/[...nextauth]/authOptions";
import "@/app/styles/globals.css";

const interFont = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const nunitoFont = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Instacamp Next App",
  description: "Instacamp Web Blog-Tech app",
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const userFontName =
    session?.user?.fontName && session.user?.fontName !== undefined
      ? `${session.user.fontName}`
      : "font-default";

  const initialThemeScript = `
        const isDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        function detectThemeOnLoad() {
          if ((!('theme' in localStorage) && isDarkMode()) || JSON.parse(localStorage.getItem('theme')) === "dark") {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }

        detectThemeOnLoad()
    `;

  const clearTheme = `
        function detectThemeOnLoad() {
          if (document.documentElement.classList.contains('light')) {
            document.documentElement.classList.remove('light')
          } else if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark')
          }
        }

        detectThemeOnLoad()
    `;

  function maybeChangeThemeMode() {
    if (session && session.user) {
      return session.user.themeMode.toLowerCase();
    } else {
      return "light";
    }
  }

  function collectFonts() {
    return [interFont, nunitoFont].map((font) => ` ${font.variable} `);
  }

  return (
    <html lang="en">
      <body className={`${collectFonts()} ${maybeChangeThemeMode()}`}>
        <script
          dangerouslySetInnerHTML={{
            __html: session ? clearTheme : initialThemeScript,
          }}
        ></script>

        <AuthProvider>
          <ThemeProvider>
            <ReactQueryProvider>
              <Navbar title="Campy" currentUser={session?.user} />
              <main
                role="main"
                className={`relative w-full min-h-screen antialiased ${userFontName} dark:bg-main-dark dark:text-slate-100 flex flex-col`}
              >
                {children}
              </main>
            </ReactQueryProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
