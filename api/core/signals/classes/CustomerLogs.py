import datetime

class CustomerInsertionLog:
    def __init__(self, rfc, name,
                 phone, email, is_active):
        self.rfc = rfc
        self.name = name
        self.phone = phone
        self.email = email
        self.is_active = is_active

    def get_json(self):
        return {
            'rfc_registered': self.rfc,
            'name_registered': self.name,
            'phone_registered': self.phone,
            'email_registered': self.email,
            'is_active': self.is_active,
            'insertion_date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        }


class CustomerUpdateLog:
    def __init__(self):
        self.previous_rfc = ''
        self.previous_name = ''
        self.previous_phone = ''
        self.previous_email = ''
        self.previous_is_active = None
        self.updated_rfc = ''
        self.updated_name = ''
        self.updated_phone = ''
        self.updated_email = ''
        self.updated_is_active = ''
        self.updated_date = ''

    def set_previous_data(self, previous_data):
        self.previous_rfc = previous_data['rfc']
        self.previous_name = previous_data['name']
        self.previous_phone = previous_data['phone']
        self.previous_email = previous_data['email']
        self.previous_is_active = previous_data['is_active']

    def set_updated_data(self, updated_data):
        self.updated_rfc = updated_data['rfc']
        self.updated_name = updated_data['name']
        self.updated_phone = updated_data['phone']
        self.updated_email = updated_data['email']
        self.updated_is_active = updated_data['is_active']
        self.updated_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def get_json(self):
        return {
            'previous_rfc': self.previous_rfc,
            'previous_name': self.previous_name,
            'previous_phone': self.previous_phone,
            'previous_email': self.previous_email,
            'previous_is_active': self.previous_is_active,
            'updated_rfc': self.updated_rfc,
            'updated_name': self.updated_name,
            'updated_phone': self.updated_phone,
            'updated_email': self.updated_email,
            'updated_is_active': self.updated_is_active,
            'updated_date': self.updated_date,
        }
