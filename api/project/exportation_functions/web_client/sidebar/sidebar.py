from .SidebarBuilder import SidebarBuilder

def create_sidebar_component(main_directory, project):
    """Create the sidebar component in the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project (Project): The project object
    """
    try:
        sidebar_builder = SidebarBuilder(project)
        sidebar_script = sidebar_builder.build()

        main_directory.writestr('web/src/Components/sidebar/Sidebar.jsx', sidebar_script)
    except Exception as e:
        raise e
