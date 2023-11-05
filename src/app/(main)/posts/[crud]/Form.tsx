"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { User as SessionUser } from "next-auth";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useFormik } from "formik";
import { object, z } from "zod";
import { UserPost } from "@/models/Post";
import MultiTagSelect from "@/components/forms/MultiTagSelect";
import { createSlug, postReadingTime } from "@/lib/helperFunctions";
import UploadImageContainer from "./ImageContainer";
import { CloseIcon } from "@/components/Icons";
import PostFormSkeleton from "@/components/skeletons/PostFormSkeleton";
import { useCreatePostMutation, usePostQuery } from "@/hooks/api";
import TextEditorSkeleton from "@/components/skeletons/TextEditorSkeleton";
import { HeroIcon } from "@/components/CoreComponents";

const TinyMceEditor = dynamic(
  () => import("@/components/forms/TinyMceEditor"),
  {
    ssr: false,
    loading: () => <TextEditorSkeleton />,
  }
);

type FormProps = {
  title: string;
  tags?: string[] | [];
  body: string;
  postImage?: File;
  publish: boolean;
};

const FormValues: FormProps = {
  title: "",
  tags: [],
  body: "",
  postImage: undefined,
  publish: false,
};

async function createOrUpdatePost({
  formData,
  methodType,
}: {
  formData: FormData;
  methodType: "POST" | "PUT";
}) {
  console.log("request...", formData, methodType);

  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts`, {
    method: methodType,
    body: formData,
    // headers: {
    //   "Content-Type": "multipart/form-data",
    // },
  });
  console.log("request resp...", await res.json());
  return await res.json();
}

function PostForm({
  crud,
  tableColumn,
  currentUser,
}: {
  crud: string;
  tableColumn: string;
  currentUser: SessionUser | undefined;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postSlug = searchParams.get("slug") || "";
  const queryClient = useQueryClient();
  const fetchRun = useRef(false);

  const doWeFetchData = crud === "edit" && fetchRun.current === false;

  const {
    data: editData,
    isLoading,
    isFetching,
  } = usePostQuery(postSlug, doWeFetchData);

  const [submitType, setSubmitType] = useState<"publish" | "draft" | null>();
  const [errMsg, setErrMsg] = useState<string | null>("");
  const [postImage, setPostImage] = useState<File>();
  const [showImage, setShowImage] = useState<string>();
  const [validFormat, setValidFormat] = useState<boolean>(true);
  const [fileDrag, setFileDrag] = useState(false);

  const AccountValidationSchema = object({
    title: z
      .string({ required_error: "Title can't be blank!" })
      .trim()
      .min(10, { message: "Title must be 10 or more characters long!" }),
    body: z
      .string({ required_error: "Content can't be blank!" })
      .trim()
      .min(20, { message: "Content too short!" }),
    postImage: z.any().optional(),
  }).refine(
    (data) => {
      if (postImage && checkFileFormat(postImage)) return true;
    },
    { message: "Only .png, .jpg and .jpeg format allowed!" }
  );

  const formikForm = useFormik({
    initialValues: FormValues,
    validationSchema: toFormikValidationSchema(AccountValidationSchema),
    onSubmit: submitForm,
  });

  const { mutate: addPostMutation } = useCreatePostMutation();

  useEffect(() => {
    async function fetchPost() {
      if (!editData && !isFetching) {
        setErrMsg("Blog post not found or data is invalid!");
        return;
      }

      if (editData) {
        await formikForm.setValues({
          title: editData.title,
          body: editData.body,
          tags: editData.tags?.map((tag) => tag.name) || [],
          publish: editData.published,
        });
      }

      setShowImage(editData?.photo_url || "");
    }

    if (crud === "edit" && !isFetching) {
      fetchPost();
    }

    return () => {
      fetchRun.current = true;
    };
  }, [crud, postSlug, editData, isFetching]);

  if (!["new", "edit"].includes(crud) || (crud === "edit" && !postSlug)) {
    return notFound();
  }

  async function saveDraft() {
    const validation = await formikForm.validateForm(formikForm.values);

    if (Object.keys(validation).length) {
      return;
    }

    formikForm.setSubmitting(true);
    setSubmitType("draft");
    handleFormSubmit({ ...formikForm.values, publish: false });
  }

  function submitForm(values: FormProps) {
    setSubmitType("publish");
    handleFormSubmit({ ...values, publish: true });
  }

  function handleFormSubmit(values: FormProps) {
    setErrMsg(null);

    const formData = new FormData();
    if (postImage) formData.append("photoUrl", postImage);
    formData.append("title", values.title);
    formData.append("body", values.body);
    formData.append("tags", (values.tags || "").toString());
    formData.append("published", values.publish.toString());
    formData.append("readTime", postReadingTime(values.body).toString());

    if (crud === "new") {
      formData.append("slug", createSlug(values.title));
      formData.append("userEmail", currentUser?.email || "");
      formData.append("boardColumn", tableColumn);
    } else if (crud === "edit") {
      formData.append("slug", postSlug || "");
    }

    try {
      const methodType = crud === "new" ? "POST" : "PUT";

      addPostMutation(
        {
          formData: formData,
          methodType: methodType,
        },
        {
          onSuccess: (postJson, { methodType }) => {
            if (
              (methodType === "POST" && !postJson?.newPost) ||
              (methodType === "PUT" && !postJson?.updatedPost)
            ) {
              if (postJson?.error) {
                setErrMsg(postJson.error);
              } else {
                setErrMsg("Something went wrong, check your console.");
              }
              formikForm.setSubmitting(false);
              setSubmitType(null);
              return;
            }

            const postArticle: UserPost =
              postJson?.newPost || postJson?.updatedPost;
            if (postJson?.newPost) {
              queryClient.setQueryData(
                ["posts", postArticle.authorId],
                postArticle
              );
            }
            formikForm.setSubmitting(false);
            setSubmitType(null);

            router.replace(`/user/${postArticle?.author.username}`);
          },
          onError: (response) => {
            console.error("Failed to create post: ", response);
            formikForm.setSubmitting(false);
            setSubmitType(null);
            return;
          },
        }
      );
    } catch (err) {
      formikForm.setSubmitting(false);
      setSubmitType(null);
      console.error(err);
    }
  }

  const onBodyChange = (value: string) => {
    formikForm.setFieldValue("body", value);
  };

  const handleValidation = (field: string) => {
    formikForm.setFieldTouched(field, true);
  };

  const handleTags = (tags: string[]) => {
    formikForm.setFieldValue("tags", tags);
  };

  const handleDrag = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === "dragenter" || event.type === "dragover") {
      setFileDrag(true);
    } else if (event.type === "dragleave") {
      setFileDrag(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setFileDrag(false);

    const file = event.dataTransfer?.files && event.dataTransfer?.files[0];

    if (file && checkFileFormat(file)) {
      setPostImage(file);
    }
  };

  const checkFileFormat = (file: File) => {
    if (file) {
      if (
        ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(
          file?.type
        )
      ) {
        setValidFormat(true);
        return true;
      } else {
        setErrMsg("Only .png, .jpg and .jpeg format allowed!");
        setValidFormat(false);
        return false;
      }
    }
  };

  const cancelImageUpload = () => {
    setPostImage(undefined);
    setValidFormat(true);
    setErrMsg(null);
  };

  const onImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event?.target.files && event?.target.files[0];
    if (file && checkFileFormat(file)) {
      setPostImage(file);
    }
    // purge input target value to allow upload same file twice
    event.target.value = "";
  };

  return (
    <section
      id="post-page"
      className="w-full md:w-3/4 lg:w-2/3 2xl:w-2/4 flex flex-col mx-auto mb-4"
    >
      <div
        className={
          errMsg
            ? "w-auto alert alert-danger !bg-white dark:!bg-[#f05961] p-4 mx-2 sm:mx-0 my-4 rounded-lg text-center flex justify-between gap-x-2"
            : "hidden"
        }
        aria-live="assertive"
      >
        {errMsg}
        <div id="remove-message" onClick={cancelImageUpload}>
          <CloseIcon />
        </div>
      </div>

      {crud === "edit" && isLoading ? (
        <PostFormSkeleton />
      ) : (
        <form
          id="post-form"
          onSubmit={formikForm.handleSubmit}
          className="relative w-full py-4 md:py-8 space-y-4 md:space-y-8 rounded-lg bg-white dark:bg-navbar-dark dark:text-slate-100 border-t border-b md:border border-gray-200 dark:border-0 shadow-md shadow-slate-200 dark:shadow-none"
        >
          <h2 className="w-full xl:w-11/12 px-4 mx-auto text-xl md:text-2xl">
            {crud === "new" ? "New blog post" : "Edit blog post"}
          </h2>

          <hr className="mb-1 dark:border-slate-500" />

          <div className="flex items-center flex-col px-4">
            <div
              id="drag-drop-container"
              className={`w-full xl:w-11/12 border-2 ${
                fileDrag
                  ? "border-indigo-500 border-dashed"
                  : "border-gray-250 dark:border-slate-400"
              } rounded-xl mx-auto mb-4 py-4 px-4 text-center flex flex-col justify-center items-center min-h-[220px]`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <UploadImageContainer
                uploadImage={postImage}
                valid={validFormat}
                cancelUpload={cancelImageUpload}
              />
              {crud === "edit" && !postImage?.name ? (
                <label
                  htmlFor="post-upload-image"
                  className="flex cursor-pointer justify-center"
                >
                  {showImage && (
                    <div
                      id="post-image"
                      className={`min-w-[8rem] h-[10rem] mx-auto bg-white rounded-md border overflow-hidden p-1 while-submitting-form`}
                    >
                      <Image
                        alt="Blog Upload Photo"
                        src={showImage}
                        width={600}
                        height={400}
                        loading="eager"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                          borderRadius: "0.5rem",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </div>
                  )}
                </label>
              ) : null}
              <input
                id="post-upload-image"
                data-testid="post-upload-image"
                hidden
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={onImageUpload}
                className="file:bg-violet-50 file:text-violet-500 hover:file:bg-violet-100 file:rounded-lg file:rounded-tr-none file:rounded-br-none file:px-4 file:py-2 file:mr-4 file:border-none hover:cursor-pointer border rounded-lg text-gray-400"
              />
            </div>
          </div>

          <div className="flex items-center flex-col text-sm md:text-base">
            <label
              htmlFor="title"
              className="w-full xl:w-11/12 px-4 mb-1 font-semibold"
            >
              Title
            </label>
            <div className="relative w-full xl:w-11/12 px-4">
              <input
                id="title"
                name="title"
                type="text"
                aria-invalid={formikForm.errors.title ? "true" : "false"}
                aria-describedby="uidnote"
                className={
                  "w-full text-sm md:text-base duration-500 border rounded-md border-[#5C5C5CB2] dark:bg-[#4a5469] dark:text-slate-100 dark:border-slate-400 p-3 text-semibold focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-90 focus:border-transparent dark:focus:border-transparent dark:focus:ring-blue-400"
                }
                onChange={formikForm.handleChange}
                onBlur={formikForm.handleBlur}
                value={formikForm.values.title}
              />
              {formikForm.touched.title && formikForm.errors.title ? (
                <div
                  key={`${formikForm.errors.title}`}
                  className="flex items-center gap-2 leading-6"
                >
                  <HeroIcon
                    name="hero-exclamation-circle"
                    classNames="invalid-feedback"
                  />
                  <span id="title-warn" className="invalid-feedback">
                    {formikForm.errors.title}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-center flex-col text-sm md:text-base">
            <label
              htmlFor="tags"
              className="w-full xl:w-11/12 px-4 mb-1 font-semibold"
            >
              Topics
            </label>
            <div className="w-full xl:w-11/12 px-4">
              <MultiTagSelect
                propTags={formikForm.values.tags || []}
                handleTags={handleTags}
              />
            </div>
          </div>

          <div className="flex items-center flex-col text-sm md:text-base">
            <label
              htmlFor="body"
              className="w-full xl:w-11/12 px-4 mb-1 font-semibold"
            >
              Body
            </label>

            <div className="relative w-full xl:w-11/12 px-4">
              <TinyMceEditor
                value={formikForm.values.body}
                placeholder="Post content here..."
                name="body"
                aria-invalid={formikForm.errors.body ? "true" : "false"}
                onValueChange={onBodyChange}
                handleFieldValidation={() => handleValidation("body")}
              />

              {formikForm.touched.body && formikForm.errors.body ? (
                <div
                  key={`${formikForm.errors.body}`}
                  className="flex items-center gap-2 leading-6"
                >
                  <HeroIcon
                    name="hero-exclamation-circle"
                    classNames="invalid-feedback"
                  />
                  <span id="body-warn" className="invalid-feedback">
                    {formikForm.errors.body}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <hr />

          <div className="flex items-center flex-col mt-8">
            <div className="w-full xl:w-11/12 flex items-center gap-4 px-4">
              <button
                type="submit"
                disabled={
                  !formikForm.isValid ||
                  formikForm.isSubmitting ||
                  submitType === "draft"
                }
                className={
                  "block px-4 xs:px-5 py-1 xs:py-[6px] md:w-max border-2 border-indigo-400 bg-transparent overflow-hidden dark:bg-indigo-400/20 text-indigo-400 dark:text-indigo-200 rounded-xl font-semibold hover:text-gray-50 hover:bg-indigo-500 dark:hover:bg-indigo-500 hover:border-indigo-500 cursor-pointer duration-150"
                }
              >
                {formikForm.isSubmitting && submitType === "publish" ? (
                  <span
                    className={
                      "flex items-center transition ease-in-out duration-150 animate-[loader-show_0.25s] cursor-not-allowed w-full h-auto"
                    }
                  >
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving
                  </span>
                ) : (
                  <span>Submit</span>
                )}
              </button>

              <button
                disabled={!formikForm.isValid || submitType === "publish"}
                name="post-draft"
                type="button"
                onClick={saveDraft}
                className={
                  "block px-4 xs:px-5 py-1 xs:py-[6px] md:w-max border-2 border-indigo-400 bg-indigo-400 overflow-hidden dark:bg-indigo-400/20 text-indigo-50 dark:text-indigo-200 rounded-xl font-semibold hover:text-gray-50 hover:bg-indigo-500 dark:hover:bg-indigo-500 hover:border-indigo-500 cursor-pointer duration-150"
                }
              >
                {formikForm.isSubmitting && submitType === "draft" ? (
                  <span
                    className={
                      "flex items-center transition ease-in-out duration-150 animate-[loader-show_0.25s] cursor-not-allowed w-full h-auto"
                    }
                  >
                    <HeroIcon
                      name="hero-cog-8-tooth"
                      classNames="animate-spin -ml-1 mr-3"
                    />
                    Saving draft
                  </span>
                ) : (
                  <span>Save as draft</span>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}

export default PostForm;
