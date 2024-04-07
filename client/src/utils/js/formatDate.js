export const parseAndFormatDate = (dateString) => {
  const parts = dateString.split('-');

  if (parts.length === 3) {
    const formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
    return formattedDate;
  } else {
    return dateString;
  }
};
