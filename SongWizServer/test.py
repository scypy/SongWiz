import json

from app import app
import unittest


class FlaskUnitTest(unittest.TestCase):

    def testLogin(self):
        tester = app.test_client(self)
        response = tester.post('/login',
                                 data=json.dumps(dict(username='admin', password='password')),
                                 content_type='application/json')
        statuscode = response.status_code
        self.assertEqual(statuscode, 200)

    def testSearch(self):
            tester = app.test_client(self)
            response = tester.post('/search',
                                   data=json.dumps(dict(userID=1)),
                                   content_type='application/json')
            statuscode = response.status_code
            self.assertEqual(statuscode, 200)

    def testuserProfile(self):
            tester = app.test_client(self)
            response = tester.post('/userprofile',
                                   data=json.dumps(dict(userID=1)),
                                   content_type='application/json')
            statuscode = response.status_code
            self.assertEqual(statuscode, 200)
    def testSongDetails(self):
            tester = app.test_client(self)
            response = tester.post('/songdetails',
                               data=json.dumps(dict(Name="BOP")),
                               content_type='application/json')
            statuscode = response.status_code
            self.assertEqual(statuscode, 200)
    def testRecommender(self):
            tester = app.test_client(self)
            response = tester.post('/recommend',
                               data=json.dumps(dict(search="BOP")),
                               content_type='application/json')
            statuscode = response.status_code
            self.assertEqual(statuscode, 200)

    def testRegistration(self):
        tester = app.test_client(self)
        response = tester.post('/signup',
                                 data=json.dumps(dict(username='admin', password='password')),
                                 content_type='application/json')
        statuscode = response.status_code
        self.assertEqual(statuscode, 200)




if __name__ == '__main__':
    unittest.main()