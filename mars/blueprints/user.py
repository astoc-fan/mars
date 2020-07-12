from flask import render_template, flash, redirect, url_for, current_app, request, Blueprint
from flask_login import login_required, current_user, fresh_login_required, logout_user

# from mars.decorators import confirm_required, permission_required
from mars.emails import send_change_email_email
from mars.extensions import db
from mars.forms.user import EditProfileForm
from mars.models import User
from mars.settings import Operations
from mars.utils import generate_token, validate_token, redirect_back, flash_errors

user_bp = Blueprint('user', __name__)


@user_bp.route('/<username>')
def index(username):
    user = User.query.filter_by(username=username).first_or_404()

    # if user == current_user:
    #     logout_user()

    return render_template('user/index.html', user=user)


@user_bp.route('/settings/profile', methods=['GET', 'POST'])
@login_required
def edit_profile():
    form = EditProfileForm()
    if form.validate_on_submit():
        current_user.name = form.name.data
        current_user.username = form.username.data
        current_user.branch = form.branch.data
        current_user.department = form.department.data
        db.session.commit()
        flash('Profile updated.', 'success')
        return redirect(url_for('.index', username=current_user.username))
    form.name.data = current_user.name
    form.username.data = current_user.username
    form.branch.data = current_user.branch
    form.department.data = current_user.department
    return render_template('user/settings/edit_profile.html', form=form)