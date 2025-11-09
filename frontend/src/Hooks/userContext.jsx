// contexts/UserContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { get } from '../util/util';

const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const data = await get('/userData');
            setUser(data);
        } catch (error) {
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateBalance = (newBalance) => {
        setUser(prev => ({ ...prev, balance: newBalance }));
    };

    return (
        <UserContext.Provider value={{ user, setUser, updateBalance, loading, fetchUser }}>
            {children}
        </UserContext.Provider>
    );
}

// Custom hook to use the context
export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within UserProvider');
    }
    return context;
}