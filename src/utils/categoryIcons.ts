import {
  Camera,
  UtensilsCrossed,
  Bed,
  Bus,
  ShoppingBag,
  Music,
  Landmark,
  TreePine,
  Dumbbell,
  Briefcase,
  HeartPulse,
  GraduationCap,
  Info,
  type LucideIcon,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  'see/do': Camera,
  'food/drink': UtensilsCrossed,
  'accommodation': Bed,
  'transport': Bus,
  'shopping': ShoppingBag,
  'entertainment': Music,
  'culture': Landmark,
  'nature': TreePine,
  'sports': Dumbbell,
  'business': Briefcase,
  'health': HeartPulse,
  'education': GraduationCap,
};

export function getCategoryIcon(category: string | null | undefined): LucideIcon {
  if (!category) return Info;
  return CATEGORY_ICONS[category.toLowerCase()] ?? Info;
}
