import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { LoadingPage } from "~/components/loading";
import { PostView } from "~/components/postView";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { generateSSHelper } from "~/server/helpers/ssgHelper";

const ProfileFeed = (props: { userId: string }) => {
  const { data, isLoading } = api.posts.getPostsByUserId.useQuery({
    id: props.userId,
  });
  if (isLoading) return <LoadingPage size={40} />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
};

const ProfilePage: NextPage<{ slug: string }> = ({ slug }) => {
  const { data } = api.profile.getUserById.useQuery({ id: slug });

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
        <title>{data.username} Profile</title>
      </Head>
      <PageLayout>
        <div className="relative flex h-32 border-b border-slate-400 bg-cyan-900 p-4">
          <Image
            src={data.profileImageUrl}
            alt={`${data.username} Profile Image`}
            className="absolute bottom-0 left-0 -mb-12 ml-6 h-24 w-24 rounded-full border-2 border-gray-900 bg-gray-900"
            width={96}
            height={96}
          />
        </div>
        <div className="h-12" />
        <div className="border-b border-slate-400 p-4 pb-8 text-2xl font-bold">
          {data.username}
        </div>
        <ProfileFeed userId={slug} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const helpers = generateSSHelper();

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  await helpers.profile.getUserById.prefetch({ id: slug });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      slug,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
