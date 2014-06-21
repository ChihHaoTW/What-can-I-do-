var movie = [
		
		{ 
			"name": "台南新光影城",
			"address" : "台南市中西區西門路一段658號(新光三越)7-9樓",
			"type" : "",
			"time" : ""
		},
		
		{ 
			"name": "台南威秀影城",
			"address" : "台南市公園路60號8樓",
			"type" : "",
			"time" : ""
		},		
	
		{ 
			"name": "台南國賓影城",
			"address" : "台南市東區中華東路一段88號",
			"type" : "",
			"time" : ""
		},	

	];
var match = [];

$('#tellMe').click(function(){

	// 抓使用者位置

	geocoder = new google.maps.Geocoder();
	
	
	var targetPos = [];

	var myPos;
	var today = new Date();
	var hour = today.getHours();
	var minute = today.getMinutes();
	var eatingTime = 0;
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

	
	$.get("ggc.py",

		{	
			"movie" : movie,
			"num"   : num;
		},
	
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


	(function(num){
	
		
		var defferedArray = [];

		for(var i=0;i<num;i++){
		
			defferedArray.push(geocodeAjax(addr[i]));
	
		}

		$.when.apply(null, defferedArray).then(function(){
		
			for(var j=0; j < markers.length ; j++ )
			{
		
				$("#result").append(+"km <br />");
			
			}
		
		
		});
	
	})(addr.length);
	
	
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
				</div>
			
			");
			
		}else if(match[key]['type'] == "movie"){
			
			$('#list').append("
			
				<div class='item'>
					<span class='name'>"+match[key]['name']+"</span>
					<span class='timeTable'>"+match[key]['timeTable']+"</span>
					<span class='meg'>"+megGenerator(match[key]['type'])+"</span>
				</div>
			
			");
			
		
		}else if(match[key]['type'] == "art"){
		
			$('#list').append("
			
				<div class='item'>
					<span class='name'>"+match[key]['name']+"</span>
					<span class='address'>"+match[key]['address']+"</span>
					<span class='time'>"+match[key]['time']+"</span>
					<span class='meg'>"+megGenerator(match[key]['type'])+"</span>
				</div>
			
			
			");
		
		}
				
		
	}


}



function checkTime(hour) {

	if(hour >= 6 && hour <= 9) return 1;
	else if(hour >= 11 && hour <= 14) return 1;
	else if(hour >= 17 && hour <= 19) return 1;
	else return 0;

}