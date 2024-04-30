LOGGING_CONFIG = {
    'version': 1,
    'formatters': {
        'default': {
            'format': '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        }
    },
    'handlers': {
        'api_handler': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': 'DEBUG',
            'filename': 'log/api.log',
            'formatter': 'default',
            'maxBytes': 10485760,  # Dimensione massima per ciascun file (in byte)
            'backupCount': 9999
        },
        'web_handler': {
            'class': 'logging.handlers.RotatingFileHandler',
            'level': 'DEBUG',
            'filename': 'log/web.log',
            'formatter': 'default',
            'maxBytes': 10485760,  # Dimensione massima per ciascun file (in byte)
            'backupCount': 9999
        },
        'console_handler': {
            'class': 'logging.StreamHandler',
            'level': 'DEBUG',
            'formatter': 'default',
            'stream': 'ext://sys.stdout'
        }
    },
    'loggers': {
        'api_logger': {
            'handlers': ['api_handler'],
            'level': 'DEBUG'
        },
        'web_logger': {
            'handlers': ['web_handler'],
            'level': 'DEBUG'
        }
    },
    'root': {  # Configurazione del root logger per visualizzare i messaggi sulla console
        'handlers': ['console_handler'],
        'level': 'DEBUG'
    }
}