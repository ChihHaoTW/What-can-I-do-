#!/usr/bin/python
# -*- coding: UTF-8 -*-

import datetime
from time import strftime
import urllib2 as urllib
import json
from bs4 import BeautifulSoup

def get_movie_data(soup):
	for child in soup.find_all('div', class_ = "showtime_box"):
		print child.div.a.get_text(strip=True)

		for length in child.find_all('div', class_ = "showtime_poster"):
			print length.get_text(strip=True)
		
		for time in child.find_all('li'):
			print time.get_text(strip=True)
		print
		
def get_art_data(soup, cur_date):
	for child in soup.find_all('div', class_ = "act_month_date"):
		#print child.get_text(strip=True)
		if child.get_text().find(cur_date) != -1:
			print child.parent.div.a.get_text(strip=True)



#page = urllib.urlopen('http://www.atmovies.com.tw/showtime/theater_t06607_a06.html')
#mv1 = BeautifulSoup(open('theater_t06607_a06.html'))
#get_movie_data(mv1)

#page = urllib.urlopen('http://culture.tainan.gov.tw/act_month/index.php?m2=30')
art1 = BeautifulSoup(open('index.php?m2=30'))

now = strftime('%Y-%m-%d')
get_art_data(art1, now)



