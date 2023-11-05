import { getServerSession } from "next-auth";
import PostForm from "./Form";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

type PageProps = {
  params: {
    crud: string;
  };
  searchParams: {
    column: string | undefined;
  };
};

export default async function PostFormPage({
  params,
  searchParams,
}: PageProps) {
  const { crud } = params;
  const tableColumn = searchParams?.column || "TO_DO";
  const session = await getServerSession(authOptions);

  return (
    <>
      <PostForm
        crud={crud}
        tableColumn={tableColumn}
        currentUser={session?.user}
      />
    </>
  );
}
