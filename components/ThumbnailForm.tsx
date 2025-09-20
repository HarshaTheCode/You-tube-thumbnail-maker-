import React, { useState, useEffect } from 'react';

interface ThumbnailFormProps {
  onGenerate: (title: string, headshotFile: File, referenceFile: File | null, backgroundFile: File | null) => void;
  isLoading: boolean;
}

const PhotoIcon: React.FC<{className?: string}> = ({ className = "w-8 h-8 text-gray-500 group-hover:text-purple-400 transition-all duration-300 group-hover:scale-110" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
);

const CloseIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
);


const checkFile = (file: File | undefined, setError: (message: string | null) => void): file is File => {
    if (!file) return false;
    if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError('File is too large. Please upload an image under 4MB.');
        return false;
    }
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        setError('Invalid file type. Please upload a PNG, JPG, or WEBP.');
        return false;
    }
    setError(null);
    return true;
}

const FileUpload: React.FC<{
    id: string;
    label: string;
    promptText: React.ReactNode;
    file: File | null;
    fileName: string;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onDrop: (e: React.DragEvent<HTMLLabelElement>) => void;
    onRemove: () => void;
    preview: string | null;
}> = ({ id, label, promptText, file, fileName, onFileChange, onDrop, onRemove, preview }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        handleDragLeave(e);
        onDrop(e);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
            <div className="relative">
                {preview ? (
                     <div className="group relative mt-1 rounded-md overflow-hidden aspect-video animate-fade-in">
                        <img src={preview} alt={fileName} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={onRemove}
                                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transform hover:scale-110 transition-transform"
                                aria-label="Remove file"
                            >
                                <CloseIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <label
                        htmlFor={id}
                        className={`mt-1 flex group justify-center items-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer transition-all ${isDragging ? 'border-purple-500 bg-purple-500/10 ring-4 ring-purple-500/20' : 'border-gray-600 hover:border-purple-500'}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="space-y-1 text-center">
                            <PhotoIcon />
                            <div className="flex text-sm text-gray-400">
                                <p>{promptText}</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 4MB</p>
                        </div>
                        <input id={id} type="file" className="sr-only" accept="image/png, image/jpeg, image/webp" onChange={onFileChange} />
                    </label>
                )}
            </div>
        </div>
    );
};


export const ThumbnailForm: React.FC<ThumbnailFormProps> = ({ onGenerate, isLoading }) => {
  const [title, setTitle] = useState<string>('');
  const [headshotFile, setHeadshotFile] = useState<File | null>(null);
  const [headshotFileName, setHeadshotFileName] = useState<string>('');
  const [headshotPreview, setHeadshotPreview] = useState<string | null>(null);

  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referenceFileName, setReferenceFileName] = useState<string>('');
  const [referencePreview, setReferencePreview] = useState<string | null>(null);

  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundFileName, setBackgroundFileName] = useState<string>('');
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(null);
  
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
        [headshotPreview, referencePreview, backgroundPreview].forEach(p => {
            if(p) URL.revokeObjectURL(p);
        })
    };
  }, [headshotPreview, referencePreview, backgroundPreview]);

  // FIX: Add `preview` parameter to `createChangeHandler` to correctly revoke the old object URL.
  const createChangeHandler = (setFile: (f:File) => void, setFileName: (n:string) => void, setPreview: (p:string|null) => void, preview: string | null) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (preview) URL.revokeObjectURL(preview);
    const file = e.target.files?.[0];
    if (checkFile(file, setError)) {
      setFile(file);
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
    }
    e.target.value = '';
  };
  
  // FIX: Add `preview` parameter to `createDropHandler` to correctly revoke the old object URL.
  const createDropHandler = (setFile: (f:File) => void, setFileName: (n:string) => void, setPreview: (p:string|null) => void, preview: string | null) => (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (preview) URL.revokeObjectURL(preview);
    const file = e.dataTransfer.files?.[0];
    if (checkFile(file, setError)) {
      setFile(file);
      setFileName(file.name);
      setPreview(URL.createObjectURL(file));
    }
  };

  const createRemoveHandler = (setFile: (f:null) => void, setFileName: (n:string) => void, setPreview: (p:string|null) => void, preview: string | null) => () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setFileName('');
    setPreview(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !headshotFile) {
      setError('Please provide both a video title and a headshot image.');
      return;
    }
    setError(null);
    onGenerate(title, headshotFile, referenceFile, backgroundFile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="relative">
        <label htmlFor="video-title" className="block text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
          <PencilIcon className="w-5 h-5 text-gray-400" />
          1. Thumbnail Prompt
        </label>
        <input
          type="text"
          id="video-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., My Craziest Travel Story EVER!"
          className="w-full bg-gray-800 border border-gray-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500/70 focus:border-purple-500 transition shadow-sm focus:shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          required
        />
      </div>

      <FileUpload
        id="headshot-upload"
        label="2. Your Headshot"
        promptText={<>Drag &amp; drop or <span className="text-purple-400 font-medium">browse</span></>}
        file={headshotFile}
        fileName={headshotFileName}
        onFileChange={createChangeHandler(setHeadshotFile, setHeadshotFileName, setHeadshotPreview, headshotPreview)}
        onDrop={createDropHandler(setHeadshotFile, setHeadshotFileName, setHeadshotPreview, headshotPreview)}
        onRemove={createRemoveHandler(setHeadshotFile, setHeadshotFileName, setHeadshotPreview, headshotPreview)}
        preview={headshotPreview}
      />

      <FileUpload
        id="reference-upload"
        label="3. Reference Thumbnail (Optional)"
        promptText={<>Drag &amp; drop or <span className="text-purple-400 font-medium">browse for style</span></>}
        file={referenceFile}
        fileName={referenceFileName}
        onFileChange={createChangeHandler(setReferenceFile, setReferenceFileName, setReferencePreview, referencePreview)}
        onDrop={createDropHandler(setReferenceFile, setReferenceFileName, setReferencePreview, referencePreview)}
        onRemove={createRemoveHandler(setReferenceFile, setReferenceFileName, setReferencePreview, referencePreview)}
        preview={referencePreview}
      />
      
      <FileUpload
        id="background-upload"
        label="4. Background Image (Optional)"
        promptText={<>Drag &amp; drop or <span className="text-purple-400 font-medium">browse for background</span></>}
        file={backgroundFile}
        fileName={backgroundFileName}
        onFileChange={createChangeHandler(setBackgroundFile, setBackgroundFileName, setBackgroundPreview, backgroundPreview)}
        onDrop={createDropHandler(setBackgroundFile, setBackgroundFileName, setBackgroundPreview, backgroundPreview)}
        onRemove={createRemoveHandler(setBackgroundFile, setBackgroundFileName, setBackgroundPreview, backgroundPreview)}
        preview={backgroundPreview}
      />

      {error && <p className="text-red-400 text-sm text-center animate-fade-in">{error}</p>}

      <button
        type="submit"
        disabled={isLoading || !title || !headshotFile}
        className="w-full relative group overflow-hidden flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-100"
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
        <span className="relative flex items-center justify-center">
            {isLoading ? (
            <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
            </>
            ) : (
            'Create My Thumbnail'
            )}
        </span>
      </button>
    </form>
  );
};