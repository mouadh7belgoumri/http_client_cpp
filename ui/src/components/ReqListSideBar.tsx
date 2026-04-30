import { useEffect, useState } from "react";

interface ReqListSideBarProps {
    onSelectRequest: (request: RequestCpp, index: number) => void;
    syncRequest?: { index: number; request: RequestCpp } | null;
}

function ReqListSideBar({ onSelectRequest, syncRequest }: ReqListSideBarProps) {
    const [requests, setRequests] = useState<RequestCpp[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    
    useEffect(() => {
        if (syncRequest && syncRequest.index !== null && syncRequest.index >= 0 && requests[syncRequest.index]) {
            setRequests(prev => {
                const newReqs = [...prev];
                newReqs[syncRequest.index] = syncRequest.request;
                return newReqs;
            });
        }
    }, [syncRequest]);

    useEffect(() => {
        const fetchRequests = async () => {
            if (window.getRequests) {
                try {
                    const requests: RequestCpp[] = await window.getRequests();
                    setRequests(requests);
                } catch (error) {
                    console.error("Error fetching requests:", error);
                }
            } else {
                console.warn("getRequests function is not defined on window");
            }
        };

        fetchRequests();
    }, []);
    
    const handleSelectRequest = (req: RequestCpp, index: number) => {
        setSelectedIndex(index);
        onSelectRequest(req, index);
    };

    const handleCreateNewRequest = () => {
        const newRequest: RequestCpp = {
            method: 'GET',
            path: 'https://',
            headers: '{}',
            body: '',
            stored: 0
        };
        setRequests((prev) => [newRequest, ...prev]);
        handleSelectRequest(newRequest, 0); // newly prepended request is at index 0
    };

    const handleDeleteRequest = async (e: React.MouseEvent, req: RequestCpp, index: number) => {
        e.stopPropagation();
        if (window.confirm("Are you sure you want to delete this request?")) {
            if (req.stored === 1 && req.id !== undefined && window.deleteRequest) {
                try {
                    await window.deleteRequest(req.id).then(() => window.alert("deleted request"));
                } catch (error) {
                    console.error("Error deleting request:", error);
                }
            }
            
            // Remove from the local UI
            setRequests((prev) => prev.filter((_, i) => prev[i].id !== req.id));
            
            // Adjust selected index if necessary
            if (selectedIndex === index) {
                setSelectedIndex(null);
                // We're casting here loosely because the parent component ideally expects something or null
                onSelectRequest(null as unknown as RequestCpp, -1);
            } else if (selectedIndex !== null && selectedIndex > index) {
                setSelectedIndex(selectedIndex - 1);
            }
        }
    };

    const getMethodColor = (method: string) => {
        const colors: Record<string, string> = {
            'GET': 'bg-blue-500/10 text-blue-400 border-blue-500/30',
            'POST': 'bg-green-500/10 text-green-400 border-green-500/30',
            'PUT': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
            'DELETE': 'bg-red-500/10 text-red-400 border-red-500/30',
            'PATCH': 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        };
        return colors[method] || 'bg-gray-500/10 text-gray-400 border-gray-500/30';
    };

    return (
        <>
            <div className="w-64 bg-gray-900/50 backdrop-blur-sm border-r border-gray-700/50 p-4 flex flex-col h-full shadow-xl">
                <h2 className="text-xl font-bold mb-4 bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Requests
                </h2>
                <button
                    onClick={handleCreateNewRequest}
                    className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 px-4 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20 mb-4"
                >
                    + New Request
                </button>
                <p className="text-xs text-gray-400 mb-4 font-medium">{requests.length} REQUESTS</p>
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    <ul className="space-y-2">
                        {requests.map((req, index) => (
                            <li key={index} className="relative group">
                                <button
                                    onClick={() => handleSelectRequest(req, index)}
                                    className={`w-full text-left p-3 pr-8 rounded-lg transition-all duration-200 border flex items-center gap-2 ${
                                        selectedIndex === index
                                            ? 'bg-gray-800 border-blue-500/50 shadow-lg shadow-blue-500/10'
                                            : 'bg-gray-800/40 border-gray-700/30 hover:bg-gray-800/60 hover:border-gray-600/50'
                                    }`}
                                >
                                    <span className={`text-xs font-bold px-2 py-1 rounded border min-w-fit flex-none ${getMethodColor(req.method)}`}>
                                        {req.method}
                                    </span>
                                    <span className="text-sm text-gray-300 truncate group-hover:text-gray-100 transition-colors">
                                        {req.path}
                                    </span>
                                </button>
                                <button
                                    onClick={(e) => handleDeleteRequest(e, req, index)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1 rounded hover:bg-gray-700/50"
                                    title="Delete request"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default ReqListSideBar