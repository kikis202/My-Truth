import { type NextPage } from "next";
import { api } from "~/utils/api";

import { LoadingPage } from "~/components/loading";
import { useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Feed } from "~/components/feed";

const CreatePostWizard = () => {
  const [input, setInput] = useState("");
  const { data } = useSession();

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: async (post) => {
      setInput("");
      await ctx.posts.getInfinite.cancel();

      ctx.posts.getInfinite.setInfiniteData({ limit: 10 }, (data) => {
        if (!data) {
          return {
            pages: [{ posts: [post], nextCursor: undefined }],
            pageParams: [],
          };
        }
        return {
          ...data,
          pages: [
            {
              ...data.pages[0],
              posts: [post, ...(data.pages[0]?.posts ?? [])],
              nextCursor: data.pages[0]?.nextCursor,
            },
            ...data.pages.slice(1),
          ],
        };
      });
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

const Home: NextPage = () => {
  // Start fetching asap
  api.posts.getInfinite.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
    }
  );
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
