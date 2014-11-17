d3.selection.prototype.moveToFront = function () {
    return this.each(function () {
        this.parentNode.appendChild(this);
    });
};
d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};
String.prototype.capitalizeCountryName = function () {
    var str = this;
    var upd = str.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
    upd = upd.replace(/ And /, ' and '); // use lowercase for `and` in long names like Bosnia and Herzegovina

    return upd;
};