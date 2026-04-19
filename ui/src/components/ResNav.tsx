
type ResponseTab = "body" | "headers";

interface ResNavProps {
    activeTab: ResponseTab;
    onTabChange: (tab: ResponseTab) => void;
}

function ResNav({ activeTab, onTabChange }: ResNavProps) {
    const getTabClass = (tabName: string) => {
        const baseClass = "px-4 py-3 text-sm font-semibold relative transition-colors";
        return activeTab === tabName
            ? `${baseClass} text-green-400`
            : `${baseClass} text-gray-400 hover:text-gray-300`;
    };

    return (
        <>
            <div className="flex border-b border-gray-700/50 bg-gray-800/30 backdrop-blur-sm px-2">
                <button
                    className={getTabClass("body")}
                    onClick={() => onTabChange("body")}
                >
                    Body
                    {activeTab === "body" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-400" />}
                </button>
                <button
                    className={getTabClass("headers")}
                    onClick={() => onTabChange("headers")}
                >
                    Headers
                    {activeTab === "headers" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-400" />}
                </button>
            </div>
        </>
    )
}

export default ResNav