import os

import pandas as pd
from flask import render_template, flash, Blueprint, redirect, url_for, current_app
from flask_login import login_required, current_user
from datetime import datetime
from mars.extensions import db
from mars.forms.e_invoice import NewInvCustomerForm, UploadForm, Upload_inv_register_form
from mars.models import Inv_Customer, inv_register

e_invoice_bp = Blueprint('e_invoice', __name__)


@e_invoice_bp.route('/')
@login_required
def index():
    customer_count = Inv_Customer.query.count()
    return render_template('e_invoice/index.html', customer_count=customer_count)


@e_invoice_bp.route('/manage/customer', methods=['GET', 'POST'])
@login_required
def manage_customer():
    customer_count = Inv_Customer.query.count()
    customers = Inv_Customer.query.all()
    form_new_customer = NewInvCustomerForm()
    if form_new_customer.validate_on_submit():
        gci = form_new_customer.gci.data
        name = form_new_customer.name.data
        user_id = current_user.id
        department_id = current_user.department_id
        branch = form_new_customer.branch.data
        customer_email = form_new_customer.customer_email.data
        user_email = form_new_customer.user_email.data
        to_user_only = form_new_customer.to_user_only
        remark = form_new_customer.remark.data
        customer = Inv_Customer(gci=gci, name=name, user_id=user_id, customer_email=customer_email,
                                user_email=user_email, branch=branch, department_id=department_id,
                                to_user_only=to_user_only, remark=remark)
        db.session.add(customer)
        db.session.commit()
        flash('New customer created.', 'success')
        return redirect(url_for('e_invoice.manage_customer'))

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
            user_id = current_user.id
            department_id = current_user.department_id
            branch = row['Branch']
            customer_email = row['Customer Emails']
            user_email = row['Operator Emails']
            remark = row['Remark']
            customer = Inv_Customer(gci=gci, name=name, user_id=user_id, customer_email=customer_email,
                                    user_email=user_email, branch=branch, department_id=department_id, remark=remark)
            db.session.add(customer)
            db.session.commit()
        flash('Upload success.', 'success')
        return redirect(url_for('e_invoice.manage_customer'))
    return render_template('e_invoice/manage_customer.html', customers=customers, customer_count=customer_count,
                           form_new_customer=form_new_customer, upload_form=upload_form)


@e_invoice_bp.route('/customer/edit/<int:customer_id>', methods=['GET', 'POST'])
@login_required
def edit_customer(customer_id):
    customer = Inv_Customer.query.get_or_404(customer_id)
    form = NewInvCustomerForm(customer=customer)
    if form.validate_on_submit():
        customer.gci = form.gci.data
        customer.name = form.name.data
        customer.customer_email = form.customer_email.data
        customer.user_email = form.user_email.data
        customer.remark = form.remark.data
        customer.user_id = current_user.id
        customer.department_id = current_user.department_id
        customer.branch = form.branch.data
        db.session.commit()
        flash('Customer updated.', 'success')
        return redirect(url_for('e_invoice.manage_customer'))
    form.gci.data = customer.gci
    form.name.data = customer.name
    form.customer_email.data = customer.customer_email
    form.user_email.data = customer.user_email
    form.remark.data = customer.remark
    form.branch.data = customer.branch
    return render_template('e_invoice/edit_customer.html', form=form, customer=customer)


@e_invoice_bp.route('/customer/delete/<int:customer_id>', methods=['POST'])
@login_required
def delete_customer(customer_id):
    customer = Inv_Customer.query.get_or_404(customer_id)
    db.session.delete(customer)
    db.session.commit()
    flash('Customer deleted.', 'success')
    return redirect(url_for('e_invoice.manage_customer'))


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

