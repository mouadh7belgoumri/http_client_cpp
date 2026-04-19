type SendTab = "headers" | "body" | "params";

interface SendReqNavProps {
    activeTab: SendTab;
    onTabChange: (tab: SendTab) => void;
}

function SendReqNav({ activeTab, onTabChange }: SendReqNavProps) {

    const getTabClass = (tabName: string) => {
        const baseClass = "px-4 py-3 text-sm font-semibold relative transition-colors";
        return activeTab === tabName
            ? `${baseClass} text-blue-400`
            : `${baseClass} text-gray-400 hover:text-gray-300`;
    };
    
    return (
        <>
            <div className="flex border-b border-gray-700/50 bg-gray-800/30 backdrop-blur-sm px-2">
                <button 
                    className={getTabClass("headers")}
                    onClick={() => onTabChange("headers")}
                >
                    Headers
                    {activeTab === "headers" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400" />}
                </button>
                <button 
                    className={getTabClass("body")}
                    onClick={() => onTabChange("body")}
                >
                    Body
                    {activeTab === "body" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400" />}
                </button>
                <button 
                    className={getTabClass("params")}
                    onClick={() => onTabChange("params")}
                >
                    Params
                    {activeTab === "params" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-400" />}
                </button>
            </div>
        </>
    )
}

export default SendReqNav