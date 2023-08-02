import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { generateSSHelper } from "~/server/helpers/ssgHelper";
import { Feed } from "~/components/feed";

const ProfilePage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.profile.getUserById.useQuery({ id });

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
        <title>{data.name ?? "Anon"} Profile</title>
      </Head>
      <PageLayout>
        <div className="relative flex h-32 border-b border-slate-400 bg-cyan-900 p-4">
          {data.image && (
            <Image
              src={data.image}
              alt={`${data.name ?? "Anon"} Profile Image`}
              className="absolute bottom-0 left-0 -mb-12 ml-6 h-24 w-24 rounded-full border-2 border-gray-900 bg-gray-900"
              width={96}
              height={96}
            />
          )}
        </div>
        <div className="h-12 bg-gray-900" />
        <div className="border-b border-slate-400 bg-gray-900 p-4 pb-8 text-2xl font-bold">
          {data.name ?? "Anon"}
        </div>
        <Feed userId={id} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const helpers = generateSSHelper();

  const id = ctx.params?.id;

  if (typeof id !== "string") throw new Error("no slug");

  await helpers.profile.getUserById.prefetch({ id });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
