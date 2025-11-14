// ============================================
// FILE: backend/services/ocrService.js
// ============================================
const Tesseract = require('tesseract.js');

/**
 * Extract text from image buffer using OCR
 * @param {Buffer} buffer - Image file buffer
 * @returns {Promise<string>} - Extracted text
 */
exports.extractTextFromImage = async (buffer) => {
  try {
    const { data: { text } } = await Tesseract.recognize(
      buffer,
      'eng',
      {
        logger: info => console.log('OCR Progress:', info.status)
      }
    );
    return text;
  } catch (error) {
    console.error('OCR extraction error:', error);
    throw new Error('Failed to extract text from image');
  }
};