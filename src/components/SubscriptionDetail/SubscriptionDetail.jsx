import { X, Trash2, ExternalLink, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '../../utils/supabaseClient';
import './SubscriptionDetail.css';

const MOCK_HISTORY = [
    { month: 'Ott', amount: 1 },
    { month: 'Nov', amount: 1 },
    { month: 'Dic', amount: 1 },
    { month: 'Gen', amount: 1 },
];

export const SubscriptionDetail = ({ sub, onClose, onDelete }) => {
    // Simulate history data based on current price
    const data = MOCK_HISTORY.map(d => ({
        ...d,
        amount: sub.price
    }));

    const handleDelete = async () => {
        if (confirm(`Sicuro di voler cancellare ${sub.name}?`)) {
            try {
                const { error } = await supabase
                    .from('subscriptions')
                    .delete()
                    .eq('id', sub.id);

                if (error) throw error;
                onDelete();
                onClose();
            } catch (error) {
                console.error('Delete error:', error);
                alert('Errore eliminazione: ' + error.message);
            }
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass detail-modal">
                <button className="btn-icon close-position" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="detail-header">
                    <div className="detail-logo">{sub.logo}</div>
                    <div className="detail-title">
                        <h2>{sub.name}</h2>
                        <span className="detail-price">€{parseFloat(sub.price).toFixed(2)} <small>/{sub.cycle === 'yearly' ? 'anno' : 'mese'}</small></span>
                    </div>
                </div>

                <div className="detail-section">
                    <h3>Storico Spesa</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ background: '#111827', border: '1px solid #c3f53c', borderRadius: '8px' }}
                                    itemStyle={{ color: '#c3f53c' }}
                                    cursor={{ fill: 'rgba(195, 245, 60, 0.1)' }}
                                />
                                <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 3 ? '#c3f53c' : '#1f2937'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="detail-section">
                    <h3>Gestione</h3>

                    <a href={`https://www.google.com/search?q=disdire abbonamento ${sub.name}`} target="_blank" className="action-row" rel="noreferrer">
                        <div className="action-icon warning">
                            <ExternalLink size={20} />
                        </div>
                        <div className="action-info">
                            <h4>Disdici Abbonamento</h4>
                            <p>Vai alla pagina di cancellazione</p>
                        </div>
                    </a>

                    <button className="action-row" onClick={handleDelete}>
                        <div className="action-icon danger">
                            <Trash2 size={20} />
                        </div>
                        <div className="action-info">
                            <h4>Elimina da AbbonaMeno</h4>
                            <p>Rimuovi dal monitoraggio</p>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
