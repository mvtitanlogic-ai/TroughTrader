#!/usr/bin/env python3
"""Fetch stock quotes via yfinance and return JSON to stdout."""
import sys
import json
import warnings
warnings.filterwarnings('ignore')

import yfinance as yf

def fetch_quotes(symbols):
    results = []
    try:
        tickers = yf.Tickers(' '.join(symbols))
    except Exception as e:
        return [{'symbol': s, 'error': str(e)} for s in symbols]

    for sym in symbols:
        try:
            t = tickers.tickers.get(sym)
            if not t:
                results.append({'symbol': sym, 'error': 'Not found'})
                continue

            fi = t.fast_info
            price = getattr(fi, 'last_price', None)
            prev  = getattr(fi, 'previous_close', None)
            chg   = (price - prev) if (price and prev) else None
            pct   = (chg / prev * 100) if (chg is not None and prev) else None

            results.append({
                'symbol':                       sym,
                'regularMarketPrice':           price,
                'regularMarketChange':          chg,
                'regularMarketChangePercent':   pct,
                'regularMarketOpen':            getattr(fi, 'open', None),
                'regularMarketDayHigh':         getattr(fi, 'day_high', None),
                'regularMarketDayLow':          getattr(fi, 'day_low', None),
                'regularMarketVolume':          getattr(fi, 'three_month_average_volume', None),
                'marketCap':                    getattr(fi, 'market_cap', None),
                'fiftyTwoWeekHigh':             getattr(fi, 'year_high', None),
                'fiftyTwoWeekLow':              getattr(fi, 'year_low', None),
                'shortName':                    sym,
            })
        except Exception as e:
            results.append({'symbol': sym, 'error': str(e)})

    return results

if __name__ == '__main__':
    symbols = sys.argv[1:]
    if not symbols:
        print(json.dumps([]))
        sys.exit(0)
    print(json.dumps(fetch_quotes(symbols)))
