// global variable for getting data
var sparqlEndpointUrl = "http://api.xsb.com/sparql/query";
var outputType = "application/sparql-results+json";
// map for redundant values
var map = [];

// helper function for creating uri
function create_url(query){
	var url = sparqlEndpointUrl + "?" + "output=" + encodeURIComponent(outputType) + "&query=" + encodeURIComponent(query);
    return url;
}

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
			create_niin_specification(data.results.bindings[0].NIIN.value, number);
		}

    });
}

function create_niin(number){
	// add it onto the list
	var item = $("<li>" + number + "</li>");
	$("#search-result").append(item);
	var current_item = $("#search-result li:last-child");
	current_item.value = number;
	current_item.addClass("item");
	current_item.slideDown();
	angular.element($("#InfoController")).scope().create(number);
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

	// click on the niin
	$("#search-result").on("click", "li", function(){
		event.preventDefault();
		//console.log($(this).text());
		angular.element($("#TotalController")).scope().focus($(this).text());
	});

	// hover on the niin to indicate which one is current
	$("#search-result").on("mouseenter", "li", function(){
		$(this).addClass("highlight");
	}).on("mouseleave", "li", function(){
		$(this).removeClass("highlight");
	})

	// this is for the buy toggle
	$("#cage-result").on("click", "li", function(){
		//console.log($(this));
		$(this).children(".cageinfo").slideToggle();
	});

});