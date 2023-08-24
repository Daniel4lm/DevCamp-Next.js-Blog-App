type PageProps = {
    params: {
        tag: string
    }
}

export async function generateMetadata({ params }: PageProps) {
    const { tag } = params

    return {
        title: "List of posts by tag",
        description: "List of posts by tag",
        keywords: tag,
        openGraph: {
            title: "List of posts by tag",
            description: "List of posts by tag",
            url: '',
            locale: 'en_US',
            type: 'website',
        },
    }
}

export default function PostsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <main role="main" className="relative w-full min-h-screen antialiased dark:bg-main-dark-github dark:text-slate-100 flex flex-col pt-12">
                {children}
            </main>
        </>
    );
}