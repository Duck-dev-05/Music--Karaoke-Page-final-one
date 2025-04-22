export const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string;

if (!PAYPAL_CLIENT_ID) {
  throw new Error('NEXT_PUBLIC_PAYPAL_CLIENT_ID is not defined');
}

export type PaymentErrorType = 
  | 'PAYMENT_CANCELLED'
  | 'PAYMENT_FAILED'
  | 'PAYPAL_ERROR'
  | 'ACTIVATION_FAILED'
  | 'NETWORK_ERROR';

export const PAYMENT_ERROR_MESSAGES = {
  PAYMENT_CANCELLED: 'Payment was cancelled. You can try again anytime.',
  PAYMENT_FAILED: 'Payment could not be processed. Please try again.',
  PAYPAL_ERROR: 'There was an error with PayPal. Please try again later.',
  ACTIVATION_FAILED: 'Could not activate premium features. Please contact support.',
  NETWORK_ERROR: 'Network connection error. Please check your internet connection.'
}; 