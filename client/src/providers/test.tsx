"use client";

import { useWillBotTour } from "./willbottour";

const tourData = [
  {
    target: "main-title",
    title: "The Hub",
    content: "This is where you manage your WillBots.",
  },
  {
    target: "bot-status",
    title: "Bot Status",
    content: "Check if your bot is online here.",
  },
  {
    target: "action-btn",
    title: "Take Action",
    content: "Click here to send a command!",
  },
  {
    target: "footer-link",
    title: "Resources",
    content: "Find documentation here.",
  },
];

export const Header = () => {
  const { startTour } = useWillBotTour();

  return (
    <nav className="p-6 bg-green-900 text-white flex justify-between items-center shadow-lg">
      <h1 id="main-title" className="text-2xl font-bold">
        WillBot Dashboard
      </h1>
      <button
        onClick={() => startTour(tourData)}
        className="px-4 py-2 bg-white text-green-900 rounded-lg font-semibold hover:bg-green-100 transition"
      >
        Start Demo Tour
      </button>
    </nav>
  );
};

// Components/BotControl.tsx
export const BotControl = () => {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md mx-auto mt-10 text-gray-800">
      <div className="flex items-center justify-between mb-6">
        <span
          id="bot-status"
          className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-bold"
        >
          ONLINE
        </span>
      </div>
      <p className="mb-6 text-gray-600">
        Welcome to the test screen. This text is a target, and the button below
        is another.
      </p>
      <button
        id="action-btn"
        className="w-full py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
      >
        Execute WillBot Command
      </button>
    </div>
  );
};

function WillBotTest() {
  return (
    <div className="w-full min-h-screen bg-green-800 font-sans">
      {/* 1. Navigation Component */}
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4">
            Test Your Tour
          </h2>
          <p className="text-green-100 opacity-80">
            Click the "Start Demo Tour" button in the header to see the context
            in action.
          </p>
        </div>

        {/* 2. Isolated Bot Control Component */}
        <BotControl />

        {/* 3. Miscellaneous Elements for Targeting */}
        <footer className="mt-20 text-center border-t border-green-700 pt-8">
          <a
            id="footer-link"
            href="#"
            className="text-green-200 hover:text-white underline transition-colors"
          >
            View WillBot Documentation
          </a>
        </footer>
      </main>

      {/* NOTE: You would render your <TourModal /> or <Tooltip /> component 
         here, which would consume useWillBotTour() to show/hide itself.
      */}
    </div>
  );
}

export default WillBotTest;
