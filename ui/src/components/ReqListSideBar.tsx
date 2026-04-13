import { useEffect, useState } from "react";

interface RequestCpp {
  method : string;
  path : string;
  header : string;
  body : string;
}

function ReqListSideBar() {
    const [res, setRes] = useState<string>("");
    let reqs: RequestCpp[] = [];
    useEffect(() => {
        const fetchData = async () => {
            if (window.getRequests) {
                reqs = await window.getRequests();
            }
        }
        fetchData();
    }, []);

    return (
        <>
            <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
                <h2 className="text-lg font-semibold mb-4">Requests</h2>
                <button 
                onClick={async() => {
                    if (window.makeFile) {
                        const data = await window.makeFile("hello");
                        setRes(data.message);
                    }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition">
                    + New Request 
                </button>
                <p className="mt-4 text-sm text-gray-400">{res}</p>
                <ul className="mt-4 space-y-2">
                    {reqs.map((req, index) => (
                        <li key={index} className="text-gray-300 hover:bg-gray-600 p-2 rounded">
                            {req.path}
                        </li>
                    ))}
                </ul>

            </div>
        </>
    )
}

export default ReqListSideBar