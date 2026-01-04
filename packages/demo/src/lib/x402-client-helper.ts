import { encodePaymentSignatureHeader, decodePaymentRequiredHeader } from '@x402/core/http';

/**
 * Creates the Authorization header value for x402 authentication
 * 
 * @param signature - The payment signature/proof
 * @param paymentRequiredHeader - The WWW-Authenticate header value from the 402 response (without 'x402 ' prefix if possible, or stripped)
 */
export function createAuthorizationHeader(signature: string, paymentRequiredHeader: string): string {
    // Strip 'x402 ' or 'X402 ' prefix if present
    const cleanHeader = paymentRequiredHeader.replace(/^[Xx]402\s+/, '');

    const required = decodePaymentRequiredHeader(cleanHeader);

    // Construct payload using 'accepts' from requirements
    const payload = {
        accepted: required.accepts,
        client: {
            scheme: required.accepts.scheme,
            network: required.accepts.network,
        },
        payment: {
            signature
        }
    };

    const token = encodePaymentSignatureHeader(payload as any); // safe cast
    return `x402 ${token}`;
}
