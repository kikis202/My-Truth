import Image from "next/image";
import Link from "next/link";
import { useNavItems } from "./navbarItems";
import { useState } from "react";

interface NavElementProps {
  svg: React.ReactNode;
  href: string;
  title: string;
  onClick?: () => void;
}

const MainNavElement: React.FC<NavElementProps> = ({
  svg,
  href,
  title,
  onClick,
}) => {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-center rounded-lg p-2 text-slate-200 hover:bg-slate-700"
        onClick={onClick}
      >
        {svg}
        <span className="ml-3">{title}</span>
      </Link>
    </li>
  );
};

const MobileNavElement: React.FC<NavElementProps> = ({
  svg,
  href,
  title,
  onClick,
}) => {
  return (
    <div className="flex flex-grow items-center justify-center">
      <Link
        href={href}
        className="group inline-flex h-14 w-36 flex-col items-center justify-center rounded-lg hover:bg-slate-700"
        onClick={onClick}
      >
        {svg}
        <span className="text-sm text-slate-400 group-hover:text-slate-200 ">
          {title}
        </span>
      </Link>
    </div>
  );
};

export const Navbar = () => {
  const navItems = useNavItems();
  const [show, setShow] = useState(false);

  return (
    <>
      <div className="hidden flex-1 sm:flex lg:justify-end">
        {/*---------- Main navbar ----------*/}
        <div className="hidden w-64 lg:block">
          <aside className="h-full md:w-full">
            <div className="overflow-y-auto px-3 py-4">
              <Link href="/" className="mb-4 flex h-12 items-center pl-2.5">
                <Image src="/favicon.svg" width={32} height={32} alt="logo" />
                <span className="ml-4 self-center whitespace-nowrap text-xl font-semibold text-slate-200">
                  My truth
                </span>
              </Link>
              <div className="overflow-y-auto py-4">
                <ul className="ml-2 space-y-2 font-medium">
                  {navItems.map((item, index) => (
                    <MainNavElement key={index} {...item} />
                  ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
        {!show && (
          <button
            type="button"
            onClick={() => setShow((prev) => !prev)}
            className="ml-3 mt-2 inline-flex h-10 items-center rounded-lg p-2 text-sm text-slate-400  hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600  lg:hidden"
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                fillRule="evenodd"
                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
              ></path>
            </svg>
          </button>
        )}
      </div>

      {/*---------- Toggle main navbar ----------*/}
      {show && (
        <div className="fixed left-0 top-0 z-40 hidden h-screen w-64 overflow-y-auto bg-slate-800 p-4 px-3 py-4 transition-transform sm:block lg:hidden">
          <Link
            href="/"
            className="mb-4 flex h-12 items-center pl-2.5"
            onClick={() => setShow((prev) => !prev)}
          >
            <Image src="/favicon.svg" width={32} height={32} alt="logo" />
            <span className="ml-4 self-center whitespace-nowrap text-xl font-semibold text-slate-200">
              My truth
            </span>
          </Link>
          <button
            type="button"
            className="absolute right-2.5 top-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-slate-400  hover:bg-slate-600 hover:text-slate-200"
            onClick={() => setShow((prev) => !prev)}
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="sr-only">Close menu</span>
          </button>
          <div className="overflow-y-auto py-4">
            <ul className="ml-2 space-y-2 font-medium">
              {navItems.map((item, index) => (
                <MainNavElement
                  key={index}
                  {...item}
                  onClick={() => setShow((prev) => !prev)}
                />
              ))}
            </ul>
          </div>
        </div>
      )}

      {/*---------- Mobile navigation ----------*/}
      <div className="slate-400 fixed bottom-0 left-0 z-50 h-16 w-screen border-t border-slate-400 bg-slate-800 sm:hidden">
        <div className={`mx-auto flex h-full justify-evenly gap-1 font-medium`}>
          {navItems.map((item, index) => (
            <MobileNavElement key={index} {...item} />
          ))}
        </div>
      </div>
    </>
  );
};
