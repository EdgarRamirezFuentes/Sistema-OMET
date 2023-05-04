import re

def validate_password(password):
    """Validate password."""
    password_regex= r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$\_\-!%*?&])[A-Za-z\d@$\_\-!%*?&]{8,}$'
    return re.match(password_regex, password)

def validate_name(name):
    name_regex = r'^[a-züáéíóúñ\s]+$'
    return re.match(name_regex, name, flags=re.IGNORECASE)

def validate_rfc(rfc):
    rfc_regex = r'^[A-Z]{4}\d{6}[A-Z0-9]{3}$'
    return re.match(rfc_regex, rfc, flags=re.IGNORECASE)

def validate_phone(phone):
    phone_regex = r'^\d{10}$'
    return re.match(phone_regex, phone, flags=re.IGNORECASE)

