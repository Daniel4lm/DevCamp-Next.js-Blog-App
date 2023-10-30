import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { crud: string };
}): Promise<Metadata> {
  const { crud } = params;

  return {
    title: `Instacamp - ${
      crud.charAt(0).toUpperCase() + crud.slice(1)
    } Blog post`,
    description: `Instacamp - ${
      crud.charAt(0).toUpperCase() + crud.slice(1)
    } Blog post`,
  };
}

// export async function generateStaticParams(): Promise<{ crud: string }[]> {
//     return [{ crud: 'new' }, { crud: 'edit' }]
// }

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <section
        className={`relative w-full min-h-screen bg-post-layout antialiased dark:bg-main-dark dark:text-slate-100 flex flex-col pt-20`}
      >
        {children}
      </section>
    </>
  );
}
