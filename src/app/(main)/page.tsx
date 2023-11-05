import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import { HeroIcon } from "@/components/CoreComponents";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <section className="flex min-h-screen flex-col bg-[#fbfbfb] dark:bg-inherit items-center justify-around py-10 lg:py-20 mt-14">
      <header className="w-auto lg:w-4/5 2xl:w-2/3 flex flex-col px-4 sm:px-8 sm:flex-row sm:justify-center items-center sm:gap-6 mt-12">
        <div className="sm:max-w-[60%] animate__jackInTheBox">
          <h1 className="text-2xl md:text-3xl lg:text-4xl text-center sm:text-left">
            Welcome to{" "}
            <span className="text-indigo-400 font-bold">
              Your powerful rich Campy
            </span>{" "}
            Blog app
          </h1>
          <p className="mt-8">
            Empower users to release rich articles fast and achieve website
            goals. Deliver a custom article page that integrates into your tech
            stack. That's why we created Campy Blog website.
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-8">
            <Link
              href={session && session.user ? "/feed" : "/api/auth/signin"}
              role="link"
              className="border sm:border-2 border-indigo-400 bg-transparent hover:bg-indigo-400 px-6 py-[6px] text-indigo-500 dark:text-indigo-400 hover:text-white dark:hover:text-white text-sm sm:text-base rounded-full duration-300"
            >
              {session && session.user ? "Visit Blog" : "Get started"}
            </Link>

            <Link
              href="/contact"
              role="link"
              className="border sm:border-2 border-orange-400 bg-transparent hover:bg-orange-400 px-6 py-[6px] text-orange-400 hover:text-white text-sm sm:text-base rounded-full duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
        <div className="sm:max-w-[40%] mt-8 sm:mt-0">
          <Image
            alt="Hero image"
            src={"/assets/images/home-page-04.svg"}
            width={400}
            height={400}
            className="rounded-xl"
            priority
          />
        </div>
      </header>

      <section className=" sm:px-4 lg:px-24 my-8">
        <div className="w-auto max-w-[1200px] mx-auto sm:px-4 text-[#495057] dark:text-slate-200">
          <div className="flex flex-col md:flex-row flex-wrap sm:-mx-4">
            {/* <!-- column 1 --> */}
            <div className="relative w-auto px-4 md:max-w-[33%] flex-1">
              {/* <!-- title --> */}
              <h5 className="text-xl sm:text-2xl text-indigo-400 font-semibold mb-2">
                Features
              </h5>
              <h2 className="text-[calc(1.35938rem+0.4vw)] leading-8">
                Why is Campy so special?
              </h2>
              <p className="my-4 font-light">
                Campy Blog portal is for every day. It is designed to work 'out
                of the box' and comes fully equipped with the features most
                people need.
              </p>
              {/* <!-- service item --> */}
              <div className="bg-[#f0f1f3] dark:bg-slate-600/30 p-4 sm:p-12 rounded-md">
                <HeroIcon
                  name="hero-squares-plus"
                  classNames="bg-indigo-400 my-2 w-8 h-8 sm:w-10 sm:h-10"
                />
                <h5 className="text-xl sm:text-2xl text-gray-700 dark:text-gray-250 font-semibold mb-2">
                  Modern Design
                </h5>
                <p className="text-sm sm:text-base mb-0">
                  Work in 3D with Blender, draw or edit pictures in Gimp, use
                  Inkscape for vector graphics.
                </p>
              </div>
            </div>

            {/* <!-- column 2 --> */}
            <div className="relative w-auto px-4 md:max-w-[33%] flex-1 mt-5">
              {/* <!-- service item --> */}
              <div className="bg-[#f0f1f3] dark:bg-slate-600/30 p-4 sm:p-12 mb-5 rounded-md">
                <HeroIcon
                  name="hero-pencil-square"
                  classNames="bg-indigo-400 my-2 w-8 h-8 sm:w-10 sm:h-10"
                />
                <h5 className="text-xl sm:text-2xl text-gray-700 dark:text-gray-250 font-semibold mb-2">
                  Productivity
                </h5>
                <p className="text-sm sm:text-base mb-0">
                  With LibreOffice's complete office suite, use the word
                  processor, make presentations, drawings, spreadsheets or even
                  databases. Easily import from or export to PDF or Microsoft
                  Office documents.
                </p>
              </div>
              {/* <!-- service item --> */}
              <div className="bg-[#f0f1f3] dark:bg-slate-600/30 p-4 sm:p-12 mb-5 rounded-md">
                <HeroIcon
                  name="hero-film"
                  classNames="bg-indigo-400 my-2 w-8 h-8 sm:w-10 sm:h-10"
                />
                <h5 className="text-xl sm:text- 2xl text-gray-700 dark:text-gray-250 font-semibold mb-2">
                  Graphic and Multimedia
                </h5>
                <p className="text-sm sm:text-base mb-0">
                  Enjoy your music, watch TV and movies, listen to podcasts,
                  Spotify and online radio.
                </p>
              </div>
            </div>

            {/* <!-- column 3 --> */}
            <div className="relative w-auto px-4 md:max-w-[33%] flex-1">
              {/* <!-- service item --> */}
              <div className="card-color-gradient text-white p-4 sm:p-12 mb-5 rounded-md">
                <HeroIcon
                  name="hero-globe-alt"
                  classNames="bg-white my-2 w-8 h-8 sm:w-10 sm:h-10"
                />
                <h5 className="text-xl sm:text-2xl font-semibold mb-2">
                  Web & resource accessibility
                </h5>
                <p className="text-sm sm:text-base mb-0">
                  Browse the Web, watch Youtube and Netflix with Firefox. Turn
                  any website into a desktop app for immediate access.
                </p>
              </div>
              {/* <!-- service item --> */}
              <div className="bg-[#f0f1f3] dark:bg-slate-600/30 p-4 sm:p-12 mb-5 rounded-md">
                <HeroIcon
                  name="hero-chat-bubble-left-ellipsis"
                  classNames="bg-indigo-400 my-2 w-8 h-8 sm:w-10 sm:h-10"
                />
                <h5 className="text-xl sm:text-2xl text-gray-700 dark:text-gray-250 font-semibold mb-2">
                  Joy
                </h5>
                <p className="text-sm sm:text-base mb-0">
                  Access more than 7,800 games with Steam. Install GOG to get
                  even more.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full relative pattern-overlay-2 bg-indigo-500 z-[1]">
        <div className="w-full max-w-[1200px] mx-auto my-4">
          <div className="flex flex-col gap-y-2 p-12 mx-auto max-w-[75%] text-white text-center">
            <h2>Give it a try. You’ll Love it!</h2>
            <p className="mb-3 text-lg">
              Most of our users come and they never look back.
            </p>
          </div>
        </div>
      </section>

      <section className="my-10">
        <div role="page-links" className="my-4 grid md:grid-cols-2 gap-4">
          <Link
            href="/feed"
            role="link"
            className="group rounded-xl border border-transparent px-5 py-4 transition-colors hover:shadow-lg hover:border-slate-200 hover:bg-slate-50 hover:dark:border-slate-700 hover:dark:bg-slate-600/30"
          >
            <h2 className={`mb-3 text-2xl font-semibold `}>
              Visit Blog{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Explore other articles you mayfind usefull.
            </p>
          </Link>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            className="group rounded-xl border border-transparent px-5 py-4 transition-colors hover:shadow-lg hover:border-slate-200 hover:bg-slate-50 hover:dark:border-slate-700 hover:dark:bg-slate-600/30"
            target="_blank"
            rel="noopener noreferrer"
            role="link"
          >
            <h2 className={`mb-3 text-2xl font-semibold `}>
              Deploy{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Instantly deploy your Next.js site to a shareable URL with Vercel.
            </p>
          </a>
        </div>

        <div className="my-4 grid md:grid-cols-2 gap-2">
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            className="group rounded-xl border border-transparent px-5 py-4 transition-colors hover:shadow-lg hover:border-slate-200 hover:bg-slate-50 hover:dark:border-slate-700 hover:dark:bg-slate-600/30"
            target="_blank"
            rel="noopener noreferrer"
            role="link"
          >
            <h2 className={`mb-3 text-2xl font-semibold `}>
              Docs{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Find in-depth information about Next.js features and API.
            </p>
          </a>

          <a
            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            className="group rounded-xl border border-transparent px-5 py-4 transition-colors hover:shadow-lg hover:border-slate-200 hover:bg-slate-50 hover:dark:border-slate-700 hover:dark:bg-slate-600/30 hover:dark:bg-opacity-30"
            target="_blank"
            rel="noopener noreferrer"
            role="link"
          >
            <h2 className={`mb-3 text-2xl font-semibold `}>
              Learn{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              Learn about Next.js in an interactive course with&nbsp;quizzes!
            </p>
          </a>
        </div>
      </section>
    </section>
  );
}
