import os
from datetime import datetime

import pandas as pd
from flask import render_template, flash, Blueprint, redirect, url_for, current_app, send_from_directory
from flask_login import login_required, current_user

from mars.extensions import db
from mars.forms.e_invoice import NewInvCustomerForm, UploadForm, Upload_inv_register_form
from mars.models import Inv_Customer, inv_register, Department, Invoices

e_invoice_bp = Blueprint('e_invoice', __name__)


@e_invoice_bp.route('/')
@login_required
def index():
    customer_count = Inv_Customer.query.count()
    inv_count = Invoices.query.count()
    return render_template('e_invoice/index.html', customer_count=customer_count,inv_count=inv_count)


@e_invoice_bp.route("/<path:filename>")
def download(filename):
    # 需要知道2个参数, 第1个参数是本地目录的path, 第2个参数是文件名(带扩展名)
    directory = current_app.root_path + '/templates/e_invoice/'  # 假设在当前目录
    return send_from_directory(directory, filename, as_attachment=True)


@e_invoice_bp.route('/manage/customer', methods=['GET', 'POST'])
@login_required
def manage_customer():
    customer_count = Inv_Customer.query.count()
    customers = Inv_Customer.query.all()
    # mydepartment = current_user.name
    mydepartment = Department.query.filter_by(id=current_user.department_id).first_or_404()
    form_new_customer = NewInvCustomerForm()
    if form_new_customer.validate_on_submit():
        gci = form_new_customer.gci.data
        name = form_new_customer.name.data
        user = form_new_customer.user.data
        department = form_new_customer.department.data
        branch = form_new_customer.branch.data
        customer_email = form_new_customer.customer_email.data
        user_email = form_new_customer.user_email.data
        to_user_only = form_new_customer.to_user_only.data
        remark = form_new_customer.remark.data
        if Inv_Customer.query.filter_by(gci=form_new_customer.gci.data, department=form_new_customer.department.data).first():
            flash('The customer + department is already exist!', 'danger')
        else:
            customer = Inv_Customer(gci=gci, name=name, user=user, customer_email=customer_email,
                                    user_email=user_email, branch=branch, department=department,
                                    to_user_only=to_user_only, remark=remark)
            db.session.add(customer)
            db.session.commit()
            flash('New customer created.', 'success')
        return redirect(url_for('e_invoice.manage_customer'))
    form_new_customer.user.render_kw = {'readonly': True}
    form_new_customer.user.data = current_user.username
    form_new_customer.branch.data = current_user.branch
    form_new_customer.department.data = Department.query.filter_by(id=current_user.department_id).first_or_404()

    upload_form = UploadForm()
    if upload_form.validate_on_submit():
        f = upload_form.customer_list.data
        filename = f.filename
        path = os.path.join(current_app.config['STATIC_PATH'], 'uploads', filename)
        f.save(path)
        df = pd.read_excel(path)
        for index, row in df.iterrows():
            gci = row['GCI']
            name = row['Customer Name']
            user = current_user.username
            department = str(mydepartment)
            branch = row['Branch']
            customer_email = row['Customer Emails']
            user_email = row['Operator Emails']
            remark = row['Remark']
            to_user_only = False
            customer = Inv_Customer(gci=gci, name=name, user=user, customer_email=customer_email, to_user_only=to_user_only,
                                    user_email=user_email, branch=branch, department=department, remark=remark)
            db.session.add(customer)
            db.session.commit()
        flash('Upload success.', 'success')
        return redirect(url_for('e_invoice.manage_customer'))

    return render_template('e_invoice/manage_customer.html', customers=customers, customer_count=customer_count,
                           form_new_customer=form_new_customer, upload_form=upload_form, mydepartment=mydepartment)


@e_invoice_bp.route('/customer/edit/<int:customer_id>', methods=['GET', 'POST'])
@login_required
def edit_customer(customer_id):
    customer = Inv_Customer.query.get_or_404(customer_id)
    form = NewInvCustomerForm(customer=customer)
    if form.validate_on_submit():
        customer.gci = form.gci.data
        customer.name = form.name.data
        customer.user = form.user.data
        # customer.department = form.department.data
        customer.branch = form.branch.data
        customer.customer_email = form.customer_email.data
        customer.user_email = form.user_email.data
        customer.to_user_only = form.to_user_only.data
        customer.remark = form.remark.data
        if customer.gci != form.gci.data and Inv_Customer.query.filter_by(gci=form.gci.data, department=form.department.data).first():
            flash('Submitted customer + department is already exist!', 'danger')
        else:
            db.session.commit()
            flash('Customer updated.', 'success')
            return redirect(url_for('e_invoice.manage_customer'))

    form.gci.render_kw = {'readonly': True}
    form.department.render_kw = {'readonly': True}
    form.gci.data = customer.gci
    form.name.data = customer.name
    form.user.data = customer.user
    form.department.data = customer.department
    form.branch.data = customer.branch
    form.customer_email.data = customer.customer_email
    form.user_email.data = customer.user_email
    form.to_user_only = customer.to_user_only
    form.remark.data = customer.remark
    return render_template('e_invoice/edit_customer.html', form=form, customer=customer)


@e_invoice_bp.route('/customer/delete/<int:customer_id>', methods=['POST'])
@login_required
def delete_customer(customer_id):
    customer = Inv_Customer.query.get_or_404(customer_id)
    db.session.delete(customer)
    db.session.commit()
    flash('Customer deleted.', 'success')
    return redirect(url_for('e_invoice.manage_customer'))


@e_invoice_bp.route('/inv_status', methods=['GET', 'POST'])
@login_required
def inv_status():
    inv_status = Invoices.query.all()
    inv_count = Invoices.query.count()
    return render_template('e_invoice/inv_status.html', inv_status=inv_status,inv_count=inv_count)


@e_invoice_bp.route('/inv_register', methods=['GET', 'POST'])
@login_required
def inv_register_manage():
    inv_count = inv_register.query.count()
    inves = inv_register.query.all()
    Upload_inv_form = Upload_inv_register_form()
    if Upload_inv_form.validate_on_submit():
        f = Upload_inv_form.inv_register.data
        filename = f.filename
        path = os.path.join(current_app.config['STATIC_PATH'], 'uploads', filename)
        f.save(path)
        df = pd.read_csv(path, encoding='GBK')
        for index, row in df.iterrows():
            invoice_type = row['Invoice Type']
            bill_to_gci = row['Bill To GCI']
            name = row['Name']
            bill_to_gci_br = row['Bill to GCI Br']
            cc = row['CC']
            usagedistinction = row['UsageDistinction']
            ei_invoice_ref = row['EI Invoice Ref']
            file = row['File']
            tc = row['TC']
            canceling_inv_reference = row['Canceling Inv Reference']
            issue_date = datetime.strptime(row['Issue Date'], '%d-%b-%y')  #
            issue_date_month = row['Issue Date Month']
            issue_date_year = row['Issue Date Year']
            amount = row['Amount']
            currency = row['Currency']
            foreign_amount = row['Foreign Amount']
            foreign_currency = row['Foreign Currency']
            vat_amount = row['VAT Amount']
            tax_invoice_status = row['Tax Invoice Status']
            internal_tax_ref = row['Internal Tax Ref']
            vat_invoice_ref = row['Vat Invoice Ref']
            vat_issue_date = datetime.strptime(row['Vat Issue Date'], '%d-%b-%y')
            vat_issue_date_month = row['Vat Issue Date Month']
            vat_issue_date_year = row['Vat Issue Date Year']
            first_vat_inv_ref = row['First Vat Inv Ref']
            first_vat_issue_date = datetime.strptime(row['First Vat Issue Date'], '%d-%b-%y')
            first_vat_issue_date_month = row['First Vat Issue Date Month']
            first_vat_issue_date_year = row['First Vat Issue Date Year']
            consol = row['Consol']
            service_order = row['Service Order']
            mbl = row['MBL']
            hbl = row['HBL']
            invoice = inv_register(invoice_type=invoice_type, bill_to_gci=bill_to_gci,
                                   name=name, bill_to_gci_br=bill_to_gci_br,
                                   cc=cc, usagedistinction=usagedistinction,
                                   ei_invoice_ref=ei_invoice_ref, file=file,
                                   tc=tc, canceling_inv_reference=canceling_inv_reference,
                                   issue_date=issue_date, issue_date_month=issue_date_month,
                                   issue_date_year=issue_date_year, amount=amount,
                                   currency=currency, foreign_amount=foreign_amount,
                                   foreign_currency=foreign_currency, vat_amount=vat_amount,
                                   tax_invoice_status=tax_invoice_status, internal_tax_ref=internal_tax_ref,
                                   vat_invoice_ref=vat_invoice_ref, vat_issue_date=vat_issue_date,
                                   vat_issue_date_month=vat_issue_date_month, vat_issue_date_year=vat_issue_date_year,
                                   first_vat_inv_ref=first_vat_inv_ref, first_vat_issue_date=first_vat_issue_date,
                                   first_vat_issue_date_month=first_vat_issue_date_month,
                                   first_vat_issue_date_year=first_vat_issue_date_year,
                                   consol=consol, service_order=service_order, mbl=mbl, hbl=hbl)
            db.session.add(invoice)
            db.session.commit()
        flash('Upload success.', 'success')
        return redirect(url_for('e_invoice.inv_register_manage'))
    return render_template('e_invoice/inv_register.html', inves=inves, Upload_inv_form=Upload_inv_form, inv_count=inv_count)

