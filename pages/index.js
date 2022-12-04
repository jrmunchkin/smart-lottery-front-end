import Head from "next/head";
import Header from "../components/Header";
import Main from "../components/Main";

export default function Home() {
  return (
    <div className="py-0 p-8">
      <Head>
        <title>Smart Lottery</title>
        <meta name="description" content="Smart Lottery" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Main />
    </div>
  );
}
