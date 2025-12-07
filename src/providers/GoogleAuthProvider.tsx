import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { useGoogleLogin, googleLogout } from '@react-oauth/google';

interface GoogleAuthContextType {
    accessToken: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
    error: string | null;
}

const GoogleAuthContext = createContext<GoogleAuthContextType | null>(null);

interface GoogleAuthProviderProps {
    children: ReactNode;
}

export function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
    const [accessToken, setAccessToken] = useState<string | null>(() => {
        // Try to restore from localStorage
        return localStorage.getItem('google_access_token');
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            setAccessToken(tokenResponse.access_token);
            localStorage.setItem('google_access_token', tokenResponse.access_token);
            setIsLoading(false);
            setError(null);
        },
        onError: (errorResponse) => {
            console.error('Google login error:', errorResponse);
            setError('로그인에 실패했습니다.');
            setIsLoading(false);
        },
        onNonOAuthError: (errorResponse) => {
            console.error('Non-OAuth error:', errorResponse);
            setError('로그인 중 오류가 발생했습니다.');
            setIsLoading(false);
        },
        scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.readonly',
    });

    const handleLogin = useCallback(() => {
        setIsLoading(true);
        setError(null);
        login();
    }, [login]);

    const handleLogout = useCallback(() => {
        googleLogout();
        setAccessToken(null);
        localStorage.removeItem('google_access_token');
    }, []);

    return (
        <GoogleAuthContext.Provider
            value={{
                accessToken,
                isLoggedIn: !!accessToken,
                isLoading,
                login: handleLogin,
                logout: handleLogout,
                error,
            }}
        >
            {children}
        </GoogleAuthContext.Provider>
    );
}

export function useGoogleAuth() {
    const context = useContext(GoogleAuthContext);
    if (!context) {
        throw new Error('useGoogleAuth must be used within a GoogleAuthProvider');
    }
    return context;
}
