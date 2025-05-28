/**
 * Type declarations for environment variables
 */

// Declare the Node.js process interface
declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_API_URL?: string;
    NODE_ENV?: "development" | "production" | "test";
  }
}

// Declare the Vite import.meta.env interface
interface ImportMeta {
  env: {
    VITE_API_URL?: string;
    MODE?: string;
    DEV?: boolean;
    PROD?: boolean;
  };
}
