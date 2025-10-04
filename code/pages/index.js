import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, AlertCircle, Plus, SkipForward, Ticket, Trash2, LogOut, User, X } from 'lucide-react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import AuthWrapper from '../components/AuthWrapper';
import CreateQueueModal from '../components/CreateQueueModal';

export default function Home() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [queues, setQueues] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [lastSync, setLastSync] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    // Check if current user is admin
    const checkAdminStatus = async () => {
        try {
            const authToken = localStorage.getItem('cas_auth_token');
            const response = await fetch('/api/auth/status', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                setIsAdmin(result.isAdmin || false);
            }
        } catch (err) {
            console.log('Could not check admin status:', err);
            setIsAdmin(false);
        }
    };

    // Get user from localStorage
    useEffect(() => {
        const authUser = localStorage.getItem('cas_auth_user');
        const authEmail = localStorage.getItem('cas_auth_email');
        if (authUser) {
            setUser({
                name: authUser,
                email: authEmail
            });
        }
        checkAdminStatus();
    }, []);

    // Handle logout
    const handleLogout = async () => {
        // Clear localStorage
        localStorage.removeItem('cas_auth_token');
        localStorage.removeItem('cas_auth_user');
        localStorage.removeItem('cas_auth_email');
        localStorage.removeItem('cas_auth_timestamp');

        // Redirect to CAS logout then to signin
        window.location.href = 'https://login.iiit.ac.in/cas/logout?service=' + encodeURIComponent(window.location.origin + '/auth/signin');
    };

    // Load data from MongoDB via API
    const loadQueues = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const authToken = localStorage.getItem('cas_auth_token');
            const response = await fetch('/api/queues', {
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired, redirect to login
                    handleLogout();
                    return;
                }
                throw new Error('Failed to fetch queues from database');
            }

            const result = await response.json();

            if (result.success) {
                setQueues(result.data);
                setLastSync(new Date());
            } else {
                throw new Error(result.error || 'Failed to load queues');
            }
        } catch (err) {
            setError(`Error loading data: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle next turn action
    const handleNextTurn = async (queueId) => {
        try {
            const authToken = localStorage.getItem('cas_auth_token');
            const response = await fetch(`/api/queues/${queueId}/next-turn`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    handleLogout();
                    return;
                }
                throw new Error('Failed to update current turn');
            }

            // Reload queues to get updated data
            await loadQueues();
        } catch (err) {
            setError(`Error updating turn: ${err.message}`);
        }
    };

    // Handle new ticket action
    const handleNewTicket = async (queueId) => {
        try {
            const authToken = localStorage.getItem('cas_auth_token');
            const response = await fetch(`/api/queues/${queueId}/new-ticket`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    handleLogout();
                    return;
                }
                throw new Error('Failed to issue new ticket');
            }

            // Reload queues to get updated data
            await loadQueues();
        } catch (err) {
            setError(`Error issuing ticket: ${err.message}`);
        }
    };

    // Handle leave queue action
    const handleLeaveQueue = async (queueId) => {
        try {
            const authToken = localStorage.getItem('cas_auth_token');
            const response = await fetch(`/api/queues/${queueId}/leave-queue`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    handleLogout();
                    return;
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to leave queue');
            }

            // Reload queues to get updated data
            await loadQueues();
        } catch (err) {
            setError(`Error leaving queue: ${err.message}`);
        }
    };

    // Handle delete queue action
    const handleDeleteQueue = async (queueId, queueTitle) => {
        if (!confirm(`Are you sure you want to delete the queue "${queueTitle}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const authToken = localStorage.getItem('cas_auth_token');
            const response = await fetch(`/api/queues/${queueId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    handleLogout();
                    return;
                }
                if (response.status === 403) {
                    throw new Error('Access denied. Only admins can delete queues.');
                }
                throw new Error('Failed to delete queue');
            }

            // Reload queues to get updated data
            await loadQueues();
        } catch (err) {
            setError(`Error deleting queue: ${err.message}`);
        }
    };

    // Load data on component mount
    useEffect(() => {
        loadQueues();

        const interval = setInterval(() => {
            loadQueues();
        }, 15000); // Auto-reload every 15 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [loadQueues]);

    return (
        <AuthWrapper>
            <Head>
                <title>TAze</title>
                <meta name="description" content="Effortless Queue Management System" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="min-h-screen bg-gray-100 p-3 sm:p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-10 space-y-4 sm:space-y-0">
                        <div className="text-center sm:text-left flex-1">
                            <h1 className="text-4xl sm:text-4xl lg:text-5xl font-extrabold text-black mb-2 sm:mb-3">TAze</h1>
                            <p className="text-base sm:text-lg text-gray-700">Queue Management System</p>
                        </div>

                        {/* User Info and Logout */}
                        <div className="flex justify-between space-x-2 sm:space-x-4 bg-white rounded-lg shadow-md p-2 sm:p-3">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                                <User className="w-5 h-5text-gray-600" />
                                <div className="flex flex-col">
                                    <span className="text-xs sm:text-sm font-medium text-gray-700 max-w-20 sm:max-w-none">
                                        {user?.name || user?.email || 'User'}
                                    </span>
                                    {isAdmin && (
                                        <span className="text-xs text-blue-600 font-semibold">Admin</span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 text-white px-2 py-1 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="bg-red-100 border border-red-300 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-start sm:items-center shadow-md">
                            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-700 mr-2 sm:mr-3 flex-shrink-0 mt-0.5 sm:mt-0" />
                            <span className="text-red-800 font-medium text-sm sm:text-base">{error}</span>
                        </div>
                    )}

                    {/* Sync Status */}
                    <div className="bg-white rounded-lg shadow-lg p-3 sm:p-5 mb-6 sm:mb-8 flex flex-row items-center justify-between space-x-4">
                        <div className="flex items-center">
                            <button
                                onClick={loadQueues}
                                disabled={loading}
                                className="bg-blue-600 hover:bg-blue-700 text-white mr-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition disabled:opacity-50"
                            >
                                <RefreshCw className={`w-5 h-5 sm:w-6 sm:h-6 text-gray-200 ${loading ? ' animate-spin' : ''}`} />
                            </button>
                            <span className="text-gray-800 font-medium text-sm sm:text-base">
                                {loading ? 'Syncing...' : 'MongoDB Connected'}
                            </span>
                        </div>
                        {lastSync && (
                            <span className="text-xs sm:text-sm text-gray-500 italic">
                                Last sync: {lastSync.toLocaleTimeString()}
                            </span>
                        )}
                    </div>

                    {/* Queues Cards */}
                    <div className="space-y-4 sm:space-y-6">
                        {queues.map((queue) => {
                            const waitingCount = queue.ticketQueue ? queue.ticketQueue.length : 0;
                            const canAdvanceTurn = waitingCount > 0 || queue.currentlyServing;
                            const currentlyServing = queue.currentlyServing || 'No one';
                            const nextInLine = queue.ticketQueue && queue.ticketQueue.length > 0 ? queue.ticketQueue[0] : 'No one';

                            return (
                                <div
                                    key={queue._id}
                                    className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border hover:shadow-xl transition-shadow"
                                >
                                    {/* Header: Title + Delete Button */}
                                    <div className="flex justify-between items-start sm:items-center mb-4 sm:mb-6">
                                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">{queue.title}</h2>
                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDeleteQueue(queue._id, queue.title)}
                                                disabled={loading}
                                                className="bg-red-500 hover:bg-red-600 text-white p-1.5 sm:p-2 rounded-lg transition disabled:opacity-50 flex items-center justify-center shadow-md ml-2"
                                                title="Delete Queue (Admin Only)"
                                            >
                                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Currently Serving - Most Prominent */}
                                    <div className="text-center mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                                        <p className="text-sm sm:text-lg font-semibold text-gray-600 mb-1 sm:mb-2">CURRENTLY SERVING</p>
                                        <p className="text-2xl sm:text-3xl lg:text-4xl font-black text-blue-600 mb-1 sm:mb-2 break-words">
                                            {currentlyServing}
                                        </p>
                                    </div>

                                    {/* People Waiting & Next Person in same row */}
                                    <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3 sm:mb-4">
                                        <div className="bg-orange-50 rounded-lg p-3 sm:p-4 border border-orange-100 text-center">
                                            <p className="text-xs sm:text-sm font-semibold text-orange-700 mb-1">PEOPLE WAITING</p>
                                            <p className="text-2xl sm:text-3xl font-bold text-orange-600">
                                                {waitingCount}
                                            </p>
                                        </div>
                                        <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-100 text-center">
                                            <p className="text-xs sm:text-sm font-semibold text-green-700 mb-1">NEXT IN LINE</p>
                                            <p className="text-lg sm:text-xl font-bold text-green-600 break-words">
                                                {nextInLine}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Queue List */}
                                    {/* {queue.ticketQueue && queue.ticketQueue.length > 0 && (
                                        <div className="mb-4 sm:mb-6">
                                            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100">
                                                <p className="text-xs font-semibold text-gray-600 mb-2">QUEUE</p>
                                                <div className="max-h-32 overflow-y-auto">
                                                    <ol className="text-xs sm:text-sm text-gray-700 space-y-1">
                                                        {queue.ticketQueue.map((person, index) => {
                                                            const isCurrentUser = person === user?.name;
                                                            return (
                                                                <li key={index} className={`flex items-center space-x-2 p-1 rounded ${isCurrentUser ? 'bg-yellow-100 border border-yellow-300' : ''}`}>
                                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isCurrentUser ? 'bg-yellow-200 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                                                        {index + 1}
                                                                    </span>
                                                                    <span className={`break-words ${isCurrentUser ? 'font-semibold text-yellow-800' : ''}`}>
                                                                        {person} {isCurrentUser && '(You)'}
                                                                    </span>
                                                                </li>
                                                            );
                                                        })}
                                                    </ol>
                                                </div>
                                            </div>
                                        </div>
                                    )} */}

                                    {/* Description */}
                                    {queue.description && (
                                        <div className="mb-4 sm:mb-6">
                                            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-100">
                                                <p className="text-xs font-semibold text-gray-600 mb-1 sm:mb-2">DESCRIPTION</p>
                                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                                    {queue.description}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                        {isAdmin ? (
                                            // Admin view: Only show Next Turn button
                                            <button
                                                onClick={() => handleNextTurn(queue._id)}
                                                disabled={loading || !canAdvanceTurn}
                                                className={`flex-1 px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg font-bold transition flex items-center justify-center space-x-2 shadow-md text-sm sm:text-base ${canAdvanceTurn
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105'
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                    } disabled:opacity-50`}
                                                title={!canAdvanceTurn ? 'No one to serve' : waitingCount > 0 ? 'Call next person (Admin Only)' : 'Finish serving current person (Admin Only)'}
                                            >
                                                <SkipForward className="w-4 h-4 sm:w-5 sm:h-5" />
                                                <span>{waitingCount > 0 ? 'Next Turn' : 'Finish Serving'}</span>
                                            </button>
                                        ) : (
                                            // Non-admin view: Show Join/Leave queue buttons
                                            (() => {
                                                const userInQueue = queue.ticketQueue && queue.ticketQueue.includes(user?.name);
                                                const userPosition = userInQueue ? queue.ticketQueue.indexOf(user?.name) + 1 : null;

                                                return (
                                                    <>
                                                        {userInQueue ? (
                                                            // User is in queue - show position and leave button
                                                            <>
                                                                <div className="flex-1 bg-yellow-50 border-2 border-yellow-200 px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg flex items-center justify-center space-x-2 text-sm sm:text-base">
                                                                    <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                                                                    <span className="font-semibold text-yellow-800">
                                                                        Your position: #{userPosition}
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleLeaveQueue(queue._id)}
                                                                    disabled={loading}
                                                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg font-bold transition disabled:opacity-50 flex items-center justify-center space-x-2 shadow-md transform hover:scale-105 text-sm sm:text-base"
                                                                >
                                                                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                                                                    <span>Leave Queue</span>
                                                                </button>
                                                            </>
                                                        ) : (
                                                            // User is not in queue - show join button
                                                            <button
                                                                onClick={() => handleNewTicket(queue._id)}
                                                                disabled={loading}
                                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg font-bold transition disabled:opacity-50 flex items-center justify-center space-x-2 shadow-md transform hover:scale-105 text-sm sm:text-base"
                                                            >
                                                                <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
                                                                <span>Join Queue</span>
                                                            </button>
                                                        )}
                                                    </>
                                                );
                                            })()
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty State */}
                    {!loading && queues.length === 0 && (
                        <div className="text-center py-8 sm:py-12">
                            <div className="text-gray-400 mb-4">
                                <Plus className="w-12 h-12 sm:w-16 sm:h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Queues Found</h3>
                            <p className="text-sm sm:text-base text-gray-500 mb-4 px-4">
                                {isAdmin ? 'Get started by creating your first queue.' : 'No queues are currently available.'}
                            </p>
                            {isAdmin && (
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-md text-sm sm:text-base font-semibold transition"
                                >
                                    Create Queue
                                </button>
                            )}
                        </div>
                    )}

                    {/* Floating Action Button */}
                    {queues.length > 0 && isAdmin && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-lg flex items-center justify-center transition transform hover:scale-110"
                            title="Create Queue (Admin Only)"
                        >
                            <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    )}
                </div>

                {/* Create Queue Modal */}
                <CreateQueueModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onQueueCreated={loadQueues}
                />
            </div>
        </AuthWrapper>
    );
}
