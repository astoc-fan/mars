from flask import render_template, flash, Blueprint, redirect, url_for
from flask_login import login_required, current_user
from mars.decorators import admin_required, permission_required
from mars.extensions import db
from mars.forms.pre_alert import NewCustomerForm
from mars.models import Dashboard
from mars.utils import redirect_back

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/')
@login_required
@permission_required('MODERATE')
def index():
    dashboards = Dashboard.query.all()
    return render_template('dashboard/index.html', dashboards=dashboards)


@dashboard_bp.route('/tvdashboard')
@login_required
@permission_required('MODERATE')
def tvdashboard():
    dashboards = Dashboard.query.filter_by(show=True)
    return render_template('dashboard/tvdashboard.html', dashboards=dashboards)



