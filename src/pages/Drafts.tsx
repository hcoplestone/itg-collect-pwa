import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useDraftsStore } from '@/stores';
import { Camera, MapPin, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AnimatedPage } from '@/components/layout/AnimatedPage';
import { motion } from 'framer-motion';
import { TAP_SCALE, fadeUpVariants, staggerContainer } from '@/lib/animations';

const Drafts = observer(function Drafts() {
  const navigate = useNavigate();
  const draftsStore = useDraftsStore();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const handleNewEntry = () => {
    draftsStore.resetDraft();
    navigate('/create-entry/map-select');
  };

  const handleResume = (draftId: string) => {
    draftsStore.loadDraft(draftId);
    const screen = draftsStore.currentScreen;
    navigate(screen);
  };

  const handleDelete = (draftId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPendingDeleteId(draftId);
  };

  const confirmDelete = () => {
    if (pendingDeleteId) {
      draftsStore.deleteDraft(pendingDeleteId);
      setPendingDeleteId(null);
    }
  };

  const formatDate = (date: string | number) => {
    const d = new Date(date);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const draftCount = draftsStore.drafts.length;

  return (
    <AnimatedPage>
      <div className="flex flex-col h-full w-full bg-primary overflow-y-auto">
        <div className="px-5 pt-6 pb-4">
          {/* Logo */}
          <div className="flex items-center justify-center mb-6">
            <img src="/images/logo-new.png" className="h-[42px] object-contain" alt="Inside Travel" />
          </div>

          {/* Title row */}
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-accent">My Drafts</h1>
            <motion.button
              onClick={handleNewEntry}
              whileTap={TAP_SCALE}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-accent text-white"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Create New Entry card */}
          <motion.button
            onClick={handleNewEntry}
            whileTap={TAP_SCALE}
            className="flex items-center gap-3 w-full p-4 bg-secondary rounded-xl text-left mb-6"
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 shrink-0">
              <Camera className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-accent">Create New Entry</h3>
              <p className="text-xs text-text-secondary">Add a new location to your collection</p>
            </div>
            <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" />
          </motion.button>

          {/* Drafts list */}
          {draftCount > 0 && (
            <>
              <div className="mb-3">
                <h2 className="text-sm font-semibold text-accent">
                  {draftCount} Draft{draftCount !== 1 ? 's' : ''}
                </h2>
                <p className="text-xs text-text-secondary">Tap to continue editing or manage</p>
              </div>

              <motion.div
                className="flex flex-col gap-2"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                {draftsStore.drafts.map((draft) => (
                  <motion.div
                    key={draft.draftId}
                    variants={fadeUpVariants}
                    onClick={() => handleResume(draft.draftId)}
                    whileTap={TAP_SCALE}
                    className="flex items-center gap-3 p-4 bg-secondary rounded-xl cursor-pointer active:bg-secondary-dark transition-colors"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-accent truncate">
                        {draft.name || 'Untitled Draft'}
                      </h3>
                      <p className="text-xs text-text-secondary">
                        {formatDate(draft.createdAt)}
                      </p>
                      {draft.category && (
                        <p className="text-xs text-text-secondary">{draft.category}</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleDelete(draft.draftId, e)}
                      className="p-2 text-text-secondary hover:text-danger transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 text-text-secondary shrink-0" />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}
        </div>

        <ConfirmDialog
          open={pendingDeleteId !== null}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDeleteId(null)}
          title="Delete Draft"
          message="Delete this draft? This action cannot be undone."
        />
      </div>
    </AnimatedPage>
  );
});

export default Drafts;
