
export default function UserLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <section className="relative w-full min-h-screen bg-inherit antialiased dark:bg-main-dark dark:text-slate-100 flex flex-col pt-20">
                {children}
            </section>
        </>
    )
}
