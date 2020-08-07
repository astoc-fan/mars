import sqlite3
import mars
import datetime
import pandas


def import_rates_to_db():
    conn = sqlite3.connect(r'..\..\data-dev.db')
    df = pandas.read_csv(r'\\tsn-comm01\sys\ftp\erbranch\rates\rates.csv')
    df.columns = ['currency', 'currency_abbr', 'price_exch_buy', 'price_cash_buy', 'price_exch_sell', 'price_cash_sell',
                  'price_boc_mid', 'publish']
    print(df)
    df.to_sql('rates', conn, if_exists='append', index=False)
    print('ok')


def aps_test():
    print(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'testing')


if __name__ == '__main__':
    import_rates_to_db()
    aps_test()
