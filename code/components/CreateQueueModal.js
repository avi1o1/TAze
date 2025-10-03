import { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function CreateQueueModal({ isOpen, onClose, onQueueCreated }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        nextTicket: 1,
        currentTurn: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const authToken = localStorage.getItem('cas_auth_token');
            const response = await fetch('/api/queues', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    // Token expired, redirect to login
                    window.location.href = '/auth/signin';
                    return;
                }
                if (response.status === 403) {
                    throw new Error('Access denied. Only admins can create queues.');
                }
                throw new Error('Failed to create queue');
            }

            const result = await response.json();

            if (result.success) {
                onQueueCreated();
                onClose();
                setFormData({
                    title: '',
                    description: '',
                    nextTicket: 1,
                    currentTurn: 0
                });
            } else {
                throw new Error(result.error || 'Failed to create queue');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-2 sm:mx-0">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Create New Queue</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6">
                    {error && (
                        <div className="bg-red-100 border border-red-300 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
                            <span className="text-red-800 text-xs sm:text-sm">{error}</span>
                        </div>
                    )}

                    <div className="space-y-3 sm:space-y-4">
                        <div>
                            <label htmlFor="title" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Queue Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="e.g., Main Reception"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Brief description of this queue..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label htmlFor="currentTurn" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Current Turn
                                </label>
                                <input
                                    type="number"
                                    id="currentTurn"
                                    name="currentTurn"
                                    min="0"
                                    value={formData.currentTurn}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label htmlFor="nextTicket" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Next Ticket
                                </label>
                                <input
                                    type="number"
                                    id="nextTicket"
                                    name="nextTicket"
                                    min="1"
                                    value={formData.nextTicket}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 text-sm sm:text-base text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md font-medium transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.title.trim()}
                            className="flex-1 px-4 py-2 text-sm sm:text-base bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            {loading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span>Create Queue</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
