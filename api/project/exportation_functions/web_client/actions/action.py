from project.utils import get_template_file_content
from core.models import AppModel
from .ActionBuilder import ActionBuilder


def create_app_actions(main_directory, project_app):
    app_models = AppModel.objects.filter(project_app=project_app)
    project_app_name = project_app.name

    for app_model in app_models:
        action_builder = ActionBuilder(app_model)
        action_script = action_builder.build()

        action_path = f'web/src/api/actions/{project_app_name}/{app_model.name}.js'

        main_directory.writestr(action_path, action_script)


