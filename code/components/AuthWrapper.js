import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const AuthWrapper = ({ children }) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = () => {
            const authToken = localStorage.getItem('cas_auth_token');
            const authUser = localStorage.getItem('cas_auth_user');
            const authEmail = localStorage.getItem('cas_auth_email');
            const authTimestamp = localStorage.getItem('cas_auth_timestamp');

            // Check if auth is valid (not older than 24 hours)
            if (authToken && authUser && authTimestamp) {
                const tokenAge = Date.now() - parseInt(authTimestamp);
                const maxAge = 24 * 60 * 60 * 1000; // 24 hours

                if (tokenAge < maxAge) {
                    setUser({
                        name: authUser,
                        email: authEmail,
                        id: authUser
                    });
                    setIsAuthenticated(true);
                    setIsLoading(false);
                    return;
                } else {
                    // Token expired, clear storage
                    localStorage.removeItem('cas_auth_token');
                    localStorage.removeItem('cas_auth_user');
                    localStorage.removeItem('cas_auth_email');
                    localStorage.removeItem('cas_auth_timestamp');
                }
            }

            // Not authenticated, redirect to signin
            setIsLoading(false);
            router.push('/auth/signin');
        };

        checkAuth();
    }, [router]);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        );
    }

    // Show loading while redirecting
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Redirecting to login...</p>
            </div>
        );
    }

    // Render children if authenticated, passing user info
    return children;
};

export default AuthWrapper;
