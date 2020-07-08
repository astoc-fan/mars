import os
from datetime import datetime

from flask import current_app
# from flask_avatars import Identicon
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from mars.extensions import db, whooshee


@whooshee.register_model('name', 'username')
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, index=True)
    email = db.Column(db.String(254), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    name = db.Column(db.String(30))
    branch = db.Column(db.String(10))
    department = db.Column(db.String(20))
    member_since = db.Column(db.DateTime, default=datetime.utcnow)
    confirmed = db.Column(db.Boolean, default=False)
