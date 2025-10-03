import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

export default function AuthError() {
    const router = useRouter();
    const { error } = router.query;

    useEffect(() => {
        // Auto-redirect to signin page after 5 seconds
        const timer = setTimeout(() => {
            router.push('/auth/signin');
        }, 5000);

        return () => clearTimeout(timer);
    }, [router]);

    const getErrorMessage = (error) => {
        switch (error) {
            case 'Configuration':
                return 'There is a problem with the server configuration.';
            case 'AccessDenied':
                return 'Access denied. You do not have permission to access this application.';
            case 'Verification':
                return 'The verification token has expired or has already been used.';
            default:
                return 'An authentication error occurred. Please try again.';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Head>
                <title>Authentication Error - TAze</title>
            </Head>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Authentication Error
                    </h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">Authentication Failed</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                {getErrorMessage(error)}
                            </p>
                            <p className="mt-4 text-xs text-gray-500">
                                Redirecting to login page in 5 seconds...
                            </p>
                            <button
                                onClick={() => router.push('/auth/signin')}
                                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
