import './App.css'
import ReqSideBar from './components/ReqSideBar'
import ResNav from './components/ResNav'
import SendReqBar from './components/SendReqBar'
import SendReqNav from './components/SendReqNav'

function App() {
  return (
    <>
      <div className="flex h-screen bg-gray-900 text-gray-100">
        <ReqSideBar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col border-b border-gray-700">
            <SendReqBar />
            <SendReqNav />
            <textarea
              placeholder="Add headers..."
              className="flex-1 bg-gray-800 text-gray-100 p-4 border-none focus:outline-none text-sm font-mono resize-none"
            />
          </div>
          <div className="flex-1 flex flex-col border-t border-gray-700">
            <ResNav />
            <pre className="flex-1 bg-gray-800 p-4 overflow-auto text-sm font-mono text-gray-300">
              Response will appear here...
            </pre>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
