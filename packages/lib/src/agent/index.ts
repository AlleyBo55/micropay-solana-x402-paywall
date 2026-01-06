// Agent Payment Utilities
// Server-side modules for autonomous AI agent payments

export {
    executeAgentPayment,
    getAgentBalance,
    hasAgentSufficientBalance,
    keypairFromBase58,
    generateAgentKeypair,
    type ExecuteAgentPaymentParams,
    type AgentPaymentResult,
} from './agentPayment';

export {
    createCreditSession,
    validateCreditSession,
    useCredit,
    addCredits,
    getRemainingCredits,
    type CreditSessionClaims,
    type CreditSessionData,
    type CreditSessionConfig,
    type CreditValidation,
    type UseCreditResult,
} from './credits';

// Shaw-style agent helper - the sexiest one-liner API
export {
    createPayingAgent,
    type PayingAgent,
    type PayingAgentConfig,
} from './payingAgent';
