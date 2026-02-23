import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useFeedbackStore } from '@/stores';
import { useToast } from '@/hooks/useToast';
import { feedbackApi } from '@/api/feedback';
import { Header } from '@/components/layout/Header';
import { AnimatedPage } from '@/components/layout/AnimatedPage';
import { PhotoPicker } from '@/components/photos/PhotoPicker';
import { PhotoGrid } from '@/components/photos/PhotoGrid';
import { Loader2, Camera } from 'lucide-react';

const Feedback = observer(function Feedback() {
  const navigate = useNavigate();
  const feedbackStore = useFeedbackStore();
  const toast = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    const { isValid, errors } = feedbackStore.validate();
    if (!isValid) {
      toast.warning(errors[0]);
      return;
    }

    setSubmitting(true);
    try {
      await feedbackApi.submitFeedback(feedbackStore.description, feedbackStore.media);
      setSuccess(true);
      feedbackStore.reset();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddPhotos = (photos: string[]) => {
    photos.forEach((photo) => feedbackStore.addMedia(photo));
  };

  if (success) {
    return (
      <div className="flex flex-col h-full">
        <Header title="Feedback" showLogo />
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">&#10003;</span>
          </div>
          <h2 className="text-xl font-bold text-accent mb-2">Thank you!</h2>
          <p className="text-sm text-text-secondary text-center mb-6">
            Your feedback has been submitted successfully.
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-accent text-secondary px-6 py-3 rounded-lg text-sm font-semibold"
          >
            Send More Feedback
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatedPage>
    <div className="flex flex-col h-full">
      <Header title="Feedback" showLogo />

      <div className="flex-1 px-4 pt-2 pb-4 overflow-y-auto">
        <p className="text-sm text-text-secondary text-center mb-4">
          We'd love to hear your thoughts! Share any feedback, suggestions, or issues.
        </p>

        <textarea
          placeholder="What would you like to tell us?"
          value={feedbackStore.description}
          onChange={(e) => feedbackStore.setDescription(e.target.value)}
          rows={6}
          className="w-full bg-secondary border border-accent/20 rounded-lg px-4 py-3 text-sm text-accent placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-accent/30 resize-none mb-4"
        />

        {/* Screenshots */}
        <div className="mb-4">
          <button
            onClick={() => navigate('/feedback-screenshots')}
            className="flex items-center gap-2 text-sm text-accent font-medium mb-3"
          >
            <Camera className="w-4 h-4" />
            {feedbackStore.media.length > 0
              ? feedbackStore.mediaCountText
              : 'Add screenshots'}
          </button>

          {feedbackStore.media.length > 0 && (
            <PhotoGrid
              photos={feedbackStore.media}
              onRemove={(index) => feedbackStore.removeMedia(index)}
              editable
            />
          )}

          {feedbackStore.media.length === 0 && (
            <PhotoPicker
              onPhotosSelected={handleAddPhotos}
              maxPhotos={5}
              currentCount={feedbackStore.media.length}
            />
          )}
        </div>
      </div>

      <div className="px-4 pb-4 shrink-0">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-accent text-secondary py-4 rounded-lg text-base font-semibold disabled:opacity-60 hover:bg-accent-light transition-colors flex items-center justify-center"
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            'Submit Feedback'
          )}
        </button>
      </div>
    </div>
    </AnimatedPage>
  );
});

export default Feedback;
