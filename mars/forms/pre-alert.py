from wtforms import StringField, SelectField, BooleanField, SubmitField
from wtforms import ValidationError
from wtforms.validators import DataRequired, Length, Email
from flask_wtf import FlaskForm
from mars.forms.user import EditProfileForm
from mars.models import User, Role, Department

