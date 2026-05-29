
import 'next-auth'
import { DefaultSession } from 'next-auth';

declare module 'next-auth'{
  interface User{
    _id?:string;
    isVerified?:boolean;
    isAcceptingMessage?:boolean;
    username?:string;
    token?:string;
  }
  interface Session{
    user:{
      _id?:string;
      isVerified?:boolean;
      isAcceptingMessage?:boolean;
      username?:string;
      token?:string;

    }& DefaultSession['user']
   
  }
}

declare module 'next-auth/jwt'{
  interface JWT{
    _id?:string;
    isVerified?:boolean;
    isAcceptingMessage?:boolean;
    username?:string;
    token?:string;
  }
}

// types/global.d.ts
// Add this at the top of your file, before your component
declare global {
  interface Window {
    turnstile: {
      render: (container: string | HTMLElement, params: TurnstileParams) => string;
      remove: (widgetId: string) => void;
    };
    onloadTurnstileCallback?: () => void;
  }
}

interface TurnstileParams {
  sitekey: string;
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
}


