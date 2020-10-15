import win32com.client as win32
import os
import re


def send_email(to, cc, title, body, attach_path=None, save_type=None, save_path=None, save_file_name=None):
    outlook = win32.Dispatch('Outlook.Application')
    mail = outlook.CreateItem(0)
    mail.To = to
    mail.CC = cc
    mail.Subject = title
    if attach_path is None:  # 判断是否存在附件地址文件
        pass
    else:
        if isinstance(attach_path, list):
            for attach in attach_path:
                mail.Attachments.Add(attach)
                os.remove(attach)
        else:
            mail.Attachments.Add(attach_path)
            os.remove(attach_path)
    mail.HTMLBody = body
    mail.Display(False)
    if save_path is None:
        pass
    else:
        mail.SaveAs(save_path + '\\' + save_file_name + '.html', save_type)
    mail.Send()
