export { };

declare global {
  interface RequestCpp {
    method: string;
    path: string;
    headers: string;
    body: string;
  }
  interface Window {
    getRequests?: () => Promise<RequestCpp[]>;
  }
}

