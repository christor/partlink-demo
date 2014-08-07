$(document).ready(function(){
	$(".show").mouseover(function(){
		//console.log($(this).text());
		$(this).addClass('choicetab');
		var choice = $(this).text();
		if (choice === "Explore"){
			$('#explore').show();
		}
		else if(choice === "Design"){
			$('#design').show();
		}
		else if(choice === "Create"){
			$('#create').show();
		}
	}).mouseleave(function(){
		$(this).removeClass('choicetab');
		$('.text').hide();
	});
});