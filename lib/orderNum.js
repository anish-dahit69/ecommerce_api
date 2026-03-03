export const generateOrderNumber = () => {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "");
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `ORD${timestamp}${random}`;
};
