import datetime
import sqlite3
from urllib import request
import pandas as pd
from bs4 import BeautifulSoup
from mars.extensions import scheduler


def spider_rates():
    currency = ['加拿大元', '瑞士法郎', '欧元', '英镑', '港币', '日元', '韩国元', '新加坡元', '新台币', '美元']
    currency_en = ['CAD', 'CHF', 'EUR', 'GBP', 'HKD', 'JPY', 'KRW', 'SGD', 'TWD', 'USD']
    # 爬取网页
    url = "https://www.boc.cn/sourcedb/whpj/"
    html = request.urlopen(url).read()
    soup = BeautifulSoup(html, 'html.parser')
    # 解析数据
    div = soup.find('div', attrs={'class': 'publish'})
    table = div.find('table', attrs={'align': 'left'})
    trs = table.find_all('tr')
    table = []
    for tr in trs:
        ths = tr.find_all('th')
        tds = tr.find_all('td')
        th = [str(i.get_text()) for i in ths]
        td = [str(i.get_text()) for i in tds]
        table.append(th)
        table.append(td)

    new = pd.DataFrame(table, columns=table[0]).dropna(axis=0, how='all', inplace=False)
    new = new.loc[new['货币名称'].isin(currency)]
    new['发布日期'] = pd.to_datetime(new['发布日期'], format="%Y-%m-%d")
    col_name = new.columns.tolist()
    col_name.insert(1, 'Currency')
    new['Currency'] = currency_en
    new = new.reindex(columns=col_name)
    new = new.drop(['发布时间'], axis=1)
    # new.to_csv(r'\\tsn-comm01\sys\ftp\erbranch\rates\rates.csv', index=False, header=True, encoding='utf-8')
    # df = pd.read_csv(r'\\tsn-comm01\sys\ftp\erbranch\rates\rates.csv')

    conn = sqlite3.connect(r'..\..\data-dev.db')
    new.columns = ['currency', 'currency_abbr', 'price_exch_buy', 'price_cash_buy', 'price_exch_sell',
                  'price_cash_sell', 'price_boc_mid', 'publish']
    # print(df)
    new.to_sql('rates', con=conn, if_exists='append', index=False)
    conn.commit()
    conn.close()
    # print(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'rates imported.')


if __name__ == '__main__':
    spider_rates()
