import datetime

import pandas as pd
from flask import render_template, Blueprint
from flask_login import login_required
from pyecharts import options as opts
from pyecharts.charts import Geo, Bar, Line
from pyecharts.globals import GeoType
from pyecharts.globals import ThemeType

from mars.decorators import permission_required
from mars.models import Dashboard

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/')
@login_required
@permission_required('MODERATE')
def index():
    dashboards = Dashboard.query.all()
    return render_template('dashboard/index.html', dashboards=dashboards)


@dashboard_bp.route('/tvdashboard')
def tvdashboard():
    dashboards = Dashboard.query.filter_by(show=True)
    return render_template('dashboard/tvdashboard.html', dashboards=dashboards)


@dashboard_bp.route('/ededashboard')
def ededashboard():
    headers = ['File', 'Client', 'system_destin', 'Input_Ctl#', 'Output_Ctl#', 'Event', 'Event Remarks', 'Event Date',
               'Initial Trigger Date', 'Initial Trigger Branch', 'Last Error Date', 'Dept', 'Create User', 'Error Count'
        , 'Error Message']
    ede = pd.read_csv(r"\\tsn-comm01\sys\ftp\EDIErrors\DailyEDE_Dash.csv", names=headers)
    ede['Date_Diff'] = (datetime.datetime.today() - pd.to_datetime(ede['Last Error Date'])).dt.days
    date_outstanding = ede.groupby('Date_Diff')['Error Count'].sum()
    ede_count = ede.groupby('Create User')['File'].count()
    ede_days = ede.groupby('Create User')['Date_Diff'].mean().round()

    bar = (
        Bar(init_opts=opts.InitOpts(theme=ThemeType.DARK))
            .add_xaxis(list(ede_count.index))
            .add_yaxis("EDE by Create User", ede_count.to_list(),
                       label_opts=opts.LabelOpts(is_show=True))
    )

    line = (
        Line(init_opts=opts.InitOpts(theme=ThemeType.DARK))
            .add_xaxis(list(ede_count.index))
            .add_yaxis("ede_by_op_days",
                       ede_days.to_list(),
                       z_level=1,
                       label_opts=opts.LabelOpts(is_show=True), )
            .add_yaxis("days outstanding",
                       date_outstanding.to_list(),
                       z_level=2,
                       label_opts=opts.LabelOpts(is_show=True), )
    )

    bar.overlap(line)
    return render_template('dashboard/ede.html', bar=bar.dump_options())


@dashboard_bp.route('/tianjin')
def tianjin():
    maptianjin = (
        Geo()
            .add_schema(maptype="天津")
            .add_coordinate("Expeditors-TSN", 117.388737, 39.165105)
            .add_coordinate("Tianjin Sea Port", 117.721901, 38.963799)
            .add("Tianjin", [('Expeditors-TSN', 38), ('Tianjin Sea Port', 21)],
                 type_=GeoType.EFFECT_SCATTER, )
            .set_series_opts(label_opts=opts.LabelOpts(is_show=True))
            .set_global_opts(
        )
    )
    return render_template('dashboard/tianjin.html', maptianjin=maptianjin.dump_options())
