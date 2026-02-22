import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useDraftsStore } from '@/stores';
import { Header } from '@/components/layout/Header';
import { FileText, Trash2, ChevronRight } from 'lucide-react';

const Drafts = observer(function Drafts() {
  const navigate = useNavigate();
  const draftsStore = useDraftsStore();

  const handleResume = (draftId: string) => {
    draftsStore.loadDraft(draftId);
    const screen = draftsStore.currentScreen;
    navigate(screen);
  };

  const handleDelete = (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this draft?')) {
      draftsStore.deleteDraft(draftId);
    }
  };

  return (
    <div className="flex flex-col h-dvh max-w-3xl mx-auto w-full bg-primary">
      <Header title="Drafts" showBack />

      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {draftsStore.drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-text-secondary mb-3" />
            <p className="text-text-secondary text-sm">No drafts saved</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {draftsStore.drafts.map((draft) => (
              <div
                key={draft.draftId}
                onClick={() => handleResume(draft.draftId)}
                className="flex items-center gap-3 p-4 bg-secondary rounded-lg cursor-pointer hover:bg-secondary-dark transition-colors"
              >
                <FileText className="w-5 h-5 text-accent shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-accent truncate">
                    {draft.name || 'Untitled Draft'}
                  </h3>
                  <p className="text-xs text-text-secondary">
                    {new Date(draft.createdAt).toLocaleDateString()}
                    {draft.category && ` · ${draft.category}`}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDelete(draft.draftId, e)}
                  className="p-2 text-text-secondary hover:text-danger transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default Drafts;
