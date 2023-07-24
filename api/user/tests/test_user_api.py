"""
Tests for the user API.
"""
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse

from rest_framework import status
from rest_framework.test import APITestCase


USER_URL = reverse('user:user-list')
TOKEN_URL = reverse('user:login')
LOGOUT_URL = reverse('user:logout')
LOGOUT_ALL_URL = reverse('user:logoutall')


class PublicUserApiTests(APITestCase):
    """
    Test the users API (public).
    """
    fixtures = ['fixtures/user.json',]


    def setUp(self):
        pass

    def test_login_success(self):
        """
        Test successful login.
        """
        payload = {
            'password': 'admin',
            'email': 'admin@admin.com'
        }

        res = self.client.post(TOKEN_URL, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('token', res.data)

    def test_login_invalid_credentials(self):
        """
        Test login with incorrect password.
        """
        payload = {
            'password': 'wrong-password',
            'email': 'admin@admin.com'
        }

        res = self.client.post(TOKEN_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout(self):
        """
        Test logout.
        """
        payload = {
            'password': 'admin',
            'email': 'admin@admin.com'
        }

        res = self.client.post(TOKEN_URL, payload)
        token = res.data['token']

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        res = self.client.post(LOGOUT_URL)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)

    def test_logout_all(self):
        """
        Test logout all.
        """
        payload = {
            'password': 'admin',
            'email': 'admin@admin.com'
        }

        res = self.client.post(TOKEN_URL, payload)
        token = res.data['token']

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token)
        res = self.client.post(LOGOUT_ALL_URL)
        self.assertEqual(res.status_code, status.HTTP_204_NO_CONTENT)


class PrivateUserApiTests(APITestCase):
    """
    Test the users API (private).
    """
    fixtures = ['fixtures/user.json',]

    def setUp(self):
        admin_credentials = {
            'password': 'admin',
            'email': 'admin@admin.com'
        }

        maintainer_credentials = {
            'password': '123',
            'email': 'edgar.ramirez.fuentes.dev@gmail.com'
        }

        res = self.client.post(TOKEN_URL, admin_credentials)
        self.admin_token = res.data['token']

        res = self.client.post(TOKEN_URL, maintainer_credentials)
        self.maintainer_token = res.data['token']

    def test_create_user_success(self):
        """
        Test creating a new user successfully.
        """
        payload = {
            "rfc": "TEST000000RFC",
            "email": "test@email.com",
            "password": "TestPassword123$",
            "name": "Test name",
            "first_last_name": "Test first last name",
            "second_last_name": "Test second last name",
            "phone": "1234567890",
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token)
        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)

    def test_create_user_invalid_rfc_error(self):
        """
        Test creating a new user with invalid RFC.
        """
        payload = {
            "rfc": "TEST000000RFCINVALID",
            "email": "test@email.com",
            "password": "TestPassword123$",
            "name": "Test name",
            "first_last_name": "Test first last name",
            "second_last_name": "Test second last name",
            "phone": "1234567890",
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token)
        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_empty_rfc_error(self):
        """
        Test creating a new user with empty RFC.
        """
        payload = {
            "rfc": "",
            "email": "testemail.com",
            "password": "TestPassword123$",
            "name": "Test name",
            "first_last_name": "Test first last name",
            "second_last_name": "Test second last name",
            "phone": "1234567890",
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token)
        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_registered_rfc_error(self):
        """
        Test creating a new user with registered RFC.
        """
        payload = {
            "rfc": "AAAA000000AAA",
                "email": "test@email.com",
            "password": "TestPassword123$",
            "name": "Test name",
            "first_last_name": "Test first last name",
            "second_last_name": "Test second last name",
            "phone": "1234567890",
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token)
        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_invalid_email_error(self):
        """
        Test creating a new user with invalid email.
        """
        payload = {
            "rfc": "TEST000000RFC",
            "email": "testemail.com",
            "password": "TestPassword123$",
            "name": "Test name",
            "first_last_name": "Test first last name",
            "second_last_name": "Test second last name",
            "phone": "1234567890",
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token)
        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_registered_email_error(self):
        """
        Test creating a new user with registered email.
        """
        payload = {
            "rfc": "TEST000000RFC",
            "email": "admin@admin.com",
            "password": "TestPassword123$",
            "name": "Test name",
            "first_last_name": "Test first last name",
            "second_last_name": "Test second last name",
            "phone": "1234567890",
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token)
        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_invalid_password_error(self):
        """
        Test creating a new user with invalid password.
        """
        payload = {
            "rfc": "TEST000000RFC",
            "email": "test@email.com",
            "password": "123",
            "name": "Test name",
            "first_last_name": "Test first last name",
            "second_last_name": "Test second last name",
            "phone": "1234567890",
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token)
        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_invalid_name_error(self):
        """
        Test creating a new user with invalid name.
        """
        payload = {
            "rfc": "TEST000000RFC",
            "email": "testemail.com",
            "password": "TestPassword123$",
            "name": "name with numbers 123",
            "first_last_name": "Test first last name",
            "second_last_name": "Test second last name",
            "phone": "1234567890",
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token)
        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_empty_name_error(self):
        """
        Test creating a new user with empty name.
        """
        payload = {
            "rfc": "TEST000000RFC",
            "email": "testemail.com",
            "password": "TestPassword123$",
            "name": "",
            "first_last_name": "Test first last name",
            "second_last_name": "Test second last name",
            "phone": "1234567890",
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token)
        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_invalid_first_last_name_error(self):
        """
        Test creating a new user with invalid first last name.
        """
        payload = {
            "rfc": "TEST000000RFC",
            "email": "testemail.com",
            "password": "TestPassword123$",
            "name": "Test name",
            "first_last_name": "first last name with numbers 123",
            "second_last_name": "Test second last name",
            "phone": "1234567890",
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token)
        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_empty_first_last_name_error(self):
        """
        Test creating a new user with empty first last name.
        """
        payload = {
            "rfc": "TEST000000RFC",
            "email": "testemail.com",
            "password": "TestPassword123$",
            "name": "Test name",
            "first_last_name": "",
            "second_last_name": "Test second last name",
            "phone": "1234567890",
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token)
        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_invalid_second_last_name_error(self):
        """
        Test creating a new user with invalid second last name.
        """
        payload = {
            "rfc": "TEST000000RFC",
            "email": "testemail.com",
            "password": "TestPassword123$",
            "name": "Test name",
            "first_last_name": "Test first last name",
            "second_last_name": "second last name with numbers 123",
            "phone": "1234567890",
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token)
        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_empty_second_last_name_error(self):
        """
        Test creating a new user with empty second last name.
        """
        payload = {
            "rfc": "TEST000000RFC",
            "email": "testemail.com",
            "password": "TestPassword123$",
            "name": "Test name",
            "first_last_name": "Test first last name",
            "second_last_name": "",
            "phone": "1234567890",
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token)
        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_invalid_phone_error(self):
        """
        Test creating a new user with invalid phone.
        """
        payload = {
            "rfc": "TEST000000RFC",
            "email": "testemail.com",
            "password": "TestPassword123$",
            "name": "Test name",
            "first_last_name": "Test first last name",
            "second_last_name": "Test second last name",
            "phone": "1234567890invalid",
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token)
        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_empty_phone_error(self):
        """
        Test creating a new user with empty phone.
        """
        payload = {
            "rfc": "TEST000000RFC",
            "email": "testemail.com",
            "password": "TestPassword123$",
            "name": "Test name",
            "first_last_name": "Test first last name",
            "second_last_name": "Test second last name",
            "phone": "",
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.admin_token)
        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user_unauthorized_user_error(self):
        """
        Test creating a new user with unauthorized user.
        """
        payload = {
            "rfc": "TEST000000RFC",
            "email": "test@email.com",
            "password": "TestPassword123$",
            "name": "Test name",
            "first_last_name": "Test first last name",
            "second_last_name": "Test second last name",
            "phone": "1234567890",
        }

        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.maintainer_token)
        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_user_unauthenticated_user_error(self):
        """
        Test creating a new user with unauthenticated user.
        """
        payload = {
            "rfc": "TEST000000RFC",
            "email": "testemail.com",
            "password": "TestPassword123$",
            "name": "Test name",
            "first_last_name": "Test first last name",
            "second_last_name": "Test second last name",
            "phone": "",
        }

        res = self.client.post(USER_URL, payload)
        self.assertEqual(res.status_code, status.HTTP_401_UNAUTHORIZED)


