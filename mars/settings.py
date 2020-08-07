import os
import sys
from mars.script.tasks import aps_test

basedir = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))

# SQLite URI compatible
WIN = sys.platform.startswith('win')
if WIN:
    prefix = 'sqlite:///'
else:
    prefix = 'sqlite:////'


class Operations:
    CONFIRM = 'confirm'
    RESET_PASSWORD = 'reset-password'
    CHANGE_EMAIL = 'change-email'


class BaseConfig:
    MARS_USER_PER_PAGE = 20
    MARS_MANAGE_USER_PER_PAGE = 30
    MARS_MAIL_SUBJECT_PREFIX = '[MARS]'
    MARS_ADMIN_EMAIL = os.getenv('MARS_ADMIN', 'stef.fan@expeditors.com')

    SECRET_KEY = os.getenv('SECRET_KEY', 'dev key')

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MAIL_SERVER = os.getenv('MAIL_SERVER', '10.254.14.154')
    MAIL_PORT = 25
    MAIL_USE_SSL = False
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = ('expd-tsn@expeditors.com', MAIL_USERNAME)

    WHOOSHEE_MIN_STRING_LEN = 1
    SCHEDULER_API_ENABLED = True
    JOBS = [
        {
            'id': 'job1',
            'func': aps_test,
            'args': '',
            'trigger': 'interval',
            'seconds': 2
        }
    ]


class DevelopmentConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = prefix + os.path.join(basedir, 'data-dev.db')


class TestingConfig(BaseConfig):
    TESTING = True
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'  # in-memory database


class ProductionConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', prefix + os.path.join(basedir, 'data.db'))


config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig
}
