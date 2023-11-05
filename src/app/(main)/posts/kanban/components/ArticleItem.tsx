import Link from "next/link";
import { DragEvent, useRef, useState } from "react";
import { HeroIcon, UserAvatar } from "@/components/CoreComponents";
import { OptsIcon } from "@/components/Icons";
import { UserPost } from "@/models/Post";
import Modal from "@/components/Modal";
import useModalShow from "@/hooks/useModalShow";
import { useRouter } from "next/navigation";

interface ColumnItemProps {
  article: UserPost;
  columnType: string;
  handleDragging?: (dragging: boolean) => void;
}

export default function ColumnItem({ article, columnType }: ColumnItemProps) {
  const { setShow, show, onHide } = useModalShow();
  const [showSubSection, setShowSubSection] = useState(false);
  const router = useRouter();
  const articleRef = useRef(null);

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.add("dragging");
    let data = {
      articleId: event.currentTarget.dataset.articleId as string,
      columnType: columnType,
    };
    event.dataTransfer.setData("text/plain", JSON.stringify(data));
  };

  const handleDragEnd = (event: DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove("dragging");
  };

  function handleShowOpts(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setShow(true);
  }

  const deleteArticle = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts`, {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    router.replace(`/posts/kanban?d=${id}&c=${columnType}`);
  };

  return (
    <>
      <Modal
        isOpen={show}
        onClose={onHide}
        title={"Kanban article options"}
        type="WARN"
        style={`bg-white dark:bg-slate-600 dark:text-slate-100 w-[20rem] sm:w-[24rem] min-h-[6rem] border border-gray-400 rounded-lg flex flex-col mx-auto opacity-100 left-1/2 top-[50vh] -translate-x-1/2 -translate-y-1/2`}
      >
        <div
          className="flex items-center cursor-pointer w-full h-12 px-5 py-3 bg-solitude hover:bg-indigo-100 rounded-lg mt-2"
          id="article-archival"
        >
          <HeroIcon name="hero-archive-box" classNames="text-gray-700" />
          <div className="flex ml-5 text-sm">Archive article</div>
        </div>

        <div className="bg-solitude rounded-lg mt-2">
          <div
            className="flex items-center cursor-pointer w-full h-12 px-5 py-3 bg-solitude hover:bg-indigo-100 rounded-lg"
            onClick={() => setShowSubSection((show) => !show)}
          >
            <HeroIcon name="hero-chevron-down" classNames="text-gray-700" />
            <div className="flex ml-6 text-secondary text-sm">
              Article deletion
            </div>
          </div>

          <div
            className={`${
              showSubSection ? "block" : "hidden"
            } flex flex-col gap-y-2 my-2`}
          >
            <p className="mx-auto font-light text-gray-600 dark:text-inherit pb-4 text-sm text-center">
              Sure you want to delete the article{" "}
              <span className="font-semibold">{article.title}</span>?
            </p>
            <div
              id="article-deletion"
              className="flex items-center cursor-pointer w-full h-12 px-5 py-3 bg-solitude alert-danger rounded-lg"
              onClick={() => deleteArticle(article!.id)}
            >
              <HeroIcon name="hero-trash" />
              <div className="flex ml-6 text-secondary text-sm">
                Delete article
              </div>
            </div>
          </div>
        </div>

        <Link
          id={`edit-article-${article.id}`}
          href={`/posts/edit?slug=${article?.slug}`}
          className="flex items-center cursor-pointer w-full h-12 px-5 py-3 bg-solitude hover:bg-indigo-100 rounded-lg mt-2"
        >
          <HeroIcon name="hero-pencil-square" classNames="text-gray-700" />
          <div className="flex ml-6 text-secondary text-sm">Edit article</div>
        </Link>
      </Modal>

      <div
        ref={articleRef}
        key={`board-article-${article.id}`}
        id={`board-article-${article.id}`}
        data-article-id={article.id}
        className="relative flex flex-col board-article rounded-lg bg-white my-2 text-sm"
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {article.tags?.length ? (
          <div
            className="flex flex-row items-center flex-wrap px-2 py-1"
            id={`article-tags-${article.id}`}
          >
            {article.tags?.map((tag) => (
              <Link
                key={`kanban-article-tag-${tag.id}`}
                id={`kanban-article-tag-${tag.id}`}
                className="flex mt-1 mr-2 relative"
                href={`/posts/tags/${tag.name}`}
              >
                <div
                  className={
                    "flex items-center align-middle cursor-pointer text-center rounded-xl h-5 px-3 text-xs text-slate-600 z-30 border border-gray-100 hover:bg-solitude"
                  }
                >
                  #{tag.name}
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        <Link href={`/posts/post/${article.slug}`} className="">
          <h3 className="flex text-base font-semibold p-2">{article.title}</h3>
        </Link>

        <div className="options-button absolute top-1 right-1 cursor-pointer rounded-lg bg-gray-200 invisible text-gray-500">
          <div className="relative" onClick={handleShowOpts}>
            <OptsIcon />
          </div>
        </div>

        {/* {<div
          id={`post-body-${article.id}`}
          className="m-2 rounded-md text-sm text-justify font-light line-clamp-3"
        >
          <div dangerouslySetInnerHTML={{ __html: article?.body || "" }} />
        </div>} */}

        <hr className="border-slate-100 dark:border-slate-500" />

        <div className="flex flex-row justify-between border rounded-bl-lg rounded-br-lg border-white p-1 bg-[#f4f8ff]">
          <UserAvatar
            link={`/user/${article?.author.username}`}
            src={(article?.author?.avatarUrl as string) || ""}
            linkClass={"w-6 h-6 md:w-8 md:h-8"}
          />
        </div>
      </div>
    </>
  );
}
