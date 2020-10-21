from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, SubmitField, TextAreaField, BooleanField, SelectField
from wtforms.validators import DataRequired, Length
from mars.models import Inv_Customer, Department, User
from flask_login import current_user
from wtforms import ValidationError


class NewInvCustomerForm(FlaskForm):
    gci = StringField('GCI', validators=[DataRequired(), Length(1, 10)])
    name = StringField('Customer Name', validators=[DataRequired(), Length(1, 128)])
    branch = StringField('Branch', validators=[DataRequired(), Length(1, 5)])
    user = StringField('User', validators=[DataRequired(), Length(1, 20)])
    # department = StringField('Department', validators=[DataRequired(), Length(1, 20)])
    department = SelectField('Department', coerce=str)
    customer_email = TextAreaField('Customer Emails', validators=[DataRequired()])
    user_email = TextAreaField('Operator Emails', validators=[DataRequired()])
    to_user_only = BooleanField('To user only?')
    remark = StringField('Remark')
    submit = SubmitField()

    def __init__(self):
        super(NewInvCustomerForm, self).__init__()
        self.department.choices = [(department.name, department.name)
                                   for department in Department.query.order_by(Department.name).all()]
        self.department.default = Department.query.filter_by(id=current_user.department_id).first_or_404()

    # def validate_gci(self, field):
    #     if Inv_Customer.query.filter_by(gci=field.data).first() and Inv_Customer.query.filter_by(department=field.data):
    #         raise ValidationError('The GCI and Department is already exist.')


# class EditInvCustomerForm(FlaskForm):



class UploadForm(FlaskForm):
    customer_list = FileField('Bulk upload customers', validators=[FileRequired(), FileAllowed(['xls', 'xlsx'])])
    submit = SubmitField()


class Upload_inv_register_form(FlaskForm):
    inv_register = FileField('Upload Inv Register', validators=[FileRequired(), FileAllowed(['xls', 'xlsx', 'csv'])])
    submit = SubmitField()


