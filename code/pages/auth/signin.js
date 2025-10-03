import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function SignIn() {
    const router = useRouter();

    useEffect(() => {
        // Check if user is already authenticated
        const checkAuth = () => {
            const authToken = localStorage.getItem('cas_auth_token');
            const authUser = localStorage.getItem('cas_auth_user');

            if (authToken && authUser) {
                router.push('/');
                return;
            }

            // Auto-redirect to CAS login
            const SERVICE_URL = window.location.origin;
            const CAS_LOGIN_URL = `https://login.iiit.ac.in/cas/login?service=${encodeURIComponent(`${SERVICE_URL}/api/auth/cas-callback`)}`;
            window.location.href = CAS_LOGIN_URL;
        };

        checkAuth();
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head>
                <title>TAze - Login</title>
            </Head>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        TAze Queue Management
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in with your IIIT credentials
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-sm text-gray-600">
                                Redirecting to IIIT CAS login...
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
