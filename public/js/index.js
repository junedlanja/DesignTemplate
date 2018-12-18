$(document).ready(function () {
    var desingURL = 'designs/dino/Dino-Examples-01.svg';
    var desingURL = 'designs/test.svg';

    //intialize design template by creating canvas
    DesignTemplate.createCanvas('canvas');

    DesignTemplate.addDesign(desingURL);
})