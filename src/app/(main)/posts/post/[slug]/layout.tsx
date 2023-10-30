export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="relative w-full min-h-screen bg-post-layout antialiased dark:bg-main-dark dark:text-slate-100 flex flex-col pt-20">
        {children}
      </section>
    </>
  );
}
