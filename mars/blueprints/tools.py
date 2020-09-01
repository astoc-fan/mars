import datetime

from flask import render_template, Blueprint, current_app

from mars.extensions import db
from mars.models import Rates

tools_bp = Blueprint('tools', __name__)


@tools_bp.route('/')
def index():
    return render_template('tools/index.html')


@tools_bp.route('/rates')
def rates():
    # today = datetime.date.today()
    # rates_today = Rates.query.filter(Rates.publish > today).all()
    last10 = Rates.query.filter(Rates.publish).order_by(Rates.id.desc()).limit(10)
    return render_template('tools/rates.html', last10=last10)
