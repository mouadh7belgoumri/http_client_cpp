export { };

declare global {
  interface RequestCpp {
    method: string;
    path: string;
    headers: string;
    body: string;
  }

  interface ResponseCpp {
    body : string,
    headers : string,
    status : number
  }
  interface Window {
    getRequests?: () => Promise<RequestCpp[]>;
    sendReq? : (request: RequestCpp) => Promise<ResponseCpp>;
  }
}

