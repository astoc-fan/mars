from flask_login import current_user
from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import StringField, SelectField, PasswordField, SubmitField, BooleanField, TextAreaField, HiddenField, \
    ValidationError
from wtforms.validators import DataRequired, Length, Email, EqualTo, Optional, Regexp

from mars.models import User


class EditProfileForm(FlaskForm):
    name = StringField('Name', validators=[DataRequired(), Length(1, 30)])
    username = StringField('Username', validators=[DataRequired(), Length(5, 20),
                                                   Regexp('^[a-zA-Z][a-zA-Z0-9-]{4,15}$',
                                                          message='The username should contain only a-z, A-Z, 0-9 and -.')])
    branch = StringField('Branch', validators=[DataRequired(), Length(0, 10)])
    # department = StringField('Department', validators=[DataRequired(), Length(0, 20)])
    department = SelectField('Department', validators=[DataRequired()],
                             choices=[('IS', 'IS'), ('op', 'Operation')])
    submit = SubmitField()

    def validate_username(self, field):
        if field.data != current_user.username and User.query.filter_by(username=field.data).first():
            raise ValidationError('The username is already in use.')
