import { useState, useEffect } from 'react';
import { Search, Mail, Trash2, Calendar, MessageSquare, X, Loader2, Send } from 'lucide-react';
import { enquiriesApi } from '../../lib/api';

interface Enquiry {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
    status: 'new' | 'read' | 'replied' | 'resolved';
}

const AdminEnquiriesPage = () => {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [sendingReply, setSendingReply] = useState(false);

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        setLoading(true);
        const response = await enquiriesApi.getAll({ search: searchTerm || undefined });
        if (response.data) {
            setEnquiries(response.data.enquiries || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchEnquiries();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this enquiry?')) {
            setDeleting(id);
            const response = await enquiriesApi.delete(id);
            if (response.error) {
                alert(response.error);
            } else {
                await fetchEnquiries();
                if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
            }
            setDeleting(null);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        const response = await enquiriesApi.updateStatus(id, status);
        if (response.error) {
            alert(response.error);
        } else {
            await fetchEnquiries();
            if (selectedEnquiry?.id === id) {
                setSelectedEnquiry({ ...selectedEnquiry, status: status as any });
            }
        }
    };

    const handleSendReply = async () => {
        if (!selectedEnquiry || !replyMessage.trim()) {
            alert('Please enter a reply message');
            return;
        }

        setSendingReply(true);
        try {
            // Send email reply via API
            const response = await enquiriesApi.sendReply(selectedEnquiry.id, {
                to: selectedEnquiry.email,
                subject: `Re: ${selectedEnquiry.subject}`,
                message: replyMessage,
            });

            if (response.error) {
                alert(response.error);
            } else {
                alert('Reply sent successfully!');
                setReplyMessage('');
                // Update status to replied
                await handleStatusUpdate(selectedEnquiry.id, 'replied');
            }
        } catch (error) {
            alert('Failed to send reply');
        } finally {
            setSendingReply(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredEnquiries = enquiries.filter(enq =>
        enq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enq.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enq.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800 font-serif">Enquiries</h1>
                <p className="text-gray-500 text-sm mt-1">View and manage form submissions</p>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>

            {/* Enquiries List */}
            {loading ? (
                <div className="p-8 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredEnquiries.map((enquiry) => (
                        <div
                            key={enquiry.id}
                            onClick={() => setSelectedEnquiry(enquiry)}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold">
                                        {enquiry.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 group-hover:text-primary transition-colors">{enquiry.name}</h3>
                                        <p className="text-xs text-gray-500">{formatDate(enquiry.created_at)}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => handleDelete(enquiry.id, e)}
                                    disabled={deleting === enquiry.id}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                                    title="Delete Enquiry"
                                >
                                    {deleting === enquiry.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 size={18} />
                                    )}
                                </button>
                            </div>

                            <h4 className="font-medium text-gray-800 mb-2 truncate">{enquiry.subject}</h4>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{enquiry.message}</p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Mail size={14} />
                                    {enquiry.email}
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    enquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                                    enquiry.status === 'read' ? 'bg-gray-100 text-gray-700' :
                                    enquiry.status === 'replied' ? 'bg-green-100 text-green-700' :
                                    'bg-purple-100 text-purple-700'
                                }`}>
                                    {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredEnquiries.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                    <p>No enquiries found</p>
                </div>
            )}

            {/* Enquiry Detail Modal */}
            {selectedEnquiry && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                            <h2 className="text-xl font-bold font-serif text-primary">Enquiry Details</h2>
                            <button onClick={() => setSelectedEnquiry(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-2xl">
                                    {selectedEnquiry.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">{selectedEnquiry.name}</h3>
                                    <p className="text-gray-500 flex items-center gap-2">
                                        <Mail size={16} /> {selectedEnquiry.email}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1 flex items-center gap-2">
                                        <Calendar size={14} /> {formatDate(selectedEnquiry.created_at)}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
                                <p className="text-lg font-bold text-gray-800 mb-6">{selectedEnquiry.subject}</p>

                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedEnquiry.message}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Status</label>
                                <div className="flex gap-2">
                                    {['new', 'read', 'replied', 'resolved'].map((status) => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusUpdate(selectedEnquiry.id, status)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                                                selectedEnquiry.status === status
                                                    ? 'bg-primary text-white border-primary'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Reply to Customer</label>
                                <textarea
                                    value={replyMessage}
                                    onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Type your reply message here..."
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 mb-2"
                                />
                                <button
                                    onClick={handleSendReply}
                                    disabled={sendingReply || !replyMessage.trim()}
                                    className="w-full px-4 py-2 bg-primary text-secondary font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                                >
                                    {sendingReply ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            Send Reply via Email
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 sticky bottom-0">
                            <button
                                onClick={(e) => {
                                    handleDelete(selectedEnquiry.id, e);
                                    setSelectedEnquiry(null);
                                }}
                                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors flex items-center gap-2"
                            >
                                <Trash2 size={18} /> Delete
                            </button>
                            <button
                                onClick={() => setSelectedEnquiry(null)}
                                className="px-6 py-2 bg-primary text-secondary font-bold rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminEnquiriesPage;
