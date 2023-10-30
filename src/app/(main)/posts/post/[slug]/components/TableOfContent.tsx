"use client";

import { HeroIcon } from "@/components/CoreComponents";
import useOutsideClick from "@/hooks/useOutsideClick";
import useTocData from "@/hooks/useTocData";
import useTocObserver from "@/hooks/useTocObserver";
import { useRef, useState } from "react";

function TableOfContent() {
  const { articleHeadings } = useTocData({ selector: ".text-link" });
  const { activeId } = useTocObserver({ selector: ".text-link" });
  const [menuOpen, setMenuOpen] = useState<"open" | "close">("close");
  const menuRef = useRef(null);

  useOutsideClick(menuRef, closeMenu);

  const handleMenuOpen = () =>
    setMenuOpen(menuOpen === "open" ? "close" : "open");
  function closeMenu() {
    setMenuOpen("close");
  }

  if (!articleHeadings.length) return null;

  return (
    <div
      ref={menuOpen === "open" ? menuRef : null}
      className={`sm:sticky top-20 w-auto h-max z-20`}
    >
      <div
        id="post-toc-icon"
        data-testid="post-toc-icon"
        className={`block 2xl:hidden w-auto h-max m-2 hover-item rounded-lg p-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-500`}
        onClick={handleMenuOpen}
      >
        <HeroIcon name="hero-list-bullet" classNames="w-6 h-6" />
      </div>

      <nav
        id="toc-table"
        aria-label="Table of contents"
        className={`${
          menuOpen === "open"
            ? "absolute left-0 sm:left-auto sm:right-0 bottom-full sm:bottom-auto sm:top-full"
            : "hidden 2xl:block"
        } 2xl:sticky w-auto h-max bg-white dark:bg-menu-dark-github 2xl:dark:bg-navbar-dark border border-indigo-300 dark:border-slate-500 rounded-lg xl:ml-2 px-2 py-4`}
      >
        <span
          id="side-nav-title"
          className="px-2 text-lg font-semibold uppercase text-indigo-500 dark:text-indigo-400"
        >
          In this article
        </span>
        <hr className="mb-1 dark:border-slate-500" />
        <ul id="side-nav-list" className="dark:border-slate-500">
          {articleHeadings.map((heading) => (
            <li
              key={heading.id}
              className={
                "w-auto sm:w-max 2xl:w-auto pl-3 text-slate-500 dark:text-slate-200 hover:text-indigo-500 hover:dark:text-indigo-400 hover:underline duration-300"
              }
            >
              <a
                href={`${heading.href}`}
                aria-current={heading.id === activeId ? true : false}
                className={` block side-anchor-link px-2 py-1 cursor-pointer`}
              >
                {heading.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

export default TableOfContent;
