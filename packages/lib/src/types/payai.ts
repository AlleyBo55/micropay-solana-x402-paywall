/**
 * PayAI Payment Format Types
 */

export type PayAIScheme = 'exact-evm' | 'exact-svm' | string;

export type PayAINetworkId = 
    | 'base' 
    | 'solana' 
    | 'solana-devnet'
    | 'polygon-amoy' 
    | string;

export interface PayAISvmAuthorization {
    message?: string;
    signatures?: string[];
}

export interface PayAIEvmAuthorization {
    from: string;
    to: string;
    value: string;
    data: string;
    validAfter: number;
    validBefore: number;
    nonce: string;
    v: number;
    r: string;
    s: string;
}

export interface PayAIPayload {
    scheme: PayAIScheme;
    networkId: PayAINetworkId;
    paymentDetails?: Record<string, any>;
    authorization: PayAISvmAuthorization | PayAIEvmAuthorization | Record<string, any>;
}
