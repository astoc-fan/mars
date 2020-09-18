import datetime
import logging
import os
import re
import shutil
from ftplib import FTP
from urllib import request

import pandas as pd
import win32com.client
from bs4 import BeautifulSoup
import pythoncom



path = r'F:\ftp\edoc_Auto-Index\AE_Samsung'
# path = r'D:\python\edoc-auto-samsung-ae'

input_path = os.path.join(path, 'input')
working_path = os.path.join(path, 'working')
index_path = os.path.join(path,'index')
logging.basicConfig(filename=path + r'\ae-samsung.log', level=logging.DEBUG,
                    format='%(asctime)s - %(message)s', datefmt='%m/%d/%Y %I:%M:%S %p')


def getfilenames(filepath='', filelist_out=[], file_ext='all'):
    # 遍历filepath下的所有'.msg'文件，包括子目录下的文件
    for fpath, dirs, fs in os.walk(filepath):
        for f in fs:
            fi_d = os.path.join(fpath, f)
            if file_ext == 'all':
                filelist_out.append(fi_d)
            elif os.path.splitext(fi_d)[1].lower() == file_ext:
                filelist_out.append(fi_d)
            else:
                pass
    return filelist_out


def get_content(email):
    pythoncom.CoInitialize()
    outlook = win32com.client.Dispatch("Outlook.Application").GetNamespace("MAPI")
    msg = outlook.OpenSharedItem(email)
    count_attachments = msg.Attachments.Count
    attachments = msg.Attachments
    html_path = os.path.splitext(email)[0] + r'.html'
    if count_attachments > 0:
        for att in attachments:
            if os.path.splitext(att.FileName)[1].lower() == '.pdf':
                att.SaveAsFile(os.path.join(working_path, att.FileName))
    msg.SaveAs(html_path, 5)


def extract_content(htmlfile):
    url = r'file:///' + htmlfile.replace('\\', '/')
    html = request.urlopen(url).read()
    # html = open(htmlfile, 'rb')
    soup = BeautifulSoup(html, 'html.parser')
    tables = soup.find_all('table')
    result = []
    for table in tables:
        trs = table.find_all('tr')
        for tr in trs:
            # ths = tr.find_all('th')
            tds = tr.find_all('td')
            # th = [str(i.get_text()) for i in ths]
            td = [str(i.get_text().replace('\n', '').strip()) for i in tds]
            # result.append(th)
            result.append(td)
    # 由于每次获取到的表列数不统一，需要获取最长列数max(result_len)
    result_len = []
    for line in result:
        result_len.append(len(line))
    col_name = ['日期','发票号', 'DO号', '提货地', '箱数', '托数', '数量', '毛重 KG', '体积 m³', '报关地点', '货物条款', '指定代理', '合同']
    # 与col_name比较，长删短补
    if max(result_len) < len(col_name):
        # 如result长度大于标准，从最后删除多余的列
        n = len(col_name) - max(result_len)
        del col_name[n*-1:]
    elif max(result_len) > len(col_name):
        # 如果result长度小于标准，添加空列
        n = max(result_len) - len(col_name)
        col_name.extend([''] * n)
    else:
        pass
    df = pd.DataFrame(result, columns=col_name).dropna(axis=0, how='all', inplace=False)
    grouped = df.groupby(by='发票号', group_keys=False).agg({'DO号': lambda x: x.str.cat(sep=', '),
                                                          '提货地': lambda x: x.head(1),
                                                          '箱数': lambda x: x.head(1),
                                                          '托数': lambda x: x.head(1),
                                                          '数量': lambda x: x.head(1),
                                                          '毛重 KG': lambda x: x.head(1),
                                                          '体积 m³': lambda x: x.head(1),
                                                          '报关地点': lambda x: x.head(1),
                                                          '货物条款': lambda x: x.head(1),
                                                          '指定代理': lambda x: x.head(1),
                                                          '合同': lambda x: x.head(1),
                                                          })
    csv_name = os.path.splitext(htmlfile)[0]+r'.csv'
    csv = grouped.to_csv(csv_name, index=True, header=True, encoding='utf_8_sig')
    return csv_name

def get_hawb(sr):
    source = r'F:\Groups\Air Export\customer service 2013\JG--CS 2019-2020\TSLED tracking report EI--2020.09.xlsx'
    df = pd.read_excel(source)
    try:
        result = df.loc[df['SR'].apply(str) == sr, ['HAWB']].to_string(index=False, header=False)
    except:
        logging.info(sr+'have no mapped HAWB.')
    return result


def reformat_file(pdffile):
    file_name = os.path.basename(pdffile)
    regex = re.compile(r'\d{10}')
    sr = regex.findall(file_name)
    try:
        sr = sr[0].strip()
        hawb = get_hawb(sr).strip()
        doc_type = ''
        if file_name.find('PL') > 0:
            doc_type = 'PCL'
        elif file_name.find('IV') > 0:
            doc_type = 'CIN'
        dt_stamp = str(datetime.datetime.now().strftime('%Y%m%d%H%M%S%f'))
        os.rename(pdffile, index_path + '\\' + hawb + '_' + doc_type + '_' + dt_stamp + '.pdf.tsk')
    except:
        logging.info(file_name + 'does not include a SR number.')
        pass


def ftp_connect():
    ftp_server = 'edoc.tsn.ei'
    username = 'edocftp'
    password = 'capture2'
    ftp = FTP()
    ftp.set_debuglevel(0)  # 打开调试级别2，显示详细信息
    ftp.connect(ftp_server, 21)  # 连接
    ftp.login(username, password)  # 登录，如果匿名登录则用空串代替即可
    return ftp


def samsung():
    result = []
    for email in getfilenames(input_path, filelist_out=[], file_ext='.msg'):
        result.append('Processing '+email+'...')
        get_content(email)
        os.remove(email)
        result.append('Processing ' + email + ' completed.')
    for htmlfile in getfilenames(input_path, filelist_out=[], file_ext='.html'):
        result.append('Analysing '+htmlfile+'...')
        csv = extract_content(htmlfile)
        result.append('Convert to ' + csv + '.')
        temp_folder = os.path.splitext(htmlfile)[0]+r'_files'
        shutil.rmtree(temp_folder)
        os.remove(htmlfile)
    for pdffile in getfilenames(working_path, filelist_out=[], file_ext='.pdf'):
        reformat_file(pdffile)
        result.append(pdffile + 'scanned.')

    ftp = ftp_connect()
    remote_path = "/prod/app/edoc/edocworkers/current/work/images/inbox"
    bufsize = 1024
    files = [fn for root, dirs, files in os.walk(index_path) for fn in files]
    for file in files:
        fp = open(index_path + '\\' + file, 'rb')
        ftp.storbinary('STOR ' + remote_path + '/' + file, fp, bufsize)  # 上传文件
        fp.close()  # 关闭文件
        logging.info(file + ' scanned.')
        os.remove(index_path + '\\' + file)
    ftp.quit()
    result.append('completed')
    return result


if __name__ == '__main__':
    samsung()
