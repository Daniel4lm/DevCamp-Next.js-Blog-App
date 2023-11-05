"use client";

import { useState } from "react";
import { HidePassIcon, ShowPassIcon } from "@/components/Icons";
import { SignupType } from "@/models/AuthTypes";
import { object, z } from "zod";
import { Field, Form, Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";

const INITIAL_STATE: SignupType = {
  email: "",
  fullName: "",
  username: "",
  location: "",
  password: "",
};

function UserSignupForm() {
  const [passwordToggle, setPasswordToggle] = useState(false);
  const [errMsg, setErrMsg] = useState<string | null>("");
  const [successMsg, setSuccess] = useState<string | null>(null);

  const RegisterValidationSchema = object({
    email: z
      .string({ required_error: "Email can't be blank!" })
      .trim()
      .email("Email is invalid"),
    fullName: z
      .string({ required_error: "Name can't be blank!" })
      .trim()
      .min(4, { message: "Name must be 4 or more characters long!" }),
    username: z
      .string({ required_error: "Username can't be blank!" })
      .trim()
      .toLowerCase()
      .min(4, { message: "Username must be 4 or more characters long!" })
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username must contain only letters, numbers and underscore (_)"
      ),
    location: z
      .string()
      .trim()
      .min(3, { message: "Location must contain least 3 characters!" })
      .optional(),
    password: z
      .string()
      .min(6, { message: "Password must be 8 or more characters long!" }),
  });

  const togglePassword = () => setPasswordToggle((passVisible) => !passVisible);

  return (
    <>
      <Formik
        initialValues={INITIAL_STATE}
        validationSchema={toFormikValidationSchema(RegisterValidationSchema)}
        onSubmit={async (values) => {
          setErrMsg(null);

          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/register`,
              {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            const data = await response.json();

            if (!response.ok) {
              //setErrMsg(data?.error || data?.message)
              setErrMsg(`Registration error: Internal Server Error`);
              return;
            }

            setErrMsg(null);
            setSuccess(
              `Welcome ${data.user.fullName}. Your account is created successfully!`
            );
          } catch (err: any) {
            setSuccess(null);
            setErrMsg(`Registration error: ${err.message}`);
          }
        }}
      >
        {({ values, errors, touched, isValid, isSubmitting }) => (
          <Form
            id="user-sign-up-form"
            className="flex flex-col space-y-4 w-full md:px-6 text-sm md:text-base"
          >
            <div className="md:p-4">
              <h1 className="my-4 text-xl md:text-2xl font-medium text-center">
                Sign up to InstaCamp and share materials with your friends
              </h1>
              <div
                className={
                  errMsg
                    ? "w-full alert alert-danger p-4 my-4 rounded-sm text-center"
                    : "hidden"
                }
                aria-live="assertive"
              >
                {errMsg}
              </div>
              <div
                className={
                  successMsg
                    ? "w-full alert alert-info p-4 my-4 rounded-sm text-center"
                    : "hidden"
                }
                aria-live="assertive"
              >
                {successMsg}
              </div>
              <div className="flex flex-col py-2">
                <label htmlFor="email" className="mb-1">
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby="uidnote"
                  className={
                    "rounded p-2 border border-gray-300 dark:bg-slate-600 dark:text-slate-100 dark:border-slate-400 shadow-sm text-sm md:text-base focus:ring-2 focus:ring-indigo-500 dark:focus:border-transparent dark:focus:ring-blue-400 focus:ring-opacity-90 focus:border-transparent"
                  }
                />
                {touched.email && errors.email ? (
                  <span key={`${errors.email}`} className="invalid-feedback">
                    {errors.email}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-col py-2">
                <label htmlFor="fullName" className="mb-1">
                  Full Name
                </label>
                <Field
                  id="fullName"
                  name="fullName"
                  type="text"
                  aria-invalid={errors.fullName ? "true" : "false"}
                  aria-describedby="uidnote"
                  className={
                    "rounded p-2 border border-gray-300 dark:bg-slate-600 dark:text-slate-100 dark:border-slate-400 shadow-sm text-sm md:text-base focus:ring-2 focus:ring-indigo-500 dark:focus:border-transparent dark:focus:ring-blue-400 focus:ring-opacity-90 focus:border-transparent"
                  }
                />
                {touched.fullName && errors.fullName ? (
                  <span key={`${errors.fullName}`} className="invalid-feedback">
                    {errors.fullName}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-col py-2">
                <label htmlFor="username" className="mb-1">
                  Username
                </label>
                <Field
                  id="username"
                  name="username"
                  type="text"
                  aria-invalid={errors.username ? "true" : "false"}
                  aria-describedby="uidnote"
                  className={
                    "rounded p-2 border border-gray-300 dark:bg-slate-600 dark:text-slate-100 dark:border-slate-400 shadow-sm text-sm md:text-base focus:ring-2 focus:ring-indigo-500 dark:focus:border-transparent dark:focus:ring-blue-400 focus:ring-opacity-90 focus:border-transparent"
                  }
                />
                {touched.username && errors.username ? (
                  <span key={`${errors.username}`} className="invalid-feedback">
                    {errors.username}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-col py-2">
                <label htmlFor="location" className="mb-1">
                  Location
                </label>
                <Field
                  id="location"
                  name="location"
                  type="text"
                  aria-invalid={errors.location ? "true" : "false"}
                  aria-describedby="uidnote"
                  className={
                    "rounded p-2 border border-gray-300 dark:bg-slate-600 dark:text-slate-100 dark:border-slate-400 shadow-sm text-sm md:text-base focus:ring-2 focus:ring-indigo-500 dark:focus:border-transparent dark:focus:ring-blue-400 focus:ring-opacity-90 focus:border-transparent"
                  }
                />
              </div>

              <div className="flex flex-col py-2">
                <label htmlFor="password" className="mb-1">
                  Password
                </label>
                <div className="relative w-full">
                  <Field
                    id="password"
                    name="password"
                    aria-invalid={errors.password ? "true" : "false"}
                    aria-describedby="pwdnote"
                    type={passwordToggle ? "text" : "password"}
                    className={
                      "w-full rounded p-2 border border-gray-300 dark:bg-slate-600 dark:text-slate-100 dark:border-slate-400 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:border-transparent dark:focus:ring-blue-400 focus:ring-opacity-90 focus:border-transparent"
                    }
                  />
                  <div
                    className="absolute w-5 h-max top-1/2 right-2 -translate-y-1/2 text-gray-400 cursor-pointer"
                    id="user-registration-show-password"
                    data-testid="user-registration-show-password"
                    onClick={togglePassword}
                  >
                    {passwordToggle ? <HidePassIcon /> : <ShowPassIcon />}
                  </div>
                </div>
                {touched.password && errors.password ? (
                  <span key={`${errors.password}`} className="invalid-feedback">
                    {errors.password}
                  </span>
                ) : null}
              </div>

              <div className="py-6">
                <button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className={
                    "block px-8 w-full py-2 xs:w-max border-none shadow rounded-full font-semibold text-gray-50 hover:bg-indigo-500 bg-indigo-400 cursor-pointer"
                  }
                >
                  {isSubmitting ? "Processing..." : "Sign up"}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default UserSignupForm;
