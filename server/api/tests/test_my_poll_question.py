from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from ..models import Poll, PollQuestion, AnswerOption, Profile, UserRole, PollType
from admin_api.models import Settings
from django.contrib.auth.models import User
from unittest.mock import patch
from api.utils import get_object_or_404

import logging
logger = logging.getLogger('django.test')

class MyPollQuestionTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        role = UserRole.objects.create(role='Админ')
        poll_type = PollType.objects.create(name='Опрос')
        self.profile = Profile.objects.create(user=self.user, role=role)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.profile = get_object_or_404(Profile, user=self.user)
        self.poll = Poll.objects.create(author=self.profile, poll_id=1, is_in_production=False)
        self.poll.poll_type = poll_type
        self.question = PollQuestion.objects.create(poll=self.poll, order_id=1, name='Sample question')
        self.answer_option = AnswerOption.objects.create(question=self.question, name='Sample answer', order_id=1)
        self.settings = Settings.objects.create(max_questions_quantity=50)


    def tearDown(self):
        self.client.logout()
        logger.info('Tear down complete')

    def test_get_poll_questions(self):
        url = reverse('my_poll_question')
        response = self.client.get(url, {'poll_id': self.poll.poll_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_get_poll_question_with_id(self):
        url = reverse('my_poll_question')
        response = self.client.get(url, {'poll_id': self.poll.poll_id, 'id': self.question.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['id'], self.question.id)

    def test_create_poll_question(self):
        url = reverse('my_poll_question')
        data = {
            'poll': self.poll.id,
            'name': 'New question'
        }
        response = self.client.post(url, data, format='json')
        print(self.poll.poll_type.name)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PollQuestion.objects.count(), 2)

    # def test_create_poll_question_exceeding_limit(self):
    #     self.settings.max_questions_quantity = 1
    #     self.settings.save()
    #     url = reverse('my_poll_question')
    #     data = {
    #         'poll_id': self.poll.poll_id,
    #         'text': 'New question'
    #     }
    #     response = self.client.post(url, data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # def test_patch_poll_question(self):
    #     url = reverse('my_poll_question')
    #     data = {'text': 'Updated question'}
    #     response = self.client.patch(url + f'?poll_id={self.poll.poll_id}&poll_question_id={self.question.id}', data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.question.refresh_from_db()
    #     self.assertEqual(self.question.text, 'Updated question')

    # def test_patch_poll_question_in_production(self):
    #     self.poll.is_in_production = True
    #     self.poll.save()
    #     url = reverse('my_poll_question')
    #     data = {'text': 'Updated question'}
    #     response = self.client.patch(url + f'?poll_id={self.poll.poll_id}&poll_question_id={self.question.id}', data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # def test_delete_poll_question(self):
    #     url = reverse('my_poll_question')
    #     response = self.client.delete(url + f'?poll_id={self.poll.poll_id}&poll_question_id={self.question.id}')
    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    #     self.assertEqual(PollQuestion.objects.count(), 0)

    # def test_delete_poll_question_in_production(self):
    #     self.poll.is_in_production = True
    #     self.poll.save()
    #     url = reverse('my_poll_question')
    #     response = self.client.delete(url + f'?poll_id={self.poll.poll_id}&poll_question_id={self.question.id}')
    #     self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # def test_put_change_options_order(self):
    #     option2 = AnswerOption.objects.create(question=self.question, text='Another answer', order_id=2)
    #     url = reverse('my_poll_question')
    #     data = {
    #         'options_data': {
    #             str(self.answer_option.id): 2,
    #             str(option2.id): 1
    #         }
    #     }
    #     response = self.client.put(url + f'?poll_id={self.poll.poll_id}&poll_question_id={self.question.id}&request_type=change_options_order', data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.answer_option.refresh_from_db()
    #     option2.refresh_from_db()
    #     self.assertEqual(self.answer_option.order_id, 2)
    #     self.assertEqual(option2.order_id, 1)

    # def test_put_copy_question(self):
    #     url = reverse('my_poll_question')
    #     response = self.client.put(url + f'?poll_id={self.poll.poll_id}&poll_question_id={self.question.id}&request_type=copy_question')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(PollQuestion.objects.count(), 2)