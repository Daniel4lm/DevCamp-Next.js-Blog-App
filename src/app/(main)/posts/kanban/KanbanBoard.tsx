"use client";

import { ArticleBoardColumn } from "@/models/ArticleBoard";
import { User as SessionUser } from "next-auth";
import BoardColumn from "./components/BoardColumn";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { User } from "@/models/User";

interface KanbanBoardProps {
  columns: ArticleBoardColumn[];
  //currentUser?: SessionUser | undefined;
  currentUser?: User | undefined;
}

export default function KanbanBoard({
  columns,
  currentUser,
}: KanbanBoardProps) {
  const [isDragging, setIsDragging] = useState(false);
  //const { data: session, update: updateSession } = useSession();

  const appendableColumns = columns.reduce<string[]>((acc, column) => {
    if (["TO_DO", "IN_PROGRESS"].includes(column.type)) {
      return [...acc, column.type];
    } else {
      return acc;
    }
  }, []);

  const router = useRouter();

  const handleDragging = (dragging: boolean) => setIsDragging(dragging);

  async function moveArticle(articleId: string, columnType: string) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/move-article`,
        {
          method: "POST",
          body: JSON.stringify({
            articleId: articleId,
            columnType: columnType,
          }),
        }
      );
      //const newArticleData = await response.json();
    } catch (err) {
      console.error("Failed to move article: ", err);
    }

    router.replace(
      `/posts/kanban?a=${articleId}${Math.floor(
        Math.random() * articleId.length
      )}&c=${columnType}`,
      {
        scroll: false,
      }
    );
  }

  async function handleRemoveColumnDescription(user: User, columnType: string) {
    const formData = new FormData();
    formData.append("id", user.id || "");
    formData.append("kanbanColumnsReviewed", JSON.stringify([columnType]));

    const updateProfileRes = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${user.username}/profile`,
      {
        method: "PUT",
        body: formData,
      }
    );

    //const userProfileData = await updateProfileRes.json();

    router.replace(
      `/posts/kanban?u=${user.id}${Math.floor(
        Math.random() * (user?.id || "").length
      )}&c=${columnType}`,
      {
        scroll: false,
      }
    );

    // await updateSession({
    //   ...session,
    //   user: {
    //     ...(typeof session?.user === "object" ? session?.user : {}),
    //     ...{
    //       kanbanColumnsReviewed:
    //         userProfileData.updatedProfile.kanbanColumnsReviewed,
    //     },
    //   },
    // });
  }

  return (
    <div className="flex flex-row shrink items-start h-full overflow-x-auto overflow-y-hidden gap-x-2 gap-y-2 p-2 rounded-lg">
      {columns.map((column) => (
        <BoardColumn
          key={column.id}
          column={column}
          appendableColumns={appendableColumns}
          currentUser={currentUser}
          isDragging={isDragging}
          handleDragging={handleDragging}
          handleMoveArticle={moveArticle}
          handleRemoveColumnDescription={handleRemoveColumnDescription}
        />
      ))}
    </div>
  );
}
