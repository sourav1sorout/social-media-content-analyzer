import React, { useState } from 'react';
import { Upload, FileText, Image, Loader2, Sparkles, Hash, Eye, MessageSquare, TrendingUp } from 'lucide-react';

// Theme configurations
const themes = {
  ocean: {
    name: 'Ocean',
    bg: 'from-blue-50 to-cyan-50',
    card: 'bg-white border-blue-200',
    primary: 'bg-blue-600 hover:bg-blue-700',
    secondary: 'text-blue-600',
    accent: 'border-blue-400',
    uploadBg: 'bg-blue-50 border-blue-300',
    uploadHover: 'hover:bg-blue-100'
  },
  sunset: {
    name: 'Sunset',
    bg: 'from-orange-50 to-pink-50',
    card: 'bg-white border-orange-200',
    primary: 'bg-orange-600 hover:bg-orange-700',
    secondary: 'text-orange-600',
    accent: 'border-orange-400',
    uploadBg: 'bg-orange-50 border-orange-300',
    uploadHover: 'hover:bg-orange-100'
  },
  forest: {
    name: 'Forest',
    bg: 'from-green-50 to-emerald-50',
    card: 'bg-white border-green-200',
    primary: 'bg-green-600 hover:bg-green-700',
    secondary: 'text-green-600',
    accent: 'border-green-400',
    uploadBg: 'bg-green-50 border-green-300',
    uploadHover: 'hover:bg-green-100'
  },
  purple: {
    name: 'Purple',
    bg: 'from-purple-50 to-indigo-50',
    card: 'bg-white border-purple-200',
    primary: 'bg-purple-600 hover:bg-purple-700',
    secondary: 'text-purple-600',
    accent: 'border-purple-400',
    uploadBg: 'bg-purple-50 border-purple-300',
    uploadHover: 'hover:bg-purple-100'
  }
};

const App = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('ocean');

  const currentTheme = themes[theme];

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Handle file selection
  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  // Validate and set file
  const handleFile = (selectedFile) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or image file (JPG, PNG)');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setResult(null);
  };

  // Upload and analyze file
  const analyzeFile = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed. Please try again.');
      }

      const data = await response.json();
      setResult(data);
      setFile(null);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Reset everything
  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  // Get icon for suggestion type
  const getSuggestionIcon = (type) => {
    switch(type) {
      case 'hashtag': return <Hash className="w-5 h-5" />;
      case 'readability': return <Eye className="w-5 h-5" />;
      case 'cta': return <MessageSquare className="w-5 h-5" />;
      case 'length': return <TrendingUp className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.bg} py-8 px-4 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className={`w-10 h-10 ${currentTheme.secondary}`} />
            <h1 className="text-4xl font-bold text-gray-800">
              Content Analyzer
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Upload content and get AI-powered social media suggestions
          </p>
        </div>

        {/* Theme Switcher */}
        <div className={`${currentTheme.card} rounded-lg shadow-md p-4 mb-6 border`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Theme:</span>
            <div className="flex gap-2">
              {Object.keys(themes).map((key) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    theme === key
                      ? `${currentTheme.primary} text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {themes[key].name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Area */}
        {!result && (
          <div className={`${currentTheme.card} rounded-lg shadow-lg p-8 border`}>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-3 border-dashed rounded-lg p-12 text-center transition-all ${
                dragActive
                  ? `${currentTheme.accent} bg-opacity-10`
                  : `${currentTheme.uploadBg} border-dashed ${currentTheme.uploadHover}`
              }`}
            >
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInput}
                className="hidden"
              />
              
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-4">
                  <div className={`p-4 rounded-full ${currentTheme.uploadBg}`}>
                    <Upload className={`w-12 h-12 ${currentTheme.secondary}`} />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      {file ? file.name : 'Drop your file here or click to browse'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports PDF, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                  {file && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      {file.type.includes('pdf') ? (
                        <FileText className="w-5 h-5" />
                      ) : (
                        <Image className="w-5 h-5" />
                      )}
                      <span>{(file.size / 1024).toFixed(2)} KB</span>
                    </div>
                  )}
                </div>
              </label>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={analyzeFile}
                disabled={!file || loading}
                className={`${currentTheme.primary} text-white px-8 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Analyze Content
                  </>
                )}
              </button>
              {file && !loading && (
                <button
                  onClick={reset}
                  className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-all"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Extracted Text */}
            <div className={`${currentTheme.card} rounded-lg shadow-lg p-6 border`}>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className={currentTheme.secondary} />
                Extracted Text
              </h2>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                  {result.extractedText}
                </p>
              </div>
              <div className="mt-3 text-sm text-gray-500">
                {result.extractedText.split(' ').length} words • {result.extractedText.length} characters
              </div>
            </div>

            {/* Suggestions */}
            <div className={`${currentTheme.card} rounded-lg shadow-lg p-6 border`}>
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className={currentTheme.secondary} />
                Engagement Suggestions
              </h2>
              <div className="space-y-3">
                {result.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`p-4 bg-gradient-to-r ${currentTheme.uploadBg} rounded-lg border ${currentTheme.accent} border-opacity-30`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`${currentTheme.secondary} mt-1`}>
                        {getSuggestionIcon(suggestion.type)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">
                          {suggestion.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {suggestion.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center">
              <button
                onClick={reset}
                className={`${currentTheme.primary} text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2`}
              >
                <Upload className="w-5 h-5" />
                Analyze Another File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;