import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useEntriesStore, useUserStore } from '@/stores';
import { entriesApi } from '@/api/entries';
import { Header } from '@/components/layout/Header';
import { LeafletMap } from '@/components/maps/LeafletMap';
import { Heart, Trash2, MapPin, Loader2, Navigation } from 'lucide-react';
import type { Entry } from '@/types';

const EntryDetail = observer(function EntryDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const entriesStore = useEntriesStore();
  const userStore = useUserStore();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    // Try to find in local store first
    const localEntry = entriesStore.entries.find((e) => e.id === id);
    if (localEntry) {
      setEntry(localEntry);
      setLoading(false);
    } else if (id) {
      // Fetch from API
      entriesApi
        .getEntry(id)
        .then((response) => {
          const data = response.data;
          setEntry({
            ...data,
            lat: typeof data.lat === 'string' ? parseFloat(data.lat) : data.lat,
            lng: typeof data.lng === 'string' ? parseFloat(data.lng) : data.lng,
            createdAt: data.created_at || data.createdAt,
            userId: data.user_id || data.userId,
          } as Entry);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id, entriesStore.entries]);

  const handleDelete = async () => {
    if (!entry || !confirm('Are you sure you want to delete this entry?')) return;

    setDeleting(true);
    try {
      await entriesApi.deleteEntry(entry.id);
      entriesStore.removeEntry(entry.id);
      navigate(-1);
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Failed to delete entry');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-dvh max-w-3xl mx-auto w-full bg-primary">
        <Header title="Entry" showBack />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="flex flex-col h-dvh max-w-3xl mx-auto w-full bg-primary">
        <Header title="Entry" showBack />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-secondary">Entry not found</p>
        </div>
      </div>
    );
  }

  const photos = Array.isArray(entry.media_base64) ? entry.media_base64 : [];
  const isFav = userStore.isFavourite(entry.id);
  const isOwner = userStore.isMyEntry(entry);

  return (
    <div className="flex flex-col h-dvh max-w-3xl mx-auto w-full bg-primary">
      <Header
        title={entry.name}
        showBack
        rightAction={
          <button onClick={() => userStore.toggleFavourite(entry.id)} className="p-2">
            <Heart className={`w-5 h-5 ${isFav ? 'fill-danger text-danger' : 'text-accent'}`} />
          </button>
        }
      />

      <div className="flex-1 overflow-y-auto">
        {/* Photo Carousel */}
        {photos.length > 0 && (
          <div className="relative">
            <img
              src={photos[currentPhotoIndex]}
              alt={entry.name}
              className="w-full h-72 object-cover"
            />
            {photos.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPhotoIndex(i)}
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
        <div className="bg-secondary rounded-t-2xl -mt-3 relative z-10">
          <div className="px-6 py-6">
            {/* Category */}
            <span className="inline-block px-4 py-1.5 bg-accent text-secondary text-xs font-medium rounded-full capitalize mb-3">
              {entry.category}
            </span>

            {/* Name & Description */}
            <h2 className="text-2xl font-bold text-accent mb-2">{entry.name}</h2>
            {entry.description && (
              <p className="text-sm text-text-secondary mb-4">{entry.description}</p>
            )}

            {/* Address */}
            {entry.address && (
              <div className="flex items-start gap-2 mb-4">
                <MapPin className="w-4 h-4 text-text-secondary mt-0.5 shrink-0" />
                <p className="text-sm text-text-secondary">{entry.address}</p>
              </div>
            )}

            {/* Mini Map */}
            <div className="h-40 rounded-lg overflow-hidden mb-4">
              <LeafletMap
                center={[entry.lat, entry.lng]}
                zoom={15}
                entries={[entry]}
              />
            </div>

            {/* Navigate */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${entry.lat},${entry.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-accent rounded-lg text-secondary text-sm font-medium hover:bg-accent-light transition-colors mb-4"
            >
              <Navigation className="w-4 h-4" />
              Navigate
            </a>

            {/* Date */}
            {entry.createdAt && (
              <p className="text-xs text-text-secondary mb-4">
                Added {new Date(entry.createdAt).toLocaleDateString()}
              </p>
            )}

            {/* Delete */}
            {isOwner && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 w-full px-4 py-3 bg-danger/10 rounded-lg text-danger text-sm font-medium hover:bg-danger/20 transition-colors disabled:opacity-60"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete Entry
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default EntryDetail;
