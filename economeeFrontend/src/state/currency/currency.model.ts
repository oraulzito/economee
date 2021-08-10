export interface Currency {
  id: number | string;
  code: string;
  country: string;
  symbol: string;
  currency: string;
}

export function createCurrency(params: Partial<Currency>) {
  return {

  } as Currency;
}
