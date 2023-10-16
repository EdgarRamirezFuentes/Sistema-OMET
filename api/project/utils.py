import re


def validate_name(name:str)->bool:
    """Validate a name.

    Args:
        name (str): name.

    Returns:
        bool: True if name is valid, False otherwise.
    """
    name_regex = r'^[a-z]+([a-z_\-\s]*[a-z]+)*$'
    return re.match(name_regex, name, flags=re.IGNORECASE)

def format_name(name:str)->str:
    """Format a name.

    Args:
        name (str): name.

    Returns:
        str: Formatted name.
    """
    new_name = name.replace('_', ' ').replace('-', ' ')
    new_name = [word.title() for word in name.split(' ') if word]
    return ''.join(new_name)

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
