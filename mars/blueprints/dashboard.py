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


# data = pd.read_csv(r"D:\python\test-pyechart\OE.csv")
# ab = []
# od = []
# for index, row in data.iterrows():
#     ab.append([row['DEST CITY'], row['CW']])
#     od.append([row['ORIGIN CITY'], row['DEST CITY']])
# min_data = min([d[1] for d in ab])
# max_data = max([d[1] for d in ab])


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
def ede_dashboard():
    headers = ['File', 'Client', 'system_destin', 'Input_Ctl#', 'Output_Ctl#', 'Event', 'Event Remarks', 'Event Date',
               'Initial Trigger Date', 'Initial Trigger Branch', 'Last Error Date', 'Dept', 'Create User', 'Error Count'
                , 'Error Message']
    ede = pd.read_csv(r"\\tsn-comm01\sys\ftp\EDIErrors\DailyEDE_Dash.csv", names=headers)
    ede['Date_Diff'] = (datetime.datetime.today() - pd.to_datetime(ede['Last Error Date'])).dt.days
    days_outstanding = ede.groupby('Date_Diff')['Error Count'].sum()
    ede_by_op_count = ede.groupby('Create User')['File'].count()
    ede_by_op_days = ede.groupby('Create User')['Date_Diff'].mean()

    bar = (
        Bar({"theme": ThemeType.DARK})
            .add_xaxis(list(ede_by_op_count.index))
            .add_yaxis("EDE by Create User", ede_by_op_days.to_list(),
                       label_opts=opts.LabelOpts(is_show=True), )
            # .add_yaxis("days outstanding", ede_by_op_count.to_list())
            .set_global_opts(tooltip_opts=opts.TooltipOpts(
                            is_show=True, trigger="axis", axis_pointer_type="cross"),
            ),
        )

    line = (
        Line({"theme": ThemeType.DARK})
            .add_xaxis(list(ede_by_op_count.index))
            .add_yaxis("days outstanding",
                       ede_by_op_count.to_list(),
                       label_opts=opts.LabelOpts(is_show=False),
            )
    )

    bar.overlap(line)
    return render_template('dashboard/ede.html', bar=bar.dump_options()
                           )




@dashboard_bp.route('/tianjin')
def tianjin():
    maptianjin = (
        Geo()
            .add_schema(maptype="天津")
            .add_coordinate("天津港", 117.4205, 38.5908)  # 39°0′N 117°48′
            .add("Tianjin", [('天津港', 'instruction')],
                 type_=GeoType.SCATTER, )
            .set_series_opts(label_opts=opts.LabelOpts(is_show=False))
            .set_global_opts(
        )
    )
    return render_template('dashboard/tianjin.html', maptianjin=maptianjin.dump_options())


# @dashboard_bp.route('/test')
# def testdashboard():
#     c = (
#         Geo()
#             .add_schema(maptype="world")
#             .add_coordinate_json(json_file=os.path.join(current_app.config['STATIC_PATH'], 'world_cities.json'))
#             .add(
#             "C Weight",
#             ab,
#             type_=GeoType.SCATTER,
#         )
#             .add(
#             "geo",
#             od,
#             type_=GeoType.LINES,
#             # effect_opts=opts.EffectOpts(symbol=SymbolType.DIAMOND, symbol_size=5, color="blue",),
#             linestyle_opts=opts.LineStyleOpts(curve=0.3),
#         )
#             .set_series_opts(label_opts=opts.LabelOpts(is_show=False))
#             .set_global_opts(title_opts=opts.TitleOpts(title="TSN LINES")
#                              , visualmap_opts=opts.VisualMapOpts(min_=min_data, max_=max_data)
#                              )
#     )
#
#     return render_template('dashboard/testdashboard.html',
#                            c_data=c.dump_options())
