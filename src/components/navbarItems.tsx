import Link from "next/link";

const ProfileSVG = () => (
  <svg
    className="h-5 w-5 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 22 21"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M7 8a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-2 3h4a4 4 0 0 1 4 4v2H1v-2a4 4 0 0 1 4-4Z"
    />
  </svg>
);

interface NavElementProps {
  svg: React.ReactNode;
  href: string;
  title: string;
}

const NavElement: React.FC<NavElementProps> = (props) => {
  return (
    <li>
      <Link
        href={props.href}
        className="group flex items-center rounded-lg p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
      >
        {props.svg}
        <span className="ml-3">{props.title}</span>
      </Link>
    </li>
  );
};

export const UserNavItems = () => {
  return (
    <ul className="ml-2 space-y-2 font-medium">
      <NavElement href="/profile" title="Profile" svg={<ProfileSVG />} />
    </ul>
  );
};

export const GuestNavItems = () => {
  return <ul className="ml-2 space-y-2 font-medium"></ul>;
};
