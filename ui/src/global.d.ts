export { };

declare global {
  interface RequestCpp {
    method: string = 'GET';
    path: string = '/';
    headers: string = '';
    body: string = '';
    stored : 0 | 1 = 0;
  }

  interface ResponseCpp {
    body : string,
    headers : string,
    status : number
  }
  interface Window {
    getRequests?: () => Promise<RequestCpp[]>;
    sendReq? : (request: RequestCpp) => Promise<ResponseCpp>;
    createRequest? : (request : RequestCpp) => Promise<string>;
  }
}

