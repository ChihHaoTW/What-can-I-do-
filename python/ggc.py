#!/usr/bin/python
# -*- coding: UTF-8 -*-

import datetime
from time import strftime
import urllib2 as urllib
import json
from bs4 import BeautifulSoup
from lxml import etree

import cgi, cgitb 
cgitb.enable()

form = cgi.FieldStorage() 

movie = form.getvalue('movie')
num = form.getvalue('num')

def get_movie_data(soup):
	for child in soup.find_all('div', class_ = "showtime_box"):
		print child.div.a.get_text(strip=True)

		for length in child.find_all('div', class_ = "showtime_poster"):
			print length.get_text(strip=True)
		
		for time in child.find_all('li'):
			print time.get_text(strip=True)
		print
		
def get_art_data(soup, cur_date):
	i = 0
	art_str = "[{"
	for child in soup.find_all('div', class_ = "act_month_date"):

		if child.get_text().find(cur_date) != -1:
			
			#print child.parent.div.a.get_text(strip=True)
			#print "  活動地點：".decode('utf-8') + child.get_text(strip=True).split("活動地點：".decode('utf-8'))[1]
			
			art_str += "name" + ":" + child.parent.div.a.get_text(strip=True) + ","
			if child.get_text(strip=True).split("活動地點：".decode('utf-8'))[1] != "":
				art_str += "address" + ":" + child.get_text(strip=True).split("活動地點：".decode('utf-8'))[1] + ","
			else:
				art_str += "address" + ":" + "null" + ","

			art_str += "type" + ":" + "art" + ","
			art_str += "time" + ":" + child.get_text(strip=True).split("活動日期：".decode('utf-8'))[1].split("活動地點：".decode('utf-8'))[0].strip()

			art_str += "},{"
		else:
			continue

	art_str += art_str[:-3] + "}]"

	art_json = json.dumps(art_str, ensure_ascii=False)
	print art_json


def get_park_data(tree):
	i = 0
	park_str = "[{"
	for child in tree.findall(".//*"):
		if i == 11:
			i = 0
			park_str += "},{"

		if child.text is not None:
			#print str(i) + child.text

			#park_str += "name" + ":" + child.text
			temp = child.text
		else:
			temp = "null"

		if i == 0:
			park_str += "name" + ":" + temp + ","
		elif i == 5:
			park_str += "address" + ":" + temp + ","
		elif i == 10:
			park_str += "type" + ":" + "park"

		i += 1

	park_str += "}]"

	#print park_str
	park_json = json.dumps(park_str, ensure_ascii=False)
	print park_json

#page = urllib.urlopen('http://www.atmovies.com.tw/showtime/theater_t06607_a06.html')
mv1 = BeautifulSoup(open('theater_t06607_a06.html'))
#get_movie_data(mv1)

#page = urllib.urlopen('http://culture.tainan.gov.tw/act_month/index.php?m2=30')
art1 = BeautifulSoup(open('index.php?m2=30'))
now = strftime('%Y-%m-%d')
get_art_data(art1, now)


park = etree.parse('03tainanparkinfo.xml')
root = park.getroot()
#get_park_data(root)







