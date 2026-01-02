import { useState } from 'react';
import { Save, AlertTriangle, Key } from 'lucide-react';
import Modal from '../../components/common/Modal';

const AdminSettingsPage = () => {
    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Modal State
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);

    const handlePasswordUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        // Logic to update password would go here
        alert('Password update simulated');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleFactoryReset = () => {
        // Logic to reset would go here
        alert('Factory reset simulated');
        setIsResetModalOpen(false);
    };

    return (
        <div className="max-w-4xl">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 font-serif">Settings</h1>
                <p className="text-gray-500 text-sm mt-1">Manage admin account and system preferences</p>
            </div>

            <div className="space-y-8">
                {/* Password Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Key size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Change Password</h2>
                            <p className="text-sm text-gray-500">Update your admin account password</p>
                        </div>
                    </div>

                    <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                            />
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors"
                            >
                                <Save size={18} />
                                <span>Update Password</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <AlertTriangle size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Danger Zone</h2>
                            <p className="text-sm text-gray-500">Irreversible system actions</p>
                        </div>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-red-800 font-bold mb-1">Factory Reset</h3>
                            <p className="text-red-600 text-sm">
                                This will permanently delete all data including products, orders, customers, and settings.
                                <br />This action cannot be undone.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsResetModalOpen(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap"
                        >
                            Reset System
                        </button>
                    </div>
                </div>
            </div>

            {/* Reset Confirmation Modal */}
            <Modal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                title="Confirm Factory Reset"
                footer={
                    <>
                        <button
                            onClick={() => setIsResetModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleFactoryReset}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700"
                        >
                            Yes, Reset Everything
                        </button>
                    </>
                }
            >
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <AlertTriangle size={32} />
                    </div>
                    <p className="text-gray-800 font-bold text-lg mb-2">Are you absolutely sure?</p>
                    <p className="text-gray-600">
                        This action will wipe all data from the database. This process is irreversible and all your data will be lost permanently.
                    </p>
                    <div className="mt-4 p-3 bg-gray-100 rounded text-sm text-gray-500 font-mono">
                        Type "CONFIRM" to proceed (Simulation)
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default AdminSettingsPage;
