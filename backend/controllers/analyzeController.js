const pdfService = require('../services/pdfService');
const ocrService = require('../services/ocrService');
const suggestionService = require('../services/suggestionService');

exports.analyzeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { buffer, mimetype } = req.file;
    let extractedText = '';

    // Extract text based on file type
    if (mimetype === 'application/pdf') {
      extractedText = await pdfService.extractTextFromPDF(buffer);
    } else if (mimetype.startsWith('image/')) {
      extractedText = await ocrService.extractTextFromImage(buffer);
    }

    // Clean the extracted text
    extractedText = cleanText(extractedText);

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Could not extract text from the file. Please ensure the file contains readable text.' 
      });
    }

    // Generate suggestions
    const suggestions = suggestionService.generateSuggestions(extractedText);

    res.json({
      extractedText,
      suggestions,
      metadata: {
        fileType: mimetype,
        textLength: extractedText.length,
        wordCount: extractedText.split(/\s+/).length
      }
    });
  } catch (error) {
    console.error('Error analyzing file:', error);
    res.status(500).json({ 
      error: 'Failed to analyze file. Please try again.' 
    });
  }
};

// Helper function to clean extracted text
function cleanText(text) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s{2,}/g, ' ')
    .trim();
}