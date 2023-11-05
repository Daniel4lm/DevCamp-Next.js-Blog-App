import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import PostTask from "@/lib/posts";
import { getServerSession } from "next-auth";
import KanbanBoard from "./KanbanBoard";
import { ArticleBoardColumn } from "@prisma/client";
import { notFound } from "next/navigation";
import UserTask from "@/lib/user";
import { User } from "@/models/User";

export default async function Page() {
  const session = await getServerSession(authOptions);

  let boardColumns: ArticleBoardColumn[] = [];
  let user: User | undefined;

  try {
    boardColumns = await PostTask.getAllArticlesGroupedInColumns(
      session?.user.id || ""
    );

    user = (await UserTask.getUser({
      username: session?.user.username,
    })) as User;
  } catch (error: any) {
    console.error(error.message);
  }

  if (!user || !boardColumns.length) return notFound();

  return (
    <div className="flex flex-col shrink w-full h-screen p-4">
      <KanbanBoard columns={boardColumns} currentUser={user} />
    </div>
  );
}
