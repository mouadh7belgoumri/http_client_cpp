export { };

interface RequestCpp {
  method: string;
  path: string;
  header: string;
  body: string;
}

declare global {
  interface RequestCpp {
    method: string;
    path: string;
    header: string;
    body: string;
  }
  interface Window {
    getRequests?: () => Promise<RequestCpp[]>;
  }
}

