import datetime


class ModelFieldInsertionLog:
    def __init__(self, name, caption,
                 is_active, is_required, order,
                 data_type_id, data_type_name,
                 project_model_id, project_model_name,
                 project_id, project_name, customer_rfc):
        self.name = name
        self.caption = caption
        self.is_active = is_active
        self.is_required = is_required
        self.order = order
        self.data_type_id = data_type_id
        self.data_type_name = data_type_name
        self.project_model_id = project_model_id
        self.project_model_name = project_model_name
        self.project_id = project_id
        self.project_name = project_name
        self.customer_rfc = customer_rfc

    def get_json(self):
        return {
            'name': self.name,
            'caption': self.caption,
            'is_active': self.is_active,
            'is_required': self.is_required,
            'order': self.order,
            'data_type_id': self.data_type_id,
            'data_type_name': self.data_type_name,
            'project_model_id': self.project_model_id,
            'project_model_name': self.project_model_name,
            'project_id': self.project_id,
            'project_name': self.project_name,
            'customer_rfc': self.customer_rfc,
            'insertion_date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }


class ModelFieldUpdateLog:
    def __init__(self):
        self.previous_name = ''
        self.previous_caption = ''
        self.previous_is_active = False
        self.previous_is_required = False
        self.previous_order = 0
        self.previous_data_type_id = 0
        self.previous_data_type_name = ''
        self.previous_project_model_id = 0
        self.previous_project_model_name = ''
        self.previous_project_id = 0
        self.previous_project_name = ''
        self.previous_customer_rfc = ''

    def set_previous_data(self, previous_data):
        self.previous_name = previous_data['name']
        self.previous_caption = previous_data['caption']
        self.previous_is_active = previous_data['is_active']
        self.previous_is_required = previous_data['is_required']
        self.previous_order = previous_data['order']
        self.previous_data_type_id = previous_data['data_type_id']
        self.previous_data_type_name = previous_data['data_type_name']
        self.previous_project_model_id = previous_data['project_model_id']
        self.previous_project_model_name = previous_data['project_model_name']
        self.previous_project_id = previous_data['project_id']
        self.previous_project_name = previous_data['project_name']
        self.previous_customer_rfc = previous_data['customer_rfc']

    def set_updated_data(self, updated_data):
        self.updated_name = updated_data['name']
        self.updated_caption = updated_data['caption']
        self.updated_is_active = updated_data['is_active']
        self.updated_is_required = updated_data['is_required']
        self.updated_order = updated_data['order']
        self.updated_data_type_id = updated_data['data_type_id']
        self.updated_data_type_name = updated_data['data_type_name']
        self.updated_project_model_id = updated_data['project_model_id']
        self.updated_project_model_name = updated_data['project_model_name']
        self.updated_project_id = updated_data['project_id']
        self.updated_project_name = updated_data['project_name']
        self.updated_customer_rfc = updated_data['customer_rfc']

    def get_json(self):
        return {
            'previous_name': self.previous_name,
            'previous_caption': self.previous_caption,
            'previous_is_active': self.previous_is_active,
            'previous_is_required': self.previous_is_required,
            'previous_order': self.previous_order,
            'previous_data_type_id': self.previous_data_type_id,
            'previous_data_type_name': self.previous_data_type_name,
            'previous_project_model_id': self.previous_project_model_id,
            'previous_project_model_name': self.previous_project_model_name,
            'previous_project_id': self.previous_project_id,
            'previous_project_name': self.previous_project_name,
            'previous_customer_rfc': self.previous_customer_rfc,
            'updated_name': self.updated_name,
            'updated_caption': self.updated_caption,
            'updated_is_active': self.updated_is_active,
            'updated_is_required': self.updated_is_required,
            'updated_order': self.updated_order,
            'updated_data_type_id': self.updated_data_type_id,
            'updated_data_type_name': self.updated_data_type_name,
            'updated_project_model_id': self.updated_project_model_id,
            'updated_project_model_name': self.updated_project_model_name,
            'updated_project_id': self.updated_project_id,
            'updated_project_name': self.updated_project_name,
            'updated_customer_rfc': self.updated_customer_rfc,
            'updated_date': datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
