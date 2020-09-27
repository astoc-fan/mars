from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileRequired, FileAllowed
from wtforms import StringField, SubmitField, TextAreaField
from wtforms.validators import DataRequired, Length
from mars.models import Inv_Customer
from wtforms import ValidationError
# from flask_uploads import UploadSet, configure_uploads, IMAGES, patch_request_class

# photos = UploadSet('photos', IMAGES)


class NewInvCustomerForm(FlaskForm):
    gci = StringField('GCI', validators=[DataRequired(), Length(1, 10)])
    name = StringField('Customer Name', validators=[DataRequired(), Length(1, 128)])
    branch = StringField('Branch', validators=[DataRequired(), Length(1, 5)])
    customer_email = TextAreaField('Customer Emails', validators=[DataRequired()])
    user_email = TextAreaField('Operator Emails', validators=[DataRequired()])
    remark = StringField('Remark', validators=[DataRequired(), Length(1, 128)])
    submit = SubmitField()

    def validate_gci(self, field):
        if Inv_Customer.query.filter_by(gci=field.data).first():
            raise ValidationError('The GCI is already exist.')


class UploadForm(FlaskForm):
    customer_list = FileField('Bulk upload customers', validators=[FileRequired(), FileAllowed(['xls', 'xlsx'])])
    submit = SubmitField()


class Upload_inv_register_form(FlaskForm):
    inv_register = FileField('Upload Inv Register', validators=[FileRequired(), FileAllowed(['xls', 'xlsx', 'csv'])])
    submit = SubmitField()


