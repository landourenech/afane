import { Revenue } from "./definition";

/**
 * Formate un montant en FCFA.
 *
 * Exemple :
 * 150000 -> 150 000 FCFA
 */
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XAF",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Formate une date selon le format français.
 *
 * Exemple :
 * 2026-08-10 -> 10 août 2026
 */
export const formatDateToLocal = (
  dateStr: string,
  locale: string = "fr-FR",
) => {
  const date = new Date(dateStr);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
    year: "numeric",
  };

  return new Intl.DateTimeFormat(locale, options).format(date);
};

/**
 * Génère les labels de l'axe Y du graphique.
 *
 * Exemple :
 *
 * 5 000 000
 * 4 000 000
 * 3 000 000
 * 2 000 000
 * 1 000 000
 * 0
 */
export const generateYAxis = (revenue: Revenue[]) => {
  if (!revenue.length) {
    return {
      yAxisLabels: ["0 FCFA"],
      topLabel: 0,
    };
  }

  const highestRecord = Math.max(
    ...revenue.map((month) => month.revenue),
  );

  const topLabel = Math.ceil(highestRecord / 100000) * 100000;

  const yAxisLabels: string[] = [];

  for (
    let i = topLabel;
    i >= 0;
    i -= 100000
  ) {
    yAxisLabels.push(
      `${new Intl.NumberFormat("fr-FR", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(i)} FCFA`,
    );
  }

  return {
    yAxisLabels,
    topLabel,
  };
};

/**
 * Génère les pages de pagination.
 *
 * Exemple :
 *
 * 1 ... 4 5 6 ... 20
 */
export const generatePagination = (
  currentPage: number,
  totalPages: number,
): (number | string)[] => {
  if (totalPages <= 0) {
    return [];
  }

  if (currentPage < 1) {
    currentPage = 1;
  }

  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  // Toutes les pages
  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, i) => i + 1,
    );
  }

  // Début
  if (currentPage <= 3) {
    return [
      1,
      2,
      3,
      "...",
      totalPages - 1,
      totalPages,
    ];
  }

  // Fin
  if (currentPage >= totalPages - 2) {
    return [
      1,
      2,
      "...",
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  // Milieu
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};