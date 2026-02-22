interface CategoryPillProps {
  category: string;
  isActive?: boolean;
  onClick?: () => void;
}

export function CategoryPill({ category, isActive, onClick }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 rounded-[15px] text-xs capitalize whitespace-nowrap transition-colors ${
        isActive
          ? 'bg-accent text-white font-bold'
          : 'bg-transparent text-accent font-medium'
      }`}
    >
      {category}
    </button>
  );
}
