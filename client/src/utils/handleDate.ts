export const formatDateddMMyyyy = (dateString: string) => {
  // 14 July, 2024
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();
  return `${day} ${month}, ${year}`;
};
