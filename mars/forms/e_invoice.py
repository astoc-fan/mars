from wtforms import StringField, SelectField, BooleanField, SubmitField, TextAreaField
from wtforms import ValidationError
from wtforms.validators import DataRequired, Length, Email
from flask_wtf import FlaskForm
from mars.models import User, Role, Department, Customer


class NewInvCustomerForm(FlaskForm):
    gci = StringField('GCI', validators=[DataRequired(), Length(1, 10)])
    name = StringField('Customer Name', validators=[DataRequired(), Length(1, 128)])
    branch = StringField('Branch', validators=[DataRequired(), Length(1, 5)])
    customer_email = TextAreaField('Customer Emails', validators=[DataRequired()])
    user_email = TextAreaField('Operator Emails', validators=[DataRequired()])
    remark = StringField('Remark', validators=[DataRequired(), Length(1, 128)])
    submit = SubmitField()
