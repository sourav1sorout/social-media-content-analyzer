// ============================================
// FILE: backend/services/suggestionService.js
// ============================================

/**
 * Generate engagement suggestions based on extracted text
 * @param {string} text - Extracted text from document
 * @returns {Array} - Array of suggestion objects
 */
exports.generateSuggestions = (text) => {
  const suggestions = [];
  const wordCount = text.split(/\s+/).length;
  const hasHashtags = /#\w+/.test(text);
  const hasQuestion = /\?/.test(text);
  const hasEmoji = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]/u.test(text);
  const hasCTA = /(click|visit|check out|learn more|sign up|download|buy|shop|get|try)/i.test(text);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;

  // Hashtag suggestion
  if (!hasHashtags) {
    suggestions.push({
      type: 'hashtag',
      title: 'Add Relevant Hashtags',
      description: 'Include 3-5 relevant hashtags to increase discoverability and reach a wider audience.'
    });
  } else {
    const hashtagCount = (text.match(/#\w+/g) || []).length;
    if (hashtagCount < 3) {
      suggestions.push({
        type: 'hashtag',
        title: 'Add More Hashtags',
        description: `You have ${hashtagCount} hashtag(s). Consider adding ${3 - hashtagCount} more for better reach.`
      });
    }
  }

  // Readability suggestion
  if (avgSentenceLength > 20) {
    suggestions.push({
      type: 'readability',
      title: 'Improve Readability',
      description: 'Your sentences are quite long. Break them into shorter, punchier sentences for better engagement.'
    });
  }

  // CTA suggestion
  if (!hasCTA) {
    suggestions.push({
      type: 'cta',
      title: 'Add a Call-to-Action',
      description: 'Include a clear call-to-action (e.g., "Click the link", "Share your thoughts", "Tag a friend") to drive engagement.'
    });
  }

  // Length suggestion
  if (wordCount < 50) {
    suggestions.push({
      type: 'length',
      title: 'Expand Your Content',
      description: 'Your post is quite short. Add more context, examples, or storytelling to make it more engaging.'
    });
  } else if (wordCount > 300) {
    suggestions.push({
      type: 'length',
      title: 'Consider Breaking It Up',
      description: 'Long posts can lose attention. Consider creating a thread or breaking it into multiple posts.'
    });
  }

  // Question suggestion
  if (!hasQuestion) {
    suggestions.push({
      type: 'engagement',
      title: 'Ask a Question',
      description: 'End with a question to encourage comments and start conversations with your audience.'
    });
  }

  // Emoji suggestion
  if (!hasEmoji && wordCount > 20) {
    suggestions.push({
      type: 'visual',
      title: 'Add Visual Elements',
      description: 'Consider adding emojis to make your post more visually appealing and expressive.'
    });
  }

  // Hook suggestion (always relevant)
  const firstSentence = sentences[0] || '';
  if (firstSentence.length > 100) {
    suggestions.push({
      type: 'hook',
      title: 'Strengthen Your Hook',
      description: 'Your opening is long. Start with a short, compelling hook to grab attention immediately.'
    });
  }

  // Return top 5-6 most relevant suggestions
  return suggestions.slice(0, 6);
};