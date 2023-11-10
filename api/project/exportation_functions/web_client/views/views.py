from .ViewBuilder import ViewBuilder
from core.models import AppModel

def build_list_views(main_directory, project_app):
    app_models = AppModel.objects.filter(project_app=project_app)

    project_app_name = project_app.name

    for app_model in app_models:
        view_builder = ViewBuilder(app_model)
        list_view_script = view_builder.build_list_view()

        list_view_path = f'web/src/{project_app_name}/{app_model.name}/ListView.jsx'

        main_directory.writestr(list_view_path, list_view_script)
