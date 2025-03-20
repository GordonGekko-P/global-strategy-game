import Head from 'next/head';
import Game from '@/components/Game';

export default function Home() {
  return (
    <>
      <Head>
        <title>Global Strategy Game</title>
        <meta name="description" content="A complex strategy game with advanced AI diplomacy and market simulation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Game />
    </>
  );
}