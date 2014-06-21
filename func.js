function deg2rad(degree)
{
	radians  = degree * (Math.PI / 180)
	return radians;
}

function disVincenty(lat1, long1, lat2, long2){

	var a  = 6378137;
	var b = 6356752.314245;
	var f = 1/298.257223563;
	var L = deg2rad(long2 - long1);
    var U1 = Math.atan((1 - f) * Math.tan(deg2rad(lat1)));
    var U2 = Math.atan((1 - f) * Math.tan(deg2rad(lat2)));
    var sinU1 = Math.sin(U1);
    var cosU1 = Math.cos(U1);
    var sinU2 = Math.sin(U2);
    var cosU2 = Math.cos(U2);
	var lambda = L;
	var iterLimit = 100;
	
    do {
        var sinLambda = Math.sin(lambda);
        var cosLambda = Math.cos(lambda);
        var sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
        if( sinSigma == 0 ) {
            return 0;
        }
        var cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda;
        var sigma = Math.atan2(sinSigma, cosSigma);
        var sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma;
        var cosSqAlpha = 1 - sinAlpha * sinAlpha;
		var cos2SigmaM = 0;
        if( cosSqAlpha == 0 ) {
            cos2SigmaM = 0;
        } else {
            cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha;
        }
        var C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
        var lambdaP = lambda;
        lambda = L + (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    } while(Math.abs(lambda - lambdaP) > 0.000000000001 && --iterLimit > 0);
	
	if( iterLimit == 0 ) {
        return 0;
    }
    var uSq = cosSqAlpha * (a * a - b * b) / (b * b);
    var A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq)));
    var B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq)));
    var deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM)));
    return Math.round(b * A * (sigma - deltaSigma))/1000;
	
}


function handleNoGeolocation(errorFlag) {
  if (errorFlag) {
    var content = 'Error: The Geolocation service failed.';
  } else {
    var content = 'Error: Your browser doesn\'t support geolocation.';
  }
 
  var options = {
    map: map,
    position: new google.maps.LatLng(60, 105),
    content: content
  };

  var infowindow = new google.maps.InfoWindow(options);
  map.setCenter(options.position);
}