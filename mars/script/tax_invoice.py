import decimal
import os
import re
import sqlite3
import pandas as pd
import pyodbc
from edoc_downloader import download_file, convert_pdf, edoc_upload, get_file_link
from outlook_email import send_email
from update_status import update_invoice_status
from flask import Flask,current_app
import mars

app = mars.create_app()


class config:
    branch = 'bjs'
    edoc_server = 'edoc.%s.ei' % branch
    working_path = os.path.abspath((os.path.dirname(__file__))) + r'\working'
    # log_path = os.path.abspath((os.path.dirname(__file__))) + r'\log.csv'
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


def tbl_edoc():
    edoc_database = "Driver={IBM DB2 ODBC DRIVER - DB2COPY1};Database=%s;Hostname=%s;Port=%s;Protocol=TCPIP;Uid=%s" \
                    ";Pwd=%s;" % (config.database, config.edoc_server, config.port, config.user, config.password)
    conn = pyodbc.connect(edoc_database, unicode_result=True)
    edoc_invoices = pd.read_sql(config.sql, conn)
    return edoc_invoices


def get_dept(file_no):
    file_no = str(file_no)[0]
    switch = {
        "1": "Other",
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
    email_list = list(set(matches))  # Remove duplication 去重
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
    # departments = tbl_department()
    # customers_details = pd.merge(customers, departments, how='left', left_on='department', right_on='name')

    invoices = pd.merge(invoices_details, customers, how='left', left_on=['GCI', 'dept'],
                        right_on=['gci', 'department'])
    # print(invoices)
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
                invoice_date = invoices.iloc[i, 1]
                client = invoices.iloc[i, 4]
                # amount = sum(invoice_item[u'Amount'].tolist())
                amount = decimal.Decimal('%.2f' % (sum(invoice_item[u'Amount'].tolist())))

                currency = invoices.iloc[i, 8]
                to_user_only = invoices.iloc[i, 23]
                to = invoices.iloc[i, 21]
                cc = invoices.iloc[i, 20]
                #
                # print(invoices)
                # print(invoices_ref, to, cc, to_user_only)
                title = '北京康捷空电子发票 发票号:' + vat_number + ' 货物单号:' + short_hbl
                body = '''<b>感谢您使用北京康捷空国际货运代理有限公司</b><br>
                        请查看附件中的发票，如有疑问，请勿回复此邮件，请联系您的客服代表或致电010-64579779 ，谢谢。<br>
                        <br>
                        尊敬的用户您好：<br>
                        我司已于%s开具电子发票，再次感谢您对康捷空的支持与信赖。<br>
                        发票信息如下：<br>
                        开票日期：%s<br>
                        发票代码：%s<br>
                        发票号码：%s<br>
                        货物单号：%s<br>
                        购方名称：%s<br>
                        销方名称：北京康捷空国际货运代理有限公司<br>
                        价税合计：￥%s<br>
                        ''' % (invoice_date, invoice_date, vat_code, vat_number, hbl, client, amount)
                vat_link = get_file_link(config.branch, invoices_ref)
                body_to_user = '''<b>此票已开出，但未发送至客户，请及时发送并将发送凭证扫描至edoc。谢谢！</b><br>
                                   <br>
                                    发票信息如下：<br>
                                    开票日期：%s<br>
                                    发票代码：0%s<br>
                                    发票号码：%s<br>
                                    货物单号：%s<br>
                                    购方名称：%s<br>
                                    销方名称：北京康捷空国际货运代理有限公司<br>
                                    价税合计：￥%s<br>
                                    发票链接：%s<br>
                                ''' % (invoice_date, vat_code, vat_number, hbl, client, amount, vat_link)
                if to != 'nan' and to_user_only == 0:
                    download_file(config.branch, config.doc_type, invoices_ref, config.working_path)
                    attach_path = config.working_path + '\\' + vat_number + '.pdf'
                    os.rename(config.working_path + '\\' + invoices_ref + '.pdf', attach_path)
                    send_email(to, cc, title, body, attach_path, 5, config.working_path, invoices_ref)
                    convert_pdf(config.working_path, invoices_ref, hbls, gci)
                    edoc_upload(config.branch, config.working_path)
                    with app.app_context():
                        print(invoices_ref, vat_ref, invoice_date, gci, client, hbl, amount,
                                              currency, vat_ref, department, 'inv to customer', to, cc)
                        update_invoice_status(invoices_ref, invoices_ref, invoice_date, gci, client, hbl, amount,
                                              currency, vat_ref, department, 'inv to customer', to, cc)
                elif to != 'nan' and to_user_only == 1:
                    download_file(config.branch, config.doc_type, invoices_ref, config.working_path)
                    attach_path = config.working_path + '\\' + vat_number + '.pdf'
                    os.rename(config.working_path + '\\' + invoices_ref + '.pdf', attach_path)
                    send_email(to, cc, title, body_to_user)
                    with app.app_context():
                        print(invoices_ref, vat_ref, invoice_date, gci, client, hbl, amount,
                                              currency, vat_ref, department, 'inv to user', to, cc)
                        update_invoice_status(invoices_ref, invoices_ref, invoice_date, gci, client, hbl, amount,
                                              currency, vat_ref, department, 'inv to user', to, cc)
                else:
                    update_invoice_status(invoices_ref, invoices_ref, invoice_date, gci, client, hbl, amount,
                                          currency, vat_ref, department, 'not send', to, cc)
                    # no email send
