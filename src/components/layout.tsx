import { type PropsWithChildren } from "react";
import { Navbar } from "./navbar";

export const PageLayout = (props: PropsWithChildren) => {
  return (
    <main className="flex h-screen flex-col-reverse md:grid md:grid-cols-5 lg:grid-cols-4">
      <Navbar />
      <div className="w-full grow overflow-y-scroll border-x border-slate-400 md:col-span-3 md:h-full lg:col-span-2">
        {props.children}
      </div>
    </main>
  );
};
