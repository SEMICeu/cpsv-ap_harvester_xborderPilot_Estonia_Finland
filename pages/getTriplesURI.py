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

URI = sys.argv[1]
classType = sys.argv[2]

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

query = "select ?p ?o where {<"+ URI +"> ?p ?o}"
properties = g.query (query)

# Configurations mappings
# mapping = ConfigParser()
# mapping.read('mapping_fields.ini')

propURI = ""
props = ""
for row in properties:
	propURI = row[0].encode('utf-8')
	if propURI != "http://www.w3.org/1999/02/22-rdf-syntax-ns#type":					
		query = "select ?o WHERE { <" + propURI + "> <http://cpsvapfield> ?o }"
		name = g.query (query)

		for row2 in name:
			key = row2[0]

		if props == "":
			props = key
		else:
			props = props + "@#" + key
					
		props = props + "##" + str(row[1])
	if propURI == "http://origin":
		props = props + "@#" + "Origin" + "##" + row[1].encode('utf-8')

print (props)
# Cleanup the graph instance
g.close()
