$(document).ready(function () {
	$("#loader").html("Loading...");

	//var desingURL = 'designs/dino/Dino-Examples-01.svg';
	//var desingURL = 'designs/test.svg';
	var desingURL = 'designs/Dino_Standard_Label_20x50mm_Examples-01.svg';

	//intialize design template by creating canvas
	DesignTemplate.createCanvas('canvas');

	DesignTemplate.addDesign({
		url: desingURL,
		// width: 268,
		// height: 210
	}, function (designInfo) {
		$("#loader").html("Ready to desing !!!");
		var texts = designInfo.texts;
		var colors = designInfo.textObjectInfo.map(function (obj) {
			return obj.fill;
		});
		for (var i = 0; i < texts.length; i++) {
			$("#design-text-container").append('<input id="' + (i + 1) + '" class="design-text" type="text" max-length="' + DesignTemplate.maxTextLength + '" value="' + texts[i] + '"/>');
		}
		for (var i = 0; i < colors.length; i++) {
			$("#design-color-container").append('<span id="color-' + (i + 1) + '" data-id="' + i + '" class="design-color" style="background-color:' + colors[i] + '"/>');
		}
		$('.design-color').colorpicker();
	});

	$("#design-text-container").on("input", ".design-text", function (event) {
		var target = $(event.target);
		var index = target.attr("id");
		var value = target.val();
		DesignTemplate.changeText(index, value);
	});


	$("#font-family").on("change", function (event) {
		var fontFamily = this.value;
		$("#font-family").css("font-family", fontFamily);
		loadFonts(fontFamily, function () {
			DesignTemplate.changeFontFamily(fontFamily);
		}, function () {
			alert('Unable to load fonts');
		});
	});

	$('#design-color-container').on('changeColor', '.design-color', function (event) {
		var ele = $(event.target);
		var id = ele.data("id");
		var color = event.color.toString();
		$("#" + ele.attr("id")).css("background-color", color);
		DesignTemplate.changeColor(id, color);
	});
})