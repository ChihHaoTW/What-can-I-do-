#!/usr/bin/python
# -*- coding: UTF-8 -*-

import datetime
from time import strftime
from time import strptime
import urllib2 as urllib
import json
from bs4 import BeautifulSoup

import cgi, cgitb 
cgitb.enable()

form = cgi.FieldStorage() 

num = form.getvalue('num')

def get_movie_data(soup):
	now = strftime('%H-%M')
	movie_str = "["
	for child in soup.find_all('div', class_ = "showtime_box"):
		#print child.div.a.get_text(strip=True)
		movie_str += "{"
		movie_str += "name" + ":" + child.div.a.get_text(strip=True) + ","

		for length in child.find_all('div', class_ = "showtime_poster"):
			#print length.get_text(strip=True)
			movie_str += "length" + ":" + length.get_text(strip=True).split("：".decode('UTF-8'))[1] + ","

		movie_str += "timeTable:["
		for time_t in child.find_all('li'):
			if strptime(time_t.get_text(strip=True)[0:5].encode('UTF-8'), '%H：%M') > strptime(now, '%H-%M'):
				#print time_t.get_text(strip=True)
				movie_str += time_t.get_text(strip=True)[0:5] + ","

		if movie_str[len(movie_str) -1] != "[":
			movie_str = movie_str[:-1]
		
		movie_str = movie_str + "]"
		movie_str += "},"

	movie_json = json.dumps(movie_str, ensure_ascii=False)
	print(json.JSONEncoder().encode(movie_str))
#page = urllib.urlopen('http://www.atmovies.com.tw/showtime/theater_t06607_a06.html')

if num == "1":
	mv = BeautifulSoup(urllib.urlopen('http://www.atmovies.com.tw/showtime/theater_t06607_a06.html')) # 新光影城
elif num == "2":
	mv = BeautifulSoup(urllib.urlopen('http://www.atmovies.com.tw/showtime/theater_t06609_a06.html')) # 威秀
elif num == "3":
	mv = BeautifulSoup(urllib.urlopen('http://www.atmovies.com.tw/showtime/theater_t06608_a06.html')) # 國賓影城
get_movie_data(mv)