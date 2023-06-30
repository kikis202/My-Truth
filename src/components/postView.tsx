import Image from "next/image";
import { type RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

export const PostView = (props: PostWithUser) => {
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
