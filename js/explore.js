// global variable for getting data
var sparqlEndpointUrl = "http://api.xsb.com/sparql/query";
var outputType = "application/sparql-results+json";
// map for redundant values
var map = [];

// class template for each search item
// create the niin object here
function query_niin(number){

	// create the query
	var niinQuery1 = "SELECT ?NIIN WHERE { ?NIIN <http://xsb.com/swiss/product#nationalItemId> \"";
    var niinQuery2 = "\".}";
    var sparqlQueryToRun = niinQuery1 + number + niinQuery2;
    var url = create_url(sparqlQueryToRun);

    // Once the data is fetched
    $.getJSON(url).done(function(data){

		if (data.results.bindings.length === 0){
			alert("Error");
		}
		else if(number in map){
			alert("You already have this item");
		}
		else{
			map[number] = 1;
			create_niin(number);
			create_niin_description(data.results.bindings[0].NIIN.value, number);
			create_niin_cageinfo(data.results.bindings[0].NIIN.value, number);
		}

    });
}
function create_url(query){
	var url = sparqlEndpointUrl + "?" + "output=" + encodeURIComponent(outputType) + "&query=" + encodeURIComponent(query);
    return url;
}
function create_niin_description(uri, number){
	var query1 = "SELECT DISTINCT ?description \n\
					WHERE{<";
	var query2 = "> rdfs:subClassOf ?o. \n\
					?o <http://purl.org/dc/terms/description> ?description.}";
	var sparqlQueryToRun = query1 + uri + query2;
	var url = create_url(sparqlQueryToRun);
	current_view = number;
	$.getJSON(url).done(function(data){
		angular.element($("#InfoController")).scope().descriptionInfo(data,number);
	})

}
function create_niin_cageinfo(uri){
	var cageURIQuery1 = "SELECT ?partnum ?cageuri \n\
                            WHERE{<";
  	var cageURIQuery2 = ">   <http://xsb.com/swiss/logistics#hasReferenceNumber> ?refnum. \n\
                            ?refnum <http://xsb.com/swiss/logistics#hasPartNumber> ?partnum. \n\
                            ?refnum <http://xsb.com/swiss/logistics#hasCage> ?cageuri. }";
  	var sparqlQueryToRun = cageURIQuery1 + uri + cageURIQuery2;
  	var url = create_url(sparqlQueryToRun);
  	/* test case */
  	//console.log(url);
  	$.getJSON(url).done(function(data){
  		create_niin_cageinfo_helper(data);
  	});
}

function create_niin_cageinfo_helper(uri){
	var cageinfo1 = "SELECT ?cagecode ?cagename ?street ?region ?locality ?postal ?country ?voicenum ?faxnum \n\
                    WHERE{<";
    var cageinfo2 = "> <http://xsb.com/swiss/logistics#hasCageCode> ?cagecode. <";
    var cageinfo3 = "> <http://xsb.com/swiss/logistics#hasCageName> ?cagename. \n\
                    OPTIONAL{<";
    var cageinfo4 = "> <http://www.w3.org/2006/vcard/ns#hasTelephone> ?phonenode1. \n\
                    ?phonenode1 rdf:type <http://www.w3.org/2006/vcard/ns#Voice>. \n\
                    ?phonenode1 <http://www.w3.org/2006/vcard/ns#hasValue> ?voicenum. \n\
                    } OPTIONAL{<";
    var cageinfo5 = "> <http://www.w3.org/2006/vcard/ns#hasTelephone> ?phonenode2. \n\
                        ?phonenode2 rdf:type <http://www.w3.org/2006/vcard/ns#Fax>. \n\
                        ?phonenode2 <http://www.w3.org/2006/vcard/ns#hasValue> ?faxnum. } \n\
                    OPTIONAL{<";
    var cageinfo6 = "> <http://www.w3.org/2006/vcard/ns#hasAddress> ?addressnode. \n\
                    ?addressnode <http://www.w3.org/2006/vcard/ns#street-address> ?street. \n\
                    OPTIONAL{ ?addressnode <http://www.w3.org/2006/vcard/ns#locality> ?locality.} \n\
                    OPTIONAL{?addressnode <http://www.w3.org/2006/vcard/ns#region> ?region.} \n\
                    OPTIONAL{?addressnode <http://www.w3.org/2006/vcard/ns#postal-code> ?postal.} \n\
                    ?addressnode <http://www.w3.org/2006/vcard/ns#country-name> ?country. } }";
    var bindings = uri.results.bindings;
   	for (var numcages = 0; numcages < bindings.length; numcages ++){
   		currentcage = bindings[numcages].cageuri.value;
   		var sparqlQueryToRun = cageinfo1 + currentcage + cageinfo2 + currentcage + cageinfo3
                            + currentcage + cageinfo4 + currentcage + cageinfo5 + currentcage + cageinfo6;
        var url = create_url(sparqlQueryToRun);
        $.getJSON(url).done(function(data){
  			angular.element($("#InfoController")).scope().buyInfo(data);
  		});
   	}
}
function create_niin(number){
	// add it onto the list
	var item = $("<li>" + number + "</li>");
	$("#search-result").append(item);
	var current_item = $("#search-result li:last-child");
	current_item.value = number;
	current_item.addClass("item");
	current_item.slideDown();
}

$(document).ready(function(){
	// add event listeners
	// pressed enter in textbox
	$("#search-box").keypress(function(e){
		if (e.which === 13){
			$(this).blur();
			//alert($(this).val());        /* stub */
			/* add the element to list */
			query_niin($(this).val());


		}
	});

	// clicked add
	$("#add-item").on("click", function(){
		//alert("clicked search");
		query_niin($("#search-box").val())
	});

	// click on the item
	$("#search-result").on("click", "li", function(){
		event.preventDefault();
		//console.log($(this).text());
		angular.element($("#TotalController")).scope().focus($(this).text());
	})

});