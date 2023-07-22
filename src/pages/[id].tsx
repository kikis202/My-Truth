import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";
import { LoadingPage, LoadingPost } from "~/components/loading";
import { PostView } from "~/components/postView";
import { PageLayout } from "~/components/layout";
import Image from "next/image";
import { generateSSHelper } from "~/server/helpers/ssgHelper";
import { Fragment, useCallback, useRef } from "react";

const ProfileFeed = (props: { userId: string }) => {
  const {
    isLoading: postsLoading,
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = api.posts.getInfinite.useInfiniteQuery(
    {
      limit: 10,
      authorId: props.userId,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (postsLoading) return; // don't do anything if we're loading posts
      if (observer.current) observer.current.disconnect(); // disconnect the old observer

      // create a new observer and observe the last element
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0] && entries[0].isIntersecting && hasNextPage) {
          fetchNextPage().catch(console.error);
        }
      });
      if (node) observer.current.observe(node);
    },
    [postsLoading, hasNextPage, fetchNextPage]
  );

  if (postsLoading && !data) return <LoadingPage size={40} />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data.pages.map((group, i) => (
        <Fragment key={i}>
          {group.posts.map((post, index) => {
            if (index === group.posts.length - 1) {
              // Add the ref to the last post
              return (
                <div ref={lastPostElementRef} key={post.id}>
                  <PostView {...post} />
                </div>
              );
            }

            return (
              <div key={post.id}>
                <PostView {...post} />
              </div>
            );
          })}
        </Fragment>
      ))}
      {isFetchingNextPage && <LoadingPost />}
    </div>
  );
};

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
        <div className="h-12" />
        <div className="border-b border-slate-400 p-4 pb-8 text-2xl font-bold">
          {data.name ?? "Anon"}
        </div>
        <ProfileFeed userId={id} />
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
