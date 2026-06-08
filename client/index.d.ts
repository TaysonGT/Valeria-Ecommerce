declare module '*.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.png' ;
declare module '*.jpg' ;
declare module '*.webp' ;
declare module 'swiper/css' ;
declare module 'swiper/css/navigation' ;

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string;
  readonly PROD: boolean;
  // add more env variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

