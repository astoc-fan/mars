from flask import render_template, flash, Blueprint, request, current_app, redirect, url_for
from flask_login import login_required

from mars.decorators import admin_required, permission_required
from mars.extensions import db
from mars.forms.admin import EditProfileAdminForm, NewDepartmentForm, EditDepartmentForm
from mars.models import Role, User, Department
from mars.utils import redirect_back

pre_alert_bp = Blueprint('pre_alert', __name__)


@pre_alert_bp.route('/')
@login_required
@permission_required('MODERATE')
def index():
    user_count = User.query.count()
    department_count = Department.query.count()
    locked_user_count = User.query.filter_by(locked=True).count()
    blocked_user_count = User.query.filter_by(active=False).count()
    return render_template('admin/index.html', user_count=user_count, locked_user_count=locked_user_count,
                           blocked_user_count=blocked_user_count, department_count=department_count)

