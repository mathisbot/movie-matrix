import Image from "next/image";

import { FancyButton } from "./(components)/FancyButton";
import { SearchBar } from "./(components)/SearchBar";
import Link from "next/link";

export default function Home() {
  return (
      <main className="flex flex-col items-center justify-between pt-28 mb-3">
            <div className="relative z-[-1] flex flex-col place-items-center before:absolute before:h-[300px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
                <Image
                    className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert mb-5"
                    src="/matrix.svg"
                    alt="MovieMatrix Logo"
                    width={180}
                    height={180}
                    priority
                />
                <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">MovieMatrix</h1>
            </div>

            {/* TODO: Hide SearchBar if not logged in */}
            <SearchBar className="mt-12">A</SearchBar>

            <div className="flex flex-row justify-even items-center mt-7">
                <Link href="/user/signup" className="m-4">
                <FancyButton type={undefined} className="">Sign Up</FancyButton>
                </Link>
                <Link href="/user/login" className="m-4">
                <FancyButton type={undefined} className="">Log In</FancyButton>
                </Link>
            </div>

          {/* <div className="mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left">
              <a
                  href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                  className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  <h2 className="mb-3 text-2xl font-semibold">
                      Docs{" "}
                      <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                          -&gt;
                      </span>
                  </h2>
                  <p className="m-0 max-w-[30ch] text-sm opacity-50">
                      Find in-depth information about Next.js features and API.
                  </p>
              </a>

              <a
                  href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                  className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  <h2 className="mb-3 text-2xl font-semibold">
                      Learn{" "}
                      <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                          -&gt;
                      </span>
                  </h2>
                  <p className="m-0 max-w-[30ch] text-sm opacity-50">
                      Learn about Next.js in an interactive course
                      with&nbsp;quizzes!
                  </p>
              </a>

              <a
                  href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                  className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  <h2 className="mb-3 text-2xl font-semibold">
                      Templates{" "}
                      <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                          -&gt;
                      </span>
                  </h2>
                  <p className="m-0 max-w-[30ch] text-sm opacity-50">
                      Explore starter templates for Next.js.
                  </p>
              </a>

              <a
                  href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
                  className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  <h2 className="mb-3 text-2xl font-semibold">
                      Deploy{" "}
                      <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                          -&gt;
                      </span>
                  </h2>
                  <p className="m-0 max-w-[30ch] text-balance text-sm opacity-50">
                      Instantly deploy your Next.js site to a shareable URL with
                      Vercel.
                  </p>
              </a>
          </div> */}
      </main>
  );
}
