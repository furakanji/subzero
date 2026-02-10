// Mock Data for MVP
const MOCK_SUBS = [
    { id: 1, name: 'Netflix', price: 17.99, cycle: 'monthly', nextInfo: '25 Gen', category: 'Streaming', logo: 'N' },
    { id: 2, name: 'Spotify', price: 10.99, cycle: 'monthly', nextInfo: '28 Gen', category: 'Music', logo: 'S' },
    { id: 3, name: 'Amazon Prime', price: 49.90, cycle: 'yearly', nextInfo: '15 Set', category: 'Shopping', logo: 'A' },
    { id: 4, name: 'Vodafone', price: 29.90, cycle: 'monthly', nextInfo: '01 Feb', category: 'Internet', logo: 'V' }
];

export const getSubscriptions = () => {
    const stored = localStorage.getItem('subzero_subs');
    if (!stored) {
        // Init with mock data for demo
        localStorage.setItem('subzero_subs', JSON.stringify(MOCK_SUBS));
        return MOCK_SUBS;
    }
    return JSON.parse(stored);
};

export const addSubscription = (sub) => {
    const subs = getSubscriptions();
    const newSub = { ...sub, id: Date.now() };
    const updated = [...subs, newSub];
    localStorage.setItem('subzero_subs', JSON.stringify(updated));
    return updated;
};

export const removeSubscription = (id) => {
    const subs = getSubscriptions();
    const updated = subs.filter(s => s.id !== id);
    localStorage.setItem('subzero_subs', JSON.stringify(updated));
    return updated;
};

export const calculateMonthlyTotal = (subs) => {
    return subs.reduce((acc, sub) => {
        let cost = parseFloat(sub.price);
        if (sub.cycle === 'yearly') cost = cost / 12;
        return acc + cost;
    }, 0).toFixed(2);
};
