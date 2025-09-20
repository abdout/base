// Re-export from auth-init with lazy initialization
export {
  auth,
  signIn,
  signOut,
  update,
  handlers,
  runtime
} from "./auth-init";

// Also export GET and POST for backward compatibility
export { handlers as default } from "./auth-init";
export const { GET, POST } = {
  GET: async (...args: any[]) => {
    const { handlers } = await import("./auth-init");
    return handlers.GET(...args);
  },
  POST: async (...args: any[]) => {
    const { handlers } = await import("./auth-init");
    return handlers.POST(...args);
  }
};