import { useState } from 'react'
import './App.css'
import ReqListSideBar from './components/ReqListSideBar' 
import ResNav from './components/ResNav'
import SendReqBar from './components/SendReqBar'
import SendReqNav from './components/SendReqNav'

type SendTab = 'headers' | 'body' | 'params'
type ResponseTab = 'body' | 'headers'
type BodyType = 'json' | 'xml' | 'text' | 'form-urlencoded'

function App() {
  const [sendActiveTab, setSendActiveTab] = useState<SendTab>('headers')
  const [responseActiveTab, setResponseActiveTab] = useState<ResponseTab>('body')
  const [bodyType, setBodyType] = useState<BodyType>('json')
  const [selectedRequest, setSelectedRequest] = useState<RequestCpp | null>(null)

  const sendTabPlaceholders: Record<SendTab, string> = {
    headers: 'Add headers... (e.g. Authorization: Bearer <token>)',
    body: 'Add request body... (JSON, XML, text)',
    params: 'Add query params... (e.g. page=1&limit=10)',
  }

  const responseTabPlaceholders: Record<ResponseTab, string> = {
    body: 'Response body will appear here...',
    headers: 'Response headers will appear here...',
  }

  return (
    <>
      <div className="flex h-screen bg-gray-900 text-gray-100">
        <ReqListSideBar onSelectRequest={setSelectedRequest} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col border-b border-gray-700">
            <SendReqBar selectedRequest={selectedRequest} />
            <SendReqNav activeTab={sendActiveTab} onTabChange={setSendActiveTab} />
            {sendActiveTab === 'body' && (
              <div className="p-3 border-b border-gray-700 bg-gray-900/50 flex items-center gap-3">
                <label htmlFor="body-type" className="text-sm text-gray-300">
                  Body type
                </label>
                <select
                  id="body-type"
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value as BodyType)}
                  className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 req-btn"
                >
                  <option value="json">JSON</option>
                  <option value="xml">XML</option>
                  <option value="text">Text</option>
                  <option value="form-urlencoded">Form URL Encoded</option>
                </select>
              </div>
            )}
            <textarea
              key={selectedRequest?.path}
              placeholder={sendTabPlaceholders[sendActiveTab]}
              value={sendActiveTab === 'headers' && selectedRequest ? (typeof selectedRequest.header === 'string' ? selectedRequest.header : JSON.stringify(selectedRequest.header, null, 2)) : sendActiveTab === 'body' && selectedRequest ? (typeof selectedRequest.body === 'string' ? selectedRequest.body : JSON.stringify(selectedRequest.body, null, 2)) : ''}
              readOnly
              className="flex-1 bg-gray-800 text-gray-100 p-4 border-none focus:outline-none text-sm font-mono resize-none"
            />
          </div>
          <div className="flex-1 flex flex-col border-t border-gray-700">
            <ResNav activeTab={responseActiveTab} onTabChange={setResponseActiveTab} />
            <textarea
              key={`response-${selectedRequest?.path}`}
              readOnly
              placeholder={responseTabPlaceholders[responseActiveTab]}
              value={responseActiveTab === 'headers' && selectedRequest ? (typeof selectedRequest.header === 'string' ? selectedRequest.header : JSON.stringify(selectedRequest.header, null, 2)) : responseActiveTab === 'body' && selectedRequest ? (typeof selectedRequest.body === 'string' ? selectedRequest.body : JSON.stringify(selectedRequest.body, null, 2)) : ''}
              className="flex-1 bg-gray-800 text-gray-300 p-4 border-none focus:outline-none text-sm font-mono resize-none"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
