# -*- coding: utf-8 -*-
"""
Harvests JSON objects over HTTP and maps to CPSV-AP vocabulary
and save to a triple store

Python ver: 3.5
"""

__author__ = 'PwC EU Services'

from json_mapping_estonia import json_to_rdf
import time

from configparser import ConfigParser

import requests
from SPARQLWrapper import SPARQLWrapper, POST, JSON
from rdflib import Graph
from rdflib.plugins.stores.sparqlstore import SPARQLUpdateStore
from termcolor import colored
import sys
import rdfextras

rdfextras.registerplugins() # so we can Graph.query()

headers = {'content-type': 'application/json'}  # HTTP header content type
# Configurations
config = ConfigParser()
config.read('config.ini')

ev = sys.argv[1]
sector = sys.argv[2]
# lang = sys.argv[3]

endpoint_uri = config['Mandatory']['endpointURI']
graph_uri = config['Mandatory']['graphURI']

# Set up endpoint and access to triple store
sparql = SPARQLWrapper(endpoint_uri)
sparql.setReturnFormat(JSON)
sparql.setMethod(POST)
store = SPARQLUpdateStore(endpoint_uri, endpoint_uri)

# Specify the (named) graph we're working with
sparql.addDefaultGraph(graph_uri)

# Create an in memory graph
g = Graph(store, identifier=graph_uri)

if ev == "BE":
	evquery = "; <http://data.europa.eu/m8g/isGroupedBy> ?event. ?event <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://data.europa.eu/m8g/BusinessEvent>"
else:
	if ev == "LE":
		evquery = "; <http://data.europa.eu/m8g/isGroupedBy> ?event. ?event <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://data.europa.eu/m8g/LifeEvent>"
	else:
		evquery =  "; <http://data.europa.eu/m8g/isGroupedBy> <" + ev + ">"
	
	

sectorquery1 = ""
sectorquery2 = ""
sectorquery = ""
firstquery = "true"
firstchar = "true"
sec = ""
if sector != "NoSector":
	aux = sector.split("@#", sector.count("@#") )
	for x in aux:
		firstchar = "true"
		sec = ""
		aux2 = x.split("##", x.count("##") )
		# sectorquery = sectorquery + ". ?uri <http://data.europa.eu/m8g/sector> '" + y + "'"
		for y in aux2:
			if firstchar == "true":
				sec = y
				firstchar = "false"
			else:
				sec = sec + " " + y
		if firstquery == "true":
				sectorquery1 = ". ?uri <http://data.europa.eu/m8g/sector> '" + sec + "'"
				firstquery = "false"
		else:
			sectorquery = "UNION { ?uri <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/vocab/cpsv#PublicService>" + evquery + ". ?uri <http://data.europa.eu/m8g/sector> '" + sec + "'. OPTIONAL{?uri <http://purl.org/dc/terms/title> ?name}. OPTIONAL{?uri <http://purl.org/dc/terms/description> ?desc}. OPTIONAL{?uri <http://origin> ?origin}}"
			sectorquery2 = sectorquery2 + " " + sectorquery
		# sectorquery = sectorquery + "'"
else:
	sectorquery1 = ""
	sectorquery2 = ""
	
query = "select distinct ?uri ?origin ?name ?desc where {{ ?uri <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/vocab/cpsv#PublicService>" + evquery + sectorquery1 + ". OPTIONAL{?uri <http://purl.org/dc/terms/title> ?name}. OPTIONAL{?uri <http://purl.org/dc/terms/description> ?desc}. OPTIONAL{?uri <http://origin> ?origin}} UNION { ?uri <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/vocab/cpsv#PublicService>" + evquery + ". OPTIONAL{?uri <http://purl.org/dc/terms/title> ?name}. OPTIONAL{?uri <http://purl.org/dc/terms/description> ?desc}. OPTIONAL{?uri <http://origin> ?origin}. FILTER(!EXISTS {?uri <http://data.europa.eu/m8g/sector> ?sector})} " + sectorquery2 + " }"
urls = g.query (query)

for row in urls:
	uri = str(row[0])
	origin = str(row[1])
	name = str(row[2])
	desc = str(row[3])
	print (uri + "@#" + origin + "@#" + name + "@#" + desc + "##")

# Cleanup the graph instance
g.close()
