import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getCurrencies, Currency } from '../api/currencies';

// Карта кодов валют на флаги стран
const currencyFlags: Record<string, string> = {
  USD: '🇺🇸',
  EUR: '🇪🇺',
  GBP: '🇬🇧',
  JPY: '🇯🇵',
  AUD: '🇦🇺',
  CAD: '🇨🇦',
  CHF: '🇨🇭',
  CNY: '🇨🇳',
  SEK: '🇸🇪',
  NZD: '🇳🇿',
  MXN: '🇲🇽',
  SGD: '🇸🇬',
  HKD: '🇭🇰',
  NOK: '🇳🇴',
  KRW: '🇰🇷',
  TRY: '🇹🇷',
  INR: '🇮🇳',
  BRL: '🇧🇷',
  ZAR: '🇿🇦',
  PLN: '🇵🇱',
  THB: '🇹🇭',
  IDR: '🇮🇩',
  HUF: '🇭🇺',
  CZK: '🇨🇿',
  ILS: '🇮🇱',
  CLP: '🇨🇱',
  PHP: '🇵🇭',
  AED: '🇦🇪',
  SAR: '🇸🇦',
  MYR: '🇲🇾',
  RON: '🇷🇴',
  DKK: '🇩🇰',
  BGN: '🇧🇬',
  HRK: '🇭🇷',
  ARS: '🇦🇷',
  EGP: '🇪🇬',
  PKR: '🇵🇰',
  VND: '🇻🇳',
  UAH: '🇺🇦',
  KZT: '🇰🇿',
  BYN: '🇧🇾',
};

export default function Currencies() {
  const { token } = useAuth();
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getCurrencies(token)
      .then(data => {
        // Убираем рубль из списка
        const filtered = data.filter(c => c.code !== 'RUB');
        setCurrencies(filtered);
      })
      .catch(err => console.error('Failed to fetch currencies:', err))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Валюты</h2>
      
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-2xl">ℹ️</span>
          <div className="text-sm text-blue-800">
            Курсы валют обновляются автоматически каждые 24 часа.
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Загрузка...</div>
      ) : currencies.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Нет доступных валют</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currencies.map(currency => {
            const flag = currencyFlags[currency.code] || '💱';
            return (
              <div
                key={currency.id}
                className="p-4 border rounded-lg bg-white hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl" role="img" aria-label={currency.code}>{flag}</span>
                    <div>
                      <div className="text-xl font-bold text-gray-800">{currency.code}</div>
                      <div className="text-xs text-gray-500 line-clamp-1">{currency.name}</div>
                    </div>
                  </div>
                  <div className="text-3xl font-semibold text-gray-600">{currency.symbol}</div>
                </div>

                <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="text-xs text-gray-600 mb-1">Курс к рублю:</div>
                  <div className="text-xl font-bold text-blue-600">
                    {currency.exchange_rate.toFixed(2)} ₽
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    1 {currency.code} = {currency.exchange_rate.toFixed(4)} RUB
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
