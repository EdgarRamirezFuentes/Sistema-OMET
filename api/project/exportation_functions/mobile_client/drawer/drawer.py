from .DrawerBuilder import DrawerBuilder, CustomDrawerContentBuilder

def create_drawer_component(main_directory, project):
    """Create the drawer component in the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project (Project): The project object
    """
    try:
        drawer_builder = DrawerBuilder(project)
        drawer_script = drawer_builder.build()

        main_directory.writestr('mobile/src/Routes/Drawer.jsx', drawer_script)
    except Exception as e:
        raise e

def create_drawer_custom_content(main_directory, project):
    """Create the drawer custom content in the zip file.

    Args:
        main_directory (zipfile.ZipFile): The main directory of the project
        project (Project): The project object
    """
    try:
        custom_drawer_content_builder = CustomDrawerContentBuilder(project)
        custom_drawer_script = custom_drawer_content_builder.build()

        main_directory.writestr('mobile/src/DrawerContent/CustomDrawerContent.jsx', custom_drawer_script)
    except Exception as e:
        raise e