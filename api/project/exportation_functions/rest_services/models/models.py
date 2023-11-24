from core.models import  (
    AppModel,
    ForeignKeyRelation
)
from project.utils import format_project_name
from .ModelBuilder import ModelBuilder

def create_app_models(main_directory, project_app):
    """Create the models of the app.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project_app (ProjectApp): The project app object
    """
    try:
        project_app_name = format_project_name(project_app.name)
        project_app_directory = project_app_name.lower()

        # Getting the models of the project app
        models = AppModel.objects.filter(project_app=project_app)
        app_models_imports = ''

        # Creating the models
        for model in models:
            model_builder = ModelBuilder(model)
            model_script = model_builder.get_model_script()

            foreign_keys = ForeignKeyRelation.objects.filter(model_field_origin__app_model=model)
            print(model, foreign_keys)


            # Adding the imports of the models
            app_models_imports += f'from .{model.name} import {model.name}\n'

            # Adding the model script to the main directory
            main_directory.writestr(f'api/{project_app_directory}/models/{model.name}.py', model_script)

        # Adding the imports of the models to the __init__.py file
        main_directory.writestr(f'api/{project_app_directory}/models/__init__.py', app_models_imports)
    except ValueError as e:
        raise e
    except Exception as e:
        raise e
