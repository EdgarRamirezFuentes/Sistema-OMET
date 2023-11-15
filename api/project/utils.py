import re

def validate_project_name(name:str)->bool:
    """Validate the project name contains only letters.

    Args:
        name (str): Project name.

    Returns:
        bool: True if the name is valid, False otherwise.
    """
    return re.match(r'^[a-zA-Z\s]+$', name)

def format_project_name(name:str)->str:
    """Format a project name.

    Args:
        name (str): project name.

    Returns:
        str: Formatted project name.
    """
    project_name = [word.title() for word in name.split(' ') if word]
    return ''.join(project_name)

def get_template_file_content(file_path):
    """Get the content of a template file

    Args:
        file_path (str): The path of the file

    Returns:
        str: The content of the file
    """
    try:
        with open(file_path, 'r') as file:
            content = file.read()
            return content
    except Exception as e:
        raise ValueError(f'No se pudo leer el archivo {file_path}')
