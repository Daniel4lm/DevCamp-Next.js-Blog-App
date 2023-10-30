import { Metadata } from "next";
import { notFound } from "next/navigation";
import PostBody from "./components/PostBody";
import { Tag, Post, Prisma } from "@prisma/client";
import { PostComment } from "@/models/Comment";
import getQueryClient from "@/lib/reactQuery/getQueryClient";
import { dehydrate } from "@tanstack/react-query";
import Hydrate from "@/components/react-query/hydrate.client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

type PostProps = Pick<Post, "slug">;

type PageProps = {
  params: PostProps;
};

/* SEO */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = params;

  let postData:
    | (Post & {
        comments: PostComment[];
        author: { [x: string]: string | number | null };
        tags: Tag[];
        _count: Prisma.PostCountOutputType;
      })
    | null;

  try {
    const blogFetch = await fetch(`http://localhost:3000/api/posts/${slug}`, {
      cache: "no-cache",
    });
    const postJson = await blogFetch.json();
    postData = postJson?.post;
  } catch (err: any) {
    console.info(err.message);
    return notFound();
  }

  if (!postData) return { title: "No post found!" };
  const postTags = postData.tags?.map((tag) => tag.name);

  return {
    title: postData.slug,
    description: postData.title,
    keywords: postTags,
    openGraph: {
      title: postData.slug,
      description: postData.title,
      url: "",
      images: [
        {
          url: postData.photo_url || "",
          width: 800,
          height: 600,
        },
      ],
      locale: "en_US",
      type: "website",
    },
  };
}

export default async function Post({ params }: PageProps) {
  const { slug } = params;

  let postData:
    | (Post & {
        comments: PostComment[];
        author: { [x: string]: string | number | null };
        tags: Tag[];
        _count: Prisma.PostCountOutputType;
      })
    | null = null;

  const queryClient = getQueryClient();
  const session = await getServerSession(authOptions);

  try {
    await queryClient.prefetchQuery({
      queryKey: ["post", slug],
      queryFn: async () => {
        const blogFetch = await fetch(
          `http://localhost:3000/api/posts/${slug}`,
          { cache: "no-cache" }
        );
        const postJson = await blogFetch.json();
        postData = postJson?.post;
        return postData;
      },
    });
  } catch (err: any) {
    console.info(err.message);
  }

  if (!postData) return notFound();

  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <div className="relative flex md:w-full lg:w-4/5 2xl:w-3/4 md:mx-auto sm:px-4">
        <PostBody postSlug={slug} currentUser={session?.user} />
      </div>
    </Hydrate>
  );
}
