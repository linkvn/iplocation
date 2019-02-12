import { ip as validate } from "ip-validator";

export interface IPResponse {
    country: string;
    countryCode: string;
    region: string;
    regionCode: string;
    city: string;
    postal: string;
    ip: string;
    latitude: number;
    longitude: number;
    timezone: string;
    __latlon: string;
}

export interface GenericResponse {
    [key: string]: string | number;
}

const keys: { [key: string]: string[]; } = {
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

export function getPropertyByPath (obj: any, path: string): any | null {
    const parts = path.split(".");
    let currentValue = obj;

    for (const part of parts) {
        if (currentValue[part]) {
            currentValue = currentValue[part];
        } else {
            return null;
        }
    }

    return currentValue;
}

export function validateIp (ip: string): boolean {
    return !ip || !validate(ip);
}

export function normalise (res: GenericResponse): IPResponse {
    const output: any = {};

    for (const outputKey in keys) {
        const keysToFind: string[] = keys[outputKey];
        output[outputKey] = "";

        for (const key of keysToFind) {
            if (key.includes(".") && getPropertyByPath(res, key)) {
                output[outputKey] = getPropertyByPath(res, key);
                break;
            } else if (res[key]) {
                output[outputKey] = res[key];
                break;
            }
        }
    }

    if ((!output.latitude || !output.longitude) && output.__latlon) {
        if (output.__latlon.includes(",")) {
            const [lat, lon] = output.__latlon.split(",");
            output.latitude = lat;
            output.longitude = lon;
        }
    }

    output.latitude = +output.latitude || null;
    output.longitude = +output.longitude || null;

    for (const key in output) {
        if (key.startsWith("__")) {
            delete output[key];
        }
    }

    return output;
}

