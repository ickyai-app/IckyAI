'use client';

export default function LoginPage({ onLogin }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-blue-900 to-black">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8">IckyAI</h1>
        <p className="text-gray-400 mb-8">Sales Intelligence Platform</p>
        <button
          onClick={onLogin}
          className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-bold transition"
        >
          🚀 Use Demo Login
        </button>
      </div>
    </div>
  );
}
