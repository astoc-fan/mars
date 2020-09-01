import datetime
import sqlite3

import pandas as pd
import requests
from bs4 import BeautifulSoup


# from mars.extensions import scheduler


def spider_rates():
    currency = ['加拿大元', '瑞士法郎', '欧元', '英镑', '港币', '日元', '韩国元', '新加坡元', '新台币', '美元']
    currency_en = {'加拿大元': 'CAD', '瑞士法郎': 'CHF', '欧元': 'EUR', '英镑': 'GBP', '港币': 'HKD',
                   '日元': 'JPY', '韩国元': 'KRW', '新加坡元': 'SGD', '新台币': 'TWD', '美元': 'USD'}
    url = 'http://www.boc.cn/sourcedb/whpj/'
    html = requests.get(url).content.decode("utf-8")  # 获取网页源码
    soup = BeautifulSoup(html, 'html.parser')
    div = soup.find('div', attrs={'class': 'publish'})
    table_content = div.find('table', attrs={'align': 'left'})
    trs = table_content.find_all('tr')
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
    new = new.drop(['发布时间'], axis=1)
    new['发布日期'] = pd.to_datetime(new['发布日期'])
    new.index = new['货币名称']
    col_name = new.columns.tolist()
    col_name.insert(1, 'Currency')
    new['Currency'] = pd.Series(currency_en)
    new = new.reindex(columns=col_name)
    print(new)
    # html = new.to_html(os.getcwd() + r'.\files.html', escape=False, index=False, sparsify=False, border=1,
    #                    index_names=False, header=True, encoding='utf-8')
    # new.to_csv(r'\\tsn-comm01\sys\ftp\erbranch\rates\rates.csv', index=False, header=True, encoding='utf-8')
    new.columns = ['currency', 'currency_abbr', 'price_exch_buy', 'price_cash_buy', 'price_exch_sell',
                  'price_cash_sell', 'price_boc_mid', 'publish']
    conn = sqlite3.connect(r'D:\python\mars\data-dev.db')
    new.to_sql('rates', con=conn, if_exists='append', index=False)

    conn.commit()
    conn.close()
    print(datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), 'rates imported.')


if __name__ == '__main__':
    spider_rates()
