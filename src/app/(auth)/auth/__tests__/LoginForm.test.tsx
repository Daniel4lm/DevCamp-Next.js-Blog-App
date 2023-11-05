/* eslint-disable testing-library/await-async-events */
import { ReactElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import LoginForm from "@/app/(auth)/auth/login/Form";
import { useRouter, useSearchParams } from "next/navigation";

function setup(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function renderLoginForm() {
  return <LoginForm />;
}

function getSubmitBtn() {
  return screen.getByRole("button", { name: /Login/i });
}

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

//jest.mock("next-auth/react");

const pushRouterFn = jest.fn();
const getUrlParamsFn = jest.fn();

describe("Login form", () => {
  (useRouter as jest.Mock).mockReturnValue({
    push: pushRouterFn,
  });

  (useSearchParams as jest.Mock).mockReturnValue({
    get: getUrlParamsFn,
  });

  it.todo("should render login page");
  // , async () => {
  //     render(await LoginPage())
  //     expect(true).toBeTruthy()
  // })

  it("should render login form with disabled submit button", async () => {
    const { user } = setup(renderLoginForm());

    const formTitle = screen.getByText(/Log in to InstaCamp/i, { exact: true });
    await waitFor(() => {
      expect(formTitle).toBeInTheDocument();
    });

    expect(getUrlParamsFn).toHaveBeenCalledWith("callbackUrl");

    const submitBtn = getSubmitBtn();
    user.click(submitBtn);
    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });
  });

  it("should render form with errors", async () => {
    const { user } = setup(renderLoginForm());

    const usernameInput = screen.getByRole("textbox", { name: /username/i });
    await user.click(usernameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText("Username can't be blank!")).toBeInTheDocument();
    });

    await user.type(usernameInput, "Dan{enter}");
    await waitFor(() => {
      expect(
        screen.getByText("Username must be 4 or more characters long!")
      ).toBeInTheDocument();
    });

    const passwordInput = screen.getByLabelText("Password");
    await user.type(passwordInput, "4444{enter}");
    await waitFor(() => {
      expect(
        screen.getByText("Password must be 6 or more characters long!")
      ).toBeInTheDocument();
    });

    const passwordHide = screen.getByTestId("user-registration-show-password");
    await user.click(passwordHide);
    expect(passwordInput).toHaveAttribute("type", "text");

    const submitBtn = getSubmitBtn();
    user.click(submitBtn);
    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });
  });

  it("should render login form with enabled submit button", async () => {
    const { user } = setup(renderLoginForm());

    const usernameInput = screen.getByRole("textbox", { name: /username/i });
    await user.type(usernameInput, "Daniel");
    await user.tab();
    await waitFor(() => {
      expect(
        screen.queryByText("Title can't be blank!")
      ).not.toBeInTheDocument();
    });

    const passwordInput = screen.getByLabelText("Password");
    await user.type(passwordInput, "4444333dz_t");
    await user.tab();
    await waitFor(() => {
      expect(
        screen.queryByText("Password must be 8 or more characters long!")
      ).not.toBeInTheDocument();
    });

    const submitBtn = getSubmitBtn();
    await waitFor(() => {
      expect(submitBtn).toBeEnabled();
    });

    await user.click(submitBtn);

    //expect(screen.getByText("Processing...")).toBeInTheDocument();

    await waitFor(() => {
      expect(pushRouterFn).toHaveBeenCalledTimes(1);
    });
  });
});
