import os

import click
from flask import Flask, render_template

# from mars.blueprints.admin import admin_bp
# from mars.blueprints.auth import auth_bp
from mars.blueprints.main import main_bp
from mars.blueprints.auth import auth_bp
from mars.extensions import bootstrap, db, login_manager, moment
# from mars.models import Admin, Post, Category, Comment, Link
from mars.settings import config

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))


def create_app(config_name=None):
    if config_name is None:
        config_name = os.getenv('FLASK_CONFIG', 'development')

    app = Flask('mars')
    app.config.from_object(config[config_name])

    register_logging(app)
    register_extensions(app)
    register_blueprints(app)
    # register_commands(app)
    # register_errors(app)
    # register_shell_context(app)
    # register_template_context(app)
    return app


def register_logging(app):
    pass


def register_extensions(app):
    bootstrap.init_app(app)
    db.init_app(app)
    login_manager.init_app(app)
    # ckeditor.init_app(app)
    # mail.init_app(app)
    moment.init_app(app)


def register_blueprints(app):
    app.register_blueprint(main_bp)
    # app.register_blueprint(admin_bp, url_prefix='/admin')
    # app.register_blueprint(auth_bp, url_prefix='/auth')


# def register_shell_context(app):
#     @app.shell_context_processor
#     def make_shell_context():
#         return dict(db=db, Admin=Admin, Post=Post, Category=Category, Comment=Comment)


# def register_template_context(app):
#     @app.context_processor
#     def make_template_context():
#         admin = Admin.query.first()
#         categories = Category.query.order_by(Category.name).all()
#         links = Link.query.order_by(Link.name).all()
#         return dict(admin=admin, categories=categories, links=links)


# def register_errors(app):
#     @app.errorhandler(400)
#     def bad_request(e):
#         return render_template('errors/400.html'), 400
#
#     @app.errorhandler(404)
#     def page_not_found(e):
#         return render_template('errors/404.html'), 404
#
#     @app.errorhandler(500)
#     def internal_server_error(e):
#         return render_template('errors/500.html'), 500
