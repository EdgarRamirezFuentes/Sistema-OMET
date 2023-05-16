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
    return name.title().replace(' ', '').strip()

