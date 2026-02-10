import { MonitorPlay, Briefcase, Zap, Heart, ShoppingBag, LayoutGrid } from 'lucide-react';

export const CATEGORIES = [
    { id: 'entertainment', label: 'Intrattenimento', icon: MonitorPlay, color: '#f472b6' }, // Pink
    { id: 'work', label: 'Lavoro', icon: Briefcase, color: '#60a5fa' }, // Blue
    { id: 'utilities', label: 'Utenze', icon: Zap, color: '#facc15' }, // Yellow
    { id: 'health', label: 'Salute', icon: Heart, color: '#4ade80' }, // Green
    { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: '#fb923c' }, // Orange
    { id: 'general', label: 'Altro', icon: LayoutGrid, color: '#9ca3af' } // Gray
];

export const getCategoryColor = (id) => {
    const cat = CATEGORIES.find(c => c.id === id);
    return cat ? cat.color : '#9ca3af';
};
