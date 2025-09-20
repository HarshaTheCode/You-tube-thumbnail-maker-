import React from 'react';

const HeartIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-1.383-.597 15.25 15.25 0 01-1.423-.883c-.378-.297-.755-.618-1.134-.963a21.18 21.18 0 01-2.946-3.088 21.18 21.18 0 01-1.492-3.185A9.965 9.965 0 012 9.998c0-5.523 4.477-10 10-10s10 4.477 10 10c0 3.328-1.612 6.33-4.195 8.163a21.18 21.18 0 01-2.946 3.088 21.18 21.18 0 01-1.492 3.185c-.378.297-.755.618-1.134-.963a15.25 15.25 0 01-1.423.883 15.247 15.247 0 01-1.383.597l-.022.012-.007.003z" />
    </svg>
);


export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-4 mt-8">
      <div className="container mx-auto text-center text-sm text-gray-500">
        <p className="flex items-center justify-center gap-1.5">
            Powered by Google Gemini. Built for creators with <HeartIcon className="w-4 h-4 text-pink-500" />.
        </p>
      </div>
    </footer>
  );
};