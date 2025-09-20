import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ThumbnailForm } from './components/ThumbnailForm';
import { ThumbnailDisplay } from './components/ThumbnailDisplay';
import { Footer } from './components/Footer';
import { generateThumbnail } from './services/geminiService';
import { toBase64 } from './utils/fileUtils';

const App: React.FC = () => {
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async (title: string, headshotFile: File, referenceFile: File | null, backgroundFile: File | null) => {
    setIsLoading(true);
    setError(null);
    setGeneratedImageUrl(null);

    try {
      const headshotBase64 = await toBase64(headshotFile);
      
      let referenceBase64: string | undefined;
      let referenceMimeType: string | undefined;
      if (referenceFile) {
        referenceBase64 = await toBase64(referenceFile);
        referenceMimeType = referenceFile.type;
      }

      let backgroundBase64: string | undefined;
      let backgroundMimeType: string | undefined;
      if (backgroundFile) {
        backgroundBase64 = await toBase64(backgroundFile);
        backgroundMimeType = backgroundFile.type;
      }

      const imageUrl = await generateThumbnail(
        title, 
        headshotBase64, 
        headshotFile.type,
        referenceBase64,
        referenceMimeType,
        backgroundBase64,
        backgroundMimeType
      );
      setGeneratedImageUrl(imageUrl);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(errorMessage);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen text-white flex flex-col antialiased">
      <div className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <Header />
        <main className="mt-8 md:mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-purple-500/30 via-gray-800/20 to-pink-500/30 shadow-2xl">
             <div className="bg-gray-900/80 p-6 md:p-8 rounded-[15px] backdrop-blur-lg">
                <ThumbnailForm onGenerate={handleGenerate} isLoading={isLoading} />
             </div>
          </div>
          <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-purple-500/30 via-gray-800/20 to-pink-500/30 shadow-2xl aspect-video">
             <div className="bg-gray-900/80 rounded-[15px] backdrop-blur-lg h-full flex items-center justify-center">
                <ThumbnailDisplay
                  imageUrl={generatedImageUrl}
                  isLoading={isLoading}
                  error={error}
                />
             </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;