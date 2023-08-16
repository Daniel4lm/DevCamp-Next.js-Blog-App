
export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <>
            <section className="relative w-full min-h-screen xs:bg-slate-50 antialiased dark:bg-main-dark dark:text-slate-100 flex flex-col pt-20">
                {children}
            </section>
        </>
    )
}
