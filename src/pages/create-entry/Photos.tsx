import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useDraftsStore } from '@/stores';
import { WizardLayout } from '@/components/entries/WizardLayout';
import { PhotoPicker } from '@/components/photos/PhotoPicker';
import { PhotoGrid } from '@/components/photos/PhotoGrid';

const Photos = observer(function Photos() {
  const navigate = useNavigate();
  const draftsStore = useDraftsStore();

  const handleAddPhotos = (photos: string[]) => {
    draftsStore.setMedia([...draftsStore.media, ...photos]);
  };

  const handleRemovePhoto = (index: number) => {
    const newMedia = [...draftsStore.media];
    newMedia.splice(index, 1);
    draftsStore.setMedia(newMedia);
  };

  const handleNext = () => {
    navigate('/create-entry/review');
  };

  return (
    <WizardLayout
      title="Photos"
      step={6}
      onNext={handleNext}
      nextLabel={draftsStore.media.length === 0 ? 'Skip' : 'Next'}
      onBack={() => navigate('/create-entry/tags')}
    >
      <div className="py-4">
        <p className="text-sm text-text-secondary mb-4">
          Add some photos of this place (optional).
        </p>

        <PhotoPicker
          onPhotosSelected={handleAddPhotos}
          maxPhotos={5}
          currentCount={draftsStore.media.length}
        />

        {draftsStore.media.length > 0 && (
          <div className="mt-4">
            <PhotoGrid
              photos={draftsStore.media}
              onRemove={handleRemovePhoto}
              editable
            />
          </div>
        )}
      </div>
    </WizardLayout>
  );
});

export default Photos;
