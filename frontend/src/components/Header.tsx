export function Header() {
  return (
    <header className="mb-10 text-center">
      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-3">
        TruthLens
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Decentralized AI-powered fact-checking on{" "}
        <a
          href="https://genlayer.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 hover:underline font-medium"
        >
          GenLayer
        </a>
        . Submit a claim, and our intelligent contract verifies it using web
        sources and LLM consensus.
      </p>
      <div className="mt-4 flex justify-center gap-3 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          Web Access
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500"></span>
          LLM Analysis
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          Validator Consensus
        </span>
      </div>
    </header>
  );
}
