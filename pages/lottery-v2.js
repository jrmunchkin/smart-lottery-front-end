import Head from "next/head";
import Header from "../components/Header";
import Main from "../components/v2/Main";

export default function Home() {
  return (
    <div className="py-0 p-8">
      <Head>
        <title>Smart Lottery V2</title>
        <meta name="description" content="Smart Lottery V2" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Main />
    </div>
  );
}
