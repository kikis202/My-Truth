import { type NextPage } from "next";
import { api } from "~/utils/api";

import { LoadingPage, LoadingPost } from "~/components/loading";
import { Fragment, useCallback, useRef, useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

const CreatePostWizard = () => {
  const [input, setInput] = useState("");
  const { data } = useSession();

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (err) => {
      const zodErrorMessage = err.data?.zodError?.fieldErrors?.content;
      if (zodErrorMessage && zodErrorMessage[0]) {
        toast.error(zodErrorMessage[0]);
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error("Failed to create post, please try again later!");
      }
    },
  });

  if (!data) return null;

  return (
    <div className="flex w-full items-center justify-start gap-4">
      {data.user.image && (
        <Image
          src={data.user.image}
          alt={`${data.user.name ?? "Anon"} Profile Image`}
          className=" h-14 w-14 rounded-full border-2 border-gray-900 bg-gray-900"
          width={56}
          height={56}
        />
      )}
      <input
        placeholder="What's on your mind?"
        className="grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            mutate({ content: input });
          }
        }}
        disabled={isPosting}
      />
      {isPosting ? (
        <LoaderIcon />
      ) : (
        input && (
          <button
            onClick={() => mutate({ content: input })}
            disabled={isPosting}
          >
            Post
          </button>
        )
      )}
      <button
        onClick={() => {
          signOut().catch(console.error);
        }}
      >
        Sign Out
      </button>
    </div>
  );
};

const Feed = () => {
  const {
    isLoading: postsLoading,
    data,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = api.posts.getInfinite.useInfiniteQuery(
    {
      limit: 10,
      authorId: null,
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

const Home: NextPage = () => {
  // Start fetching asap
  api.posts.getAll.useQuery();
  const { status } = useSession();

  if (status === "loading") return <LoadingPage></LoadingPage>;

  return (
    <>
      <PageLayout>
        <div className="flex justify-end border-b border-slate-400 p-4">
          {status === "authenticated" ? (
            <CreatePostWizard />
          ) : (
            <button
              onClick={() => {
                signIn("github").catch(console.error);
              }}
            >
              Sign In
            </button>
          )}
        </div>
        <Feed />
      </PageLayout>
    </>
  );
};

export default Home;
