class MongoRouter:
    """
    A router to control if database should use
    primary database or non-relational one.
    """

    logs_models = {'userinsertionlogs',}

    def db_for_read(self, model, **_hints):
        if model._meta.model_name in self.logs_models:
            return 'logs'
        return 'default'

    def db_for_write(self, model, **_hints):
        if model._meta.model_name in self.logs_models:
            return 'logs'
        return 'default'

    def allow_migrate(self, _db, _app_label, model_name=None, **_hints):
        if _db == 'logs' or model_name in self.logs_models:
            return False
        return True
