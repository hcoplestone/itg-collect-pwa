import apiClient from './client';

export const feedbackApi = {
  submitFeedback(feedback: string, media: string[] = []) {
    return apiClient.post('/feedback', {
      feedback,
      media_base64: media.length > 0 ? media : null,
    });
  },
};
