import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { summarizeService } from '../../services/api';

const SummarizePage = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [inputText, setInputText] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (activeTab === 'text' && !inputText.trim()) return;
    if (activeTab === 'video' && !videoUrl.trim()) return;
    if (activeTab === 'file' && !fileUploaded) return;
    
    setIsLoading(true);
    
    try {
      let response;
      
      if (activeTab === 'text') {
        response = await summarizeService.summarizeText(inputText);
      } else if (activeTab === 'video') {
        response = await summarizeService.summarizeVideo(videoUrl);
      } else if (activeTab === 'file') {
        // Get the file from the input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput && fileInput.files.length > 0) {
          response = await summarizeService.summarizeFile(fileInput.files[0]);
        } else {
          throw new Error('No file selected');
        }
      }
      
      if (response && response.success) {
        setSummary({
          ...response.summary,
          date: new Date(response.summary.date).toLocaleDateString()
        });
      } else {
        throw new Error('Failed to generate summary');
      }
    } catch (error) {
      console.error('Summarization error:', error);
      alert(`Error: ${error.message || 'Failed to generate summary'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFileUploaded(true);
    } else {
      setFileUploaded(false);
    }
  };

  const resetForm = () => {
    setSummary(null);
    setInputText('');
    setVideoUrl('');
    setFileUploaded(false);
  };

  return (
    <>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">Summarize Content</h1>
        <p className="text-gray-400 text-base md:text-lg">Generate concise summaries from text, videos, or documents</p>
      </div>

      {!summary ? (
        <div className="bg-black backdrop-blur-md p-4 md:p-6 rounded-2xl border border-gray-700 shadow-xl">
          {/* Tabs */}
          <div className="flex border-b border-gray-700 mb-4 md:mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('text')}
              className={`px-3 md:px-6 py-2 md:py-3 font-medium text-xs md:text-sm whitespace-nowrap ${activeTab === 'text' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Text
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 md:px-6 py-2 md:py-3 font-medium text-xs md:text-sm whitespace-nowrap ${activeTab === 'video' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Video
            </button>
            <button
              onClick={() => setActiveTab('file')}
              className={`px-3 md:px-6 py-2 md:py-3 font-medium text-xs md:text-sm whitespace-nowrap ${activeTab === 'file' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-gray-300'}`}
            >
              Document
            </button>
          </div>

          {/* Tab Content */}
          <form onSubmit={handleSubmit}>
            {activeTab === 'text' && (
              <div className="space-y-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste your text here to summarize..."
                  className="w-full h-40 md:h-64 px-3 md:px-5 py-3 md:py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent resize-none"
                  required
                />
                <div className="text-right text-sm text-gray-400">
                  {inputText.length} characters
                </div>
              </div>
            )}

            {activeTab === 'video' && (
              <div className="space-y-6">
                <div>
                  <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-400 mb-2">YouTube or Vimeo URL</label>
                  <input
                    type="url"
                    id="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full px-5 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    required
                  />
                </div>
                <div className="bg-gray-800/50 rounded-xl p-6 text-center">
                  {videoUrl ? (
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center">
                      <p className="text-gray-400">Video preview would appear here</p>
                    </div>
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center justify-center py-10">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <p>Enter a video URL to summarize its content</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'file' && (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center">
                  <input
                    type="file"
                    id="fileUpload"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt"
                  />
                  <label htmlFor="fileUpload" className="cursor-pointer">
                    {fileUploaded ? (
                      <div className="text-white flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>File uploaded successfully</p>
                        <p className="text-sm text-gray-400 mt-1">Click to change file</p>
                      </div>
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p>Drag and drop your file here, or click to browse</p>
                        <p className="text-sm mt-2">Supports PDF, DOC, DOCX, TXT (Max 10MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}

            <div className="mt-6 md:mt-8 flex justify-center md:justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-6 md:px-8 py-3 bg-black text-white border border-white rounded-xl hover:bg-gray-800 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Summarizing...
                  </>
                ) : 'Generate Summary'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Summary Result */}
          <div className="bg-black backdrop-blur-md p-4 md:p-6 rounded-2xl border border-gray-700 shadow-xl">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 md:mb-6">
              <div className="mb-3 md:mb-0">
                <h2 className="text-xl md:text-2xl font-bold text-white">{summary.title}</h2>
                <div className="flex flex-wrap items-center mt-2 gap-2 md:gap-0 md:space-x-4">
                  <span className="text-xs md:text-sm text-gray-400">{summary.date}</span>
                  <span className="text-xs md:text-sm text-gray-400">{summary.wordCount} words</span>
                  <span className="text-xs md:text-sm text-gray-400">{summary.readTime} read</span>
                </div>
              </div>
              <div className="flex space-x-2 self-end md:self-auto">
                <button className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
                <button className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <p className="text-gray-300 leading-relaxed">{summary.content}</p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-white mb-4">Key Points</h3>
              <ul className="space-y-3">
                {summary.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gray-800 flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-white text-xs font-medium">{index + 1}</span>
                    </div>
                    <p className="text-gray-300">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 md:gap-0">
            <button 
              onClick={resetForm} 
              className="w-full md:w-auto px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors duration-300 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              New Summary
            </button>
            <div className="flex flex-col md:flex-row w-full md:w-auto gap-3 md:space-x-4">
              <button className="w-full md:w-auto px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors duration-300">
                Copy to Clipboard
              </button>
              <button className="w-full md:w-auto px-6 py-3 bg-black text-white border border-white rounded-xl hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center">
                Save Summary
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer with AI message */}
      <div className="text-center text-sm text-gray-500 py-4 border-t border-gray-800 mt-8">
        <p>🤖 Powered by Knowtasks</p>
      </div>
    </>
  );
};

export default SummarizePage;