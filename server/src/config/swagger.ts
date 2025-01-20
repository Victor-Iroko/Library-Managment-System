import swaggerAutogen from 'swagger-autogen';
import { getEnvVar } from '../utils/getEnv';


const doc = {
  info: {
    title: 'My Library Management system',
    description: 'API for a Library Management system'
  },
  host: `${getEnvVar('HOST', 'localhost')}:${getEnvVar('PORT', '3000')}`,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer'
      }
    },
    parameters: {
      page: {
        description: 'Select the page you want to take',
      },
      limit: {
        description: "Select how many you items you want to take for the given page"
      }
    },
    schemas: {
      
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['../app.ts'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen({openapi: '3.0.0'})(outputFile, routes, doc).then(async () => {
    await import('../app') // starts the server 
});

// swaggerAutogen({openapi: '3.0.0'})(outputFile, routes, doc)