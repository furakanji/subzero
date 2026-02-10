export const getAdvice = (subscriptions) => {
    const advice = [];
    const lowerName = (name) => name.toLowerCase();

    // 1. Netflix Optimization
    const netflix = subscriptions.find(s => lowerName(s.name).includes('netflix'));
    if (netflix && netflix.price >= 17.99 && netflix.cycle === 'monthly') {
        advice.push({
            id: 'netflix-save',
            title: 'Risparmia su Netflix',
            message: 'Passando al piano "Standard con pubblicità" potresti risparmiare fino a €12/mese.',
            saving: '€144/anno',
            action: 'link',
            url: 'https://www.netflix.com/changeplan'
        });
    }

    // 2. High Total Cost Warning
    const total = subscriptions.reduce((acc, s) => acc + s.price, 0);
    if (total > 100) {
        advice.push({
            id: 'high-spend',
            title: 'Spesa Mensile Elevata',
            message: `Stai spendendo oltre €100/mese in abbonamenti. Considera di tagliare i servizi che usi meno.`,
            saving: null,
            action: 'review'
        });
    }

    // 3. Spotify Family
    const spotify = subscriptions.find(s => lowerName(s.name).includes('spotify'));
    if (spotify && spotify.price >= 10.99 && spotify.price < 17.99) {
        advice.push({
            id: 'spotify-family',
            title: 'Spotify Duo/Family',
            message: 'Se vivi con qualcuno, il piano Duo o Family abbatte il costo per persona.',
            saving: '€3-5/mese',
            action: 'link',
            url: 'https://www.spotify.com/premium/'
        });
    }

    // 4. Default advice if nothing else matches but list is not empty
    if (advice.length === 0 && subscriptions.length > 0) {
        advice.push({
            id: 'general-audit',
            title: 'Revisione Periodica',
            message: 'È buona norma controllare gli estratti conto per abbonamenti "dimenticati" non in questa lista.',
            saving: 'Variabile',
            action: 'none'
        });
    }

    return advice;
};
