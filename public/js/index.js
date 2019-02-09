function renderTextOptions() {
    $("#design-text-container").empty();
    var texts = DesignTemplate.designTexts;
    for (var i = 0; i < texts.length; i++) {
        $("#design-text-container").append(
            '<input id="' +
            (i + 1) +
            '" class="design-text" type="text" max-length="' +
            DesignTemplate.maxTextLength +
            '" value="' +
            texts[i] +
            '"/>'
        );
    }
}

function renderColorOptions() {
    $("#design-color-container").empty();
    var colors = DesignTemplate.textObjectInfo.map(function (obj) {
        return obj.fill;
    });
    // for (var i = 0; i < colors.length; i++) {
    //     $("#design-color-container").append('<span id="color-' + (i + 1) + '" data-id="' + i + '" class="design-color" style="background-color:' + colors[i] + '"/>');
    // }
    // $(".design-color").colorpicker();
}

function selectDefaultFontFamily() {
    var defaultFontFamily = DesignTemplate.designFontFamily;
    $('#font-family option[value="' + defaultFontFamily + '"]').prop(
        "selected",
        true
    );
}

var readUploadedFile = function (file, callback) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var imgObj = new Image();
        imgObj.src = event.target.result;
        imgObj.onload = function () {
            callback(imgObj);
        };
    };
    reader.readAsDataURL(file);
};

const cloudName = "dsoxr0nis";
const unsignedUploadPreset = "hxay11ox";

// *********** Upload file to Cloudinary ******************** //
function uploadFile(file) {
    var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    // Reset the upload progress bar
    $("#progress").css({
        width: 0
    });

    // Update progress (can be used to show progress indicator)
    xhr.upload.addEventListener("progress", function (e) {});

    xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4) {
            if ((xhr.status = 200)) {
                // File uploaded successfully
                var response = JSON.parse(xhr.responseText);
                console.log("Uploaded image url : ", response.secure_url);
                var url = response.secure_url;
                // Create a thumbnail of the uploaded image, with 150px width
                var tokens = url.split("/");
                tokens.splice(-2, 0, "w_150,c_scale");
                var img = new Image();
                img.src = tokens.join("/");
                img.alt = response.public_id;
                //Append thumbnail to gallery
                $("#gallery").append(img);
                showExportSuccessMsg();
                $("#preview-modal").modal("hide");
            } else {
                showExportFailureMsg();
                disablePreviewButtons(false);
            }
        }
    };

    fd.append("upload_preset", unsignedUploadPreset);
    fd.append("tags", "browser_upload"); // Optional - add tag for image admin in Cloudinary
    fd.append("file", file);
    xhr.send(fd);
}

function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {
        type: mime
    });
}

//Usage example:
var file = dataURLtoFile(
    "data:text/plain;base64,aGVsbG8gd29ybGQ=",
    "hello.txt"
);

//change preview modal content on preview
function showPreviewDetail(src) {
    $("#preview-img")
        .attr("src", src)
        .show();
    $("#preview-modal .modal-title").html("Design Preview");
    $("#loader").hide();
    disablePreviewButtons(false);
    $("#preview-modal").modal({
        show: true,
        backdrop: "static",
        keyboard: false
    });
}

//change preview modal content on export click
function showExportDetail() {
    $("#preview-modal .modal-title").html("Exporting Design");
    disablePreviewButtons(true);
    $("#loader").show();
}

//disable/enable buttons while preview/export
function disablePreviewButtons(enabled) {
    $("#export").prop("disabled", enabled);
    $("#icon-close").prop("disabled", enabled);
    $("#btn-close").prop("disabled", enabled);
}

//show success message when exported design is saved on cloud
function showExportSuccessMsg() {
    $("#export-success").show();
    //auto hide success message after 5 sec
    setTimeout(function () {
        $("#export-success").hide();
    }, 5000);
}

//show error message when exported design is saved on cloud
function showExportFailureMsg() {
    $("#export-error").show();
    //auto hide error message after 5 sec
    setTimeout(function () {
        $("#export-error").hide();
    }, 5000);
}

$(document).ready(function () {
    $("#design-loader").html("Loading...");

    //var designURL = 'designs/Dino_Standard_Label_20x50mm_Examples-01.svg';
    var designURL = "designs/Dino_Optimized.svg";

    //Create canvas
    DesignTemplate.createCanvas("canvas");

    //Add design 
    DesignTemplate.addDesign({
            url: designURL
        },
        function () {
            $("#design-loader").html("Ready to desing !!!");
            renderTextOptions();
            renderColorOptions();
            selectDefaultFontFamily();
        }
    );

    //Change text
    $("#design-text-container").on("input", ".design-text", function (event) {
        var target = $(event.target);
        var index = target.attr("id");
        var value = target.val();
        DesignTemplate.changeText(index, value);
    });

    //change font family
    $("#font-family").on("change", function (event) {
        var fontFamily = this.value;
        $("#font-family").css("font-family", fontFamily);
        loadFonts(
            fontFamily,
            function () {
                DesignTemplate.changeFontFamily(fontFamily, renderTextOptions);
            },
            function () {
                alert("Unable to load fonts");
            }
        );
    });

    //change text color
    $("#design-color-container").on("changeColor", ".design-color", function (
        event
    ) {
        var ele = $(event.target);
        var id = ele.data("id");
        var color = event.color.toString();
        $("#" + ele.attr("id")).css("background-color", color);
        DesignTemplate.changeColor(id, color);
    });

    //export final design
    $("#export").on("click", function (e) {
        showExportDetail();
        var file = dataURLtoFile(DesignTemplate.exportDesign(), "temp.png");
        uploadFile(file);
    });

    //Preview final design
    $("#preview").on("click", function (e) {
        var src = DesignTemplate.exportDesign();
        showPreviewDetail(src);
    });
});