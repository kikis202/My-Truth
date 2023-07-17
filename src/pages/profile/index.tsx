import Head from "next/head";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { useSession } from "next-auth/react";

const ProfilePage = () => {
  const { data } = useSession();

  if (!data) {
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
        <title>{data.user.name ?? "Anon"} Profile</title>
      </Head>
      <PageLayout>
        <div className="relative flex h-32 border-b border-slate-400 bg-cyan-900 p-4">
          {data.user.image && (
            <Image
              src={data.user.image}
              alt={`${data.user.name ?? "Anon"} Profile Image`}
              className="absolute bottom-0 left-0 -mb-12 ml-6 h-24 w-24 rounded-full border-2 border-gray-900 bg-gray-900"
              width={96}
              height={96}
            />
          )}
        </div>
        <div className="h-12" />
        <div className="border-b border-slate-400 p-4 pb-8 text-2xl font-bold">
          {data.user.name ?? "Anon"}
        </div>
      </PageLayout>
    </>
  );
};

export default ProfilePage;
