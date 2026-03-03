export const generateOTP = (length = 6) => {
  return Math.floor(
    Math.pow(10, length - 1) + Math.random() * Math.pow(10, length - 1),
  ).toString();
};

export const getOTPExpiry = (minutes) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

// Works with the Date Object stored in the Database
export const isOTPExpired = (expiryTime) => {
  if (!expiryTime) return true; // If no expiry exists, it is "expired"
  return new Date() > expiryTime;
};
