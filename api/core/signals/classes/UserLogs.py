import datetime

class UserInsertionLog:
    def __init__(self, name, first_last_name
                    , second_last_name, email
                    , phone, is_superuser
                    , is_staff, insertion_date):
            self.name = name
            self.first_last_name = first_last_name
            self.second_last_name = second_last_name
            self.email = email
            self.phone = phone
            self.is_superuser = is_superuser
            self.is_staff = is_staff
            self.insertion_date = insertion_date

    def get_json(self):
        return {
            'name_registered': self.name,
            'first_last_name_registered': self.first_last_name,
            'second_last_name_registered': self.second_last_name,
            'email_registered': self.email,
            'phone_registered': self.phone,
            'is_superuser': self.is_superuser,
            'is_staff': self.is_staff,
            'insertion_date': self.insertion_date,
        }

class UserUpdateLog:
    def __init__(self):
            self.previous_name = ''
            self.previous_first_last_name = ''
            self.previous_second_last_name = ''
            self.previous_email = ''
            self.previous_phone = ''
            self.previous_is_superuser = None
            self.is_staff = None
            self.updated_name = ''
            self.updated_first_last_name = ''
            self.updated_second_last_name = ''
            self.updated_email = ''
            self.updated_phone = ''
            self.updated_is_superuser = ''
            self.updated_date = ''

    def set_previous_data(self, previous_data):
        self.previous_name = previous_data['name']
        self.previous_first_last_name = previous_data['first_last_name']
        self.previous_second_last_name = previous_data['second_last_name']
        self.previous_email = previous_data['email']
        self.previous_phone = previous_data['phone']
        self.previous_is_superuser = previous_data['is_superuser']
        self.previous_is_staff = previous_data['is_staff']

    def set_updated_data(self, updated_data):
        self.updated_name = updated_data['name']
        self.updated_first_last_name = updated_data['first_last_name']
        self.updated_second_last_name = updated_data['second_last_name']
        self.updated_email = updated_data['email']
        self.updated_phone = updated_data['phone']
        self.updated_is_superuser = updated_data['is_superuser']
        self.updated_is_staff = updated_data['is_staff']
        self.updated_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def get_json(self):
        return {
            'previous_name': self.previous_name,
            'previous_first_last_name': self.previous_first_last_name,
            'previous_second_last_name': self.previous_second_last_name,
            'previous_email': self.previous_email,
            'previous_phone': self.previous_phone,
            'previous_is_superuser': self.previous_is_superuser,
            'previous_is_staff': self.previous_is_staff,
            'updated_name': self.updated_name,
            'updated_first_last_name': self.updated_first_last_name,
            'updated_second_last_name': self.updated_second_last_name,
            'updated_email': self.updated_email,
            'updated_phone': self.updated_phone,
            'updated_is_superuser': self.updated_is_superuser,
            'updated_is_staff': self.updated_is_staff,
            'updated_date': self.updated_date,
        }
