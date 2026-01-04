import { encodePaymentSignatureHeader, decodePaymentRequiredHeader } from '@x402/core/http';

/**
 * Creates the Authorization header value for x402 authentication
 * 
 * @param signature - The payment signature/proof
 * @param paymentRequiredHeader - The WWW-Authenticate header value from the 402 response
 */
export function createX402AuthorizationHeader(signature: string, paymentRequiredHeader: string): string {
    // Strip 'x402 ' or 'X402 ' prefix if present
    const cleanHeader = paymentRequiredHeader.replace(/^[Xx]402\s+/, '');

    const required = decodePaymentRequiredHeader(cleanHeader);

    // Handle array or single object requirement
    const accepts = Array.isArray(required.accepts) ? required.accepts[0] : required.accepts;

    // Use the x402 SDK's expected format
    const payload = {
        scheme: accepts.scheme,
        network: accepts.network,
        payload: {
            signature
        }
    };

    // Let the SDK encode it properly
    const token = encodePaymentSignatureHeader(payload as any);
    return `x402 ${token}`;
}
