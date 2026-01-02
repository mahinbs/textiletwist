import { useState, useEffect } from 'react';
import { Search, Mail, Trash2, Calendar, MessageSquare, X } from 'lucide-react';

interface Enquiry {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    date: string;
    status: 'new' | 'read';
}

const AdminEnquiriesPage = () => {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

    useEffect(() => {
        const storedEnquiries = JSON.parse(localStorage.getItem('contact_enquiries') || '[]');
        setEnquiries(storedEnquiries);
    }, []);

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this enquiry?')) {
            const updatedEnquiries = enquiries.filter(enq => enq.id !== id);
            setEnquiries(updatedEnquiries);
            localStorage.setItem('contact_enquiries', JSON.stringify(updatedEnquiries));
            if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
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
            {/* Header */}
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
                                    <p className="text-xs text-gray-500">{formatDate(enquiry.date)}</p>
                                </div>
                            </div>
                            <button
                                onClick={(e) => handleDelete(enquiry.id, e)}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                title="Delete Enquiry"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <h4 className="font-medium text-gray-800 mb-2 truncate">{enquiry.subject}</h4>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{enquiry.message}</p>

                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Mail size={14} />
                            {enquiry.email}
                        </div>
                    </div>
                ))}
            </div>

            {filteredEnquiries.length === 0 && (
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
                                        <Calendar size={14} /> {formatDate(selectedEnquiry.date)}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subject</label>
                                <p className="text-lg font-bold text-gray-800 mb-6">{selectedEnquiry.subject}</p>

                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Message</label>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedEnquiry.message}</p>
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
