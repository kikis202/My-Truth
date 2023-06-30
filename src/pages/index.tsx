import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { type RouterOutputs, api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage } from "~/components/loading";
import { useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import Link from "next/link";
import { PageLayout } from "~/components/layout";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  const [input, setInput] = useState("");

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

  if (!user) return null;

  return (
    <div className="flex w-full items-center justify-start gap-4">
      <Image
        src={user.profileImageUrl}
        alt="Profile image"
        className="h-10 w-10 rounded-full"
        width={40}
        height={40}
      />
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

      <SignOutButton />
    </div>
  );
};
type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div
      key={post.id}
      className="flex gap-4 border-b border-slate-400 bg-gray-800 p-8"
    >
      <div>
        <Link href={author.id}>
          <Image
            src={author.profileImageUrl}
            alt="Profile image"
            className="h-10 w-10 rounded-full"
            width={40}
            height={40}
          />
        </Link>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <Link href={author.id}>
            <span className="text-sm text-slate-400">{`@${author.username}`}</span>
          </Link>
          <span className="text-xs font-thin text-slate-500">
            {`- ${dayjs(post.createdAt).fromNow()}`}
          </span>
        </div>
        <Link href={`/post/${post.id}`}>
          <span className="text-lg text-slate-300">{post.content}</span>
        </Link>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage size={40} />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView key={fullPost.post.id} {...fullPost} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap
  api.posts.getAll.useQuery();

  if (!userLoaded) return <></>;

  return (
    <>
      <PageLayout>
        <div className="flex justify-end border-b border-slate-400 p-4">
          {isSignedIn && <CreatePostWizard />}
          {!isSignedIn && <SignInButton />}
        </div>
        <Feed />
      </PageLayout>
    </>
  );
};

export default Home;
