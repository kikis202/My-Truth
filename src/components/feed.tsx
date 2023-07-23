import { Fragment, useCallback, useRef } from "react";
import { api } from "~/utils/api";
import { LoadingPage, LoadingPost } from "./loading";
import { PostView } from "./postView";

export const Feed = (props: { userId?: string }) => {
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
