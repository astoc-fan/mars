from wtforms import StringField, SelectField, BooleanField, SubmitField, TextAreaField
from wtforms import ValidationError
from wtforms.validators import DataRequired, Length, Email
from flask_wtf import FlaskForm
from mars.models import User, Role, Department, Customer


class NewCustomerForm(FlaskForm):
    department = SelectField('Department', coerce=int)
    gci = StringField('GCI', validators=[DataRequired(), Length(1, 10)])
    name = StringField('Customer Name', validators=[DataRequired(), Length(1, 128)])
    customer_email = TextAreaField('Customer Emails', validators=[DataRequired()])
    user_email = TextAreaField('Operator Emails', validators=[DataRequired()])
    remark = StringField('Remark', validators=[DataRequired(), Length(1, 128)])
    submit = SubmitField()

    def __init__(self):
        super(NewCustomerForm, self).__init__()
        self.department.choices = [(department.id, department.name)
                                   for department in Department.query.order_by(Department.name).all()]
