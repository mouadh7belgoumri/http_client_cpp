type SendTab = "headers" | "body" | "params";

interface SendReqNavProps {
    activeTab: SendTab;
    onTabChange: (tab: SendTab) => void;
}

function SendReqNav({ activeTab, onTabChange }: SendReqNavProps) {

    const getTabClass = (tabName: string) => {
        const baseClass = "px-4 py-2 text-sm font-medium";
        return activeTab === tabName
            ? `${baseClass} border-b-2 border-blue-500 text-gray-100`
            : `${baseClass} text-gray-400 hover:text-gray-100`;
    };
    
    return (
        <>
            <div className="flex border-b border-gray-700">
                <button 
                    className={getTabClass("headers")}
                    onClick={() => onTabChange("headers")}
                >
                    Headers
                </button>
                <button 
                    className={getTabClass("body")}
                    onClick={() => onTabChange("body")}
                >
                    Body
                </button>
                <button 
                    className={getTabClass("params")}
                    onClick={() => onTabChange("params")}
                >
                    Params
                </button>
            </div>
        </>
    )
}

export default SendReqNav