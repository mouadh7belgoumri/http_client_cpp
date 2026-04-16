import { useEffect, useState } from "react";


interface RequestCpp {
  method : string;
  path : string;
  header : string;
  body : string;
}

function ReqListSideBar() {
    const [requests, setRequests] = useState<RequestCpp[]>([]);
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
    return (
        <>
            <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
                <h2 className="text-lg font-semibold mb-4">Requests</h2>
                <button 
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition">
                    + New Request 
                </button>
                <p className="mt-4 text-sm text-gray-400">{requests.length} requests</p>
                <ul className="mt-4 space-y-2">
                    {requests.map((req, index) => (
                        <li key={index} className="text-gray-300 hover:bg-gray-600 p-2 rounded">
                            {req.method} {req.path}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default ReqListSideBar