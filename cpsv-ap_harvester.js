/**
 * Cleans the graph indicated in the configuration file (config.ini).
 */
function clean(){	
	var btn = document.getElementById("clean");
	btn.disabled = true;
	btn.innerHTML = "Removing data";

	$.ajax({
		type: "GET",
		url: "http://localhost:80/harvesterPilotFederal/pages/clear.php",
		data: { },
		async: false,
		success: function (response) {
			alert("The data has been deleted.");
		},
		error: function () {
			alert('There was an error!');
		},
	});
	
	btn.disabled = false;
	btn.innerHTML = "Clean data";
}

/**
 * Harvests the URLs indicated in the configuration file (config.ini).
 */
function harvest(){
	var btn = document.getElementById("harvest");
	btn.disabled = true;
	btn.innerHTML = "Harvesting";
	
	$.ajax({
		type: "GET",
		url: "http://localhost:80/harvesterPilotFederal/pages/harvest.php",
		data: { p: '1' },
		async: false,
		success: function (response) {
			btn.disabled = false;
			btn.innerHTML = "Harvest";
			alert("The following files have been harvested:\n"+response);
		},
		error: function () {
			btn.disabled = false;
			btn.innerHTML = "Harvest";
			alert('There was an error!');
		},
	});
}

/**
 * Parses the text introduced by parameter, splitting it per rows.
 * #param {string} text - text to be parsed.
 * #returns {list} List with a triple per cell.
 */
function parseResult(text){
	var lines = text.split("\n");
	
	return lines;
}

/**
 * Gets all the identifiers of those elements that are typed as a determined class.
 * #param {string} text - Text that contains the triples where to look for the elements.
 * #param {string} classURI - URI of the class to look for.
 * #returns {list} List with the URIs typed as a class.
 */
function getclassURIs (text, classURI){
	var lines = parseResult(text); //Get the different triples
	var row, i, URIs;
	
	URIs = "";
	for (i=0; i<lines.length; i++){
		row = lines[i].split(" ");
		if (row[1] == "http://www.w3.org/1999/02/22-rdf-syntax-ns#type") { 
			aux = row[2].split('\r');
			if ( aux[0] == classURI) {
				URIs = URIs + "," + row[0];
			}
		}
	}
	
	return URIs;
}

/**
 * Gets all the properties of a determined element, indicated by its URI (identifier).
 * #param {list} lines - Rows that contains the triples where to look for the properties.
 * #param {string} URI - URI (identifier) of the element to extract the properties.
 * #returns {list} List with the properties of the element per cell.
 */
function getURIproperties (lines, URI) {	
	var row, i, props;
	
	props = "";
	for (i=0; i<lines.length; i++){
		row = lines[i].split(" ");
		if (row[0] == URI) { 
			props = props + "##" + lines[i];
		}
	}
	
	return props;
}

/**
 * Removes the data existing in an HTML table.
 * #param {string} tableID - ID of the table that contains the data in the HTML page.
 */
function removeTable(tableID) {
	var tableHeaderRowCount = 1;
	var table = document.getElementById(tableID);
	var rowCount = table.rows.length;
	
	if(rowCount > 1){
		for (var i = tableHeaderRowCount; i < rowCount; i++) {
			table.deleteRow(tableHeaderRowCount);
		}
	}

}

/**
 * Inserts a row in a table of the HTML page.
 * #param {string} tableID - ID of the HTML table where to add the row.
 */
function createRow (tableID){
	var tableHeader = document.getElementById("tableHeader");
	
	if (tableHeader.hidden) tableHeader.hidden = false;
	
	var tableRef = document.getElementById(tableID);

	// Insert a row in the table at the last row
	var newRow   = tableRef.insertRow(tableRef.rows.length);

	// Insert a cell in the row at index 0
	var newCell  = newRow.insertCell(0);
	
	return newCell;
}

/**
 * Appends content in the input cell.
 * #param {cell} cell - Cell where to append the HTML.
 * #param {string} v - String to append.
 * #param {string} style - Style to give to the string.
 */
function appendContent (cell, v, style){
	var newp = document.createElement("p");
	newp.innerHTML = v;
	newp.className = style;
	cell.appendChild(newp);
	return newp;
}

/**
 * Translates the property URI to a user-readable name indicated in the mapping fields file (mapping_fields.ini).
 * #param {string} className - Value of the class from which to obtain the property name.
 * #param {string} propURI - URI of the property.
 */
function getPropertyName(propURI){
	$.ajax({
		type: "GET",
		url: "http://localhost:80/harvesterPilotFederal/pages/getProperties.php",
		data: { "p":propURI },
		async: false,
		success: function (response) {
			name = response;
		},
	});
	return name;
}

/**
 * Update the values showed in a table.
 * #param {string} tableID - ID of the HTML table to update.
 * #param {string} className - Value of the class to which the values will be included.
 * #param {string} URIs - URIs with the elements to include.
 * #param {string} data - Row data harvested.
 */
function updateTable (tableID, className, URIs, data) {
	var lines, properties, i, j, k, aux, aux2, values, URI, table, prop, propName, value, newCell, p, append = false;
	
	lines = parseResult(data);
	values = URIs.split(",");
	
	for (i=0; i<values.length; i++){
		URI = values[i];
		if (URI != "") {
			properties = "";
			properties = getURIproperties(lines, URI);
			aux = "";
			aux = properties.split("##");
			for (j=1; j<aux.length; j++){
				prop = aux[j].split(" ");
				propURI = prop[1];
				append = false;
				if(j == 1) {
					newCell = createRow (tableID);
					p = appendContent (newCell, className, "class-data");
					p.setAttribute("onclick","updateDetailData('"+URI+"', '"+className+"')");
					p.setAttribute("style", "cursor:pointer");
					appendContent (newCell, "<b>Identifier: </b>" + URI, "mydata");
				}
				//Only show one property per class
				switch (className){
					case "Channel":	{
						if (propURI == "http://data.europa.eu/m8g/hasContactPoint"){
							propName = "Contact Point";
							append = true;
						}
						break;
					}
					case "Address":	{
						if (propURI == "http://www.w3.org/ns/locn#fullAddress"){
							propName = "Full Address";
							append = true;
						}
						break;
					}
					case "Contact Point":	{
						if (propURI == "http://www.w3.org/2006/vcard/ns#hasURL"){
							propName = "URL";
							append = true;
						}
						break;
					}
					case "Cost":	{
						if (propURI == "http://purl.org/dc/terms/description"){
							propName = "Description";
							append = true;
						}
						break;
					}
					case "PeriodofTime":	{
						break;
					}
					/* case "FormalFramework":	{
						if (propURI == "http://data.europa.eu/eli/ontology#id_local"){
							propName = "Name";
							append = true;
						}
						break;
					} */
					case "Participation":	{ //
						if (propURI == "http://purl.org/dc/terms/description"){
							propName = "Description";
							append = true;
						}
						break;
					}
					default:	{
						if (propURI == "http://purl.org/dc/terms/title"){
							propName = "Name";
							append = true;
						}
						break;
					}
				}
				if (append) {
					value = "";
					for (k=2; k<prop.length; k++){
						value = value + " " + prop[k];
					}
					appendContent (newCell, "<b>" + propName + ":</b>" + value, "mydata");
				}
			}
		}
	}
}

/**
 * Get the data stored in the triple store.
 * #returns {string} - Data stored.
 */
function getStoredData (){
	var result = "", endpoint = "";	
	var xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			endpoint = xhttp.responseText;
			}
	};
	xhttp.open("GET", "http://localhost:80/harvesterPilotFederal/pages/getEndPoint.php", false); //synchronized
	xhttp.send();
	
	if (endpoint != "") {
		var xhttp2 = new XMLHttpRequest();
		xhttp2.onreadystatechange = function() {
			if (xhttp2.readyState == 4 && xhttp2.status == 200) {
				result = xhttp2.responseText;
			}
		};
		xhttp2.open("GET", "http://localhost:80/harvesterPilotFederal/pages/show.php", false); //synchronized
		xhttp2.send();
		
	}
	
	return result;
}

/**
 * Shows in the HTML table the triples of a determined class selected by the user.
 */
function showClass(){
	var btn = document.getElementById("showClass");
	btn.disabled = true;
	btn.innerHTML = "Loading";
	var endpoint="", result="";
	
	var btn2 = document.getElementById("showAll");
	btn2.disabled = false;
	btn2.innerHTML = "Visualise all data";
	
	var tableHeader = document.getElementById("tableHeader");
	tableHeader.hidden = true;
	
	cleanDetailData();
	
	result = getStoredData();
	
	removeTable("data");
	
	//get selected class
	var e = document.getElementById("classes");
	var className = e.options[e.selectedIndex].value;
	
	//show Public Services
	var URIs;
	switch (className){
		case "PS": {
			URIs = getclassURIs(result, "http://purl.org/vocab/cpsv#PublicService");
			updateTable("data", "PublicService", URIs, result);
			break;
		}
		case "BE": {
			URIs = getclassURIs(result, "http://data.europa.eu/m8g/BusinessEvent");
			updateTable("data", "BusinessEvent", URIs, result);
			break;
		}
		case "LE": {
			URIs = getclassURIs(result, "http://data.europa.eu/m8g/LifeEvent");
			updateTable("data", "LifeEvent", URIs, result);
			break;
		}
		case "Participation": {
			URIs = getclassURIs(result, "http://data.europa.eu/m8g/Participation");
			updateTable("data", "Participation", URIs, result);
			break;
		}
		case "Criterion": {
			URIs = getclassURIs(result, "http://data.europa.eu/m8g/CriterionRequirement");
			updateTable("data", "Criterion", URIs, result);
			break;
		}
		case "Evidence": {
			URIs = getclassURIs(result, "http://data.europa.eu/m8g/Evidence");
			updateTable("data", "Evidence", URIs, result);
			break;
		}
		case "Output": {
			URIs = getclassURIs(result, "http://data.europa.eu/m8g/Output");
			updateTable("data", "Output", URIs, result);
			break;
		}
		case "Channel": {
			URIs = getclassURIs(result, "http://data.europa.eu/m8g/Channel");
			updateTable("data", "Channel", URIs, result);
			break;
		}
		case "FF": {
			URIs = getclassURIs(result, "http://purl.org/vocab/cpsv#FormalFramework");
			updateTable("data", "FormalFramework", URIs, result);
			break;
		}
		case "Rule": {
			URIs = getclassURIs(result, "http://purl.org/vocab/cpsv#Rule");
			updateTable("data", "Rule", URIs, result);
			break;
		}
		case "Agent": {
			URIs = getclassURIs(result, "http://purl.org/dc/terms/Agent");
			updateTable("data", "Agent", URIs, result);
			break;
		}
		case "Contact": {
			URIs = getclassURIs(result, "http://www.w3.org/2006/vcard/ns#Contact");
			updateTable("data", "Contact", URIs, result);
			break;
		}
		case "PO": {
			URIs = getclassURIs(result, "http://data.europa.eu/m8g/PublicOrganisation");
			updateTable("data", "PublicOrganisation", URIs, result);
			break;
		}
		case "Cost": {
			URIs = getclassURIs(result, "http://data.europa.eu/m8g/Cost");
			updateTable("data", "Cost", URIs, result);
			break;
		}
		case "PT": {
			URIs = getclassURIs(result, "http://data.europa.eu/m8g/PeriodOfTime");
			updateTable("data", "PeriodofTime", URIs, result);
			break;
		}
		case "Address": {
			URIs = getclassURIs(result, "http://www.w3.org/ns/locn#Address");
			updateTable("data", "Address", URIs, result);
			break;
		}
	}
	
	btn.disabled = false;
	btn.innerHTML = "Visualise class";

	alert ("The data is loaded");
	
}

/**
 * Shows in the HTML table all the harvested data, ordered by classes.
 */
function showAll () {
	var btn = document.getElementById("showAll");
	btn.disabled = true;
	btn.innerHTML = "Loading";
	var endpoint="", result="";
	
	var btn2 = document.getElementById("showClass");
	btn2.disabled = false;
	btn2.innerHTML = "Visualise class";
	
	var tableHeader = document.getElementById("tableHeader");
	tableHeader.hidden = true;
	
	cleanDetailData();
		
	result = getStoredData();
	
	removeTable("data");
	
	var URIs;
	
	//show the Public Services
	URIs = getclassURIs(result, "http://purl.org/vocab/cpsv#PublicService");
	updateTable("data", "PublicService", URIs, result);
	
	//show the Business Events
	URIs = getclassURIs(result, "http://data.europa.eu/m8g/BusinessEvent");
	updateTable("data", "BusinessEvent", URIs, result);

	//show the Life Events
	URIs = getclassURIs(result, "http://data.europa.eu/m8g/LifeEvent");
	updateTable("data", "LifeEvent", URIs, result);
	
	//show the Participations
	URIs = getclassURIs(result, "http://data.europa.eu/m8g/Participation"); //
	updateTable("data", "Participation", URIs, result);
	
	//show the Criteria
	URIs = getclassURIs(result, "http://data.europa.eu/m8g/CriterionRequirement"); //
	updateTable("data", "Criterion", URIs, result);
	
	//show the Evidences
	URIs = getclassURIs(result, "http://data.europa.eu/m8g/Evidence");
	updateTable("data", "Evidence", URIs, result);

	//show the Outputs
	URIs = getclassURIs(result, "http://data.europa.eu/m8g/Output"); //
	updateTable("data", "Output", URIs, result);

	//show the Channels
	URIs = getclassURIs(result, "http://data.europa.eu/m8g/Channel"); //
	updateTable("data", "Channel", URIs, result);

	//show the Formal Frameworks
	URIs = getclassURIs(result, "http://purl.org/vocab/cpsv#FormalFramework"); //
	updateTable("data", "FormalFramework", URIs, result);

	//show the Rules
	URIs = getclassURIs(result, "http://purl.org/vocab/cpsv#Rule"); //
	updateTable("data", "Rule", URIs, result);

	//show the Agents
	URIs = getclassURIs(result, "http://purl.org/dc/terms/Agent"); //
	updateTable("data", "Agent", URIs, result);

	//show the Contacts
	URIs = getclassURIs(result, "http://www.w3.org/2006/vcard/ns#Contact"); //
	updateTable("data", "Contact", URIs, result);

	//show the Public Organisations
	URIs = getclassURIs(result, "http://data.europa.eu/m8g/PublicOrganisation"); //
	updateTable("data", "PublicOrganisation", URIs, result);

	//show the Costs
	URIs = getclassURIs(result, "http://data.europa.eu/m8g/Cost"); //
	updateTable("data", "Cost", URIs, result);

	//show the Period of Time
	URIs = getclassURIs(result, "http://data.europa.eu/m8g/PeriodOfTime"); //
	updateTable("data", "PeriodofTime", URIs, result);

	//show the Address
	URIs = getclassURIs(result, "http://www.w3.org/ns/locn#Address"); //
	updateTable("data", "Address", URIs, result);
	
	btn.disabled = false;
	btn.innerHTML = "Visualise all data";
	
	alert ("The data is loaded");
}

/**
 * Cleans the data showed on the right.
 */
function cleanDetailData () {
	var div = document.getElementById("detailResult");
	div.innerHTML = "";
	
	var newp = document.createElement("p");
	newp.innerHTML = "";
	newp.setAttribute("id", "detailDataTitle");
	div.appendChild(newp);
	
	newp = document.createElement("p");
	newp.innerHTML = "";
	newp.setAttribute("id", "detailDataBody");
	div.appendChild(newp);
	
}

/**
 * Gets the properties of a URI.
 * #param {string} URI - Value of the subject from which to obtain the properties.
 * #returns - List of properties (propType propValue).
 */
function getTriplesURI(URI, classType){
	var props="";
	
	$.ajax({
		type: "GET",
		url: "http://localhost:80/harvesterPilotFederal/pages/getTriplesURI.php",
		data: { "URI":URI, "class":classType },
		async: false,
		success: function (response) {
			props = response;
		},
	});
	return props;
}

/**
 * Update the data on the right with the detail data.
 * #param {string} URI - URI of the element of which to show the data.
 * #param {string} classType - Type of the class of the URI (Public Service, Business Event...)
 */
function updateDetailData (URI, classType) {
	var triples = getTriplesURI(URI, classType);
	
	cleanDetailData();
	
	var div = document.getElementById("detailResult");
	
	var title = document.getElementById("detailDataTitle");
	title.innerHTML = classType;
	title.className = "title";
	
	var body = document.getElementById("detailDataBody");
	body.innerHTML = "<b>Identifier: </b>" + URI;
	body.className = "mydata";
	
	var properties = triples.split("@#");
	var i, j, prop, propType, propValue, cad="";
	for (i=0; i<properties.length; i++){
		prop = properties[i].split("##");
		propType = prop[0];
		propValue = prop[1];
		newp = document.createElement("p");
		newp.innerHTML = "<b>" + propType+ ": </b>" + propValue;
		newp.className = "mydata";
		div.appendChild(newp);
	}
	
}

function getPublicServices (country){
	var ps="";
	
	$.ajax({
		type: "GET",
		url: "http://localhost:80/harvesterPilotFederal/pages/getPS.php",
		data: { "country":country },
		async: false,
		success: function (response) {
			ps = response;
		},
	});
	
	return ps;
}

function getPublicServicesEvent (country, evURI){
	var ps="";
	
	$.ajax({
		type: "GET",
		url: "http://localhost:80/harvesterPilotFederal/pages/getPSEvent.php",
		data: { "country":country, "ev":evURI },
		async: false,
		success: function (response) {
			ps = response;
		},
	});
	
	return ps;
}

function getListPublicServices (typeEvent){
	var ps="";
	
	$.ajax({
		type: "GET",
		url: "http://localhost:80/harvesterPilotFederal/pages/getListPS.php",
		data: { "ev":typeEvent },
		async: false,
		success: function (response) {
			ps = response;
		},
	});
	
	return ps;
}

function getEvents (country){
	var ev="";
	
	$.ajax({
		type: "GET",
		url: "http://localhost:80/harvesterPilotFederal/pages/getEvents.php",
		data: { "country":country },
		async: false,
		success: function (response) {
			ev = response;
		},
	});
	
	return ev;
}

function getSector (typeEvent){
	var sec="";
	
	$.ajax({
		type: "GET",
		url: "http://localhost:80/harvesterPilotFederal/pages/getSector.php",
		data: { "type":typeEvent },
		async: false,
		success: function (response) {
			sec = response;
		},
	});
	
	return sec;
}


/* function getLanguage (typeEvent){
	var lang="";
	
	$.ajax({
		type: "GET",
		url: "http://localhost:80/harvesterPilotFederal/pages/getLanguage.php",
		data: { "type":typeEvent },
		async: false,
		success: function (response) {
			lang = response;
		},
	});
	
	return lang;
} */

function initialisePS (country, evURI) {
	var i=0, auxps = "", uri="", name="", row="", props="", j=0, auxev="", ev="";
	var ps = document.getElementById("PSContainer");
	
	ps.innerHTML = "";
	
	if(evURI == "") {
		props = getPublicServices (country);
	}
	else {
		auxev = evURI.split("@#");
		for (j=0; j<auxev.length; j++){
			ev = auxev[j];
			if(ev != "")
				props = props + getPublicServicesEvent (country, ev);
		}
	}
	
	auxps = props.split("\n");
		
	for (i=0; i<auxps.length-1; i++){
		row = auxps[i].split("@#");
		ps.innerHTML = ps.innerHTML + "<div class='form-radio-container'><input type='radio' id='" + row[0] + "' name='radioPS' value='Option " + i + "' /><label for='radio-" + i + "-_u916548098853793411'> " + row[1] + "</label></div>";
	}
}

function initialisePSEU (evURI) {
	var i=0, auxps = "", uri="", name="", row="", props="", j=0, auxev="", ev="", ps;
	
	//Update public service radio buttons of Estonia
	ps = document.getElementById("PSContainerEstonia");
	ps.innerHTML = "";
	
	if(evURI == "") {
		props = getPublicServices ("Estonia");
	}
	else {
		auxev = evURI.split("@#");
		for (j=0; j<auxev.length; j++){
			ev = auxev[j];
			if(ev != "")
				props = props + getPublicServicesEvent ("Estonia", ev);
		}
	}
	
	auxps = props.split("\n");
	for (i=0; i<auxps.length-1; i++){
		row = auxps[i].split("@#");
		ps.innerHTML = ps.innerHTML + "<div class='form-radio-container'><input type='radio' id='" + row[0] + "' name='radioPSEstonia' value='Option " + i + "' /><label for='radio-" + i + "-_u916548098853793411'> " + row[1] + "</label></div>";
	}
	
	//Update public service radio buttons of Finland
	ps = document.getElementById("PSContainerFinland");
	ps.innerHTML = "";
	props = "";
	
	if(evURI == "") {
		props = getPublicServices ("Finland");
	}
	else {
		//auxev was already split
		for (j=0; j<auxev.length; j++){
			ev = auxev[j];
			if(ev != "")
				props = props + getPublicServicesEvent ("Finland", ev);
		}
	}
	
	auxps = props.split("\n");
	for (i=0; i<auxps.length-1; i++){
		row = auxps[i].split("@#");
		ps.innerHTML = ps.innerHTML + "<div class='form-radio-container'><input type='radio' id='" + row[0] + "' name='radioPSFinland' value='Option " + i + "' /><label for='radio-" + i + "-_u916548098853793411'> " + row[1] + "</label></div>";
	}
}

function initialiseSector (type) {
	var sectors = getSector (type);
	
	var i=0, uri="", name="", row="", aux="";
	
	aux = sectors.split("\n");
	
	var sectors = document.getElementById("sectorContainer");
	sectors.innerHTML = "";
	for (i=0; i<aux.length-1; i++){
		uri = aux[i];
		row = uri.split("/");
		name = row[row.length-1];
		sectors.innerHTML = sectors.innerHTML + "<span class='form-radio-container'><input type='checkbox' id='checkbox-" + i + "-_u904997771784187993' name='checkSector' value='" + uri.substring(0, uri.length-1) + "' /><label for='checkbox-" + i + "-_u904997771784187993'>" + name.substring(0, name.length-1) + "</label></span>";
		
	}
}

/* function initialiseLanguage (type) {
	var lang = getLanguage (type);
	
	var i=0, uri="", name="", row="", aux="";
	
	aux = lang.split("\n");
	
	var lang = document.getElementById("languageContainer");
	lang.innerHTML = "";
	for (i=0; i<aux.length-1; i++){
		uri = aux[i];
		row = uri.split("/");
		name = row[row.length-1];
		lang.innerHTML = lang.innerHTML + "<span class='form-radio-container'><input type='checkbox' id='checkbox-"+ i + "-_u953317408302598336' name='checkLanguage' value='" + uri.substring(0, uri.length-1) + "' /><label for='checkbox-"+ i + "-_u953317408302598336'>" + name.substring(0, name.length-1) + "</label></span>";
	}
} */

function initialiseListPS (typeEvent) {
	var i=0, auxps = "", uri="", title="", row="", props="", desc="", cad="", origin="", aux="";
	var ps = document.getElementById("listPS");
	
	ps.innerHTML = "<tr><td/><td>Loading list of public services</td><td/></tr>";
	
	props = getListPublicServices (typeEvent);
	
	auxps = props.split("##");	
	for (i=0; i<auxps.length-1; i++){
		row = auxps[i].split("@#");
		if (i>0) { 
			aux = row[0].split("\n"); //Remove the first character, which is \n (introduced by python)
			uri = aux[1]; 
		}
		else
		uri = row[0];
		origin = row[1];
		title = row[2];
		desc = row[3];
		/* cad = cad + "<div onclick='getPSInfo(&#39;" + uri + "&#39;, &#39;" + origin + "&#39;)' style='cursor:pointer'><b>" + origin + " - " + title + ":</b> " + desc + "</div>"; */
		cad = cad + "<tr><td><b>" + origin + "</b></td><td><b>" + title + ":</b> " + desc + "</td><td class='table-col-knowmore' onclick='getPSInfo(&#39;" + uri + "&#39;, &#39;" + origin + "&#39;)' style='cursor:pointer; text-align: center;'><img src='images/info2.png' alt='Imagen' style='width:136;max-width:60%;' /></td></tr>";
	}
	
	ps.innerHTML = cad;
}

function initialise (type) {
	var events = getEvents ("Not");
	
	var i=0, uri="", name="", row="", auxevents="";
	
	auxevents = events.split("\n");
	
	var events = document.getElementById("eventsContainer");
	events.innerHTML = "";
	events.innerHTML = "<option id='" + type + "' name='checkEv' value='Option" + 0 + "'>All</option>";
	for (i=0; i<auxevents.length-1; i++){
		row = auxevents[i].split("@#");
		if (row[0] == type)
			events.innerHTML = events.innerHTML + "<option id='" + row[1] + "' name='checkEv' value='Option" + parseInt(i+1) + "'>" + row[2] + "</option>";
	}
	
	initialiseSector(type);
	/* initialiseLanguage(type); */
	initialiseListPS(type);
	
	var titleps = document.getElementById("title1");
	titleps.innerHTML = " ";
	var descps = document.getElementById("description1");
	descps.innerHTML = " ";
	titleps = document.getElementById("title2");
	titleps.innerHTML = " ";
	descps = document.getElementById("description2");
	descps.innerHTML = " ";
}

function getSelectedPS () {
	var radios = document.getElementsByName('radioPS');
	var check = false, i=0, uri="";
	for ( i = 0; i < radios.length; i++) {
		if(radios[i].checked) {
			check = true;
			uri = radios[i].getAttribute("id");
			break;
		}
	}
	if(!check)   { //payment method button is not checked
		alert("Please choose a Public Service to display");
		uri="";
	}
	return uri;
}

function getSelectedPSEU (country) {
	var radios = document.getElementsByName('radioPS'+country);
	var check = false, i=0, uri="";
	for ( i = 0; i < radios.length; i++) {
		if(radios[i].checked) {
			check = true;
			uri = radios[i].getAttribute("id");
			break;
		}
	}
	if(!check)   { //payment method button is not checked
		alert("Please choose a Public Service to display");
		uri="";
	}
	return uri;
}

function getSelectedEvent () {
	var events = document.getElementById ("eventsContainer");
	var uri="";
	
	uri = events.options[events.selectedIndex].id;

	return uri;
}

function getSelectedSector () {
	var radios = document.getElementsByName('checkSector');
	var i=0, uris="";
	for ( i = 0; i < radios.length; i++) {
		if(radios[i].checked) {
			if (uris == "")
				uris = radios[i].getAttribute("value");
			else
				uris = uris + "@#" + radios[i].getAttribute("value");
		}
	}
	
	return uris;
}

/* function getSelectedLanguage () {
	var radios = document.getElementsByName('checkLanguage');
	var i=0, uris="";
	for ( i = 0; i < radios.length; i++) {
		if(radios[i].checked) {
			if (uris == "")
				uris = radios[i].getAttribute("value");
			else
				uris = uris + "@#" + radios[i].getAttribute("value");
		}
	}
	
	return uris;
} */

function getURIProps (uri) {
	var props="";
	
	$.ajax({
		type: "GET",
		url: "http://localhost:80/harvesterPilotFederal/pages/getURIprops.php",
		data: { "uri":uri },
		async: false,
		success: function (response) {
			props = response;
		},
	});
	
	return props;
}

function getMoreInfoURI (uri) {
	var props="";
	
	$.ajax({
		type: "GET",
		url: "http://localhost:80/harvesterPilotFederal/pages/getMoreInfo.php",
		data: { "uri":uri },
		async: false,
		success: function (response) {
			props = response;
		},
	});
	
	return props;
}

function getURIShowProperty (uri) {
	var props="";
	
	$.ajax({
		type: "GET",
		url: "http://localhost:80/harvesterPilotFederal/pages/getURIShowProp.php",
		data: { "uri":uri },
		async: false,
		success: function (response) {
			props = response;
		},
	});
	
	return props;
}

function updateInfo (field, title, list, origin) {
	var props="", aux="", i, prop="", value="", name="", cad="", show="", auxshow="", j, uri, propName, result="", propValue="";
	
	props=list.split("\n");
	
	for(i=0; i<props.length; i++){
		aux=props[i].split("@#");
		prop=aux[0];
		value=aux[1];
		name = prop
		if(prop != "") {
			if(prop == "Name") {
				title.innerHTML = origin + " - " + value;
			}
			else {
				if (value.substring(0, 4) == "http") {
					uri = value.substring(0, value.length-1);
					show = "";
					show = getURIShowProperty (uri);
					if (show == "")
						cad = cad + "<div><b>" + name + "</b>: " + uri + "</div>";
					else {
						auxshow = show.split("##");
						for (j=0; j<auxshow.length-1; j++){
							result = auxshow[j].split("@#");
							propName = result[0];
							propValue = result[1];
							if (propValue != "NoValue")
								cad = cad + "<div onclick='getMoreInfo(&#39;" + uri + "&#39;, &#39;" + name + "&#39;)' style='cursor:pointer'><b>" + name + ":</b> <u>" + propValue + "</u></div>";
							else
								cad = cad + "<div onclick='getMoreInfo(&#39;" + uri + "&#39;, &#39;" + name + "&#39;)' style='cursor:pointer'><b>" + name + ":</b> <u>There is no " + propName + " for " + name + ". Click for more information.</u></div>";
						}
					}
				}
				else cad = cad + "<div><b>" + name + "</b>: " + value + "</div>";
			}
		}
	}
	field.innerHTML = cad;
}

function applyPS () {
	var uri="", props="";
	
	uri = getSelectedPS();
	
	if(uri != "") {
		var desc = document.getElementById("description");
		var title = document.getElementById("title");
	
		title.innerHTML = "";
		desc.innerHTML = "Loading description...";
		
		//show the Public Service properties
		props = getURIProps(uri);
		updateInfo(desc, title, props);
	}
}

function applyPSEU (country) {
	var uri="", props="";
	
	uri = getSelectedPSEU (country);
	
	if(uri != "") {
		var desc = document.getElementById("description"+country);
		var title = document.getElementById("title"+country);
	
		title.innerHTML = "";
		desc.innerHTML = "Loading description...";
		
		//show the Public Service properties
		props = getURIProps(uri);
		updateInfo(desc, title, props);
	}
}

function applyEvent (country) {
	var uris="", props="", i;
	
	uris = getSelectedEvent();
	
	if(uris != "") {
		if(country != "EU")
			initialisePS (country, uris);
		else {
			initialisePSEU (uris);
		}
	}
}

function getMoreInfo (uri, uriName) {
	var modal, body, header, props="", bodyText="", i, name="", value="", aux="";
	
	props = getMoreInfoURI (uri);
	
	if (props == "") { //If there is no further information, show the Identifier
		// Get the modal
		modal = document.getElementById('moreInfo');

		// Get the <span> element that closes the modal
		var span = document.getElementsByClassName("closeInfo")[0];

		// When the user clicks the button, open the modal
		modal.style.display = "block";

		header = document.getElementById('modalHeader');
		header.innerHTML = uriName;
		
		props = props.split("##");
		
		bodyText = "<div><b>Identifier</b>: " + uri + "</div>";
		
		body = document.getElementById('modalBody');
		body.innerHTML = bodyText;
		
		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
			modal.style.display = "none";
		}

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		}
	}
 	else {
		// Get the modal
		modal = document.getElementById('moreInfo');

		// Get the <span> element that closes the modal
		var span = document.getElementsByClassName("closeInfo")[0];

		// When the user clicks the button, open the modal
		modal.style.display = "block";

		header = document.getElementById('modalHeader');
		header.innerHTML = uriName;
		
		props = props.split("##");
		
		bodyText = "<div><b>Identifier</b>: " + uri + "</div>";
		
		for (i=1; i<props.length; i++) {
			aux = props[i].split("@#");
			name = aux[0];
			value = aux[1];
			bodyText = bodyText + "<div><b>" + name + "</b>: " + value + "</div>";
		}
		
		body = document.getElementById('modalBody');
		body.innerHTML = bodyText;
		
		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
			modal.style.display = "none";
		}

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = "none";
			}
		}
	}
}

function getPSInfo (uri, origin) {
	var props="";
	
	if (origin == "Estonia") {
		var desc = document.getElementById("description1");
		var title = document.getElementById("title1");
	}
	if (origin == "Finland") {
		var desc = document.getElementById("description2");
		var title = document.getElementById("title2");
	}

	title.innerHTML = "";
	desc.innerHTML = "Loading description...";
	
	//show the Public Service properties
	props = getURIProps(uri);
	updateInfo(desc, title, props, origin);
}

function updateListPS (list) {
	var i=0, auxps = "", uri="", title="", row="", desc="", cad="", origin="", aux="";
	var ps = document.getElementById("listPS");
	
	ps.innerHTML = "<tr><td/><td>Loading list of public services</td><td/></tr>";
	
	auxps = list.split("##");	
	for (i=0; i<auxps.length-1; i++){
		row = auxps[i].split("@#");
		if (i>0) { 
			aux = row[0].split("\n"); //Remove the first character, which is \n (introduced by python)
			uri = aux[1]; 
		}
		else
		uri = row[0];
		origin = row[1];
		title = row[2];
		desc = row[3];
		/* cad = cad + "<div onclick='getPSInfo(&#39;" + uri + "&#39;, &#39;" + origin + "&#39;)' style='cursor:pointer'><b>" + origin + " - " + title + ":</b> " + desc + "</div>"; */
		cad = cad + "<tr><td><b>" + origin + "</b></td><td><b>" + title + ":</b> " + desc + "</td><td class='table-col-knowmore' onclick='getPSInfo(&#39;" + uri + "&#39;, &#39;" + origin + "&#39;)' style='cursor:pointer'><img src='images/info2.png' alt='Imagen' style='width:136;max-width:60%;' /></td></tr>";
	}
	
	if (cad == "") cad = "<tr><td/><td>There is no public service found under that criteria.</td><td/></tr>";
	ps.innerHTML = cad;
	
	var titleps = document.getElementById("title1");
	titleps.innerHTML = "";
	
	var descps = document.getElementById("description1");
	descps.innerHTML = "";
	
	titleps = document.getElementById("title2");
	titleps.innerHTML = "";
	
	descps = document.getElementById("description2");
	descps.innerHTML = "";
}


function applyFilter () {
	var event = getSelectedEvent ();
	var sector = getSelectedSector ();
	/* var lang = getSelectedLanguage (); */
	
	var s="", l="";
	
	var ps = document.getElementById("listPS");
	ps.innerHTML = "<tr><td/><td>Loading list of public services</td><td/></tr>";
	var titleps = document.getElementById("title1");
	titleps.innerHTML = " ";	
	var descps = document.getElementById("description1");
	descps.innerHTML = " ";
	titleps = document.getElementById("title2");
	titleps.innerHTML = " ";	
	descps = document.getElementById("description2");
	descps.innerHTML = " ";
	
	if (sector == "")
		s = "NoSector";
	else
		s = sector.replace(/ /g, "##");
	
	/* if (lang == "")
		l = "NoLang";
	else
		l = lang; */
	
	
	var cad="";
	$.ajax({
		type: "GET",
		url: "http://localhost:80/harvesterPilotFederal/pages/getPSFilter.php",
		data: { "ev":event, "sector":s/* , "lang":l */ },
		async: false,
		success: function (response) {
			cad = response;
		},
	});
	
	updateListPS(cad);
	
}

