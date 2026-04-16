interface SendReqBarProps {
    selectedRequest: RequestCpp | null;
}

function SendReqBar({ selectedRequest }: SendReqBarProps) {
    return (
        <>
            <div className="p-4 border-b border-gray-700 space-y-3">
                <div className="flex gap-2">
                    <select className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 req-btn">
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
                        className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition">
                        Send
                    </button>
                </div>
            </div>
        </>
    )
}

export default SendReqBar