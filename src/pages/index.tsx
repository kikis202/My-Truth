import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Image from "next/image";
import { api } from "~/utils/api";

import { LoadingPage } from "~/components/loading";
import { useState } from "react";
import toast, { LoaderIcon } from "react-hot-toast";
import { PageLayout } from "~/components/layout";
import { PostView } from "~/components/postView";

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
