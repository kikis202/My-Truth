import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { PostView } from "~/components/postView";
import { generateSSHelper } from "~/server/helpers/ssgHelper";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.posts.getById.useQuery({ id });

  if (!data) {
    return (
      <>
        <Head>
          <title>Post</title>
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
        <title>Post</title>
      </Head>
      <main className="flex h-screen items-center justify-center">
        <div className="h-fit w-full border border-slate-400 md:max-w-2xl">
          <PostView {...data} />
        </div>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = generateSSHelper();

  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no id");

  await helpers.posts.getById.prefetch({ id });

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

export default SinglePostPage;
