import { useEffect, useState } from 'react';
import { Save, Key, Loader2, Truck } from 'lucide-react';
import { authApi, settingsApi } from '../../lib/api';

const AdminSettingsPage = () => {
    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);

    // Shipping settings state
    const [shippingEnabled, setShippingEnabled] = useState(true);
    const [shippingFlatFee, setShippingFlatFee] = useState(500);
    const [shippingFreeThreshold, setShippingFreeThreshold] = useState(5000);
    const [loadingShipping, setLoadingShipping] = useState(true);
    const [shippingError, setShippingError] = useState<string | null>(null);
    const [shippingSuccess, setShippingSuccess] = useState(false);

    useEffect(() => {
        const fetchShippingSettings = async () => {
            setLoadingShipping(true);
            setShippingError(null);
            const response = await settingsApi.getShippingAdmin();
            if (response.error) {
                setShippingError(response.error);
            } else if (response.data?.settings) {
                const s = response.data.settings;
                setShippingEnabled(s.shipping_enabled);
                setShippingFlatFee(Math.round(s.shipping_flat_fee));
                setShippingFreeThreshold(Math.round(s.shipping_free_threshold));
            }
            setLoadingShipping(false);
        };
        fetchShippingSettings();
    }, []);

    const handleShippingSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setShippingError(null);
        setShippingSuccess(false);

        const response = await settingsApi.updateShippingAdmin({
            shipping_enabled: shippingEnabled,
            shipping_flat_fee: shippingFlatFee,
            shipping_free_threshold: shippingFreeThreshold,
        });

        if (response.error) {
            setShippingError(response.error);
        } else {
            setShippingSuccess(true);
            setTimeout(() => setShippingSuccess(false), 3000);
        }
    };

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError(null);
        setPasswordSuccess(false);

        // Validation
        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match');
            return;
        }

        setUpdatingPassword(true);

        // Call API to change password
        const response = await authApi.changePassword(currentPassword, newPassword);

        if (response.error) {
            setPasswordError(response.error);
        } else {
            setPasswordSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setPasswordSuccess(false), 3000);
        }
        
        setUpdatingPassword(false);
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

                    {passwordSuccess && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                            Password updated successfully!
                        </div>
                    )}
                    {passwordError && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            {passwordError}
                        </div>
                    )}
                    <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => {
                                    setCurrentPassword(e.target.value);
                                    setPasswordError(null);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                                disabled={updatingPassword}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => {
                                    setNewPassword(e.target.value);
                                    setPasswordError(null);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                                minLength={6}
                                disabled={updatingPassword}
                            />
                            <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setPasswordError(null);
                                }}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                required
                                disabled={updatingPassword}
                            />
                        </div>
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={updatingPassword}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updatingPassword ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Update Password</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Shipping Settings Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <Truck size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Shipping Settings</h2>
                            <p className="text-sm text-gray-500">
                                Control delivery fee rules for the store
                            </p>
                        </div>
                    </div>

                    {shippingSuccess && (
                        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                            Shipping settings updated successfully!
                        </div>
                    )}
                    {shippingError && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                            {shippingError}
                        </div>
                    )}

                    <form onSubmit={handleShippingSave} className="space-y-4 max-w-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Enable Delivery Fee
                                </label>
                                <p className="text-xs text-gray-500">
                                    Turn off to offer free delivery on all orders
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShippingEnabled(!shippingEnabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    shippingEnabled ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                                disabled={loadingShipping}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        shippingEnabled ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Delivery Fee (₹)
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    value={shippingFlatFee}
                                    onChange={(e) => setShippingFlatFee(Number(e.target.value) || 0)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    disabled={loadingShipping || !shippingEnabled}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Charged when order total is below free delivery threshold
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Free Delivery Above (₹)
                                </label>
                                <input
                                    type="number"
                                    min={0}
                                    value={shippingFreeThreshold}
                                    onChange={(e) =>
                                        setShippingFreeThreshold(Number(e.target.value) || 0)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    disabled={loadingShipping || !shippingEnabled}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Set to 0 to never auto-apply free delivery
                                </p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loadingShipping}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loadingShipping ? (
                                    <>
                                        <Loader2 size={18} className="animate-spin" />
                                        <span>Loading...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        <span>Save Shipping Settings</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSettingsPage;
