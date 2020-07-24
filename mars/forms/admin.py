from wtforms import StringField, SelectField, BooleanField, SubmitField
from wtforms import ValidationError
from wtforms.validators import DataRequired, Length, Email
from flask_wtf import FlaskForm
from mars.forms.user import EditProfileForm
from mars.models import User, Role, Department


class EditProfileAdminForm(EditProfileForm):
    email = StringField('Email', validators=[DataRequired(), Length(1, 254), Email()])
    role = SelectField('Role', coerce=int)
    department = SelectField('Department', coerce=int)
    active = BooleanField('Active')
    confirmed = BooleanField('Confirmed')
    submit = SubmitField()

    def __init__(self, user, *args, **kwargs):
        super(EditProfileAdminForm, self).__init__(*args, **kwargs)
        self.role.choices = [(role.id, role.name)
                             for role in Role.query.order_by(Role.name).all()]
        self.department.choices = [(department.id, department.name)
                                   for department in Department.query.order_by(Department.name).all()]
        self.user = user

    def validate_username(self, field):
        if field.data != self.user.username and User.query.filter_by(username=field.data).first():
            raise ValidationError('The username is already in use.')

    def validate_email(self, field):
        if field.data != self.user.email and User.query.filter_by(email=field.data.lower()).first():
            raise ValidationError('The email is already in use.')


class NewDepartmentForm(FlaskForm):
    department = StringField('Department Name', validators=[DataRequired(), Length(1, 19)])
    submit = SubmitField()

    def validate_department(self, field):
        if field.data != self.department.name and Department.query.filter_by(name=field.data).first():
            raise ValidationError('The department is already exist.')


class EditDepartmentForm(FlaskForm):
    department = StringField('Department Name', validators=[DataRequired(), Length(1, 19)])
    submit = SubmitField()

    def validate_department(self, field):
        if field.data != self.department.name and Department.query.filter_by(name=field.data).first():
            raise ValidationError('The department is already exist.')
