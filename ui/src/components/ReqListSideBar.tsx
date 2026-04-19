import { useEffect, useState } from "react";

interface ReqListSideBarProps {
    onSelectRequest: (request: RequestCpp) => void;
}

function ReqListSideBar({ onSelectRequest }: ReqListSideBarProps) {
    const [requests, setRequests] = useState<RequestCpp[]>([]);
    const [selectedPath, setSelectedPath] = useState<string | null>(null);
    
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
    
    const handleSelectRequest = (req: RequestCpp) => {
        setSelectedPath(req.path);
        onSelectRequest(req);
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
                <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    Requests
                </h2>
                <button
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 px-4 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20 mb-4"
                >
                    + New Request
                </button>
                <p className="text-xs text-gray-400 mb-4 font-medium">{requests.length} REQUESTS</p>
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    <ul className="space-y-2">
                        {requests.map((req, index) => (
                            <li key={index}>
                                <button
                                    onClick={() => handleSelectRequest(req)}
                                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 border flex items-center gap-2 group ${
                                        selectedPath === req.path
                                            ? 'bg-gray-800 border-blue-500/50 shadow-lg shadow-blue-500/10'
                                            : 'bg-gray-800/40 border-gray-700/30 hover:bg-gray-800/60 hover:border-gray-600/50'
                                    }`}
                                >
                                    <span className={`text-xs font-bold px-2 py-1 rounded border ${getMethodColor(req.method)}`}>
                                        {req.method}
                                    </span>
                                    <span className="text-sm text-gray-300 truncate group-hover:text-gray-100 transition-colors">
                                        {req.path}
                                    </span>
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