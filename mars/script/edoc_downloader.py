import urllib.request

import requests
from bs4 import BeautifulSoup
from ftplib import FTP
import pdfkit
import datetime
import os
import shutil


def download_file(branch, doc_types, file_num, save_path):
    server = 'http://edoc.' + branch + '.ei:8018/edoc/'
    url = 'main?object=folder&key=' + file_num + ",CONSOL&method=read"
    content = requests.get(server + url).text
    soup = BeautifulSoup(content, 'html.parser')
    links = soup.find_all('a')
    # assert isinstance(links, object)
    for l in links:
        link = l.get('href')
        text = l.text
        file_type_text = l.find_all('img')[0].attrs['src']

        # download docs
        for doc in doc_types:
            if text.find(doc) > 0:
                if file_type_text == "images/document.gif":
                    file_type = '.tif'
                else:
                    file_type = '.pdf'
                urllib.request.urlretrieve(server + link, save_path + '\\' + file_num + file_type)
                # urllib.request.urlretrieve(server + link,
                #                            filename=working_path + '\\' + vat_number + file_type)
            else:
                pass


def get_file_link(branch, file_num):
    server = 'http://edoc.' + branch + '.ei:8018/edoc/'
    url = 'main?object=folder&key=' + file_num + ",CONSOL&method=read"
    content = requests.get(server + url).text
    soup = BeautifulSoup(content, 'html.parser')
    link = soup.find_all('a')[0]
    link = link.get('href')
    file_link = (server + link).lower()
    return file_link


def ftp_connect(branch):
    ftp_server = 'edoc.' + branch + '.ei'
    username = 'edocftp'
    password = 'capture2'
    ftp = FTP()
    ftp.set_debuglevel(0)  # 打开调试级别2，显示详细信息
    ftp.connect(ftp_server, 21)  # 连接
    ftp.login(username, password)  # 登录，如果匿名登录则用空串代替即可
    return ftp


def convert_pdf(working_path, invoices_ref, hbls, gci):
    options = {
        'page-size': 'A4',
        'margin-top': '0.75in',
        'margin-right': '0.75in',
        'margin-bottom': '0.75in',
        'margin-left': '0.75in',
        'encoding': "UTF-8",  # 支持中文
        'custom-header': [
            ('Accept-Encoding', 'gzip')
        ],
        'no-outline': None
    }
    for split_hbl in hbls:
        pdfkit.from_file(working_path + '\\' + invoices_ref + '.html', working_path + '\\' + split_hbl + '.pdf',
                         options=options)
        #  Rename 2380294268_PIE_20200323042544411_G2232818.pdf.tsk
        dt = datetime.datetime.now().strftime('%Y%m%d%H%M%S%f')
        print(dt)
        os.rename(working_path + '\\' + split_hbl + '.pdf',
                  working_path + '\\' + split_hbl + '_PIE_' + str(dt) + '_' + gci + '.pdf.tsk')
    #     Delete files and folders
    os.remove(working_path + '\\' + invoices_ref + '.html')
    shutil.rmtree(working_path + '\\' + invoices_ref + '_files')


def edoc_upload(branch, working_path):
    ftp = ftp_connect(branch)
    remotepath = "/prod/app/edoc/edocworkers/current/work/images/inbox"
    bufsize = 1024
    files = [fn for root, dirs, files in os.walk(working_path) for fn in files]
    for file in files:
        fp = open(working_path + '\\' + file, 'rb')
        ftp.storbinary('STOR ' + remotepath + '/' + file, fp, bufsize)  # 上传文件
        fp.close()  # 关闭文件
        os.remove(working_path + '\\' + file)
    ftp.quit()


if __name__ == '__main__':
    la = get_file_link('tsn', 'T200005490')
    print(la)
