from extensions import socketio

from . import create_app

app = create_app()

if __name__ == '__main__':
    socketio = socketio(app, debug=True, cors_allowed_origins='*', async_mode='eventlet')


