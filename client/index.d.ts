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
  readonly VITE_CLOUDINARY_CLOUD_NAME: string;
  readonly VITE_CLOUDINARY_API_KEY: string;
  readonly VITE_CLOUDINARY_API_SECRET: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

