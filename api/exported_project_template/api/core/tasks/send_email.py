from celery import shared_task
from django.conf import settings
from django.core import mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

@shared_task
def send_reset_password_email(user_name, user_last_name, user_email, new_password):
    try:
        subject = 'Reset your password'
        html_message = render_to_string('email/reset_password.html', {
            'new_password': new_password,
            'user_name': user_name,
            'user_last_name': user_last_name,
        })

        print(f'sent password {new_password}')

        plain_message = strip_tags(html_message)
        from_email = settings.EMAIL_HOST_USER
        to = user_email

        mail.send_mail(subject, plain_message, from_email, [to], html_message=html_message)
        return True
    except Exception as e:
        return False
