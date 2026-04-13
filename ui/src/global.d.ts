export {};

interface test {
    message: string;
}

interface RequestCpp {
  method : string;
  path : string;
  header : string;
  body : string;
}

declare global {
  interface Window {
    getRequests?: () => Promise<RequestCpp[]>;
    makeFile?: (msg) => Promise<test>;
  }
}
