import { createContext } from "react";
import { Database } from "sql.js";

// We provide an undefined default value. If you consume without creating, beware of crashes
export const ContextDatabase = createContext<Database>(undefined as any);

export default ContextDatabase;
