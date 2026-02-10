import { Trash2, AlertCircle } from 'lucide-react';
import './SubscriptionCard.css';

export const SubscriptionCard = ({ sub, onRemove }) => {
    return (
        <div className="sub-card glass">
            <div className="sub-logo">{sub.name[0]}</div>
            <div className="sub-info">
                <h3>{sub.name}</h3>
                <p className="sub-cycle">{sub.cycle === 'yearly' ? 'Annuale' : 'Mensile'} • Prossimo: {sub.nextInfo}</p>
            </div>
            <div className="sub-cost">
                <span className="price">€{parseFloat(sub.price).toFixed(2)}</span>
            </div>
            {sub.price > 15 && sub.cycle === 'monthly' && (
                <div className="smart-alert" title="Spesa elevata! Potresti risparmiare con un piano annuale.">
                    <AlertCircle size={14} color="#f43f5e" />
                </div>
            )}
        </div>
    );
};
