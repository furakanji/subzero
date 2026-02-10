import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient'; // Use Supabase
import { CATEGORIES, getCategoryColor } from '../../utils/categories';
import './AddSubscription.css';

export const AddSubscription = ({ onClose, onAdd }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [cycle, setCycle] = useState('monthly');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('general');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !price) return;
        setLoading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('No session');

            const newSub = {
                user_id: session.user.id,
                name,
                price: parseFloat(price),
                cycle,
                next_payment: date || new Date().toISOString(), // Use ISO date
                category,
                logo: name[0].toUpperCase()
            };

            const { error } = await supabase
                .from('subscriptions')
                .insert([newSub]);

            if (error) throw error;

            onAdd(); // Refresh list
            onClose();
        } catch (error) {
            console.error('Error adding:', error);
            alert('Errore: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content glass">
                <div className="modal-header">
                    <h2>Nuovo Abbonamento</h2>
                    <button className="btn-icon close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nome Servizio</label>
                        <input
                            type="text"
                            placeholder="es. Netflix, Palestra..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label>Costo (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Categoria</label>
                        <div className="category-grid">
                            {CATEGORIES.map(cat => {
                                const Icon = cat.icon;
                                const isSelected = category === cat.id;
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        className={`cat-btn ${isSelected ? 'active' : ''}`}
                                        onClick={() => setCategory(cat.id)}
                                        style={{
                                            borderColor: isSelected ? cat.color : 'transparent',
                                            background: isSelected ? `${cat.color}20` : 'rgba(255,255,255,0.05)'
                                        }}
                                        title={cat.label}
                                    >
                                        <Icon size={20} color={isSelected ? cat.color : '#9ca3af'} />
                                        <span className="cat-label" style={{ color: isSelected ? cat.color : '#9ca3af' }}>{cat.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Ciclo di Fatturazione</label>
                        <div className="cycle-selector">
                            <button
                                type="button"
                                className={`cycle-btn ${cycle === 'monthly' ? 'active' : ''}`}
                                onClick={() => setCycle('monthly')}
                            >
                                Mensile
                            </button>
                            <button
                                type="button"
                                className={`cycle-btn ${cycle === 'yearly' ? 'active' : ''}`}
                                onClick={() => setCycle('yearly')}
                            >
                                Annuale
                            </button>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Prossimo Pagamento (Opzionale)</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn-primary full-width">
                        Salva Abbonamento
                    </button>
                </form>
            </div>
        </div>
    );
};
