import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useDraftsStore, useEntriesStore } from '@/stores';
import { entriesApi } from '@/api/entries';
import { WizardLayout } from '@/components/entries/WizardLayout';
import { LeafletMap } from '@/components/maps/LeafletMap';
import { Star, Loader2, CheckCircle } from 'lucide-react';

const Review = observer(function Review() {
  const navigate = useNavigate();
  const draftsStore = useDraftsStore();
  const entriesStore = useEntriesStore();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Save rating and review to draft before submitting
      const draft = draftsStore.currentDraft;
      if (!draft) {
        throw new Error('No draft data available');
      }

      const response = await entriesApi.createEntry({
        lat: draft.lat,
        lng: draft.lng,
        name: draft.name,
        description: draft.description,
        rating: draft.rating,
        review: draft.review,
        tags: draft.tags,
        media_base64: draft.media.length > 0 ? draft.media : undefined,
      });

      // Refresh entries so homepage updates immediately
      entriesStore.forceRefresh();

      // Show success then navigate
      setSuccess(true);
      setTimeout(() => {
        draftsStore.removeCurrentDraft();
        navigate(`/entry/${response.data.id}`, { replace: true });
      }, 1500);
    } catch (error) {
      console.error('Error creating entry:', error);
      alert('Failed to create entry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetRating = (rating: number) => {
    draftsStore.setRating(rating);
  };

  if (success) {
    return (
      <div className="flex flex-col h-dvh max-w-3xl mx-auto w-full bg-primary items-center justify-center">
        <CheckCircle className="w-16 h-16 text-success mb-4" />
        <p className="text-lg font-bold text-accent">Entry saved successfully!</p>
      </div>
    );
  }

  return (
    <WizardLayout
      title="Review & Submit"
      step={7}
      onNext={handleSubmit}
      nextLabel={submitting ? 'Submitting...' : 'Submit Entry'}
      nextDisabled={submitting}
      onBack={() => navigate('/create-entry/photos')}
      showSaveDraft={!submitting}
    >
      <div className="py-4">
        {/* Summary */}
        <div className="bg-secondary rounded-lg p-4 mb-4">
          <h3 className="text-lg font-bold text-accent mb-1">{draftsStore.name}</h3>
          {draftsStore.tags.length > 0 && (
            <p className="text-sm text-text-secondary mb-2">
              {draftsStore.tags.join(', ')}
            </p>
          )}
          {draftsStore.description && (
            <p className="text-sm text-text-secondary mb-2">{draftsStore.description}</p>
          )}
          <p className="text-xs text-text-secondary">
            {draftsStore.lat.toFixed(6)}, {draftsStore.lng.toFixed(6)}
          </p>
        </div>

        {/* Mini Map */}
        <div className="h-32 rounded-lg overflow-hidden mb-4">
          <LeafletMap
            center={[draftsStore.lat, draftsStore.lng]}
            zoom={15}
            entries={[{
              id: 'preview',
              name: draftsStore.name,
              category: draftsStore.category,
              lat: draftsStore.lat,
              lng: draftsStore.lng,
            }]}
          />
        </div>

        {/* Photos Preview */}
        {draftsStore.media.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-accent mb-2">
              {draftsStore.media.length} photo{draftsStore.media.length > 1 ? 's' : ''}
            </p>
            <div className="flex gap-2 overflow-x-auto">
              {draftsStore.media.map((photo, i) => (
                <img
                  key={i}
                  src={photo}
                  alt={`Photo ${i + 1}`}
                  className="w-20 h-20 rounded-lg object-cover shrink-0"
                />
              ))}
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="mb-4">
          <p className="text-sm font-medium text-accent mb-2">Rating (optional)</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => handleSetRating(star)}>
                <Star
                  className={`w-8 h-8 ${
                    star <= draftsStore.rating
                      ? 'fill-warning text-warning'
                      : 'text-text-secondary'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-accent mb-2">
            Review (optional)
          </label>
          <textarea
            placeholder="Write a short review..."
            value={draftsStore.review}
            onChange={(e) => draftsStore.setReview(e.target.value)}
            rows={3}
            className="w-full bg-secondary border border-accent/20 rounded-lg px-4 py-3 text-sm text-accent placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-accent/30 resize-none"
          />
        </div>

        {submitting && (
          <div className="flex items-center justify-center gap-2 py-4">
            <Loader2 className="w-5 h-5 animate-spin text-accent" />
            <span className="text-sm text-accent">Creating entry...</span>
          </div>
        )}
      </div>
    </WizardLayout>
  );
});

export default Review;
