var moviePlace = [
		
		{ 
			"name": "台南新光影城",
			"address" : "台南市中西區西門路一段658號(新光三越)7-9樓",
			"type" : "",
			"time" : "",
			"lat"  : "22.987091",
			"lng"  : "120.197819"
		},
		
		{ 
			"name": "台南威秀影城",
			"address" : "台南市公園路60號8樓",
			"type" : "",
			"time" : "",
			"lat"  : "22.995780",
			"lng"  : "120.206079"
		},		
	
		{ 
			"name": "台南國賓影城",
			"address" : "台南市東區中華東路一段88號",
			"type" : "",
			"time" : "",
			"lat"  : "22.995774",
			"lng"  : "120.234148"
		},	

	];
var initData = [];
var match = [];
var endData = [];
var numOfMovie = 0;
var targetMovie;

var map;
var service;
var infowindow;

$(document).ready(function (){
	$('#tellMe').click(function(){

		// 抓使用者位置

		geocoder = new google.maps.Geocoder();
		
		
		var targetPos = [];

		var myPos;
		var today = new Date();
		var hour = today.getHours();
		var minute = today.getMinutes();
		var c = 0;
		var std_dist = 2;

		if(navigator.geolocation) {
		
			navigator.geolocation.getCurrentPosition(function(position) {
			  
				myPos = { 
							'lat': position.coords.latitude,
							'lng': position.coords.longitude
						};
			}, function() {
			  handleNoGeolocation(true);
			});
		
		} else {
			// Browser doesn't support Geolocation
			handleNoGeolocation(false);
		}
		
		// 比對電影院距離
		
/*		for(var key in moviePlace){
		
			var dist = disVincenty(myPos.latitude, myPos.longitude, moviePlace[key]['lat'], moviePlace[key]['lng']);
			if(dist <= 2){
				numOfMovie = key + 1;
				targetMovie = moviePlace[key];
			} 
		
		}
*/		
		// 抓電影時刻表
		
		if(numOfMovie > 0){
		
			$.get("python/movie.py",
			
				{	
					"num" : num
				},
				
				function(data) {
				
					for(var key in data){
					
						match.push(data[key]);
					
					}
				
				},"json");
		
		}

		function geosearchAjax(column){


			var def = new jQuery.Deferred();
			setTimeout(function() {
				  var pyrmont = new google.maps.LatLng(myPos.lat,myPos.lng);

				  map = new google.maps.Map(document.getElementById('map'), {
				      mapTypeId: google.maps.MapTypeId.ROADMAP,
				      center: pyrmont,
				      zoom: 15
				    });
					
				  var request = {
				    location: pyrmont,
				    radius: '20',
				    query: column.address
				  };
				
				  service = new google.maps.places.PlacesService(map);
				  service.textSearch(request, function(results, status) {
				  def.resolve();

					  if (status== google.maps.places.PlacesServiceStatus.OK) {
					  		console.log(results[0]);
					  		
							var result = {
								'name': column.name,
								'address': results[0].formatted_address,
								'type': column.type,
								'time': column.time
							}	
					 		post_data(result);
					  }else{
					  	def.rejected();
					  }

					});
	
				}, c++ * 1000);
					
			return def.promise();
		}
		clean_index();

		var defferedArray = [];

		$.ajax({ 
			url:"/cgi-bin/ggc.py", 
			type: "get",
			datatype: "json",	
			success: function(data){
			
				//data = data.substr(1, data.length-2);
		
				data = JSON.parse(data);
				//console.log(data[1].address);
				console.log("long = "+data.length);
				for(var key in data){
					
					if(!(isEmpty(data[key].address))) defferedArray.push(geosearchAjax(data[key]));
				}

			},
			async: false	
		});
		

	});
});

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

function clean_index(){

	$('#title').remove();
	$('#tellMe').remove();
	$('body').append("<div id='message'>身為一個台南人, 你可以去 ... </div><div id='list'></div>");

}

function post_data(column){

	var type;


		if(column['type'] == "park" || column['type']=='landmark'){

			type = "地";
		
			$('#list').append("<div class='place BlogEntry' ><span class='icon'>"+type+"</span><span class='right'><span class='name'>"+column['name']+"</span><span class='address'>"+column['address']+"</span><span class='search'>Search More</span></span></div>");
			
		}else if(column['type'] == "movie"){

			type = "影";
			
			$('#list').append("<div class='BlogEntry movie'><span class='icon'>"+type+"</span><span class='right'><span class='sub_left'><div class='place'>"+targetMovie['name']+"</div><div class='address'>"+targetMovie['address']+"</div></span><span class='sub_middle'><span class='name'>"+column['name']+"</span><span class='timeTable'></span></span><span class='sub_right'><span class='search'>Search More</span></span></span></div>");
			
			for(var i=0;i<4;i++){

				$("span#timeTable_"+key).append("<span class='time'>"+column[timeTable][i]+"</span>");
			
			}
			
		}else if(column['type'] == "art"){
			type =  "活";
		$('#list').append("<div class='place BlogEntry' ><span class='icon'>"+type+"</span><span class='right'><span class='name'>"+column['name']+"</span><span class='address'>"+column['address']+"</span><span class='search'>Search More</span></span></div>");
			
		}
				
		


}

function isEmpty(str) {
    return (!str || 0 === str.length);
}