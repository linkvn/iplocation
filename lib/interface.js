"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ip_validator_1 = require("ip-validator");
var keys = {
    country: ["country_name", "country.name", "country", "geobytescountry", "countryName"],
    countryCode: ["country_code", "country.code", "country", "countryCode", "country_code2", "geobytesinternet"],
    region: ["region", "stateProv", "state_prov", "geobytescity", "regionName", "city"],
    regionCode: ["region_code", "regionCode", "regionName", "region", "stateProv", "state_prov", "geobytescity", "city"],
    city: ["stateProv", "state_prov", "city", "geobytescity", "region", "cityName"],
    postal: ["postal", "zipCode"],
    ip: ["ip", "query", "ipAddress"],
    latitude: ["location.latitude", "latitude", "lat", "geobyteslatitude"],
    longitude: ["location.longitude", "longitude", "lon", "geobyteslongitude"],
    timezone: ["location.timezone", "timezone", "timeZone"],
    __latlon: ["loc"]
};
function getPropertyByPath(obj, path) {
    var parts = path.split(".");
    var currentValue = obj;
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
        var part = parts_1[_i];
        if (currentValue[part]) {
            currentValue = currentValue[part];
        }
        else {
            return null;
        }
    }
    return currentValue;
}
exports.getPropertyByPath = getPropertyByPath;
function validateIp(ip) {
    return !ip || !ip_validator_1.ip(ip);
}
exports.validateIp = validateIp;
function normalise(res) {
    var output = {};
    for (var outputKey in keys) {
        var keysToFind = keys[outputKey];
        output[outputKey] = "";
        for (var _i = 0, keysToFind_1 = keysToFind; _i < keysToFind_1.length; _i++) {
            var key = keysToFind_1[_i];
            if (key.includes(".") && getPropertyByPath(res, key)) {
                output[outputKey] = getPropertyByPath(res, key);
                break;
            }
            else if (res[key]) {
                output[outputKey] = res[key];
                break;
            }
        }
    }
    if ((!output.latitude || !output.longitude) && output.__latlon) {
        if (output.__latlon.includes(",")) {
            var _a = output.__latlon.split(","), lat = _a[0], lon = _a[1];
            output.latitude = lat;
            output.longitude = lon;
        }
    }
    output.latitude = +output.latitude || null;
    output.longitude = +output.longitude || null;
    for (var key in output) {
        if (key.startsWith("__")) {
            delete output[key];
        }
    }
    return output;
}
exports.normalise = normalise;
