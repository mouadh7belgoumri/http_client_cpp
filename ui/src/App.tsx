import { useState } from 'react'
import Editor from '@monaco-editor/react'
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [syncSideBarReq, setSyncSideBarReq] = useState<{ index: number; request: RequestCpp } | null>(null)
  const [responseData, setResponseData] = useState<{ body?: string; headers?: any } | null>(null)
  const [requestBody, setRequesBody] = useState<string>("")
  const [createRequestResponse, setCreateRequestResponse] = useState<string>("")
  console.log(createRequestResponse);
  

  let isSyntaxValid = true;
  if (bodyType === 'json' && requestBody.trim() !== '') {
    try {
      JSON.parse(requestBody);
    } catch {
      isSyntaxValid = false;
    }
  } else if (bodyType === 'xml' && requestBody.trim() !== '') {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(requestBody, "application/xml");
      const errorNode = doc.querySelector("parsererror");
      if (errorNode) {
        isSyntaxValid = false;
      }
    } catch {
      isSyntaxValid = false;
    }
  }

  const handleEditorWillMount = (monaco: any) => {
    monaco.editor.defineTheme('custom-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#00000000', // transparent background
      },
    });
  };

  return (
    <>
      <div className="flex h-screen bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
        <ReqListSideBar 
          onSelectRequest={(req, index) => {
            if (req) {
              setSelectedRequest(req);
              setSelectedIndex(index);
            } else {
              // when a request gets deleted and it's the selected one
              setSelectedRequest(null);
              setSelectedIndex(null);
            }
          }} 
          syncRequest={syncSideBarReq}
        />
        <div className="flex-1 flex flex-col overflow-hidden shadow-2xl">
          <div className="flex-1 flex flex-col border-b border-gray-700/50">
            <SendReqBar 
              isSendDisabled={!isSyntaxValid}
              selectedRequest={selectedRequest} 
              onRequestChange={(updatedReq) => {
                setSelectedRequest(updatedReq);
              }}
              onSendRequest={() => {
              if (selectedRequest && window.sendReq && window.createRequest) {
                // Update Sidebar immediately with latest edited details
                if (selectedIndex !== null) {
                  setSyncSideBarReq({ index: selectedIndex, request: selectedRequest });
                }

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
                if (selectedRequest.stored === 0) {
                  window.createRequest(selectedRequest)
                    .then((response) => {
                      setCreateRequestResponse(response);
                    });
                }
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
            <div className="flex-1 bg-gray-800/50 pt-2 pb-2">
              <Editor
                beforeMount={handleEditorWillMount}
                height="100%"
                theme="custom-dark"
                language={sendActiveTab === 'body' ? (bodyType === 'json' ? 'json' : bodyType === 'xml' ? 'xml' : 'plaintext') : 'json'}
                value={selectedRequest ? (
                  sendActiveTab === 'headers'
                    ? (typeof selectedRequest.headers === 'string' ? selectedRequest.headers : JSON.stringify(selectedRequest.headers, null, 2))
                    : sendActiveTab === 'body'
                      ? requestBody
                      : ''
                ) : ''}
                onChange={(value) => {
                  if (sendActiveTab === 'body') {
                    setRequesBody(value || '')
                  }
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  wordWrap: 'on',
                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>
          <div className="flex-1 flex flex-col border-t border-gray-700/50">
            <ResNav activeTab={responseActiveTab} onTabChange={setResponseActiveTab} />
            <div className="flex-1 bg-gray-800/50 pt-2 pb-2">
              <Editor
                beforeMount={handleEditorWillMount}
                height="100%"
                theme="custom-dark"
                language="json"
                value={responseData ? (responseActiveTab === 'headers' ? (() => {
                  if (!responseData.headers) return '';
                  if (typeof responseData.headers === 'object') {
                    return JSON.stringify(responseData.headers, null, 2);
                  }
                  try {
                    return JSON.stringify(JSON.parse(responseData.headers), null, 2);
                  } catch {
                    return String(responseData.headers);
                  }
                })() : (() => {
                  try {
                    return typeof responseData.body === 'string' ? JSON.stringify(JSON.parse(responseData.body), null, 2) : String(responseData.body || '');
                  } catch {
                    return String(responseData.body || '');
                  }
                })()) : ''}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  wordWrap: 'on',
                  fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
