from tornado.httpserver import HTTPServer
from tornado.wsgi import WSGIContainer
import mars
from tornado.ioloop import IOLoop

app = mars.create_app()
s = HTTPServer(WSGIContainer(app))
s.listen(9900) # 监听 9900 端口
IOLoop.current().start()
