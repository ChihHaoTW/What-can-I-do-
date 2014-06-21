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
var match = [];
var numOfMovie = 0;


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
		  
			myPos = position.coords;

		}, function() {
		  handleNoGeolocation(true);
		});
	
	} else {
		// Browser doesn't support Geolocation
		handleNoGeolocation(false);
	}
	
	// 比對電影院距離
	
	for(var key in moviePlace){
	
		var dist = disVincenty(myPos.latitude, myPos.longitude, moviePlace[key]['lat'], moviePlace[key]['lng']);
		if(dist <= 2) numOfMovie = key + 1;
	
	}
	
	// 抓電影時刻表
	
	if(numOfMovie > 0){
	
		$.get("movie.py",
		
			{	
				"num"   : num;
			},
			
			function(data) {
			
				for(var key in data){
				
					match.push(data[key]);
				
				}
			
			},"json");
	
	}

	
	$.get("ggc.py",


		function(data){

			for(var key in data){
			
				data[key]["address"];
				
				setTimeout(function() {
					//呼叫decode()，傳入參數及Callback函數
					geocoder.geocode({ address: data[key]['address'] }, function (results, status) {
						//檢查執行結果
						if (status == google.maps.GeocoderStatus.OK) {
						
							var loc = results[0].geometry.location;
							var dist = disVincenty(myPos.latitude, myPos.longitude, loc.lat(), loc.lng());
							
							if( dist <= std_dist) {
								match.push(data[key]);
							}
						}
						else
						{
							//  no match coord
						}
					});
				}, c++ * 1000);			
			
		}
	
	
	}, "json");
	

});
	
function clean_index(){

	$('#title').clear();
	$('#tellMe').clear();

}

function post_data(){

	for(var key in match){
	
		if(match[key]['type']) == "park"){
		
			$('#list').append("
			
				<div class='item'>
					<span class='name'>"+match[key]['name']+"</span>
					<span class='address'>"+match[key]['address']+"</span>
					<span class='meg'>"+megGenerator(match[key]['type'])+"</span>
					<span class='search more'>Search More</span>
				</div>
			
			");
			
		}else if(match[key]['type'] == "movie"){
			
			$('#list').append("
			
				<div class='item'>
					<span class='name'>"+match[key]['name']+"</span>
					<span class='timeTable' id='timeTable_"+key+"'></span>
					<span class='meg'>"+megGenerator(match[key]['type'])+"</span>
					<span class='search more'>Search More</span>			
				</div>
			
			");
			
			for(var i in match[key]['timeTable']){

				$("span#timeTable_"+key).append(match[key][timeTable][i]);
			
			}
			
		}else if(match[key]['type'] == "art"){
		
			$('#list').append("
			
				<div class='item'>
					<span class='name'>"+match[key]['name']+"</span>
					<span class='address'>"+match[key]['address']+"</span>
					<span class='time'>"+match[key]['time']+"</span>
					<span class='meg'>"+megGenerator(match[key]['type'])+"</span>
					<span class='search more'>Search More</span>					
				</div>
			
			");
		
		}
				
		
	}


}
