import { type PropsWithChildren } from "react";
import { Navbar } from "./navbar";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen">
      <Navbar />
      <div className="mb-16 w-screen max-w-2xl overflow-y-scroll border-slate-400 sm:mb-0 sm:w-4/5 sm:border-x md:h-full lg:w-3/5">
        {props.children}
      </div>
      <div className="hidden flex-1 sm:block" />
    </main>
  );
};
