import React, { useState, useEffect } from 'react';

interface ThumbnailDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const LoadingSpinner: React.FC = () => (
    <div className="w-12 h-12 relative">
        <div className="absolute inset-0 border-4 border-gray-600 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-purple-500 border-l-purple-500 border-b-pink-500 border-r-transparent rounded-full animate-spin"></div>
    </div>
);

const loadingMessages = [
    'Analyzing your headshot...',
    'Warming up the color palette...',
    'Crafting compelling typography...',
    'Adding a touch of magic...',
    'Almost there...',
];

const Placeholder: React.FC = () => (
     <div className="w-full h-full flex flex-col items-center justify-center text-center text-gray-500 border-2 border-dashed border-gray-700/50 rounded-lg p-4">
        <svg className="w-16 h-16 text-gray-700 animate-float" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-400">Your Thumbnail Will Appear Here</h3>
        <p className="mt-1 text-sm text-gray-500">Fill out the form and let the AI work its magic.</p>
    </div>
);

export const ThumbnailDisplay: React.FC<ThumbnailDisplayProps> = ({ imageUrl, isLoading, error }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isLoading) {
      interval = setInterval(() => {
        setCurrentMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center p-4">
        <LoadingSpinner />
        <p className="mt-6 text-lg font-semibold text-gray-400 transition-opacity duration-500 animate-fade-in" key={currentMessageIndex}>
            {loadingMessages[currentMessageIndex]}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center text-red-400 bg-red-900/30 border border-red-500/50 rounded-lg p-4 animate-fade-in">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="mt-2 font-bold">Generation Failed</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="w-full relative group animate-fade-in">
        <img src={imageUrl} alt="Generated YouTube thumbnail" className="w-full h-full object-contain rounded-lg shadow-lg" />
        <a
          href={imageUrl}
          download="ai-thumbnail.png"
          className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white py-2 px-4 rounded-lg flex items-center
                     opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-sm transform hover:scale-110"
        >
          <DownloadIcon />
          Download
        </a>
      </div>
    );
  }

  return <Placeholder />;
};