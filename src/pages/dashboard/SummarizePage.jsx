import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { useToast } from '../../hooks/use-toast';

const SummarizePage = () => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [activeTab, setActiveTab] = useState('upload');
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSummary(null);
    }
  };

  const handleTextInput = (e) => {
    setTextInput(e.target.value);
    setSummary(null);
  };

  const generateSummary = async (content) => {
    // Simple text summarization algorithm (extract key sentences)
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const words = content.toLowerCase().split(/\s+/);
    
    // Count word frequency
    const wordFreq = {};
    words.forEach(word => {
      if (word.length > 3) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    // Score sentences based on word frequency
    const sentenceScores = sentences.map(sentence => {
      const sentenceWords = sentence.toLowerCase().split(/\s+/);
      const score = sentenceWords.reduce((acc, word) => acc + (wordFreq[word] || 0), 0);
      return { sentence: sentence.trim(), score };
    });

    // Get top sentences
    const topSentences = sentenceScores
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(5, Math.ceil(sentences.length * 0.3)))
      .map(item => item.sentence)
      .filter(s => s.length > 20);

    return topSentences.join('. ') + '.';
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        
        // Generate summary from uploaded content
        const summaryText = await generateSummary(data.content || 'Document content extracted successfully.');
        
        setSummary({
          title: file.name,
          content: summaryText,
          originalContent: data.content,
          wordCount: data.content?.split(/\s+/).length || 0,
          estimatedPages: Math.ceil((data.content?.split(/\s+/).length || 0) / 250),
          keyPoints: summaryText.split('. ').slice(0, 5),
          createdAt: new Date().toISOString(),
          fileName: file.name,
          documentType: file.type || 'Document',
          fileSize: file.size,
        });

        toast({
          title: 'Success',
          description: 'Document uploaded and summarized successfully!',
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload and summarize document.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextSummarize = async () => {
    if (!textInput.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text to summarize.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);
    try {
      const summaryText = await generateSummary(textInput);
      
      setSummary({
        title: 'Text Summary',
        content: summaryText,
        originalContent: textInput,
        wordCount: textInput.split(/\s+/).length,
        estimatedPages: Math.ceil(textInput.split(/\s+/).length / 250),
        keyPoints: summaryText.split('. ').slice(0, 5),
        createdAt: new Date().toISOString(),
        fileName: 'Text Input',
        documentType: 'Text',
        fileSize: textInput.length,
      });

      toast({
        title: 'Success',
        description: 'Text summarized successfully!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to summarize text.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div>
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Smart Summarization</h1>
        <p className="text-gray-600 text-base md:text-lg">
          Upload documents or paste text to generate intelligent summaries
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Method</CardTitle>
              <CardDescription>Choose how you want to provide content for summarization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Button
                  variant={activeTab === 'upload' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('upload')}
                  className="flex-1"
                >
                  Upload File
                </Button>
                <Button
                  variant={activeTab === 'text' ? 'default' : 'outline'}
                  onClick={() => setActiveTab('text')}
                  className="flex-1"
                >
                  Paste Text
                </Button>
              </div>

              {activeTab === 'upload' ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt"
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="space-y-2">
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium text-blue-600 hover:text-blue-500">
                            Click to upload
                          </span>{' '}
                          or drag and drop
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, TXT up to 10MB</p>
                      </div>
                    </label>
                  </div>
                  {file && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900">{file.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                      </div>
                    </div>
                  )}
                  <Button
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="w-full"
                  >
                    {isUploading ? 'Processing...' : 'Upload & Summarize'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={textInput}
                    onChange={handleTextInput}
                    placeholder="Paste your text here to generate a summary..."
                    className="w-full h-48 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <Button
                    onClick={handleTextSummarize}
                    disabled={!textInput.trim() || isUploading}
                    className="w-full"
                  >
                    {isUploading ? 'Processing...' : 'Generate Summary'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Summary</CardTitle>
              <CardDescription>Your AI-powered summary will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              {summary ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">{summary.title}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600 font-medium">Words:</span> {summary.wordCount}
                      </div>
                      <div>
                        <span className="text-blue-600 font-medium">Pages:</span> ~{summary.estimatedPages}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Summary</h4>
                    <p className="text-gray-700 leading-relaxed">{summary.content}</p>
                  </div>

                  {summary.keyPoints && summary.keyPoints.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Points</h4>
                      <ul className="space-y-1">
                        {summary.keyPoints.map((point, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-700 text-sm">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      Share
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No summary yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Upload a document or paste text to generate your first summary.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SummarizePage;
