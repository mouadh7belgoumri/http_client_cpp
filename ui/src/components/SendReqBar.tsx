interface SendReqBarProps {
    selectedRequest: RequestCpp | null;
    onSendRequest?: () => void;
}

function SendReqBar({ selectedRequest, onSendRequest }: SendReqBarProps) {
    return (
        <>
            <div className="p-4 border-b border-gray-700/50 space-y-3 bg-gray-800/20 backdrop-blur-sm">
                <div className="flex gap-3">
                    <select className="bg-gray-800/80 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 req-btn transition-all hover:border-gray-600">
                        <option>{selectedRequest?.method || 'GET'}</option>
                        <option>GET</option>
                        <option>POST</option>
                        <option>PUT</option>
                        <option>DELETE</option>
                        <option>PATCH</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Enter URL..."
                        value={selectedRequest?.path || ''}
                        readOnly
                        className="flex-1 bg-gray-800/80 border border-gray-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all hover:border-gray-600"
                    />
                    <button 
                        onClick={onSendRequest}
                        disabled={!selectedRequest}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-all hover:shadow-lg hover:shadow-green-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    )
}

export default SendReqBar