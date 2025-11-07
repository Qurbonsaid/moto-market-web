// Formatting utilities
export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('uz-UZ', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }) + ' so\'m';
};

export const formatDate = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

export const formatDateTime = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

export const formatQuantity = (quantity: number): string => {
  return `${quantity} dona`;
};

export const getFilterLabel = (filter: string): string => {
  const labels: Record<string, string> = {
    'bugun': 'Bugun',
    'bu_hafta': 'Bu hafta',
    'bu_oy': 'Bu oy',
    'barchasi': 'Barcha vaqt',
    'custom': 'Tanlangan davr',
  };
  return labels[filter] || 'Barcha vaqt';
};
