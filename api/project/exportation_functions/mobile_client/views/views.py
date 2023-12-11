from .ViewBuilder import ViewBuilder
from core.models import AppModel

def create_list_views(main_directory, project_app):
    ''' Create the list views for the project app.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project_app (ProjectApp): The project app object
    '''
    app_models = AppModel.objects.filter(project_app=project_app)

    project_app_name = project_app.name

    for app_model in app_models:
        view_builder = ViewBuilder(app_model)
        list_view_script = view_builder.build_list_view()
        create_view_script = view_builder.build_create_view()
        update_view_script = view_builder.build_update_view()
        retrieve_view_script = view_builder.build_retrieve_view()

        #stack_script = view_builder.

        list_view_path = f'mobile/src/{project_app_name}/{app_model.name}/{app_model.name}ListView.jsx'
        create_view_path = f'mobile/src/{project_app_name}/{app_model.name}/{app_model.name}CreateView.jsx'
        update_view_path = f'mobile/src/{project_app_name}/{app_model.name}/{app_model.name}UpdateView.jsx'
        retrieve_view_path = f'mobile/src/{project_app_name}/{app_model.name}/{app_model.name}RetrieveView.jsx'

        #model_stack_path = f'mobile/src/{project_app_name}/{app_model.name}/{app_model.name}Stack.jsx'

        main_directory.writestr(list_view_path, list_view_script)
        main_directory.writestr(create_view_path, create_view_script)
        main_directory.writestr(update_view_path, update_view_script)
        main_directory.writestr(retrieve_view_path, retrieve_view_script)


