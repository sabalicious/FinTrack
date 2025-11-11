import React, { useEffect, useState } from "react";

interface CurrencyRatesProps {
  displayedCurrencies?: string[];
}

const CurrencyRates: React.FC<CurrencyRatesProps> = ({
  displayedCurrencies = ["USD", "EUR"],
}) => {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch("https://open.er-api.com/v6/latest/RUB")
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setRates(data.rates);
      })
      .catch(() => setError("Не удалось получить курсы"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-sm">Загрузка курсов...</p>;
  if (error) return <p className="text-sm text-red-500">{error}</p>;
  if (!rates || Object.keys(rates).length === 0) return null;

  return (
    <ul className="flex gap-4 text-sm font-medium items-center">
      {Object.entries(rates)
        .filter(([currency]) => displayedCurrencies.includes(currency))
        .map(([currency, rate]) => (
          <li key={currency}>
            {currency}: {(1 / rate).toFixed(2)} RUB
          </li>
        ))}
    </ul>
  );
};

export default CurrencyRates;
