from core.models import AppModel
from .ModelViewBuilder import ModelViewBuilder

def create_project_app_views(main_directory, project_app):
    """Create the views of the project app

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project_app (ProjectApp): The project app object
    """
    try:
        project_models = AppModel.objects.filter(project_app=project_app, is_active=True)

        if not project_models:
            raise ValueError(f'La app {project_app.name} debe tener al menos un modelo.')

        view_imports = ''

        for project_model in project_models:
            project_model_name = project_model.name
            model_view_builder = ModelViewBuilder(project_model)
            view_script = model_view_builder.get_view_script()
            main_directory.writestr(f'api/{project_app.name}/views/{project_model_name}.py', view_script)
            view_imports += f'from .{project_model_name} import {project_model_name}ViewSet\n'

        # Adding the view imports
        main_directory.writestr(f'api/{project_app.name}/views/__init__.py', view_imports)
    except ValueError as e:
        raise e
    except Exception as e:
        raise e
