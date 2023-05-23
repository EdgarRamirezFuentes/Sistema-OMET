import re

def validate_rfc(rfc:str)->bool:
    """Validate RFC.

    Args:
        rfc (str): RFC.

    Returns:
        bool: True if RFC is valid, False otherwise.
    """
    rfc_regex = r'^[A-Z]{4}\d{6}[A-Z0-9]{3}$'
    return re.match(rfc_regex, rfc, flags=re.IGNORECASE)

def validate_phone(phone:str)->bool:
    """Validate phone number.

    Args:
        phone (str): Phone number.

    Returns:
        bool: True if phone number is valid, False otherwise."""
    phone_regex = r'^(\+\d{1,3})?\s?\d{10,14}$'
    return re.match(phone_regex, phone)

def format_data(data:str)->str:
    """Format a data.

    Args:
        data (str): data.

    Returns:
        str: Formatted data.
    """
    return data.lower().strip()
