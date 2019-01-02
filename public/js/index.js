$(document).ready(function () {
    $("#loader").html("Loading...");

    var desingURL = 'designs/dino/Dino-Examples-01.svg';
    //var desingURL = 'designs/test.svg';

    //intialize design template by creating canvas
    DesignTemplate.createCanvas('canvas');

    DesignTemplate.addDesign({
    	url : desingURL,
    	width : 268,
    	height : 210
    }, function(designInfo) {
        $("#loader").html("Ready to desing !!!");
    	var texts = designInfo.texts;
    	for (var i = 0; i < texts.length; i++) {
    		$("#design-text-container").append('<input id="' + (i+1) +'" class="design-text" type="text" value="' + texts[i] + '"/>');
    	}
    });

    $("#design-text-container").on("input", ".design-text", function(event){
    	var target = $(event.target);
    	var index = target.attr("id");
    	var value = target.val();
    	DesignTemplate.changeText(index, value);
    });

    $("#design-text-container").on("input", ".design-text", function(event){
    	var target = $(event.target);
    	var index = target.attr("id");
    	var value = target.val();
    	DesignTemplate.changeText(index, value);
    });

    $("#font-family").on("change", function(event){
    	var fontFamily = this.value;
    	loadFonts(fontFamily, function(){
    		DesignTemplate.changeFontFamily(fontFamily);
    	}, function(){
    		alert('Unable to load fonts');
    	});
    })
})