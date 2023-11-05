/* eslint-disable testing-library/await-async-events */
import { ReactElement } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import RegisterForm from "@/app/(auth)/auth/register/Form";

function setup(jsx: ReactElement) {
  return {
    user: userEvent.setup(),
    ...render(jsx),
  };
}

function renderRegisterForm() {
  return <RegisterForm />;
}

function getSubmitBtn() {
  return screen.getByRole("button", { name: /Sign up/i });
}

describe("Register Form", () => {
  it("should render register form with disabled submit button", async () => {
    const { user } = setup(renderRegisterForm());

    const formTitle = screen.getByText(
      /Sign up to InstaCamp and share materials with your friends/i,
      { exact: true }
    );
    await waitFor(() => {
      expect(formTitle).toBeInTheDocument();
    });

    const submitBtn = getSubmitBtn();
    user.click(submitBtn);
    await waitFor(() => {
      expect(submitBtn).toBeDisabled();
    });
  });

  it("should render form with errors", async () => {
    const { user } = setup(renderRegisterForm());

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    await user.click(emailInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText("Email can't be blank!")).toBeInTheDocument();
    });

    await user.type(emailInput, "danielgmail.com{enter}");
    await waitFor(() => {
      expect(screen.getByText("Email is invalid")).toBeInTheDocument();
    });

    const fullNameInput = screen.getByRole("textbox", { name: /Full Name/i });
    await user.type(fullNameInput, "Dan{enter}");
    await waitFor(() => {
      expect(
        screen.getByText("Name must be 4 or more characters long!")
      ).toBeInTheDocument();
    });

    const usernameInput = screen.getByRole("textbox", { name: /username/i });
    await user.type(usernameInput, "dan");
    await user.tab();
    await waitFor(() => {
      expect(
        screen.getByText("Username must be 4 or more characters long!")
      ).toBeInTheDocument();
    });
    await user.type(usernameInput, "daniel*/4mx");
    await user.tab();
    await waitFor(() => {
      expect(
        screen.getByText(
          "Username must contain only letters, numbers and underscore (_)"
        )
      ).toBeInTheDocument();
    });

    const passwordInput = screen.getByLabelText("Password");
    await user.type(passwordInput, "4444");
    await user.tab();
    await waitFor(() => {
      expect(
        screen.getByText("Password must be 8 or more characters long!")
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

  it("should render register form with enabled submit button", async () => {
    const { user } = setup(renderRegisterForm());

    const emailInput = screen.getByRole("textbox", { name: /email/i });
    await user.type(emailInput, "daniel@gmail.com");
    await user.tab();
    await waitFor(() => {
      expect(screen.queryByText("Email is invalid")).not.toBeInTheDocument();
    });

    const fullNameInput = screen.getByRole("textbox", { name: /Full Name/i });
    await user.type(fullNameInput, "Daniel");
    await user.tab();
    await waitFor(() => {
      expect(
        screen.queryByText("Name must be 4 or more characters long!")
      ).not.toBeInTheDocument();
    });

    const usernameInput = screen.getByRole("textbox", { name: /username/i });
    await user.type(usernameInput, "daniel4mx");
    await user.tab();
    await waitFor(() => {
      expect(
        screen.queryByText(
          "Username must contain only letters, numbers and underscore (_)"
        )
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

    // await waitFor(() => {
    //   screen.getByText("Processing...");
    // });
    //expect(screen.getByText('Processing...')).toBeInTheDocument()

    await waitFor(() => {
      screen.getByText("Welcome Daniel. Your account is created successfully!");
    });
  });
});
