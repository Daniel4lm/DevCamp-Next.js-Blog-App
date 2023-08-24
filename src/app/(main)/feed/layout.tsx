
export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <section className="relative w-full min-h-screen bg-[#f8fafc] antialiased dark:bg-main-dark dark:text-slate-100 flex flex-col pt-10">
                {children}
            </section>
        </>
    )
}
