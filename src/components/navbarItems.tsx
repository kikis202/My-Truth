import { useSession } from "next-auth/react";

const HomeSVG = () => (
  <svg
    className="h-5 w-5 text-slate-400 transition duration-75  group-hover:text-slate-200"
    fill="currentColor"
    viewBox="0 0 21 20"
  >
    <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z" />
  </svg>
);

const ProfileSVG = () => (
  <svg
    className="h-5 w-5 text-slate-400 transition duration-75  group-hover:text-slate-200"
    fill="currentColor"
    viewBox="0 0 15 20"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-2 3h4a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"
    />
  </svg>
);

interface NavElementProps {
  svg: React.ReactNode;
  href: string;
  title: string;
}

const userItems: NavElementProps[] = [
  {
    href: "/",
    title: "Home",
    svg: <HomeSVG />,
  },
  {
    svg: <ProfileSVG />,
    href: "/profile",
    title: "Profile",
  },
];

const guestItems: NavElementProps[] = [];

export const useNavItems = () => {
  const { status } = useSession();

  if (status === "authenticated") return userItems;
  return guestItems;
};
