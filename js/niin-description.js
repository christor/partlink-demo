function create_niin_description(uri, number){
	var query1 = "SELECT DISTINCT ?description \n\
					WHERE{<";
	var query2 = "> rdfs:subClassOf ?o. \n\
					?o <http://purl.org/dc/terms/description> ?description.}";
	var sparqlQueryToRun = query1 + uri + query2;
	var url = create_url(sparqlQueryToRun);
	$.getJSON(url).done(function(data){
		angular.element($("#InfoController")).scope().descriptionInfo(data,number);
	})
}