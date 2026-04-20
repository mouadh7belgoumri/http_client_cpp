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
  const [responseData, setResponseData] = useState<{ body?: string; headers?: string } | null>(null)

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
      <div className="flex h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100" key={`${selectedRequest?.method}-${selectedRequest?.path}`}>
        <ReqListSideBar onSelectRequest={setSelectedRequest} />
        <div className="flex-1 flex flex-col overflow-hidden shadow-2xl">
          <div className="flex-1 flex flex-col border-b border-gray-700/50">
            <SendReqBar selectedRequest={selectedRequest} onSendRequest={() => {
              if (selectedRequest && window.sendReq) {
                window.sendReq(selectedRequest)
                  .then((response) => {
                    setResponseData({
                      body: response.body,
                      headers: response.headers,
                    });
                  })
                  .catch((error) => {
                    console.error("Error sending request:", error);
                    setResponseData({
                      body: `Error: ${error.message}`,
                      headers: '',
                    });
                  });
              } else {
                console.warn("sendReq function is not defined on window or no request selected");
              }
            }} />
            <SendReqNav activeTab={sendActiveTab} onTabChange={setSendActiveTab} />
            {sendActiveTab === 'body' && (
              <div className="p-3 border-b border-gray-700/50 bg-gray-800/30 flex items-center gap-3">
                <label htmlFor="body-type" className="text-sm text-gray-300">
                  Body type
                </label>
                <select
                  id="body-type"
                  value={bodyType}
                  onChange={(e) => setBodyType(e.target.value as BodyType)}
                  className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 req-btn transition-colors"
                >
                  <option value="json">JSON</option>
                  <option value="xml">XML</option>
                  <option value="text">Text</option>
                  <option value="form-urlencoded">Form URL Encoded</option>
                </select>
              </div>
            )}
            <textarea
              key={`request-${selectedRequest?.method}-${selectedRequest?.path}-${sendActiveTab}`}
              placeholder={sendTabPlaceholders[sendActiveTab]}
              value={selectedRequest ? (
                sendActiveTab === 'headers'
                  ? (typeof selectedRequest.headers === 'string' ? selectedRequest.headers : JSON.stringify(selectedRequest.headers, null, 2))
                  : sendActiveTab === 'body'
                    ? (typeof selectedRequest.body === 'string' ? selectedRequest.body : JSON.stringify(selectedRequest.body, null, 2))
                    : ''
              ) : ''}
              className="flex-1 bg-gray-800/50 text-gray-100 p-4 border-none focus:outline-none text-sm font-mono resize-none placeholder-gray-500"
            />
          </div>
          <div className="flex-1 flex flex-col border-t border-gray-700/50">
            <ResNav activeTab={responseActiveTab} onTabChange={setResponseActiveTab} />
            <textarea
              key={`response-${selectedRequest?.method}-${selectedRequest?.path}-${responseActiveTab}`}
              readOnly
              placeholder={responseTabPlaceholders[responseActiveTab]}
              value={responseData ? (responseActiveTab === 'headers' ? responseData.headers || '' : responseData.body || '') : ''}
              className="flex-1 bg-gray-800/50 text-gray-300 p-4 border-none focus:outline-none text-sm font-mono resize-none placeholder-gray-500"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default App
