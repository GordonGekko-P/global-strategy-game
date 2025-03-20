import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Global Strategy Game</title>
        <meta name="description" content="A complex strategy game with advanced AI diplomacy and market simulation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to Global Strategy Game
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">AI Diplomacy</h2>
            <p className="text-gray-600">
              Engage in complex diplomatic relations with AI-driven nations.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Market Simulation</h2>
            <p className="text-gray-600">
              Experience dynamic economic systems and market interactions.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Research & Technology</h2>
            <p className="text-gray-600">
              Advance your civilization through scientific discoveries.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}