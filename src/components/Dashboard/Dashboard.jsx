import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient'; // Centralize import
import { SubscriptionCard } from '../Subscription/SubscriptionCard';
import { Plus, TrendingUp, Wallet, ShieldAlert, LogOut } from 'lucide-react';
import { AddSubscription } from '../AddSubscription/AddSubscription';
import { SubscriptionDetail } from '../SubscriptionDetail/SubscriptionDetail';
import { Analytics } from '../Analytics/Analytics';
import { getAdvice } from '../../utils/adviceEngine';
import './Dashboard.css';

export const Dashboard = ({ session }) => {
    const navigate = useNavigate();
    const [subs, setSubs] = useState([]);
    const [total, setTotal] = useState(0);
    const [view, setView] = useState('list'); // 'list' or 'analytics'
    const [showAdd, setShowAdd] = useState(false);
    const [selectedSub, setSelectedSub] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, [session]); // Reload if session changes

    const loadData = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('subscriptions')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setSubs(data || []);
            calculateTotal(data || []);
        } catch (error) {
            console.error('Error loading subs:', error);
        } finally {
            setLoading(false);
        }
    };

    // Helper for total calculation
    const calculateTotal = (data) => {
        const monthlyTotal = data.reduce((acc, sub) => {
            let cost = parseFloat(sub.price);
            if (sub.cycle === 'yearly') cost = cost / 12;
            return acc + cost;
        }, 0);
        setTotal(monthlyTotal.toFixed(2));
    };

    const handleRemove = async (id) => {
        if (confirm('Sicuro di voler terminare questo abbonamento?')) {
            try {
                const { error } = await supabase
                    .from('subscriptions')
                    .delete()
                    .eq('id', id);

                if (error) throw error;
                loadData(); // Refresh list
            } catch (error) {
                console.error('Error removing:', error);
                alert('Errore nella cancellazione');
            }
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="dashboard">
            <header className="brand-header">
                <div className="logo-container">
                    <img src={`${import.meta.env.BASE_URL}logo.png`} alt="AbbonaMeno Logo" className="brand-logo" />
                    <h1 className="brand-title">Abbona<span className="text-primary">Meno</span></h1>
                </div>
                <button className="btn-icon" onClick={handleLogout} title="Esci">
                    <LogOut size={20} />
                </button>
            </header>

            <div className="summary-card glass">
                <span className="label">Spesa Mensile Totale</span>
                <div className="amount-row">
                    <h1 className="amount">€{total}</h1>
                    <div className="trend-badge positive">
                        <TrendingUp size={16} /> +2%
                    </div>
                </div>
                <p className="summary-footer">Hai <strong>{subs.length}</strong> abbonamenti attivi</p>
            </div>

            <div className="section-title">
                <Wallet size={18} />
                <h2>I tuoi Servizi</h2>
                <div className="view-toggle">
                    <button className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>Lista</button>
                    <button className={view === 'analytics' ? 'active' : ''} onClick={() => setView('analytics')}>Analisi</button>
                </div>
            </div>

            {view === 'list' ? (
                <>
                    {/* Zero State */}
                    {subs.length === 0 && !loading && (
                        <div className="zero-state glass">
                            <div className="zero-icon">🚀</div>
                            <h3>Benvenuto su AbbonaMeno!</h3>
                            <p>Non hai ancora abbonamenti tracciati.</p>
                            <button className="btn-primary" onClick={() => navigate('/onboarding')}>
                                Inizia Setup Guidato
                            </button>
                        </div>
                    )}

                    <div className="subs-list">
                        {subs.map(sub => (
                            <div key={sub.id} onClick={() => setSelectedSub(sub)}>
                                <SubscriptionCard sub={sub} onRemove={handleRemove} />
                            </div>
                        ))}
                    </div>

                    {/* Smart Advice Section (Only show if we have data) */}
                    {subs.length > 0 && getAdvice(subs).map(item => (
                        <div key={item.id} className="advice-card glass">
                            <div className="advice-icon">
                                <ShieldAlert size={24} color="#fcd34d" />
                            </div>
                            <div className="advice-content">
                                <h4>{item.title}</h4>
                                <p>{item.message}</p>
                                {item.saving && <span className="saving-badge">Risparmi: {item.saving}</span>}
                            </div>
                        </div>
                    ))}
                </>
            ) : (
                <Analytics subscriptions={subs} />
            )}

            <button className="fab-add" onClick={() => setShowAdd(true)}>
                <Plus size={24} />
            </button>

            {showAdd && (
                <AddSubscription
                    onClose={() => setShowAdd(false)}
                    onAdd={loadData}
                />
            )}

            {selectedSub && (
                <SubscriptionDetail
                    sub={selectedSub}
                    onClose={() => setSelectedSub(null)}
                    onDelete={() => {
                        loadData();
                        setSelectedSub(null);
                    }}
                />
            )}
        </div>
    );
};
