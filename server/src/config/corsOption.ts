import { CorsOptions } from "cors";
import { CorsError} from "../errors/customError";
import { getEnvVar } from "../utils/getEnv";


const protocol = getEnvVar('PROTOCOL', getEnvVar('NODE_ENV') === "production" ? 'https' : 'http');
const host = getEnvVar('HOST', 'localhost')
const port = getEnvVar('PORT', '4000')

const allowedOrigins = [`${protocol}://${host}:${port}`]


export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
      // allow undefined during development
      const isDevelopment = getEnvVar('NODE_ENV') === "development";
      const checkAllowedOrigins = (origin && allowedOrigins.includes(origin)) || (isDevelopment && !origin);
      if (checkAllowedOrigins) {        
        callback(null, true);
      } else {
        callback(new CorsError("Not allowed by CORS"));
      }
    },
    credentials: true,
  };




  