import Head from "next/head";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

const ProfilePage = () => {
  const { user } = useUser();

  if (!user) {
    return (
      <>
        <Head>
          <title>Profile</title>
        </Head>
        <main className="flex h-screen justify-center">
          <div>404</div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{user.username} Profile</title>
      </Head>
      <PageLayout>
        <div className="relative flex h-32 border-b border-slate-400 bg-cyan-900 p-4">
          <Image
            src={user.profileImageUrl}
            alt={`${
              user.username || user.firstName || "Anonymous"
            } Profile Image`}
            className="absolute bottom-0 left-0 -mb-12 ml-6 h-24 w-24 rounded-full border-2 border-gray-900 bg-gray-900"
            width={96}
            height={96}
          />
        </div>
        <div className="h-12" />
        <div className="border-b border-slate-400 p-4 pb-8 text-2xl font-bold">
          {user.username || user.firstName || "Anonymous"}
        </div>
      </PageLayout>
    </>
  );
};

export default ProfilePage;
