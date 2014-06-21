# -*- coding: UTF-8 -*-

import urllib2
import json
from bs4 import BeautifulSoup

def get_data(soup):
	for child in soup.find_all('div', class_ = "showtime_box"):
		print child.div.a.get_text(strip=True)

		for length in child.find_all('div', class_ = "showtime_poster"):
			print length.get_text(strip=True)
		
		for time in child.find_all('li'):
			print time.get_text(strip=True)
		print
		

#page = urllib2.urlopen('http://www.atmovies.com.tw/showtime/theater_t06607_a06.html')
mv1 = BeautifulSoup(open('theater_t06607_a06.html'))
get_data(mv1)

#print soup.div['']
#print soup.find_all('div',  attrs={"class": "showtime_block"}).text

