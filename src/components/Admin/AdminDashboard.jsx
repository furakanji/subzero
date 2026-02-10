import { Users, CreditCard, Activity, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

import { supabase } from '../../utils/supabaseClient';

export const AdminDashboard = ({ session }) => {
    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div className="admin-logo">
                    <button className="btn-icon" onClick={handleLogout} title="Esci">
                        <ArrowLeft size={24} />
                    </button>
                    <h2>SubZero Admin</h2>
                </div>
                <div className="admin-user">
                    <span>Admin User</span>
                    <div className="avatar">A</div>
                </div>
            </header>

            <div className="kpi-grid">
                <div className="kpi-card glass">
                    <div className="kpi-icon blue">
                        <Users size={24} />
                    </div>
                    <div className="kpi-info">
                        <span className="kpi-label">Utenti Totali</span>
                        <h3 className="kpi-value">1,248</h3>
                        <span className="kpi-trend positive">+12% vs ieri</span>
                    </div>
                </div>

                <div className="kpi-card glass">
                    <div className="kpi-icon green">
                        <CreditCard size={24} />
                    </div>
                    <div className="kpi-info">
                        <span className="kpi-label">Abbonamenti Tracciati</span>
                        <h3 className="kpi-value">5,892</h3>
                        <span className="kpi-trend positive">+24% vs ieri</span>
                    </div>
                </div>

                <div className="kpi-card glass">
                    <div className="kpi-icon purple">
                        <Activity size={24} />
                    </div>
                    <div className="kpi-info">
                        <span className="kpi-label">Volume Stimato</span>
                        <h3 className="kpi-value">€84k</h3>
                        <span className="kpi-trend neutral">Mensile</span>
                    </div>
                </div>
            </div>

            <div className="data-table glass">
                <div className="table-header">
                    <h3>Ultimi Iscritti</h3>
                    <button className="btn-text">Vedi tutti</button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Utente</th>
                            <th>Email</th>
                            <th>Data</th>
                            <th>Stato</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Marco Rossi</td>
                            <td>marco@gmail.com</td>
                            <td>Oggi, 10:23</td>
                            <td><span className="badge active">Attivo</span></td>
                        </tr>
                        <tr>
                            <td>Anna Verdi</td>
                            <td>anna@libero.it</td>
                            <td>Ieri, 18:45</td>
                            <td><span className="badge active">Attivo</span></td>
                        </tr>
                        <tr>
                            <td>Luigi Bianchi</td>
                            <td>luigi@hotmail.com</td>
                            <td>22 Gen, 09:12</td>
                            <td><span className="badge pending">Pending</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
