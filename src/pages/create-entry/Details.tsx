import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useDraftsStore } from '@/stores';
import { WizardLayout } from '@/components/entries/WizardLayout';

const Details = observer(function Details() {
  const navigate = useNavigate();
  const draftsStore = useDraftsStore();

  const handleNext = () => {
    navigate('/create-entry/tags');
  };

  return (
    <WizardLayout
      title="Details"
      step={4}
      onNext={handleNext}
      onBack={() => navigate('/create-entry/location')}
    >
      <div className="py-4">
        <p className="text-sm text-text-secondary mb-4">
          Add a description for <strong className="text-accent">{draftsStore.name}</strong>
        </p>

        <label className="block text-sm font-medium text-accent mb-2">
          Description
        </label>
        <textarea
          placeholder="What makes this place special?"
          value={draftsStore.description}
          onChange={(e) => draftsStore.setDescription(e.target.value)}
          rows={5}
          className="w-full bg-secondary rounded-lg px-4 py-3 text-sm text-accent placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-accent/30 resize-none"
        />
      </div>
    </WizardLayout>
  );
});

export default Details;
