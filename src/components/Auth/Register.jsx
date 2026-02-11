import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, ArrowRight, Loader } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import './Login.css'; // Reusing Login styles

export const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                // alert('Registrazione completata!'); // Optional
                navigate('/onboarding');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card glass">
                <div className="login-header">
                    <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Logo" className="login-logo" />
                    <h1>Crea Account</h1>
                    <p>Inizia a risparmiare con AbbonaMeno!</p>
                </div>

                {error && <div className="error-banner">{error}</div>}

                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <Mail className="input-icon" size={20} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <Lock className="input-icon" size={20} />
                        <input
                            type="password"
                            placeholder="Password (min 6 caratteri)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn-primary login-btn" disabled={loading}>
                        {loading ? <Loader className="spin" size={20} /> : <>Registrati <UserPlus size={20} /></>}
                    </button>
                </form>

                <div className="login-footer">
                    <p>Hai già un account? <Link to="/">Accedi</Link></p>
                </div>
            </div>
        </div>
    );
};
