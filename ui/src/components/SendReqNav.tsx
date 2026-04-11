

function SendReqNav() {
    return (
        <>
            <div className="flex border-b border-gray-700">
                <button className="px-4 py-2 border-b-2 border-blue-500 text-sm font-medium">Headers</button>
                <button className="px-4 py-2 text-gray-400 hover:text-gray-100 text-sm font-medium">Body</button>
                <button className="px-4 py-2 text-gray-400 hover:text-gray-100 text-sm font-medium">Params</button>
            </div>
        </>
    )
}

export default SendReqNav