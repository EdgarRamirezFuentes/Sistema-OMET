from project.utils import get_template_file_content
from core.models import AppModel
from .ControllerBuilder import ControllerBuilder

def create_app_controllers(main_directory, project_app):
    app_models = AppModel.objects.filter(project_app=project_app)

    project_app_name = project_app.name

    for app_model in app_models:
        controller_builder = ControllerBuilder(app_model)
        controller_script = controller_builder.build()

        controller_path = f'web/src/api/controller/{project_app_name}/{app_model.name}.js'

        main_directory.writestr(controller_path, controller_script)