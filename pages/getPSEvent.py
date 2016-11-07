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

country = sys.argv[1]
ev = sys.argv[2]

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

query = "select ?s ?name where {?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://purl.org/vocab/cpsv#PublicService>; <http://origin> '" + country + "'; <http://data.europa.eu/m8g/isGroupedBy> <" + ev + ">. ?s <http://purl.org/dc/terms/title> ?name}"
urls = g.query (query)

for row in urls:
	uri = str(row[0])
	name = str(row[1])
	print (uri + "@#" + name)

# Cleanup the graph instance
g.close()
