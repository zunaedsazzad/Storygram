declare namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string; // Let TypeScript know this variable exists
    }
  }
  