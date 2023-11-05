import { http, HttpResponse } from "msw";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

export const handlers = [
  http.get(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/comments`,
    ({ request }) => {
      const url = new URL(request.url);
      const postId = url.searchParams.get("postId");

      return new Response(
        JSON.stringify({
          comments: [],
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
        }
      );
    }
  ),
  http.get(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/:slug`,
    ({ params }) => {
      const { slug } = params;

      const blogPost = blogPostFactory(slug as string);

      if (!blogPost) {
        return HttpResponse.json(
          {
            error: "Blog post not found or data is invalid!",
          },
          { status: 404 }
        );
      }

      return new Response(JSON.stringify({ post: blogPost }), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      });
    }
  ),
  http.get(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/:username`,
    ({ params }) => {
      const { username } = params;

      if (username !== "daniel4mx") {
        return new Response(
          JSON.stringify({ error: "User not found or username is invalid!" }),
          {
            headers: {
              "Content-Type": "application/json",
            },
            status: 404,
          }
        );
      }

      return new Response(
        JSON.stringify({
          user: {
            id: "4477251-ctx-44",
            avatarUrl: true,
            email: "danielgmail.com",
            username: "daniel4mx",
            fullName: "Daniel",
            postsCount: 4,
            role: "USER",
            profile: {
              create: {
                bio: "Hello, I'm Daniel from Great City",
              },
            },
            posts: {
              create: [
                {
                  title: "Next.js 13 release",
                  slug: "next-js-13-release",
                  tags: [
                    {
                      id: "14",
                      name: "next.js",
                    },
                    {
                      id: "25",
                      name: "front-end",
                    },
                  ],
                  body: "Next. js v13 was released by Vercel at the Next. js conference in October 2022, bringing many new features and improvements.",
                  published: true,
                },
                {
                  title: "Validate related schema attributes with Zod",
                  slug: "validate-related-schema-attributes-with-zod",
                  tags: {
                    create: [
                      {
                        id: "tr",
                        name: "zod",
                      },
                      {
                        id: "fds",
                        name: "javascript",
                      },
                    ],
                  },
                  body: "<p>Zod is a TypeScript-first schema declaration and validation library.</p><p> I'm using the term 'schema' to broadly refer to any data type, from a simple string to a complex nested object.</p>",
                  published: true,
                },
              ],
            },
            followersCount: 10,
            followingCount: 12,
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
        }
      );
    }
  ),
  http.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/register`,
    async ({ request }) => {
      const formData = await request.json();

      const userInfo = {
        email: "daniel@gmail.com",
        username: "daniel4mx",
        fullName: "Daniel",
      };

      return new Response(JSON.stringify({ user: userInfo }), {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      });
    }
  ),
  http.post(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/posts`,
    async ({ request }) => {
      const formData = await request.formData();
      console.log("create post -> ", formData);

      return new Response(
        JSON.stringify({
          newPost: {
            id: "ctx4444888333221_dm",
            authorId: "4444333221",
            title: "Next.js 13 release",
            slug: "next-js-13-release",
            tags: [
              {
                name: "next.js",
              },
              {
                name: "front-end",
              },
            ],
            body: "Next. js v13 was released by Vercel at the Next. js conference in October 2022, bringing many new features and improvements.",
            published: true,
            photo_url: null,
            totalLikes: 0,
            totalComments: 0,
            totalBookmarks: 0,
            readTime: 1,
            author: {
              id: "4444333221",
              email: "daniel@gmail.com",
              fullName: "Daniel M",
              username: "daniel_m",
              avatarUrl: null,
              themeMode: "LIGHT",
              role: "USER",
            },
            comments: [],
            likes: [],
            bookmarks: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
          status: 200,
        }
      );
    }
  ),
];

function blogPostFactory(slug: string) {
  if (slug === "next-js-13-release") {
    return {
      id: "ctx4444888333221_dm",
      authorId: "4444333221",
      title: "Next.js 13 release",
      slug: "next-js-13-release",
      tags: [
        {
          id: "4444",
          name: "next.js",
        },
        {
          id: "333",
          name: "front-end",
        },
      ],
      body: `
                Next. js v13 was released by Vercel at the Next. js conference in October 2022, bringing many new features and improvements.
                <br>
                <h1><a id="anchor1" href="#anchor1" rel="noopener noreferrer" class="text-link">First anchor tag</a></h1>
                `,
      published: true,
      photo_url: null,
      totalLikes: 0,
      totalComments: 0,
      totalBookmarks: 0,
      readTime: 1,
      author: {
        id: "4444333221",
        email: "daniel@gmail.com",
        fullName: "Daniel M",
        username: "daniel_m",
        avatarUrl: null,
        themeMode: "LIGHT",
        role: "USER",
      },
      comments: [],
      likes: [],
      bookmarks: [],
      createdAt: "2023-04-12 11:08:50.677", //new Date(),
      updatedAt: "2023-08-30 07:08:50.677", //new Date(),
    };
  }
}

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
    logger: {
      log: console.log,
      warn: console.warn,
      error: () => {},
    },
  });

export function renderWithClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient();
  const { rerender, ...result } = render(
    <QueryClientProvider client={testQueryClient}> {ui} </QueryClientProvider>
  );
  return {
    ...result,
    rerender: (rerenderUi: React.ReactElement) =>
      rerender(
        <QueryClientProvider client={testQueryClient}>
          {" "}
          {rerenderUi}{" "}
        </QueryClientProvider>
      ),
  };
}

export function createWrapper() {
  const testQueryClient = createTestQueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={testQueryClient}>
      {" "}
      {children}{" "}
    </QueryClientProvider>
  );
}
