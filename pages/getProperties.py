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

headers = {'content-type': 'application/json'}  # HTTP header content type
# Configurations
config = ConfigParser()
config.read('config.ini')

uri = sys.argv[1]

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

query = "select ?o WHERE { <" + uri + "> <http://cpsvapfield> ?o }"
name = g.query (query)

for row in name:
	print(row[0])

# Cleanup the graph instance
g.close()


