import { useEffect, useState } from "react";

interface ReqListSideBarProps {
    onSelectRequest: (request: RequestCpp) => void;
}

function ReqListSideBar({ onSelectRequest }: ReqListSideBarProps) {
    const [requests, setRequests] = useState<RequestCpp[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch("http://localhost:8000/requests");
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: RequestCpp[] = await response.json();
                setRequests(data);
            } catch (error) {
                console.error("Error fetching requests from backend:", error);
                setError(error instanceof Error ? error.message : "Failed to fetch requests");
                // Fallback to public requests.json if backend is not available
                try {
                    const fallbackResponse = await fetch("/requests.json");
                    if (fallbackResponse.ok) {
                        const fallbackData: RequestCpp[] = await fallbackResponse.json();
                        setRequests(fallbackData);
                        setError(null);
                    }
                } catch (fallbackError) {
                    console.error("Error loading fallback requests:", fallbackError);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);
    
    return (
        <>
            <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
                <h2 className="text-lg font-semibold mb-4">Requests</h2>
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition">
                    + New Request
                </button>
                {error && (
                    <p className="mt-4 text-sm text-yellow-400">
                        Note: Using fallback data. Backend not available: {error}
                    </p>
                )}
                {loading ? (
                    <p className="mt-4 text-sm text-gray-400">Loading requests...</p>
                ) : (
                    <p className="mt-4 text-sm text-gray-400">{requests.length} requests</p>
                )}
                <ul className="mt-4 space-y-2">
                    {requests.map((req, index) => (
                        <li key={index} className="text-gray-300 hover:bg-gray-600 p-2 rounded">
                            <button
                                onClick={() => onSelectRequest(req)}
                                className="w-full text-left">{req.method} {req.path}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default ReqListSideBar