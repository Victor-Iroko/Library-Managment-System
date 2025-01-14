import https from 'https';
import { getEnvVar } from './getEnv';
import logger from './logger';

// Define a function to make the payment
export const makePayment = async (email: string, amount: number) => {
    const params = JSON.stringify({
        email: email,
        amount: amount
    });

    const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${getEnvVar('PAYSTACK_SECRET_KEY')}`,
            'Content-Type': 'application/json'
        }
    };

    return new Promise<JSON>((resolve, reject) => {
        try {
            const req = https.request(options, res => {
                let data = '';
        
                res.on('data', (chunk) => {
                    data += chunk;
                });
        
                res.on('end', () => {
                    // Parse and log the result
                    try {
                        const parsedData: JSON = JSON.parse(data);
                        logger('payments').info(parsedData);
                        resolve(parsedData);
                    } catch (e) {
                        reject(`Error parsing response data: ${e}`);
                    }
                });
            }).on('error', error => {
                reject(error); // Reject on error
            });

            req.write(params); // Send the data
            req.end(); // End the request
        } catch (error) {
            reject(error); // Reject if there's any synchronous error
        }
    });
};


export const verifyPayment = async (reference: string) => {
    const options = {
    hostname: 'api.paystack.co',
    port: 443,
    path: `/transaction/verify/${reference}`,
    method: 'GET',
    headers: {
        Authorization: `Bearer ${getEnvVar('PAYSTACK_SECRET_KEY')}`
    }
    }

    return new Promise<JSON>((resolve, reject) => {
        const req = https.request(options, res => {
            let data = '';

            // Accumulate data chunks
            res.on('data', (chunk) => {
                data += chunk;
            });

            // Handle end of response
            res.on('end', () => {
                try {
                    const parsedData: JSON = JSON.parse(data);
                    logger('payments').info(parsedData)
                    resolve(parsedData);
                } catch (err) {
                    logger('payments').error(`Failed to parse JSON response from Paystack ${err}`)
                    reject(new Error('Failed to parse JSON response from Paystack'));
                }
            });
        });

        // Handle request errors
        req.on('error', (error) => {
            reject(new Error(`Request failed: ${error.message}`));
        });

        req.end();
    });
}

