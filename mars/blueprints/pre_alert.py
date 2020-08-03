from flask import render_template, flash, Blueprint, redirect, url_for
from flask_login import login_required, current_user

from mars.extensions import db
from mars.forms.pre_alert import NewCustomerForm
from mars.models import Customer, User, Department

pre_alert_bp = Blueprint('pre_alert', __name__)


@pre_alert_bp.route('/')
@login_required
def index():
    return render_template('pre_alert/index.html')


@pre_alert_bp.route('/manage/customer', methods=['GET', 'POST'])
@login_required
def manage_customer():
    customer_count = Customer.query.count()
    customers = Customer.query.all()
    form = NewCustomerForm()
    if form.validate_on_submit():
        gci = form.gci.data
        name = form.name.data
        user_id = current_user.id
        # department_id = current_user.department_id
        department = current_user.department_id
        customer_email = form.customer_email.data
        user_email = form.user_email.data
        remark = form.remark.data
        customer = Customer(gci=gci, name=name, user_id=user_id, customer_email=customer_email, user_email=user_email,
                            department=department, remark=remark)
        db.session.add(customer)
        db.session.commit()
        flash('New customer created.', 'success')
        return redirect(url_for('pre_alert.manage_customer'))
    form.department.data = current_user.department_id
    return render_template('pre_alert/manage_customer.html', customers=customers, customer_count=customer_count,
                           form=form)
