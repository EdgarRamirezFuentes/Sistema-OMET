from .ModelSerializerBuilder import ModelSerializerBuilder
from core.models import AppModel
from project.utils import format_project_name


def create_project_app_serializers(main_directory, project_app):
    """Create the project app serializers

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project_app (ProjectApp): The project app object
    """
    try:
        app_models = AppModel.objects.filter(project_app=project_app)

        if not app_models:
            raise ValueError(f'La app {project_app.name} debe tener al menos un modelo.')

        project_app_name = format_project_name(project_app.name).lower()
        app_serializer_imports = set()

        for app_model in app_models:
            model_serializer_builder = ModelSerializerBuilder(app_model)
            model_serializer = model_serializer_builder.get_serializer_script()
            main_directory.writestr(f'api/{project_app_name}/serializers/{app_model.name}Serializer.py', model_serializer)
            app_serializer_imports.add(f'from .{app_model.name}Serializer import *')

        main_directory.writestr(f'api/{project_app_name}/serializers/__init__.py', '\n'.join(app_serializer_imports))
    except ValueError as e:
        raise e
    except Exception as e:
        raise e
