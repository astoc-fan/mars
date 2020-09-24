from flask import render_template, flash, Blueprint, redirect, url_for
from flask_login import login_required, current_user

from mars.extensions import db
from mars.forms.e_invoice import NewInvCustomerForm
from mars.models import Inv_Customer

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
        remark = form_new_customer.remark.data
        customer = Inv_Customer(gci=gci, name=name, user_id=user_id, customer_email=customer_email,
                                user_email=user_email, branch=branch, department_id=department_id, remark=remark)
        db.session.add(customer)
        db.session.commit()
        flash('New customer created.', 'success')
        return redirect(url_for('e_invoice.manage_customer'))
    return render_template('e_invoice/manage_customer.html', customers=customers, customer_count=customer_count,
                           form_new_customer=form_new_customer)


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
