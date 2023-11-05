export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <section className="relative w-full min-h-screen bg-[#e2e2e2bd] antialiased dark:bg-main-dark dark:text-slate-100 flex flex-col pt-16">
        {children}
      </section>
    </>
  );
}
