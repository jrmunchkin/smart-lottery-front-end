import { ConnectButton } from "web3uikit";
import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div>
      <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
        <h1 className="hidden md:flex py-4 px-4 font-bold text-2xl text-white">
          Smart Lottery
        </h1>
        <div className="hidden md:flex flex-row items-center">
          <Link href="/">
            <a className="mr-4 p-6 text-white">Version 1</a>
          </Link>
          <Link href="/lottery-v2">
            <a className="mr-4 p-6 text-white">Version 2</a>
          </Link>
          <ConnectButton moralisAuth={false} />
        </div>
        <section className="flex md:hidden">
          <div
            className="space-y-2"
            onClick={() => setIsNavOpen((prev) => !prev)}
          >
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
            <span className="block h-0.5 w-8 animate-pulse bg-gray-600"></span>
          </div>

          <div className={isNavOpen ? "showMenuNav" : "hideMenuNav"}>
            <h1 className="py-4 px-4 font-bold text-2xl text-white">
              Smart Lottery
            </h1>
            <div
              className="absolute top-0 right-0 px-8 py-8"
              onClick={() => setIsNavOpen(false)}
            >
              <svg
                className="h-8 w-8 text-gray-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <ul className="flex flex-col items-center justify-between min-h-[150px]">
              <li className="text-white my-8">
                <Link href="/">Version 1</Link>
              </li>
              <li className="text-white my-8">
                <Link href="/lottery-v2">Version 2</Link>
              </li>
            </ul>
          </div>
          <ConnectButton moralisAuth={false} />
        </section>
      </nav>
      <style>{`
    .hideMenuNav {
      display: none;
    }
    .showMenuNav {
      display: block;
      position: absolute;
      width: 100%;
      height: 40vh;
      top: 0;
      left: 0;
      background: #ef4444;
      z-index: 10;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
    }
  `}</style>
    </div>
  );
}
