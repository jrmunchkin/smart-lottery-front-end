import { ConnectButton } from "web3uikit";
import Link from "next/link";

export default function Header() {
  return (
    <div className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h1 className="py-4 px-4 font-bold text-3xl text-white">Smart Lottery</h1>
      <div className="flex flex-row items-center">
        <Link href="/">
          <a className="mr-4 p-6 text-white">Version 1</a>
        </Link>
        <Link href="/lottery-v2">
          <a className="mr-4 p-6 text-white">Version 2</a>
        </Link>
        <ConnectButton moralisAuth={false} />
      </div>
    </div>
  );
}
