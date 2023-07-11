import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { GuestNavItems, UserNavItems } from "./navbarItems";

export const Navbar = () => {
  const { isSignedIn } = useUser();
  return (
    <>
      <button
        data-drawer-target="separator-sidebar"
        data-drawer-toggle="separator-sidebar"
        aria-controls="separator-sidebar"
        type="button"
        className="ml-3 mt-2 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600 sm:hidden"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="h-6 w-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="separator-sidebar"
        className="h-full md:w-full"
        aria-label="Sidebar"
      >
        <div className="overflow-y-auto px-3 py-4">
          <Link href="/" className="mb-8 flex h-12 items-center pl-2.5">
            <Image src="/favicon.svg" width={32} height={32} alt="logo" />
            <span className="ml-4 self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              My truth
            </span>
          </Link>
          {isSignedIn ? <UserNavItems /> : <GuestNavItems />}
        </div>
      </aside>
    </>
  );
};
