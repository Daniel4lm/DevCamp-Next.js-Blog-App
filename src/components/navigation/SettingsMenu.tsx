"use client";

import { MouseEvent, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "next-auth";
import useOutsideClick from "@/hooks/useOutsideClick";
import {
  CloseSideMenuIcon,
  LogoutIcon,
  SettingsIcon2,
  SmallUserIcon,
  TagListIcon,
} from "../Icons";
import { MemoizedSideMenu } from "./SideMenu";
import { AvatarLink } from "../CoreComponents";
import { WelcomeTooltip } from "../Tooltip";

enum MenuState {
  close = "close",
  open = "open",
}

export function SettingsMenu({ currentUser }: { currentUser: User }) {
  const [menuOpen, setMenuOpen] = useState<MenuState>(MenuState.close);
  const { data: session, update: updateSession } = useSession();
  const avatarRef = useRef(null);
  const router = useRouter();
  useOutsideClick(avatarRef, closeMenu);

  function handleMenuOpen() {
    setMenuOpen(menuOpen === MenuState.open ? MenuState.close : MenuState.open);
  }

  function closeMenu() {
    setMenuOpen(MenuState.close);
  }

  const closeTooltip = async () => {
    //event.stopPropagation()

    const formData = new FormData();
    formData.append("id", currentUser.id);
    formData.append("profileVisited", "true");

    const updateProfileRes = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${currentUser.username}/profile`,
      {
        method: "PUT",
        body: formData,
      }
    );

    const userProfileData = await updateProfileRes.json();

    await updateSession({
      ...session,
      user: {
        ...(typeof session?.user === "object" ? session?.user : {}),
        ...{
          profileVisited: userProfileData.updatedProfile.profileVisited,
        },
      },
    });

    //router.refresh()
  };

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <li
        className="xs:relative mx-2"
        ref={menuOpen === MenuState.open ? avatarRef : null}
      >
        <div
          id="user-avatar"
          data-test="user-avatar-link"
          className="relative cursor-pointer flex items-center justify-center text-neutral-600 flex-col dark:text-gray-200 hover:text-black hover:underline"
          onClick={handleMenuOpen}
        >
          <AvatarLink
            src={currentUser?.avatarUrl || ""}
            className="relative w-8 h-8 md:w-9 md:h-9 ring-2 ring-slate-200 dark:ring-slate-500 hover:bg-gray-100 dark:hover:bg-slate-500 hover:ring-[#B1B8F8] hover:ring-opacity-80"
          />
          {/* {<span className='hidden xs:block'>Me</span>} */}
          {!currentUser.profileVisited ? (
            <WelcomeTooltip closeTooltip={closeTooltip} />
          ) : null}
        </div>

        <MemoizedSideMenu
          id="settings-menu"
          classNames="w-full h-full shadow dark:text-white border-l border-slate-300 dark:border-slate-600 bg-white dark:dark:bg-menu-dark-github overflow-auto"
          isOpen={menuOpen}
          side="right"
          closeFunc={closeMenu}
        >
          <ul
            id="settings-menu"
            data-test="settings-menu-list"
            className={`absolute w-full p-2 bg-white dark:bg-menu-dark-github dark:text-slate-100 overflow-hidden text-sm`}
          >
            <li className="py-2 px-2 flex items-center justify-between">
              <div className="flex items-center flex-1">
                <AvatarLink
                  withLink={`/user/${currentUser.username}`}
                  src={currentUser?.avatarUrl || ""}
                  className={
                    "max-w-[2.1rem] max-h-[2.1rem] xs:max-w-[2.4rem] xs:max-h-[2.4rem] ring-2 ring-slate-200 dark:ring-slate-500 hover:bg-gray-100 dark:hover:bg-slate-500 hover:ring-[#B1B8F8] hover:ring-opacity-80"
                  }
                />
                <div className="flex-1 ml-2">
                  <p
                    data-test="user-name-title"
                    className="text-lg font-medium"
                  >
                    {currentUser?.fullName}
                  </p>
                  <span data-test="user-email-title">{currentUser?.email}</span>
                </div>
              </div>
              <a
                id="mobile-menu-close"
                href="#"
                data-test="close-menu-link"
                className="z-50 dark:text-slate-200 hover:bg-[#e4e6fc] hover:dark:bg-slate-600 cursor-pointer rounded-lg p-2"
                onClick={closeMenu}
              >
                <CloseSideMenuIcon />
              </a>
            </li>
            <hr className="my-2 dark:border-gray-600" />
            <Link
              data-test="my-profile-link"
              href={`/user/${currentUser?.username}?tab=all`}
              onClick={closeMenu}
            >
              <li className="flex justify-start items-center gap-2 p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600">
                <span className="text-slate-800 dark:text-inherit">
                  <SmallUserIcon />
                </span>
                <span>My profile</span>
              </li>
            </Link>

            <Link
              data-test="saved-list-link"
              href={`/user/${currentUser?.username}?tab=starred`}
              onClick={closeMenu}
            >
              <li className="flex justify-start items-center gap-2 p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600">
                <span className="text-slate-800 dark:text-inherit">
                  {/* {<SavedListIcon classNames='w-4 h-4' />} */}
                  <TagListIcon classNames="w-4 h-4" />
                </span>
                <span>Saved list</span>
              </li>
            </Link>

            <Link
              data-test="settings-link"
              href={`/settings/account/${currentUser.username}`}
              onClick={closeMenu}
            >
              <li className="flex justify-start items-center gap-2 p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600">
                <span className="text-slate-800 dark:text-inherit">
                  <SettingsIcon2 />
                </span>
                <span>Settings</span>
              </li>
            </Link>

            <hr className="my-2 dark:border-gray-600" />

            <Link
              data-test="logout-link"
              href={`/api/auth/signout`}
              onClick={closeMenu}
            >
              <li className="flex justify-start items-center gap-2 p-2 cursor-pointer rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600">
                <span className="text-slate-800 dark:text-inherit">
                  <LogoutIcon />
                </span>
                <span>Log Out</span>
              </li>
            </Link>
          </ul>
        </MemoizedSideMenu>
      </li>
    </>
  );
}
