#!/usr/bin/python
# -*- coding: UTF-8 -*-

import datetime
import time
from time import strftime
import urllib2 as urllib
import json
from bs4 import BeautifulSoup
from lxml import etree
import csv
import sys
import urllib2

import cgi, cgitb 
cgitb.enable()


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
	print(json.JSONEncoder().encode(art_str))


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
	print(json.JSONEncoder().encode(park_str))

def get_landmark_data(f):
	week = strftime('%w')
	landmark_str = "["
	for row in csv.DictReader(f):  
		#print row['景點中文名稱'] + row['開放時間'] + row['X坐標'] + row['Y坐標'] + row['地址']
		if row['開放時間'].find('\n') == -1:
			landmark_str += "{name:" + row['景點中文名稱'] + "," + "type=landmark," + "time:" + row['開放時間'] + "," + "lat:" + row['地址'] + "," + "lng:" + row['X坐標'] + "," + "address:" + row['地址'] + "},"
		else:
			landmark_str += "{name:" + row['景點中文名稱'] + "," + "type=landmark," + "time:" + row['開放時間'].split('\n')[0] + row['開放時間'].split('\n')[1] + "," + "lat:" + row['地址'] + "," + "lng:" + row['X坐標'] + "," + "address:" + row['地址'] + "},"

	landmark_str = landmark_str[:-1] + "]"

	landmark_json = json.dumps(landmark_str, ensure_ascii=False)
	print(json.JSONEncoder().encode(landmark_str))

#page = urllib.urlopen('http://www.atmovies.com.tw/showtime/theater_t06607_a06.html')
#mv1 = BeautifulSoup(page)
#get_movie_data(mv1)

page = urllib.urlopen('http://culture.tainan.gov.tw/act_month/index.php?m2=30')
art = BeautifulSoup(page)
now = strftime('%Y-%m-%d')
#get_art_data(art, now)


park = etree.parse(urllib.urlopen('http://data.tainan.gov.tw/cs_CZ/dataset/54189166-fd56-469c-ab56-74a2b05d2a9f/resource/aaef2427-597c-40cf-8ecf-db79c3b72f1c/download/03tainanparkinfo.xml'))
root = park.getroot()
#get_park_data(root)


landmark = urllib.urlopen('http://data.tainan.gov.tw/cs_CZ/dataset/e70e2580-b45b-457f-8715-d1d0846434ac/resource/4a9a150a-e79a-4ae0-bcec-abd3e619f6a3/download/landmark2.csv') 
#get_landmark_data(landmark)

response = urllib2.urlopen('http://zh.wikipedia.org/wiki/%E8%87%BA%E5%8D%97%E5%B8%82%E5%90%84%E7%B4%9A%E5%AD%B8%E6%A0%A1%E5%88%97%E8%A1%A8')
school = BeautifulSoup(response)
