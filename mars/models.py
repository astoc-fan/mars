from datetime import datetime

from flask import current_app
# from flask_avatars import Identicon
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash

from mars.extensions import db, whooshee

# relationship table
roles_permissions = db.Table('roles_permissions',
                             db.Column('role_id', db.Integer, db.ForeignKey('role.id')),
                             db.Column('permission_id', db.Integer, db.ForeignKey('permission.id'))
                             )


class Permission(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True)
    roles = db.relationship('Role', secondary=roles_permissions, back_populates='permissions')


class Role(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(30), unique=True)
    users = db.relationship('User', back_populates='role')
    permissions = db.relationship('Permission', secondary=roles_permissions, back_populates='roles')

    @staticmethod
    def init_role():
        roles_permissions_map = {
            'Locked': [],
            'User': ['PRE-ALERT', 'E-INVOICE'],
            'Superuser': ['PRE-ALERT', 'E-INVOICE', 'MODERATE'],
            'Administrator': ['PRE-ALERT', 'E-INVOICE', 'MODERATE', 'ADMINISTER']
        }

        for role_name in roles_permissions_map:
            role = Role.query.filter_by(name=role_name).first()
            if role is None:
                role = Role(name=role_name)
                db.session.add(role)
            role.permissions = []
            for permission_name in roles_permissions_map[role_name]:
                permission = Permission.query.filter_by(name=permission_name).first()
                if permission is None:
                    permission = Permission(name=permission_name)
                    db.session.add(permission)
                role.permissions.append(permission)
        db.session.commit()


@whooshee.register_model('name', 'username')
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, index=True)
    email = db.Column(db.String(254), unique=True, index=True)
    password_hash = db.Column(db.String(128))
    name = db.Column(db.String(30))
    branch = db.Column(db.String(10))
    member_since = db.Column(db.DateTime, default=datetime.utcnow)
    confirmed = db.Column(db.Boolean, default=False)
    locked = db.Column(db.Boolean, default=False)
    active = db.Column(db.Boolean, default=True)
    customers = db.relationship('Customer', back_populates='user')
    # invcustomers = db.relationship('Inv_Customer', back_populates='user')
    role_id = db.Column(db.Integer, db.ForeignKey('role.id'))
    role = db.relationship('Role', back_populates='users')
    department_id = db.Column(db.Integer, db.ForeignKey('department.id'))
    department = db.relationship('Department', back_populates='users')

    def __repr__(self):
        return self.name

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        self.set_role()
        # self.set_department()

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def set_role(self):
        if self.role_id is None:
            if self.email == current_app.config['MARS_ADMIN_EMAIL']:
                self.role_id = 4  # Admin
            else:
                self.role_id = 2  # User
            db.session.commit()

    def set_department(self):
        if self.department_id is None:
            if self.email == current_app.config['MARS_ADMIN_EMAIL']:
                self.department_id = 3  # Department.query.filter_by(name='IS').first()
            else:
                self.department_id = 4  # Role.query.filter_by(name='Operation').first()
            db.session.commit()

    def validate_password(self, password):
        return check_password_hash(self.password_hash, password)

    def lock(self):
        self.locked = True
        self.role = Role.query.filter_by(name='Locked').first()
        db.session.commit()

    def unlock(self):
        self.locked = False
        self.role = Role.query.filter_by(name='User').first()
        db.session.commit()

    def block(self):
        self.active = False
        db.session.commit()

    def unblock(self):
        self.active = True
        db.session.commit()

    @property
    def is_admin(self):
        return self.role.name == 'Administrator'

    @property
    def is_active(self):
        return self.active

    def can(self, permission_name):
        permission = Permission.query.filter_by(name=permission_name).first()
        return permission is not None and self.role is not None and permission in self.role.permissions


class Department(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True)
    users = db.relationship('User', back_populates='department')
    customers = db.relationship('Customer', back_populates='department')
    # invcustomers = db.relationship('Inv_Customer', back_populates='department')

    def __repr__(self):
        return self.name


class Customer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    gci = db.Column(db.String(10))
    name = db.Column(db.String(128))
    user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    user = db.relationship('User', back_populates='customers')
    department_id = db.Column(db.Integer, db.ForeignKey(Department.id))
    department = db.relationship('Department', back_populates='customers')
    user_email = db.Column(db.Text)
    customer_email = db.Column(db.Text)
    create = db.Column(db.DateTime, default=datetime.utcnow)
    remark = db.Column(db.String(128))


class Pre_alert(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event = db.Column(db.String(4))
    create = db.Column(db.DateTime, default=datetime.utcnow())


class Rates(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    currency = db.Column(db.String(10))
    currency_abbr = db.Column(db.String(10))
    price_exch_buy = db.Column(db.String(10))
    price_cash_buy = db.Column(db.String(10))
    price_exch_sell = db.Column(db.String(10))
    price_cash_sell = db.Column(db.String(10))
    price_boc_mid = db.Column(db.String(10))
    publish = db.Column(db.DateTime)
    create = db.Column(db.DateTime, default=datetime.utcnow)


class Dashboard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), unique=True)
    desc = db.Column(db.String(256))
    category = db.Column(db.String(20))
    url = db.Column(db.String(2000))
    author = db.Column(db.String(20))
    show = db.Column(db.Boolean, default=False)
    create = db.Column(db.DateTime, default=datetime.utcnow)


class Inv_Customer(db.Model):
    cid = db.Column(db.Integer, primary_key=True)
    gci = db.Column(db.String(10))
    name = db.Column(db.String(128))
    # user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    user = db.Column(db.String(20))
    # department_id = db.Column(db.Integer, db.ForeignKey(Department.id))
    department = db.Column(db.String(20))
    branch = db.Column(db.String(5))
    user_email = db.Column(db.Text)
    customer_email = db.Column(db.Text)
    create = db.Column(db.DateTime, default=datetime.now())
    to_user_only = db.Column(db.Boolean)
    remark = db.Column(db.String(128))


class inv_register(db.Model):
    invoice_type = db.Column(db.String(5))
    bill_to_gci = db.Column(db.String(10))
    name = db.Column(db.String(256))
    bill_to_gci_br = db.Column(db.String(5))
    cc = db.Column(db.String(5))
    usagedistinction = db.Column(db.String(10))
    ei_invoice_ref = db.Column(db.String(10), primary_key=True, unique=True)
    file = db.Column(db.String(10))
    tc = db.Column(db.String(10))
    canceling_inv_reference = db.Column(db.String(10))
    issue_date = db.Column(db.Date)
    issue_date_month = db.Column(db.String(2))
    issue_date_year = db.Column(db.String(4))
    amount = db.Column(db.Float)
    currency = db.Column(db.String(10))
    foreign_amount = db.Column(db.Float)
    foreign_currency = db.Column(db.String(10))
    vat_amount = db.Column(db.Float)
    tax_invoice_status = db.Column(db.String(256))
    internal_tax_ref = db.Column(db.String(10))
    vat_invoice_ref = db.Column(db.String(20))
    vat_issue_date = db.Column(db.Date)
    vat_issue_date_month = db.Column(db.String(2))
    vat_issue_date_year = db.Column(db.String(4))
    first_vat_inv_ref = db.Column(db.String(20))
    first_vat_issue_date = db.Column(db.Date)
    first_vat_issue_date_month = db.Column(db.String(2))
    first_vat_issue_date_year = db.Column(db.String(4))
    consol = db.Column(db.String(25))
    service_order = db.Column(db.String(10))
    mbl = db.Column(db.String(25))
    hbl = db.Column(db.String(25))


class Invoices(db.Model):
    iid = db.Column(db.Integer, primary_key=True)
    tax_ref = db.Column(db.String(30))
    tai_scan_date = db.Column(db.DateTime)
    gci = db.Column(db.String(10))
    customer_name = db.Column(db.String(256))
    ei_invoice_ref = db.Column(db.String(10))
    file = db.Column(db.String(10))
    amount = db.Column(db.Float)
    currency = db.Column(db.String(10))
    vat_invoice_ref = db.Column(db.String(30))
    department = db.Column(db.String(20))
    status = db.Column(db.String(10))
    user_email = db.Column(db.Text)
    customer_email = db.Column(db.Text)
    update_time = db.Column(db.DateTime, default=datetime.utcnow)
