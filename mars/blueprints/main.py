from flask import render_template, flash, redirect, url_for, request, current_app, Blueprint, abort, make_response
from flask_login import current_user

# from mars.emails import send_new_comment_email, send_new_reply_email
from mars.extensions import db
# from mars.forms import CommentForm, AdminCommentForm
# from mars.models import Post, Category, Comment
from mars.utils import redirect_back

main_bp = Blueprint('main', __name__)


@main_bp.route('/')
def index():
    # return render_template('mars/index.html', pagination=pagination, posts=posts)
    return render_template('main/index.html')


@main_bp.route('/dashboard')
def dashboard():
    return render_template('dashboard/dashboard.html')


@main_bp.route('/table')
def table():
    return render_template('main/test2.html')
