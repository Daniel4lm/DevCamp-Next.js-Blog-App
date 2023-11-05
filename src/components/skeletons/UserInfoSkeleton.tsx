import Skeleton from "./Skeleton";

function UserInfoSkeleton() {
  return (
    <>
      <section className="relative flex justify-center items-center flex-col w-full sm:w-10/12 md:w-3/4 xl:w-3/6 2xl:w-2/5 mx-auto px-4 xs:px-10 mt-16 pt-20 pb-4 bg-white dark:bg-[#344453] dark:text-slate-300 border-t sm:border dark:border-gray-600 sm:rounded-lg sm:shadow-md sm:shadow-slate-100 dark:shadow-none">
        <Skeleton classes="profile-circle absolute w-20 h-20 xs:w-28 xs:h-28 left-4 xs:left-1/2 xs:-translate-x-1/2 -top-10 xs:-top-12" />

        <Skeleton classes="h-40 width-100 my-1" />
      </section>

      <section className="flex xs:justify-center xs:items-center flex-col w-full sm:w-10/12 md:w-3/4 xl:w-3/6 2xl:w-2/5 mx-auto px-4 xs:px-10 py-2 sm:my-4 bg-white dark:bg-[#344453] text-gray-600 dark:text-slate-300 sm:rounded-lg border-b sm:border dark:border-gray-600 shadow-md dark:shadow-none shadow-slate-100">
        <Skeleton classes="h-20 width-100 my-1" />
      </section>
    </>
  );
}

export default UserInfoSkeleton;
