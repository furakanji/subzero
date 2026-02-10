import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Loader } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import './Onboarding.css';

const SERVICES_DATA = {
    'Intrattenimento': [
        { id: 'netflix', name: 'Netflix', price: 17.99, color: '#E50914' },
        { id: 'spotify', name: 'Spotify', price: 10.99, color: '#1DB954' },
        { id: 'disney', name: 'Disney+', price: 8.99, color: '#113CCF' },
        { id: 'prime', name: 'Amazon Prime', price: 4.99, color: '#00A8E1' },
        { id: 'dazn', name: 'DAZN', price: 30.99, color: '#F4E409' },
        { id: 'psplus', name: 'PS Plus', price: 8.99, color: '#00439C' },
        { id: 'appletv', name: 'Apple TV+', price: 9.99, color: '#000000' }
    ],
    'Casa & Utenze': [
        { id: 'enel', name: 'Enel Energia', price: 65.00, color: '#D52B1E' },
        { id: 'a2a', name: 'A2A Energia', price: 55.00, color: '#0090D0' },
        { id: 'vodafone', name: 'Vodafone', price: 29.90, color: '#E60000' },
        { id: 'tim', name: 'TIM', price: 34.90, color: '#004085' },
        { id: 'fastweb', name: 'Fastweb', price: 27.95, color: '#FFCC00' },
        { id: 'windtre', name: 'WindTre', price: 25.99, color: '#FF7900' }
    ],
    'Finanza & Banche': [
        { id: 'revolut', name: 'Revolut Metal', price: 13.99, color: '#000000' },
        { id: 'intesa', name: 'Intesa SP', price: 6.00, color: '#006C47' },
        { id: 'fineco', name: 'Fineco', price: 3.95, color: '#003366' },
        { id: 'satispay', name: 'Satispay', price: 0.00, color: '#E53E3E' },
        { id: 'amex', name: 'Amex Gold', price: 16.50, color: '#CFB53B' }
    ],
    'Delivery & Cibo': [
        { id: 'glovo', name: 'Glovo Prime', price: 5.99, color: '#FFC244' },
        { id: 'deliveroo', name: 'Deliveroo Plus', price: 6.99, color: '#00CCBC' },
        { id: 'ubereats', name: 'Uber One', price: 6.99, color: '#06C167' }
    ],
    'Lavoro & AI': [
        { id: 'chatgpt', name: 'ChatGPT', price: 20.00, color: '#10A37F' },
        { id: 'linkedin', name: 'LinkedIn', price: 29.99, color: '#0077B5' },
        { id: 'adobe', name: 'Adobe CC', price: 36.59, color: '#FF0000' },
        { id: 'midjourney', name: 'Midjourney', price: 10.00, color: '#FFFFFF' }
    ],
    'Salute & Benessere': [
        { id: 'gym', name: 'Palestra', price: 45.00, color: '#FFB800' },
        { id: 'headspace', name: 'Headspace', price: 12.99, color: '#F1D302' },
        { id: 'strava', name: 'Strava', price: 7.99, color: '#FC4C02' }
    ],
    'Utility': [
        { id: 'icloud', name: 'iCloud+', price: 2.99, color: '#007AFF' },
        { id: 'googleone', name: 'Google One', price: 1.99, color: '#4285F4' },
        { id: 'dropbox', name: 'Dropbox', price: 11.99, color: '#0061FF' }
    ]
};

export const Onboarding = () => {
    const [selected, setSelected] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const toggleService = (service, category) => {
        if (selected.find(s => s.id === service.id)) {
            setSelected(selected.filter(s => s.id !== service.id));
        } else {
            setSelected([...selected, { ...service, category }]);
        }
    };

    const totalCost = selected.reduce((acc, curr) => acc + curr.price, 0);

    const handleSave = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError || !session) {
                console.warn('Sessione non valida, redirect al login');
                navigate('/');
                return;
            }

            const subsToInsert = selected.map(s => ({
                user_id: session.user.id,
                name: s.name,
                price: s.price,
                category: s.category || 'Altro',
                cycle: 'monthly',
                logo: s.name[0],
                next_payment: new Date().toISOString()
            }));

            if (subsToInsert.length === 0) {
                navigate('/dashboard');
                return;
            }

            const { error } = await supabase
                .from('subscriptions')
                .insert(subsToInsert);

            if (error) {
                console.error('Supabase Error:', error);
                throw new Error(error.message || 'Errore durante il salvataggio');
            }

            navigate('/dashboard');
        } catch (err) {
            console.error('Save Error:', err);
            setErrorMsg('Errore: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onboarding-container">
            <header className="onboard-header">
                <h1>Quali servizi usi?</h1>
                <p>Seleziona quelli attivi per iniziare subito.</p>
            </header>

            <div className="categories-list">
                {Object.entries(SERVICES_DATA).map(([category, services]) => (
                    <div key={category} className="category-section">
                        <h3 className="category-title">{category}</h3>
                        <div className="services-grid">
                            {services.map(service => {
                                const isSelected = selected.find(s => s.id === service.id);
                                return (
                                    <button
                                        key={service.id}
                                        className={`service-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => toggleService(service, category)}
                                        style={{ '--brand-color': service.color }}
                                    >
                                        <div className="service-icon">
                                            {service.name[0]}
                                            {isSelected && <div className="check-badge"><Check size={12} /></div>}
                                        </div>
                                        <span className="service-name">{service.name}</span>
                                        <span className="service-price">€{service.price}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <div className={`bottom-bar glass ${selected.length > 0 ? 'visible' : ''}`}>
                <div className="total-info">
                    <span className="count">{selected.length} servizi</span>
                    <span className="monthly generic">~€{totalCost.toFixed(2)}/mese</span>
                </div>
                {errorMsg && <div style={{ color: '#ef4444', marginRight: '10px', fontSize: '0.9rem' }}>{errorMsg}</div>}
                <button className="btn-primary finish-btn" onClick={handleSave} disabled={loading}>
                    {loading ? <Loader className="spin" /> : <>Fatto <ArrowRight size={20} /></>}
                </button>
            </div>
        </div>
    );
};
