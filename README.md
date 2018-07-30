# A cross-border catalogue of Public Services with Finland and Estonia
A cross-border catalogue of public services, i.e. a catalogue of public services at European level. Public service descriptions from Estonia and Finland are harvested, transformed and displayed on a user-friendly webpage.

## Introduction
Citizens and businesses from Estonia and Finland face a number of **challenges** both at national and European level when trying to find information on the public services available to them:

There are different portals for finding public service descriptions and the information is offered in different languages;
The descriptions do not follow a common structure, and,
No portal provides a comprehensive overview of all the public services available across Europe.
In addition, public administrations need to develop solutions that allow them to publish user-centric **public service descriptions** for citizens and businesses on a national and European level.

Finland and Estonia have a great deal of cross-border movement of citizens and business for economic, social and cultural reasons. Therefore, these countries **need to exchange large amounts of information** across borders, public services being a perfect example.

The pilot can be accessed [here](http://cpsv-ap.semic.eu/cpsv-ap_harvester_xBorder_pilot/).

## Functional description
We designed a pilot to implement a **user-centric portal** where public service descriptions from both countries are available in a harmonised and user-friendly format. To achieve this, we conducted a mapping between the CPSV-AP and the Estonian and Finnish data models (FSC). The information required for the central portal is stored in different national portals in each country. That information was harvested, transformed to the CPSV-AP and published in a user-centric fashion by using the CPSV-AP as a common vocabulary between the data models. The figure below provides an overview of the process.
![Finnish portal](https://github.com/catalogue-of-services-isa/cpsv-ap_harvester_xborderPilot_Estonia_Finland/blob/master/images/finnish%20portal_1.png?raw=true)

The pilot **gathers information spread over a variety of sources on a national level and collects it** in a centralised, user-centric visualisation of public service descriptions on a European level. These are then ordered and categorised according to several parameters including life event, business event, sector, etc., making them easily searchable for citizens and businesses.

A screenshot of the portal can be seen below.
![Finnish portal site](https://github.com/catalogue-of-services-isa/cpsv-ap_harvester_xborderPilot_Estonia_Finland/blob/master/images/Finnish%20portal%20site.png?raw=true)

## Results
The outcome of the pilot was a website where the harvested data was visualised in a user-centric way. This provides a proof-of-concept both for cross-border portals and for harmonising information based on the CPSV-AP as common vocabulary. A screenshot, with examples of public services harvested from both countries, can be seen below.
![Finnish portal example](https://github.com/catalogue-of-services-isa/cpsv-ap_harvester_xborderPilot_Estonia_Finland/blob/master/images/Finnish%20portal%20example.png?raw=true)

## Technical description
Both the [CPSV-AP Mapping Editor](https://github.com/catalogue-of-services-isa/cpsv-ap_mapping_tool) and the [CPSV-AP Data Harvester](https://github.com/catalogue-of-services-isa/CPSV-AP_harvester/) were used to deliver this pilot. The Editor mapped the data models of Estonia and Finland to the CPSV-AP, which was used as a common vocabulary. The public service descriptions from both Estonia and Finland were transformed using the mappings, creating CPSV-AP compliant descriptions. These descriptions were then collected by the CPSV-AP Data Harvester and visualised in the user-centric portal. 
![FinlandEstonia pilot](https://github.com/catalogue-of-services-isa/cpsv-ap_harvester_xborderPilot_Estonia_Finland/blob/master/images/finlandestonia%20pilot.png?raw=true)
