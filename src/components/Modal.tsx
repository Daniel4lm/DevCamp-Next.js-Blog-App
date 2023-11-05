"use client";

import React, { MouseEvent } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./Icons";
import { HeroIcon } from "./CoreComponents";

interface ModalType {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  type?: "INFO" | "WARN" | "DIALOG";
  style?: string;
  children?: React.ReactNode | React.ReactNode[];
}

function Modal({
  isOpen,
  onClose,
  title,
  type = "INFO",
  style,
  children,
}: ModalType) {
  if (!isOpen) return null;

  const stopClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  const modalIcon = () => {
    switch (type) {
      case "INFO":
        return (
          <HeroIcon
            name="hero-information-circle"
            classNames="w-6 h-6 sm:w-10 sm:h-10 text-sky-400"
          />
        );
      case "DIALOG":
        return (
          <HeroIcon
            name="hero-chat-bubble-bottom-center"
            classNames="w-6 h-6 sm:w-10 sm:h-10 text-indigo-400"
          />
        );
      case "WARN":
        return (
          <HeroIcon
            name="hero-exclamation-circle"
            classNames="w-6 h-6 sm:w-10 sm:h-10 text-orange-400"
          />
        );
      default:
        return null;
    }
  };

  const dialogFrame = () => {
    return (
      <>
        <div className="w-full h-full bg-black/20 fixed top-0 left-0 z-100 p-8" />
        <div
          className="fixed top-0 left-0 z-[150] w-full h-full overflow-hidden overflow-y-auto outline-0"
          onClick={onClose}
        >
          <div className={`absolute z-[400] ${style}`} onClick={stopClick}>
            <header className="flex justify-between items-center gap-2 p-4 dark:border-slate-400 rounded-t-lg">
              <div className="flex items-center gap-2">
                <div>{modalIcon()}</div>
                <h2
                  title="modal-title"
                  className="text-sm xs:text-base first-letter:uppercase font-semibold"
                >
                  {title}
                </h2>
              </div>
              <button
                title="close-modal"
                className="text-[#8F8F8F] bg-[#F4F6FA] p-1 rounded-full"
                onClick={onClose}
              >
                <CloseIcon />
              </button>
            </header>
            <div className="p-4 text-sm xs:text-base">{children}</div>
          </div>
        </div>
      </>
    );
  };

  const infoFrame = () => {
    return (
      <div
        className="absolute bg-black/40 backdrop-blur-lg w-max border dark:border-slate-400 rounded-md flex flex-col z-[400] opacity-100 right-[4vw] top-[4vh]"
        onClick={stopClick}
      >
        <header className="flex justify-between items-center gap-2 p-4 rounded-md">
          <div className="flex items-center gap-2">
            <div>{modalIcon()}</div>
            <h2
              title="modal-title"
              className="dark:text-slate-100 text-xs xs:text-sm font-medium"
            >
              {title}
            </h2>
          </div>

          <button
            title="close-modal"
            className=" dark:text-slate-100"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </header>
        <div className="text-sm xs:text-base">{children}</div>
      </div>
    );
  };

  return createPortal(
    <>{type === "INFO" ? infoFrame() : dialogFrame()}</>,
    document.body as HTMLElement
  );
}

export default Modal;
