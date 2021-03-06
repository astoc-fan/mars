from flask import render_template, flash, Blueprint, request, current_app, redirect, url_for
from flask_login import login_required

from mars.decorators import admin_required, permission_required
from mars.extensions import db
from mars.forms.admin import EditProfileAdminForm, NewDepartmentForm, EditDepartmentForm, DashboardForm
from mars.models import Role, User, Department, Dashboard
from mars.utils import redirect_back

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/')
@login_required
@permission_required('MODERATE')
def index():
    user_count = User.query.count()
    department_count = Department.query.count()
    dashboard_count = Dashboard.query.count()
    locked_user_count = User.query.filter_by(locked=True).count()
    blocked_user_count = User.query.filter_by(active=False).count()
    return render_template('admin/index.html', user_count=user_count, locked_user_count=locked_user_count,
                           blocked_user_count=blocked_user_count, department_count=department_count,
                           dashboard_count=dashboard_count)


@admin_bp.route('/profile/<int:user_id>', methods=['GET', 'POST'])
@login_required
@admin_required
def edit_profile_admin(user_id):
    user = User.query.get_or_404(user_id)
    form = EditProfileAdminForm(user=user)
    if form.validate_on_submit():
        user.name = form.name.data
        role = Role.query.get(form.role.data)
        department = Department.query.get(form.department.data)
        if role.name == 'Locked':
            user.lock()
        user.role = role
        user.branch = form.branch.data
        user.department = department
        user.confirmed = form.confirmed.data
        user.active = form.active.data
        user.username = form.username.data
        user.email = form.email.data
        db.session.commit()
        flash('Profile updated.', 'success')
        return redirect_back()
    form.name.data = user.name
    form.role.data = user.role_id
    form.branch.data = user.branch
    form.department.data = user.department_id
    form.username.data = user.username
    form.email.data = user.email
    form.confirmed.data = user.confirmed
    form.active.data = user.active
    return render_template('admin/edit_profile.html', form=form, user=user)


@admin_bp.route('/block/user/<int:user_id>', methods=['POST'])
@login_required
@permission_required('MODERATE')
def block_user(user_id):
    user = User.query.get_or_404(user_id)
    if user.role.name in ['Administrator', 'Moderator']:
        flash('Permission denied.', 'warning')
    else:
        user.block()
        flash('Account blocked.', 'info')
    return redirect_back()


@admin_bp.route('/unblock/user/<int:user_id>', methods=['POST'])
@login_required
@permission_required('MODERATE')
def unblock_user(user_id):
    user = User.query.get_or_404(user_id)
    user.unblock()
    flash('Block canceled.', 'info')
    return redirect_back()


@admin_bp.route('/lock/user/<int:user_id>', methods=['POST'])
@login_required
@permission_required('MODERATE')
def lock_user(user_id):
    user = User.query.get_or_404(user_id)
    if user.role.name in ['Administrator', 'Moderator']:
        flash('Permission denied.', 'warning')
    else:
        user.lock()
        flash('Account locked.', 'info')
    return redirect_back()


@admin_bp.route('/unlock/user/<int:user_id>', methods=['POST'])
@login_required
@permission_required('MODERATE')
def unlock_user(user_id):
    user = User.query.get_or_404(user_id)
    user.unlock()
    flash('Lock canceled.', 'info')
    return redirect_back()


@admin_bp.route('/manage/user')
@login_required
@permission_required('MODERATE')
def manage_user():
    filter_rule = request.args.get('filter', 'all')  # 'all', 'locked', 'blocked', 'administrator', 'moderator'
    page = request.args.get('page', 1, type=int)
    per_page = current_app.config['MARS_MANAGE_USER_PER_PAGE']
    administrator = Role.query.filter_by(name='Administrator').first()
    moderator = Role.query.filter_by(name='Moderator').first()

    if filter_rule == 'locked':
        filtered_users = User.query.filter_by(locked=True)
    elif filter_rule == 'blocked':
        filtered_users = User.query.filter_by(active=False)
    elif filter_rule == 'administrator':
        filtered_users = User.query.filter_by(role=administrator)
    elif filter_rule == 'moderator':
        filtered_users = User.query.filter_by(role=moderator)
    elif filter_rule == 'TSN':
        filtered_users = User.query.filter_by(branch='TSN')
    else:
        filtered_users = User.query

    pagination = filtered_users.order_by(User.member_since.desc()).paginate(page, per_page)
    users = pagination.items
    return render_template('admin/manage_user.html', pagination=pagination, users=users)


@admin_bp.route('/manage/department', methods=['GET', 'POST'])
@login_required
@permission_required('MODERATE')
def manage_departments():
    department_count = Department.query.count()
    departments = Department.query.all()
    form = NewDepartmentForm()
    if form.validate_on_submit():
        department = form.department.data
        new_dept = Department(name=department)
        db.session.add(new_dept)
        db.session.commit()
        flash('New Department created.', 'success')
        return redirect(url_for('admin.manage_departments'))
    return render_template('admin/manage_department.html', departments=departments, department_count=department_count,
                           form=form)


# @admin_bp.route('/manage/new_department', methods=['GET', 'POST'])
# @login_required
# @permission_required('MODERATE')
# def new_department():
#     form = NewDepartmentForm()
#     if form.validate_on_submit():
#         department = form.department.data
#         new_dept = Department(name=department)
#         db.session.add(new_dept)
#         db.session.commit()
#         flash('New Department created.', 'success')
#     return render_template('admin/new_department.html', form=form)


@admin_bp.route('/department/<int:department_id>', methods=['GET', 'POST'])
@login_required
@admin_required
def edit_department(department_id):
    department = Department.query.get_or_404(department_id)
    form = EditDepartmentForm(department=department)
    if form.validate_on_submit():
        department.name = form.department.data
        db.session.commit()
        flash('Department updated.', 'success')
        return redirect_back()
    form.department.data = department.name
    return render_template('admin/edit_department.html', form=form, department=department)


@admin_bp.route('/department/delete/<int:department_id>', methods=['POST'])
@login_required
@admin_required
def delete_department(department_id):
    department = Department.query.get_or_404(department_id)
    db.session.delete(department)
    db.session.commit()
    flash('Department deleted.', 'success')
    return redirect(url_for('admin.manage_departments'))


@admin_bp.route('/manage/dashboard', methods=['GET', 'POST'])
@login_required
@admin_required
def manage_dashboards():
    dashboard_count = Dashboard.query.count()
    dashboards = Dashboard.query.all()
    form = DashboardForm()
    if form.validate_on_submit():
        name = form.name.data
        desc = form.desc.data
        category = form.category.data
        url = form.url.data
        author = form.author.data
        show = form.show.data
        new_dashboard = Dashboard(name=name, desc=desc, category=category, url=url, author=author, show=show)
        db.session.add(new_dashboard)
        db.session.commit()
        flash('New Dashboard created.', 'success')
        return redirect(url_for('admin.manage_dashboards'))
    return render_template('admin/manage_dashboard.html', dashboards=dashboards, dashboard_count=dashboard_count,
                           form=form)


@admin_bp.route('/dashboard/<int:dashboard_id>', methods=['GET', 'POST'])
@login_required
@admin_required
def edit_dashboard(dashboard_id):
    dashboard = Dashboard.query.get_or_404(dashboard_id)
    form = DashboardForm(dashboard=dashboard)
    if form.validate_on_submit():
        dashboard.name = form.name.data
        dashboard.desc = form.desc.data
        dashboard.category = form.category.data
        dashboard.url = form.url.data
        dashboard.author = form.author.data
        dashboard.show = form.show.data
        db.session.commit()
        flash('Dashboard updated.', 'success')
        return redirect_back()
    form.name.data = dashboard.name
    form.desc.data = dashboard.desc
    form.category.data = dashboard.category
    form.url.data = dashboard.url
    form.author.data = dashboard.author
    form.show.data = dashboard.show
    return render_template('admin/edit_dashboard.html', form=form, dashboard=dashboard)


@admin_bp.route('/dashboard/delete/<int:dashboard_id>', methods=['POST'])
@login_required
@admin_required
def delete_dashboard(dashboard_id):
    dashboard = Dashboard.query.get_or_404(dashboard_id)
    db.session.delete(dashboard)
    db.session.commit()
    flash('Dashboard deleted.', 'success')
    return redirect(url_for('admin.manage_dashboards'))
