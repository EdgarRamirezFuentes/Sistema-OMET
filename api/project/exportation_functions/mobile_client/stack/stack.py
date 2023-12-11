from .StackBuilder import StackBuilder, ModelStackBuilder
from core.models import AppModel

def create_stacks(main_directory, project_app):
    ''' Create the list views for the project app.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project_app (ProjectApp): The project app object
    '''
    print("===project_app===")
    print(project_app)
    

    view_builder = StackBuilder(project_app)
    stack_script = view_builder.build()

    stack_path = f'mobile/src/{project_app.name}/{project_app.name.title()}Stack.jsx'

    main_directory.writestr(stack_path, stack_script)


def create_model_stacks(main_directory, project_app):
    ''' Create the list views for the project app.'''

    app_models = AppModel.objects.filter(project_app=project_app)

    project_app_name = project_app.name


    for app_model in app_models:
        model_stack_builder = ModelStackBuilder(app_model)
        model_stack_script = model_stack_builder.build()

        stack_path = f'mobile/src/{project_app_name}/{app_model.name}/{app_model.name.title()}Stack.jsx'

        main_directory.writestr(stack_path, model_stack_script)


