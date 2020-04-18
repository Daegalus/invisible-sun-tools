#!/bin/env python

import requests
import urllib.request
import time
import os

from bs4 import BeautifulSoup

s = requests.Session()
cookie_obj = requests.cookies.create_cookie(domain='app.invisiblesunrpg.com',name='bp-activity-oldestpage',value='1')
cookie_obj1 = requests.cookies.create_cookie(domain='app.invisiblesunrpg.com',path="/",name='wordpress_logged_in_cef24067940080ce68c70b4348f23c32',value=os.environ['WORDPRESS_LOGIN'])
cookie_obj2 = requests.cookies.create_cookie(domain='app.invisiblesunrpg.com',path="/wpsite",name='wordpress_logged_in_cef24067940080ce68c70b4348f23c32',value=os.environ['WORDPRESS_LOGIN'])
cookie_obj3 = requests.cookies.create_cookie(domain='app.invisiblesunrpg.com',path="/wpsite/wp-admin",name='wordpress_sec_cef24067940080ce68c70b4348f23c32',value=os.environ['WORDPRESS_SEC'])
cookie_obj4 = requests.cookies.create_cookie(domain='app.invisiblesunrpg.com',path="/wpsite/wp-content/plugins",name='wordpress_sec_cef24067940080ce68c70b4348f23c32',value=os.environ['WORDPRESS_SEC'])
s.cookies.set_cookie(cookie_obj)
s.cookies.set_cookie(cookie_obj1)
s.cookies.set_cookie(cookie_obj2)
s.cookies.set_cookie(cookie_obj3)
s.cookies.set_cookie(cookie_obj4)

for i in range(1,61):
    url = 'https://app.invisiblesunrpg.com/soothdeck/card-{:02d}/'.format(i)
    response = s.get(url)

    soup = BeautifulSoup(response.text, "html.parser")

    soothe_card_image = soup.findAll('img')[0]['src']
    soothe_card_name = soup.findAll('h2')[0].string

    resp = s.get(soothe_card_image, stream=True)
    if resp.status_code == 200:
        with open("./" + soothe_card_name + ".png", 'wb') as f:
            for chunk in resp:
                f.write(chunk)
