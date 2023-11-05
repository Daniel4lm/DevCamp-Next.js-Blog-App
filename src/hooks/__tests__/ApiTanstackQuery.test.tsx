import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
  renderHook,
} from "@testing-library/react";
//import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactElement } from "react";
import { usePostQuery, useUserQuery, useUserQueryData } from "../api";

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

const ReactQueryWrapper = ({ children }: { children: ReactElement }) => (
  <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
);

afterEach(async () => {
  await testQueryClient.cancelQueries();
  testQueryClient.clear();
});

describe("Test react/tanstack query hooks", () => {
  describe("usePostQuery", () => {
    it("should render error warning", async () => {
      const { result } = renderHook(() => usePostQuery("react-release"), {
        wrapper: ReactQueryWrapper,
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      await waitFor(() => expect(result.current.data).toBeUndefined());
    });
    it("successful query hook", async () => {
      const { result } = renderHook(() => usePostQuery("next-js-13-release"), {
        wrapper: ReactQueryWrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      await waitFor(() => expect(result.current.data).toBeDefined());
      expect(result.current.data?.slug).toBe("next-js-13-release");
      expect(result.current.data?.title).toBe("Next.js 13 release");
      //await waitFor(() => console.log('result -> ', result.current.data));
    });
  });

  describe("useUserQueryData", () => {
    it("should render error warning", async () => {
      const { result } = renderHook(() => useUserQuery("dave"), {
        wrapper: ReactQueryWrapper,
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      await waitFor(() => expect(result.current.data).toBeUndefined());
    });
    it("successful query hook", async () => {
      const { result } = renderHook(() => useUserQuery("daniel4mx"), {
        wrapper: ReactQueryWrapper,
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      await waitFor(() => expect(result.current.data).toBeDefined());
      expect(result.current.data?.username).toBe("daniel4mx");
      expect(result.current.data?.fullName).toBe("Daniel");
    });
  });

  // describe('useUserQueryData', () => {
  //     it("should create new post article", async () => {
  //         const { result, waitFor } = renderHook(() => useCreateUserMutation(), {
  //           wrapper: wrapper,
  //         });
  //         nock('https://dummyapi.io', {
  //           reqheaders: {
  //             'app-id': () => true
  //           }
  //         })
  //           .post(`/data/v1/user/create`)
  //           // Mocking the response with status code = 200
  //           .reply(200, {});

  //         act(() => {
  //           result.current.mutate({
  //             firstName: 'fTest',
  //             lastName: 'lTest',
  //             email: 'eTest@test.com'
  //           });
  //         });

  //         // Waiting for the request status to resolve as success, i.e: statusCode = 200
  //         await waitFor(() => {
  //           return result.current.isSuccess;
  //         });

  //         // Make sure the request status resolved to true
  //         expect(result.current.isSuccess).toBe(true);
  //       });
  // })
});
