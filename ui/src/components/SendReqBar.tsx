interface SendReqBarProps {
    selectedRequest: RequestCpp | null;
    onSendRequest?: () => void;
    onRequestChange?: (updatedRequest: RequestCpp) => void;
}

function SendReqBar({ selectedRequest, onSendRequest, onRequestChange }: SendReqBarProps) {
    return (
        <>
            <div className="p-4 border-b border-gray-700/50 space-y-3 bg-gray-800/20 backdrop-blur-sm">
                <div className="flex gap-3">
                    <select 
                        value={selectedRequest?.method || 'GET'}
                        onChange={(e) => {
                            if (selectedRequest && onRequestChange) {
                                onRequestChange({ ...selectedRequest, method: e.target.value });
                            }
                        }}
                        disabled={!selectedRequest}
                        className="bg-gray-800/80 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 req-btn transition-all hover:border-gray-600"
                    >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Enter URL..."
                        value={selectedRequest?.path || ''}
                        onChange={(e) => {
                            if (selectedRequest && onRequestChange) {
                                onRequestChange({ ...selectedRequest, path: e.target.value });
                            }
                        }}
                        disabled={!selectedRequest}
                        className="flex-1 bg-gray-800/80 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-gray-600"
                    />
                    <button 
                        onClick={onSendRequest}
                        disabled={!selectedRequest}
                        className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    )
}

export default SendReqBar