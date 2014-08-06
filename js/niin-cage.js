function create_niin_cageinfo(uri, number){
	// console.log(uri);
	var cageURIQuery1 = "SELECT ?partnum ?cageuri \n\
                            WHERE{<";
  	var cageURIQuery2 = ">   <http://xsb.com/swiss/logistics#hasReferenceNumber> ?refnum. \n\
                            ?refnum <http://xsb.com/swiss/logistics#hasPartNumber> ?partnum. \n\
                            ?refnum <http://xsb.com/swiss/logistics#hasCage> ?cageuri. }";
  	/* regex hack I need to change the uri which is in the form of http://xsb.com/swiss/product#
  	   to http://xsb.com/swiss/logistics# */
  	var uri = uri.replace("product", "logistics");
  	// console.log(uri);
  	var sparqlQueryToRun = cageURIQuery1 + uri + cageURIQuery2;
  	var url = create_url(sparqlQueryToRun);
  	/* test case */
  	//console.log(url);
  	$.getJSON(url).done(function(data){
  		create_niin_cageinfo_helper(data, number);
  	});
}

function create_niin_cageinfo_helper(uri, number){
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
  			angular.element($("#InfoController")).scope().buyInfo(data, number);
  		});
   	}
}