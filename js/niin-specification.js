function create_niin_specification(uri, number){
	var restrictionQuery1 = "SELECT DISTINCT ?s ?p ?o ?p2 ?o2 ?o3 \n\
                            WHERE \n\
                            {<";
    var restrictionQuery2 = ">       rdfs:subClassOf ?s. #get the subclasses \n\
                                ?s rdf:type owl:Restriction. #subclass that are restrictions \n\
                                ?s ?p ?o. #List the restriction's triples\n\
                                ?o ?p2 ?o2. \n\
                                FILTER NOT EXISTS {?o2 rdf:type owl:Class.} \n\
                                OPTIONAL{?o2 rdfs:label ?o3.} \n\
                            } \n\
                            ORDER BY ?s desc(?p) \n\
                            LIMIT 30";
    sparqlQueryToRun = restrictionQuery1 + uri + restrictionQuery2;
    //console.log(sparqlQueryToRun);
    var url = create_url(sparqlQueryToRun);
  	/* test case */
  	//console.log(url);
  	$.getJSON(url).done(function(data){
  		angular.element($("#InfoController")).scope().specInfo(data,number);
  	});
}