import { Wifi, Wind, Coffee, type LucideIcon } from 'lucide-react';

export const iconMap: { [key: string]: LucideIcon } = {
  Wind,
  Wifi,
  Coffee,
};

export type Highlight = {
  id: string;
  icon: keyof typeof iconMap;
  titleKey: string;
  descriptionKey: string;
};

export const initialHighlights: Highlight[] = [
  {
    id: 'h1',
    icon: 'Wind',
    titleKey: 'seaBreeze',
    descriptionKey: 'seaBreezeDesc',
  },
  {
    id: 'h2',
    icon: 'Wifi',
    titleKey: 'freeWifi',
    descriptionKey: 'freeWifiDesc',
  },
  {
    id: 'h3',
    icon: 'Coffee',
    titleKey: 'gourmetBreakfast',
    descriptionKey: 'gourmetBreakfastDesc',
  },
];
