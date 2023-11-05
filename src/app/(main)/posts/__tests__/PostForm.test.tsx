/* eslint-disable testing-library/await-async-events */
import "@testing-library/jest-dom";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostForm from "../[crud]/Form";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { User as SessionUser } from "next-auth";
import { QueryClient } from "@tanstack/query-core";
import React, { ReactElement } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

function setup(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

jest.mock("next-auth/react");
jest.mock("next/navigation");

const getUrlParamsFn = jest.fn();
const pushRouterFn = jest.fn();
const replaceRouterFn = jest.fn();

const queryClient = new QueryClient({
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

function renderForm(crud: string, curUser: SessionUser | undefined) {
  return (
    <QueryClientProvider client={queryClient}>
      <PostForm crud={crud} tableColumn="TO_DO" currentUser={curUser} />
    </QueryClientProvider>
  );
}

function getSubmitBtn() {
  return screen.getByRole("button", { name: /Submit/i });
}

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
      fontName: "default",
      profileVisited: false,
      kanbanColumnsReviewed: [],
    },
    expires: "",
  },
  status: "authenticated",
});

jest.mock("@tinymce/tinymce-react", () => ({
  Editor: (props: any) => {
    const { onEditorChange, onBlur, value } = props;
    // Simulate TinyMCE editor's behavior here
    return (
      <textarea
        id="body"
        data-testid="tinymce-editor"
        onChange={(e) => onEditorChange(e.target.value)}
        onBlur={onBlur}
        value={value}
      />
    );
  },
}));

describe("New post crud form", () => {
  (useRouter as jest.Mock).mockReturnValue({
    query: {},
    push: pushRouterFn,
    replace: replaceRouterFn,
  });

  (useSearchParams as jest.Mock).mockReturnValue({
    get: getUrlParamsFn,
  });

  const { data: userData } = useSession();

  it("Should not render form", async () => {
    setup(renderForm("", userData?.user));

    expect(screen.queryByText(/Title/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/blog post/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Submit/i)).not.toBeInTheDocument();
  });

  it("Should render new post form with inputs and disabled submit", async () => {
    const { user } = setup(renderForm("new", userData?.user));

    const formTitleNew = screen.getByText(/New blog post/i, { exact: true });

    await waitFor(() => {
      expect(formTitleNew).toBeInTheDocument();
    });

    const submitBtn = getSubmitBtn();
    user.click(submitBtn);
    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });
  });

  it("Should render new post form with errors", async () => {
    const { container, user } = setup(renderForm("new", userData?.user));

    const formTitleNew = screen.getByText(/New blog post/i, { exact: true });
    await waitFor(() => {
      expect(formTitleNew).toBeInTheDocument();
    });

    const titleInput = screen.getByRole("textbox", { name: /title/i });
    await user.click(titleInput);

    //const editor = screen.getByTestId('tinymce-editor');
    const editor = screen.getByRole("textbox", { name: /body/i });

    expect(editor).toBeInTheDocument();

    await user.click(editor);
    await waitFor(() => {
      expect(screen.getByText("Title can't be blank!")).toBeInTheDocument();
    });

    // You can interact with the editor if needed using fireEvent
    fireEvent.change(editor, { target: { value: "" } });
    titleInput.focus();
    await waitFor(() => {
      expect(screen.getByText("Content can't be blank!")).toBeInTheDocument();
    });

    await user.type(titleInput, "Next.js");
    fireEvent.keyDown(titleInput, { key: "Enter", code: "Enter" });

    await waitFor(() => {
      expect(
        screen.getByText("Title must be 10 or more characters long!")
      ).toBeInTheDocument();
    });

    fireEvent.change(editor, { target: { value: "Testing..." } });
    await waitFor(() => {
      expect(screen.getByText("Content too short!")).toBeInTheDocument();
    });
  });

  it("Should render new post form with no errors", async () => {
    const fileValues = [
      {
        lastModified: 1695986339831,
        name: "avatar.jpg",
        size: 14922,
        type: "image/jpeg",
        webkitRelativePath: "",
      },
    ];

    // Mock FormData web API
    // const appendMock = jest.fn();
    // function FormDataMock(this: any) {
    //   this.append = appendMock;
    // }
    // (global as any).FormData = FormDataMock;

    global.URL.createObjectURL = jest.fn();

    const { user } = setup(renderForm("new", userData?.user));

    const fileInput = screen.getByTestId("post-upload-image");
    // fireEvent.change(fileInput, {
    //     target: { files: [new File(['avatar.jpg'], 'avatar.jpg')] },
    // });

    const str = JSON.stringify(fileValues);
    const fileBlob = new Blob([str]);

    const file = new File([fileBlob], "avatar.jpg", {
      type: "image/jpg",
    });

    File.prototype.text = jest.fn().mockResolvedValueOnce(str);

    await user.upload(fileInput, file);
    // Object.defineProperty(fileInput, "files", {
    //     value: [file]
    // });

    //fireEvent.change(fileInput);
    fireEvent.change(fileInput, {
      target: { files: [file] },
    });
    //fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(/avatar.jpg/i)).toBeInTheDocument();
    });

    expect(screen.getByText("Image selected:")).toBeInTheDocument();

    const titleInput = screen.getByRole("textbox", { name: /title/i });
    await user.type(titleInput, "Next.js 13 release");

    const tagsInput = screen.getByRole("textbox", { name: /topics/i });
    await user.type(tagsInput, "next.js,");
    fireEvent.keyDown(tagsInput, { key: "Enter", code: "Enter" });
    await user.type(tagsInput, "#testing ");
    fireEvent.keyDown(tagsInput, { key: "Space", code: "Space" });
    await user.type(tagsInput, "#");
    fireEvent.keyDown(tagsInput, { key: "Space", code: "Space" });
    await user.type(tagsInput, "react");
    await user.tab();

    expect(screen.getByText(/#next.js/i)).toBeInTheDocument();
    expect(screen.getByText(/#testing/i)).toBeInTheDocument();
    expect(screen.getByText(/#react/i)).toBeInTheDocument();

    const editor = screen.getByRole("textbox", { name: /body/i });
    expect(editor).toBeInTheDocument();

    const submitBtn = getSubmitBtn();
    expect(submitBtn).toBeDisabled();

    fireEvent.change(editor, {
      target: { textContent: "Hello, World! This is a new version of Next.js" },
    });

    await waitFor(() => {
      expect(
        screen.getByText("Hello, World! This is a new version of Next.js")
      ).toBeInTheDocument();
    });
    await user.tab();

    expect(submitBtn).toBeEnabled();

    await user.click(submitBtn);

    // Assert that FormData was used correctly
    // expect(appendMock).toHaveBeenCalledWith("title", "Next.js 13 release");
    // expect(appendMock).toHaveBeenCalledWith(
    //   "body",
    //   "Hello, World! This is a new version of Next.js"
    // );
    // expect(appendMock).toHaveBeenCalledWith("tags", "next.js,testing,react");
    // expect(appendMock).toHaveBeenCalledWith("published", "true");
    // expect(appendMock).toHaveBeenCalledWith("slug", "next-js-13-release");
    // expect(appendMock).toHaveBeenCalledWith("userEmail", "daniel@gmail.com");
    // expect(appendMock).toHaveBeenCalledTimes(8);

    //await screen.findByText("Saving");
    // await act(() => sleep(500));

    // await waitFor(() => {
    //   expect(screen.getByText("Saving")).toBeInTheDocument();
    // });

    // await waitFor(() => {
    //   expect(submitBtn).toBeDisabled();
    // });

    await waitFor(() => {
      expect(replaceRouterFn).toHaveBeenCalledTimes(1);
    });
  });
});

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Edit post crud form", () => {
  (useRouter as jest.Mock).mockReturnValue({
    query: {},
    push: pushRouterFn,
    replace: replaceRouterFn,
  });

  const { data: userData } = useSession();

  it("Should render form with error message", async () => {
    let getUrlParamsFn = jest.fn().mockImplementation(() => "next-js-13");
    (useSearchParams as jest.Mock).mockReturnValue({
      get: getUrlParamsFn,
    });

    setup(renderForm("edit", userData?.user));

    await act(() => sleep(500));

    await waitFor(() => {
      expect(
        screen.getByText(/Blog post not found or data is invalid!/i)
      ).toBeInTheDocument();
    });

    const titleInput = screen.getByRole("textbox", { name: /title/i });
    const editor = screen.getByRole("textbox", { name: /body/i });

    expect(titleInput).toHaveValue("");
    expect(editor).toHaveValue("");
  });

  it("Should edit an existing post form with inputs", async () => {
    let getUrlParamsFn = jest
      .fn()
      .mockImplementation(() => "next-js-13-release");
    (useSearchParams as jest.Mock).mockReturnValue({
      get: getUrlParamsFn,
    });

    setup(renderForm("edit", userData?.user));

    await act(() => sleep(500));
    const formTitleEdit = screen.queryByText(/Edit blog post/i, {
      exact: true,
    });

    await waitFor(() => {
      expect(formTitleEdit).toBeInTheDocument();
    });

    const titleInput = screen.getByRole("textbox", { name: /title/i });
    //const tagsInput = screen.getByRole('textbox', { name: /topics/i })
    const editor = screen.getByRole("textbox", { name: /body/i });

    expect(titleInput).toHaveValue("Next.js 13 release");
    expect(screen.getByText(/#next.js/i)).toBeInTheDocument();
    expect(screen.getByText(/#front-end/i)).toBeInTheDocument();
    expect(editor).toHaveTextContent(
      /Next. js v13 was released by Vercel at the Next. js conference in October 2022, bringing many new features and improvements./i
    );
  });

  it.todo("Should submit new post form with inputs");
});
