import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useEntriesStore, useUserStore } from '@/stores';
import { entriesApi } from '@/api/entries';
import { Header } from '@/components/layout/Header';
import { LeafletMap } from '@/components/maps/LeafletMap';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { AnimatedPage } from '@/components/layout/AnimatedPage';
import { Heart, Trash2, MapPin, Loader2, Navigation, User, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { TAP_SCALE, heartPopVariants } from '@/lib/animations';
import type { Entry } from '@/types';
import { getRelativeTime } from '@/utils/time';

const EntryDetail = observer(function EntryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const fromWizard = (location.state as any)?.fromWizard === true;
  const entriesStore = useEntriesStore();
  const userStore = useUserStore();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [heartKey, setHeartKey] = useState(0);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    entriesApi
      .getEntry(id)
      .then((response) => {
        const data = response.data;

        // Parse media_base64 if it's a JSON string
        let media_base64 = data.media_base64;
        if (media_base64 && typeof media_base64 === 'string') {
          try {
            media_base64 = JSON.parse(media_base64);
          } catch {
            media_base64 = undefined;
          }
        }

        // Parse tags if it's a JSON string
        let tags = (data as any).tags;
        if (tags && typeof tags === 'string') {
          try {
            tags = JSON.parse(tags);
          } catch {
            tags = undefined;
          }
        }

        setEntry({
          ...data,
          media_base64,
          tags,
          lat: typeof data.lat === 'string' ? parseFloat(data.lat) : data.lat,
          lng: typeof data.lng === 'string' ? parseFloat(data.lng) : data.lng,
          createdAt: data.created_at || data.createdAt,
          userId: data.user_id || data.userId,
        } as Entry);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!entry) return;
    setShowDeleteConfirm(false);
    setDeleting(true);
    try {
      await entriesApi.deleteEntry(entry.id);
      entriesStore.removeEntry(entry.id);
      entriesStore.fetch(true);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error deleting entry:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleFav = () => {
    if (!entry) return;
    userStore.toggleFavourite(entry.id);
    setHeartKey((k) => k + 1);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-dvh w-full bg-primary">
        <Header title="Loading..." showBack onBack={fromWizard ? () => navigate('/home', { replace: true }) : undefined} />
        <div className="flex-1 flex items-center justify-center w-full">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex flex-col h-dvh w-full bg-primary">
        <Header title="Entry" showBack onBack={fromWizard ? () => navigate('/home', { replace: true }) : undefined} />
        <div className="flex-1 flex items-center justify-center w-full">
          <p className="text-text-secondary">Entry not found</p>
        </div>
      </div>
    );
  }

  const photos = Array.isArray(entry.media_base64) ? entry.media_base64 : [];
  const formattedPhotos = photos.map(p =>
    p.startsWith('data:') ? p : `data:image/jpeg;base64,${p}`
  );
  const isFav = userStore.isFavourite(entry.id);
  const isOwner = userStore.isMyEntry(entry);

  return (
    <AnimatedPage>
      <div className="flex flex-col h-dvh w-full bg-primary">
        <Header
          title={entry.name}
          showBack
          onBack={fromWizard ? () => navigate('/home', { replace: true }) : undefined}
          rightAction={
            <motion.button
              onClick={handleToggleFav}
              whileTap={TAP_SCALE}
              aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'}
              className="p-2"
            >
              <motion.div
                key={heartKey}
                variants={heartPopVariants}
                initial="idle"
                animate="pop"
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-danger text-danger' : 'text-accent'}`} />
              </motion.div>
            </motion.button>
          }
        />

        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Photo Carousel */}
          {formattedPhotos.length > 0 && (
            <div className="relative">
              <img
                src={formattedPhotos[currentPhotoIndex]}
                alt={entry.name}
                className="w-full h-72 object-cover"
              />
              {formattedPhotos.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {formattedPhotos.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPhotoIndex(i)}
                      aria-label={`View photo ${i + 1}`}
                      className={`w-2 h-2 rounded-full ${
                        i === currentPhotoIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cream content area */}
          <div className="bg-secondary rounded-t-2xl -mt-3 relative z-10 flex-1">
            <div className="px-6 py-6">
              {/* Name + Pin */}
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-bold text-accent">{entry.name}</h2>
                <MapPin className="w-5 h-5 text-accent shrink-0" />
              </div>

              {/* Description */}
              {entry.description && (
                <p className="text-sm text-text-secondary mb-4">{entry.description}</p>
              )}

              {/* Author + Relative Date */}
              <div className="flex items-center gap-3 text-sm text-text-secondary mb-4">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {entry.uploaded_by || 'Unknown'}
                </span>
                {entry.createdAt && (
                  <>
                    <span>|</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {getRelativeTime(entry.createdAt)}
                    </span>
                  </>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {entry.category && (
                  <span className="bg-white/20 rounded-md px-3 py-1 text-sm font-medium text-accent capitalize">
                    {entry.category}
                  </span>
                )}
                {Array.isArray(entry.tags) && entry.tags.map((tag, i) => {
                  const label = typeof tag === 'string' ? tag : tag?.name?.en;
                  if (!label) return null;
                  return (
                    <span key={i} className="bg-white/20 rounded-md px-3 py-1 text-sm font-medium text-accent">
                      {label}
                    </span>
                  );
                })}
              </div>

              {/* Location section */}
              <h3 className="text-lg font-semibold text-accent mb-2">Location</h3>

              {/* Mini Map */}
              <div className="h-40 rounded-lg overflow-hidden mb-2">
                <LeafletMap
                  center={[entry.lat, entry.lng]}
                  zoom={15}
                  entries={[entry]}
                />
              </div>

              {/* Coordinates */}
              <p className="text-xs text-text-secondary mb-4">
                {entry.lat.toFixed(7)}, {entry.lng.toFixed(7)}
              </p>

              {/* Navigate */}
              <motion.a
                href={`https://www.google.com/maps/dir/?api=1&destination=${entry.lat},${entry.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                whileTap={TAP_SCALE}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-accent rounded-lg text-secondary text-sm font-medium hover:bg-accent-light transition-colors mb-4"
              >
                <Navigation className="w-4 h-4" />
                Navigate
              </motion.a>

              {/* Delete */}
              {isOwner && (
                <motion.button
                  onClick={handleDelete}
                  disabled={deleting}
                  whileTap={TAP_SCALE}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-danger rounded-lg text-secondary text-sm font-medium hover:bg-danger/90 transition-colors disabled:opacity-60"
                >
                  {deleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete Entry
                </motion.button>
              )}
            </div>
          </div>
        </div>

        <ConfirmDialog
          open={showDeleteConfirm}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
          title="Delete Entry"
          message="Are you sure you want to delete this entry? This action cannot be undone."
        />
      </div>
    </AnimatedPage>
  );
});

export default EntryDetail;
