import { ArticleBoardColumn } from "@/models/ArticleBoard";
import ColumnItem from "./ArticleItem";
import { DragEvent } from "react";
import { HeroIcon } from "@/components/CoreComponents";
import { User } from "@/models/User";
import Link from "next/link";

interface BoardColumnProps {
  column: ArticleBoardColumn;
  appendableColumns: string[];
  //currentUser?: SessionUser | undefined;
  currentUser?: User | undefined;
  isDragging?: boolean;
  handleDragging?: (dragging: boolean) => void;
  handleMoveArticle: (id: string, type: string) => void;
  handleRemoveColumnDescription: (user: User, type: string) => void;
}

export default function BoardColumn({
  column,
  appendableColumns,
  currentUser,
  handleMoveArticle,
  handleRemoveColumnDescription,
}: BoardColumnProps) {
  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const dragEnter = (event: DragEvent<HTMLDivElement>) => {
    const columnType = event.currentTarget.dataset.columnType;
    const articleData = JSON.parse(event.dataTransfer.getData("text"));

    if (articleData.columnType === columnType) {
      return;
    }
    event.currentTarget.classList.add("drop");
  };

  const dragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.currentTarget.classList.remove("drop");
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const columnType = event.currentTarget.dataset.columnType || "";
    const articleData = JSON.parse(event.dataTransfer.getData("text"));

    event.currentTarget.classList.remove("drop");

    event.preventDefault();

    if (articleData.columnType === columnType) {
      return;
    }

    handleMoveArticle(articleData.articleId, columnType);
  };

  function removeColumnDescription() {
    if (currentUser) {
      handleRemoveColumnDescription(currentUser, column.type);
    }
  }

  return (
    <div
      key={`articleColumn-${column.id}-description`}
      id={`articleColumn-${column.id}-description`}
      data-column-type={column.type}
      className="flex flex-col article-column border-2 border-transparent shrink-0 w-80 first:mx-0 last:mx-0 bg-column rounded-md p-5 max-h-full overflow-x-visible overflow-y-auto"
      onDragEnter={dragEnter}
      onDragLeave={dragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2 className="text-gray-900 text-2xl">{column.title}</h2>

      {currentUser?.profile?.kanbanColumnsReviewed &&
      !currentUser?.profile.kanbanColumnsReviewed.includes(column.type) ? (
        <div
          className="relative articleboardcolumn-description mt-5 p-3 rounded-md border-2 border-dashed border-gray-250 text-sm text-gray-900"
          id={`articleboardcolumn-description-${column.id}`}
        >
          <div className="opacity-50 transition-opacity">
            {column.description}
          </div>

          <div
            className="absolute invisible top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow text-indigo-400 cursor-pointer articleboardcolumn-remove-button"
            onClick={removeColumnDescription}
          >
            <HeroIcon name="hero-x-mark" />
          </div>
        </div>
      ) : null}

      <div
        className="flex flex-col mt-5"
        id={`articles-list-${column.id}`}
        data-column-id={column.id}
      >
        {column.posts?.map((article) => (
          <ColumnItem
            key={article.id}
            article={article}
            columnType={column.type}
          />
        ))}
      </div>

      {appendableColumns.includes(column.type) ? (
        <Link
          className="inline-block mt-5 w-max"
          href={`/posts/new?column=${column.type}`}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white hover:bg-indigo-100 hover:text-indigo-600 text-indigo-400 cursor-pointer">
            <HeroIcon name="hero-plus" />
          </div>
        </Link>
      ) : null}
    </div>
  );
}
