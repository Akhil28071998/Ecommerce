
export const validatePaymentDetails = (details) => {
  return true;
};

export const processPayment = (amount, details) => {
  return Promise.resolve({ success: true, paymentId: "demo123" });
};
