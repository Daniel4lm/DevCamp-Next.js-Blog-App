/* eslint-disable testing-library/await-async-events */
import { QueryClient } from "@tanstack/query-core";
import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostShowPage from "../post/[slug]/components/PostBody";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactElement } from "react";
import { useSession } from "next-auth/react";
import { User as SessionUser } from "next-auth";
import { useRouter } from "next/navigation";
import { server } from "@/mocks/server";
import { http } from "msw";

function setup(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

const testQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    // ✅ no more errors on the console
    error: () => {},
  },
});

function renderPostPage(postSlug: string, curUser: SessionUser | undefined) {
  return (
    <QueryClientProvider client={testQueryClient}>
      <PostShowPage postSlug={postSlug} currentUser={curUser} />
    </QueryClientProvider>
  );
}

jest.mock("next-auth/react");

const mockUsePathname = jest.fn();
const pushRouterFn = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname() {
    return mockUsePathname();
  },
}));

//const mockedPostQuery = usePostQuery;
// jest.mock('@/hooks/api', () => ({
//     usePostQuery: jest.fn()
// }));

const observe = jest.fn();
const disconnect = jest.fn();

const intersectionObserverMock = () => ({
  observe,
  disconnect,
});

window.IntersectionObserver = jest
  .fn()
  .mockImplementation(intersectionObserverMock);

afterEach(async () => {
  await testQueryClient.cancelQueries();
  testQueryClient.clear();
});

describe("Post render component", () => {
  describe("test rendering", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          id: "4444333221",
          email: "daniel@gmail.com",
          fullName: "Daniel M",
          username: "daniel_m",
          avatarUrl: null,
          themeMode: "LIGHT",
          role: "USER",
        },
        expires: "",
      },
      status: "authenticated",
    });

    const { data: userData } = useSession();

    it("while is loading...", async () => {
      setup(renderPostPage("next-js-13-release", userData?.user));

      await waitFor(() => {
        expect(screen.getByText(/Loading post.../i)).toBeInTheDocument();
      });
    });

    it("should render error warning", async () => {
      server.use(
        http.get(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/`, () => {
          // return res(
          //   ctx.status(404),
          //   ctx.json({ error: "Blog post not found or data is invalid!" })
          // );

          return new Response(
            JSON.stringify({
              error: "Blog post not found or data is invalid!",
            }),
            {
              headers: {
                "Content-Type": "application/json",
              },
              status: 404,
            }
          );
        })
      );

      setup(renderPostPage("", userData?.user));

      await waitFor(() => {
        expect(
          screen.queryByText(/Next.js 13 release/i)
        ).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText(/Post not found/i)).toBeInTheDocument();
      });
    });

    it("should render post page", async () => {
      mockUsePathname.mockImplementation(() => "#post-comments-section");

      (useRouter as jest.Mock).mockReturnValue({
        query: {},
        push: pushRouterFn,
      });

      // const { result } = renderHook(() => usePostQuery('next-js-13-release'), {
      //     wrapper: () => (
      //         <QueryClientProvider client={testQueryClient}>
      //             <PostShowPage postSlug={'next-js-13-release'} currentUser={userData?.user} />
      //         </QueryClientProvider>
      //     )
      // });

      //renderWithClient(<PostShowPage postSlug={'next-js-13-release'} currentUser={userData?.user} />)
      //render(<PostShowPage postSlug={'next-js-13-release'} currentUser={userData?.user} />, { wrapper: ReactQueryWrapper });
      setup(renderPostPage("next-js-13-release", userData?.user));

      await waitFor(() => {
        expect(screen.getByText(/Next.js 13 release/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/Daniel M/i)).toBeInTheDocument();
      expect(screen.getByText(/No comments yet!/i)).toBeInTheDocument();
      expect(screen.getByText(/#next.js/i)).toBeInTheDocument();
      expect(screen.getByText(/#front-end/i)).toBeInTheDocument();
      expect(screen.getByText(/Aug 30, 2023/i)).toBeInTheDocument();
      expect(screen.getByText(/Apr 12, 2023/i)).toBeInTheDocument();

      const tocList = screen.getAllByText(/In this article/i);
      const headings = screen.getAllByText(/First anchor tag/i);

      expect(tocList.length).toBeGreaterThan(1);
      expect(headings).toHaveLength(3);
    });
  });

  describe("test user interaction when user is author", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          id: "4444333221",
          email: "daniel@gmail.com",
          fullName: "Daniel M",
          username: "daniel_m",
          avatarUrl: null,
          themeMode: "LIGHT",
          role: "USER",
        },
        expires: "",
      },
      status: "authenticated",
    });

    const { data: userData } = useSession();

    it("should render disabled sidebar with enabled popup menu", async () => {
      const { user } = setup(
        renderPostPage("next-js-13-release", userData?.user)
      );

      await waitFor(() => {
        expect(screen.getByText(/Next.js 13 release/i)).toBeInTheDocument();
      });

      expect(
        screen.queryByTestId("like-post-component")
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("like-post-icon")).toBeInTheDocument();
      expect(
        screen.queryByTestId("bookmark-post-component")
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("bookmark-post-icon")).toBeInTheDocument();

      const optsBtn = screen.getByTestId("post-options-icon");
      expect(optsBtn).toBeInTheDocument();
      await user.click(optsBtn);

      await waitFor(() => {
        expect(screen.getByTestId("opts-menu-component")).toBeInTheDocument();
      });
      expect(screen.getByText(/Copy link/i)).toBeInTheDocument();
      const copyUrlPicker = screen.getByTestId("copy-url-picker");
      expect(copyUrlPicker).toBeInTheDocument();
      await user.click(copyUrlPicker);
      //await waitFor(() => { expect(screen.getByText(/Copied to Clipboard/i)).toBeInTheDocument() });

      expect(screen.getByText(/Delete post/i)).toBeInTheDocument();
      expect(screen.getByText(/Edit post/i)).toBeInTheDocument();

      const likeBtn = screen.getByTestId("like-post-icon");
      //await user.click(likeBtn)
      await user.click(document.body);

      await waitFor(() => {
        expect(
          screen.queryByTestId("opts-menu-component")
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("test user interaction when user is not author", () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          id: "84756214_cty",
          email: "email4x@gmail.com",
          fullName: "Dave Speter",
          username: "davelx@gmail.com",
          avatarUrl: null,
          themeMode: "DARK",
          role: "USER",
        },
        expires: "",
      },
      status: "authenticated",
    });

    const { data: userData } = useSession();

    it("should render enabled sidebar with disabled popup menu", async () => {
      const { user } = setup(
        renderPostPage("next-js-13-release", userData?.user)
      );

      await waitFor(() => {
        expect(screen.getByText(/Next.js 13 release/i)).toBeInTheDocument();
      });

      expect(screen.queryByTestId("like-post-icon")).not.toBeInTheDocument();
      expect(screen.getByTestId("like-post-component")).toBeInTheDocument();
      expect(
        screen.queryByTestId("bookmark-post-icon")
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("bookmark-post-component")).toBeInTheDocument();

      const optsBtn = screen.getByTestId("post-options-icon");
      expect(optsBtn).toBeInTheDocument();
      await user.click(optsBtn);

      await waitFor(() => {
        expect(screen.getByTestId("opts-menu-component")).toBeInTheDocument();
      });
      expect(screen.getByText(/Copy link/i)).toBeInTheDocument();

      expect(screen.queryByText(/Delete post/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Edit post/i)).not.toBeInTheDocument();
    });
  });
});
