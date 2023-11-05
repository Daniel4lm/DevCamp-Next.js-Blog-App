import Link from "next/link";
import { AppIcon } from "../Icons";
import { ThemeToggle } from "../ThemeToggle";
import { SettingsMenu } from "./SettingsMenu";
import { ToolTip } from "../Tooltip";
import WorkMenu from "./WorkMenu";
import { User } from "next-auth";

interface NavBarProps {
  title?: string;
  currentUser?: User | undefined;
}

export default function Navbar({ title, currentUser }: NavBarProps) {
  const userFontName =
    currentUser?.fontName && currentUser?.fontName !== undefined
      ? `${currentUser?.fontName}`
      : "font-default";

  return (
    <header
      id="app-navbar"
      className={`h-16 ${userFontName} border-b dark:border-transparent flex fixed top-0 w-full bg-white dark:bg-navbar-dark dark:text-slate-100 z-50`}
    >
      <div className="flex justify-between items-center px-2 py-0 mx-auto w-full md:w-11/12">
        {" "}
        <div className="flex justify-center items-center gap-2 xs:gap-0">
          <Link
            aria-label="Logo"
            data-test="logo"
            href="/"
            className="flex items-center gap-2 mx-4"
          >
            <AppIcon />
            <h4 className="text-lg md:text-xl font-normal">{title}</h4>
          </Link>
        </div>
        <nav className="lg:w-3/5">
          <ul className="flex items-center justify-end pl-2 text-xs md:text-base">
            {currentUser ? (
              <>
                <WorkMenu />
                <SettingsMenu currentUser={currentUser} />
              </>
            ) : (
              <>
                <li className="hidden xs:block">
                  <Link
                    data-test="login-link"
                    href="/api/auth/signin"
                    className="ml-2 py-[0.4rem] px-4 text-gray-700 hover:text-indigo-500 decoration-2 rounded-full hover:border-indigo-400 font-medium duration-150 ease-in-out bg-transparent hover:underline dark:border-transparent dark:text-slate-100"
                  >
                    Login
                  </Link>
                </li>
                <li className="hidden xs:block">
                  <Link
                    data-test="register-link"
                    href="/auth/register"
                    className="ml-2 py-[0.4rem] px-4 text-gray-700 rounded-full font-medium duration-150 ease-in-out bg-transparent border border-slate-300 dark:border-transparent hover:border-indigo-400 hover:text-indigo-600 dark:hover:bg-slate-500 dark:text-slate-100"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
            <ToolTip position="bottom" title="Day/Night Theme">
              <li
                id="theme-switch"
                className="relative mx-2 xs:mx-4 text-gray-600 dark:text-gray-200 hover:text-[#755FFF]"
              >
                <ThemeToggle />
              </li>
            </ToolTip>
          </ul>
        </nav>
      </div>
    </header>
  );
}
