

function ReqSideBar() {
    return (
        <>
            <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
                <h2 className="text-lg font-semibold mb-4">Requests</h2>
                <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition">
                    + New Request
                </button>
            </div>
        </>
    )
}

export default ReqSideBar