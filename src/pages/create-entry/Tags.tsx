import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useDraftsStore } from '@/stores';
import { WizardLayout } from '@/components/entries/WizardLayout';

const TAG_OPTIONS = [
  'See/Do',
  'Food/Drink',
  'Accommodation',
  'Transport',
  'Shopping',
  'Entertainment',
  'Culture',
  'Nature',
  'Sports',
  'Business',
  'Health',
  'Education',
];

const Tags = observer(function Tags() {
  const navigate = useNavigate();
  const draftsStore = useDraftsStore();
  const [selectedTags, setSelectedTags] = useState<string[]>(draftsStore.tags);

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const handleNext = () => {
    draftsStore.setTags(selectedTags);
    navigate('/create-entry/photos');
  };

  return (
    <WizardLayout
      title="Tags"
      step={5}
      onNext={handleNext}
      onBack={() => navigate(-1)}
    >
      <div className="py-4">
        <p className="text-sm text-text-secondary mb-4">
          Select the categories that best describe this location
        </p>

        <div className="flex flex-wrap gap-2">
          {TAG_OPTIONS.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleToggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-accent text-secondary'
                    : 'bg-secondary text-accent hover:bg-secondary-dark'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </WizardLayout>
  );
});

export default Tags;
