interface CategoryPillProps {
  category: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function CategoryPill({ category, isActive, onClick }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-xs font-medium capitalize whitespace-nowrap transition-colors ${
        isActive
          ? 'bg-accent text-white font-bold'
          : 'bg-transparent text-accent'
      }`}
    >
      {category}
    </button>
  );
}
