import mars
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

app = mars.create_app()
manager = Manager(app)

Migrate(app, mars.db, render_as_batch=True)

manager.add_command('db', MigrateCommand) # 当你的命令中出现 db 指令,则去MigrateCommand中寻找对应关系
"""
数据库迁移指令:
python manager.py db init 
python manager.py db migrate   # Django中的 makemigration
python manager.py db upgrade  # Django中的 migrate
"""


if __name__ == '__main__':
    manager.run()
