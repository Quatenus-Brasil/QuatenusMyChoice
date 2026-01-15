// Aceita somente Strings
const convertCurrencyToInt = (currency) => {
  if (!currency) {
    return currency;
  }

  const convertedCurrency = currency.replace(/[^0-9]+/g, "");

  return parseInt(convertedCurrency, 10);
};

const convertIntToCurrency = (currency) => {
  const convertedCurrency = currency / 100;

  return convertedCurrency.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
};

export { convertCurrencyToInt, convertIntToCurrency };
