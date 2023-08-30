import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-around px-8 lg:px-24 py-10 lg:py-20 mt-14">
      <div className="z-10 flex w-full max-w-5xl items-center justify-center bg-gray-100 dark:bg-slate-600/40 rounded-xl my-6">
        <p className="w-full text-lg text-center lg:text-2xl font-semibold dark:from-inherit lg:w-auto lg:rounded-xl p-4">
          Your powerful rich Instacamp Blog app.
        </p>

      </div>

      <div className="relative flex place-items-center">
        <Image
          className="relative "
          src="/landing.svg"
          alt="Landing Page Logo"
          width={120}
          height={37}
          priority
        />
      </div>

      <div className="my-4 grid text-center lg:mb-0 md:grid-cols-2 lg:text-left gap-2">
        <Link
          href="/feed"
          className="group rounded-xl border border-transparent px-5 py-4 transition-colors hover:shadow-lg hover:border-slate-200 hover:bg-slate-50 hover:dark:border-slate-700 hover:dark:bg-slate-600/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Blog feed page{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
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
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Deploy{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instantly deploy your Next.js site to a shareable URL with Vercel.
          </p>
        </a>
      </div>

      <div className="mb-32 grid text-center lg:mb-0 md:grid-cols-2 lg:text-left gap-2">
        <a
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          className="group rounded-xl border border-transparent px-5 py-4 transition-colors hover:shadow-lg hover:border-slate-200 hover:bg-slate-50 hover:dark:border-slate-700 hover:dark:bg-slate-600/30"
          target="_blank"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Docs{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
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
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Learn{' '}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Learn about Next.js in an interactive course with&nbsp;quizzes!
          </p>
        </a>
      </div>
    </section>
  )
}
