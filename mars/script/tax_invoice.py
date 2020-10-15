import os
import re
import sqlite3
import pandas as pd
import pyodbc
import decimal


class config:
    branch = 'bjs'
    edoc_server = 'edoc.%s.ei' % branch
    working_path = os.path.abspath((os.path.dirname(__file__)))
    log_path = os.path.abspath((os.path.dirname(__file__))) + r'\log.csv'
    if branch == 'bjs':
        inv_register_path = open(r'F:\ftp\edoc_Auto-Index\AC_INV_bjs\PDF\Invoice-Register.csv', encoding='GB18030')
    elif branch == 'tsn':
        inv_register_path = open(r'F:\ftp\edoc_Auto-Index\AC_INV\PDF\Invoice-Register.csv', encoding='GB18030')
    doc_type = 'Tax Invoice'
    database = 'edoc'
    port = '50002'
    user = 'inetsoft'
    password = 'etl5boxes'
    sql = '''SELECT DISTINCT
             f.key_ AS "Tax Ref",DATE(MAX(D.CREATION_TIME)) AS "TAI Scan Date",D.DESCRIPTION AS "GCI"
             FROM EDOC.FOLDER F INNER JOIN EDOC.FOLDER_DOCUMENT FD ON F.G_U_I_D =FD.FOLDER__P_K 
             INNER JOIN EDOC.DOCUMENT D ON D.G_U_I_D = FD.DOCUMENT__P_K
             WHERE D.DOC_TYPE = 'TAI' AND SUBSTR(f.key_,1,2) = 'T2'
             --AND DATE(D.CREATION_TIME) = DATE(CURRENT TIMESTAMP)
             GROUP BY f.key_, D.DESCRIPTION'''


def tbl_inv_register():
    inv_register = pd.read_csv(config.inv_register_path, usecols=[1, 2, 6, 7, 13, 14, 19, 20, 30, 31],
                               converters={u'Vat Invoice Ref': str, u'File': str})
    return inv_register


def tbl_customer():
    basedir = os.path.abspath(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    conn = sqlite3.connect(os.path.join(basedir, 'data-dev.db'))
    sql = 'select * from inv__customer'
    customers = pd.read_sql(sql, conn)
    return customers


def tbl_department():
    basedir = os.path.abspath(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
    conn = sqlite3.connect(os.path.join(basedir, 'data-dev.db'))
    sql = 'select * from department'
    department = pd.read_sql(sql, conn)
    return department


def tbl_edoc():
    edoc_database = "Driver={IBM DB2 ODBC DRIVER - DB2COPY1};Database=%s;Hostname=%s;Port=%s;Protocol=TCPIP;Uid=%s" \
                    ";Pwd=%s;" % (config.database, config.edoc_server, config.port, config.user, config.password)
    conn = pyodbc.connect(edoc_database, unicode_result=True)
    edoc_invoices = pd.read_sql(config.sql, conn)
    return edoc_invoices


def get_dept(file_no):
    file_no = str(file_no)[0]
    switch = {
        "1": "",
        "2": "Air Import",
        "3": "Air Export",
        "4": "Air Export",
        "5": "Ocean Export",
        "6": "Ocean Export",
        "7": "Ocean Import",
        "8": "Transcon",
        "9": "Distribution",
        "J": "Transcon",
        "R": "Order Management",
        "H": "Transcon"
    }
    dept = switch[file_no]
    return dept


def extract_email_address(email):
    pat = r'''(
    [a-zA-Z0-9._%+-]+      # username
    @                      # @ symbol
    [a-zA-Z0-9.-]+        # domain name
    (\.[a-zA-Z]{2,8}){1,2} # dot-something
    )'''
    matches = []
    strings = email
    email_regex = re.compile(pat, re.VERBOSE)
    for groups in email_regex.findall(strings):
        matches.append(groups[0])
    email_list = list(set(matches))     # Remove duplication 去重
    email_list = ';'.join(email_list)
    return email_list


# def send_inv():


if __name__ == '__main__':
    pd.set_option('display.max_columns', None)
    inv_registers = tbl_inv_register()
    edoc_invoices = tbl_edoc()
    invoices_details = pd.merge(edoc_invoices, inv_registers, how='inner', left_on='Tax Ref',
                                right_on='Internal Tax Ref')
    hbls = invoices_details[u'File'].tolist()
    depts = [get_dept(hbl) for hbl in hbls]
    invoices_details[u'dept'] = depts

    customers = tbl_customer()
    departments = tbl_department()
    customers_details = pd.merge(customers, departments, how='left', left_on='department_id', right_on='id')

    invoices = pd.merge(invoices_details, customers_details, how='left', left_on=['GCI', 'dept'],
                        right_on=['gci', 'name_y'])

    if len(invoices) > 0:
        for i in range(0, len(invoices)):
            invoices_ref = invoices.iloc[i, 0]  # T file

            # List for send invoices
            invoice_item = invoices[(invoices[u'Tax Ref'] == invoices_ref)]
            if invoices_ref != invoices.iloc[i - 1, 0] or (i == 0):
                hbls = invoice_item[u'File'].tolist()  # HAWB number
                hbl = "/".join(list(set(hbls)))  # hawb 斜杠分隔
                # HAWB 缩写，用于标题
                if len(hbls) > 3:
                    short_hbl = "/".join(hbls[0:3]) + '等'
                else:
                    short_hbl = "/".join(hbls)
                vat_ref = invoices.iloc[i, 10]
                vat_code = vat_ref[0:12]  # 发票代码
                vat_number = vat_ref[-8:]  # 发票号码，最后8位
                department = invoices.iloc[i, 13]
                gci = invoices.iloc[i, 2]
                invoice_date = invoices.iloc[i,1]
                client = invoices.iloc[i,4]
                # amount = sum(invoice_item[u'Amount'].tolist())
                amount = decimal.Decimal('%.2f' % (sum(invoice_item[u'Amount'].tolist())))

                to = invoices.iloc[i, 21]
                cc = invoices.iloc[i, 20]
                # print(invoices)
                # print(inv_registers)
                print(invoices_ref, short_hbl, vat_code, vat_number, department, gci, invoice_date, client, amount, to, cc)
