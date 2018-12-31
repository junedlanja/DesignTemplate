function loadFonts(fontFamily, successCallback, errorCallback, count) {
    count = Number(count ? count : 0);

    if (count++ > 5)
        return errorCallback && errorCallback();

    WebFont.load({
        custom: {
            families: [fontFamily + ":n4,i4,n7,i7"]
        },
        active: function () {
            successCallback && successCallback();
        },
        inactive: loadFonts.bind(null, fontFamily, successCallback, errorCallback, count)
    });
}