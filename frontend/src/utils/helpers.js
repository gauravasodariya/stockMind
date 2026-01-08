export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat("en-IN").format(num);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const hasInstruction = (instruction) => {
  if (instruction === undefined || instruction === null) return false;
  if (typeof instruction === "string") return instruction.trim().length > 0;
  if (Array.isArray(instruction)) return instruction.length > 0;
  if (typeof instruction === "object")
    return Object.keys(instruction).length > 0;
  return Boolean(instruction);
};

export const updateIfInstruction = (instruction, updater) => {
  if (!hasInstruction(instruction)) return { updated: false };
  const result = typeof updater === "function" ? updater(instruction) : updater;
  return { updated: true, result };
};
