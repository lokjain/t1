	$( document ).bind( "mobileinit", function() {
		$.support.cors = true;
		$.mobile.allowCrossDomainPages = true;
		$.mobile.phonegapNavigationEnabled = true
		$.mobile.loader.prototype.options.text = "Loading Page....";
		$.mobile.loader.prototype.options.textVisible = false;
		$.mobile.loader.prototype.options.theme = "f";
		$.mobile.loader.prototype.options.html = "";
	});
	
	function onDeviceReady() {
		document.getElementById("networkInfo").addEventListener("click", networkInfo);
		document.addEventListener("offline", onOffline, false);
		document.addEventListener("online", onOnline, false);
		var devversion=device.version;
		var osversion=device.platform;
		checkConnection();
		 navigator.splashscreen.hide(); 
	}
	function checkConnection() {
	    var networkState = navigator.network.connection.type;
	    var states = {};
	    states[Connection.UNKNOWN]  = 'Unknown connection';
	    states[Connection.ETHERNET] = 'Ethernet connection';
	    states[Connection.WIFI]     = 'WiFi connection';
	    states[Connection.CELL_2G]  = 'Cell 2G connection';
	    states[Connection.CELL_3G]  = 'Cell 3G connection';
	    states[Connection.CELL_4G]  = 'Cell 4G connection';
	    states[Connection.NONE]     = 'No network connection';

		if (states[networkState]=="No network connection"){
			alert(" No Network Connection, will Exit Now!");

			if (navigator.app) {
				navigator.app.exitApp();
			}
			else if (navigator.device) {
				navigator.device.exitApp();
			}
		}
	}
	function onOffline() {
		alert('You are now offline!');
	}

	function onOnline() {
	//   alert('You are now online!');
	}
	function exitFromApp(){
		navigator.app.exitApp();
	}

	$(document).ready(function(){
			var myLocalLang,myStateID,myDistrictID,myBlockID,myUID,mypwd,mSID,u,p,ses,lng,lat;
			var resourceID,ag_pr_name,ag_process_name,componentID;
			var my_media = null;
			var mediaTimer = null;
			var media_file = null;
			var tid=null;
			var myWebHost="http://www.pau-fcp.in/acad/matt/";
	//		var myWebHost="http://localhost/localpau/acad/matt/";
			function mPage(eleid){
				$.mobile.changePage($(eleid), {
					  allowSamePageTransition : true,
					  transition : 'none',
					  showLoadMsg : true,
					  reloadPage : true
					 });
			}	
			function mPageLogout(eleid){
				$.mobile.changePage($(eleid), {
					  allowSamePageTransition : true,
					  transition : 'none',
					  showLoadMsg : true,
					  reloadPage : true
				 });
			}	
			if(window.localStorage["u"] != undefined && window.localStorage["p"] != undefined&& window.localStorage["aut"] != undefined) {  
				u = window.localStorage["u"];  
				p = window.localStorage["p"];
				a = window.localStorage["aut"];
				myLogin(u,p,a);
				}
			else{
				mPage('#startpage');
			}
			myInit();
			function loadMyPage(lclstrid,url,elementid,lclstrname){
				var d=new Date().getFullYear();
				var myfooter='© www.pau.edu </div><br> '+d+'. All rights reserved.';
				$('div[data-role="footer"]').html(myfooter);
				$('div[data-role="footer"]').trigger('create');
				$(elementid).html("");
				$(elementid).trigger('create');
				if (lclstrname)
				{
					localStorage.removeItem(lclstrname);
					localStorage.setItem(lclstrname,lclstrid);
				}
				$.get(url+lclstrid, function(data) {
					$(elementid).html(data);
					$(elementid).trigger('create');
					$(elementid).on('load',function(){		
						$.mobile.loading( 'hide');
					});
					myInit();
				});
			}
		
			function myLogin(nu,np,aut){
				if (nu){
				$.post(myWebHost+'logon.php',{ username: nu, pwd: np, authtype: aut },function(data){
					var L,s;
					for (var i=0;i<data.length;i++){
						if(data.substring(i,i+1)=="L"){
							L=data.substring(i,i+7);
							s=data.substring(i+7,data.length)
							break;
							}
					}
					if(L == "LoginOK") 
					{
						window.localStorage["u"] = nu;
						window.localStorage["p"] = np;        
						window.sessionStorage["ses"] = s;
						window.localStorage["aut"] = aut;
						ses=s;
						u=nu;	
						if(window.localStorage["tid"]!=null){
							mPage('#transid');
						}else{	
							loadMyPage('',myWebHost+'myFirstPage.php?aut='+aut,"#langu",);		
							mPage('#pagelang');
						}
						myInit();
						return false;
					}  
					else 
					{
						alert("Your login failed");
						$('#myLoginFail').html("Login failed. Please Login again");
						$('#myLoginFail').trigger('create');
						myInit();
						mPage('#startpage');
						myInit();
						return false;
					}
				});
			  }
			}
			
			function myInit(){
				$("a").unbind().click(function(event) {
					// stuff
					});	
				$("a").on("click",function(){
					var myID = $(this).attr("id");
//					alert (myID);
					switch (true) {
						case (myID==="mlout"):
							$.post(myWebHost+'logout.php','',function(data){
								alert(data);
								window.localStorage["u"]="";
								window.localStorage["p"]="";        
								window.sessionStorage["ses"]="";
								window.localStorage["aut"]="";
							
								window.localStorage.removeItem["u"];
								window.localStorage.removeItem["p"];        
								window.sessionStorage.removeItem["ses"];
								window.localStorage.removeItem["aut"];
								$("#loginform").trigger('reset');
								$.mobile.changePage("#loginform", {reverse: false, changeHash: false, transition: "pop"});
								myInit();
								mPageLogout('#loginpage');		
										
							});	
							break;

						case (myID==="mlogin"):
							mPage('#loginpage');
							break;

						case (myID==="exitApp"):
							exitFromApp();
							break;

						case (myID==="login"):
							myLogin($('#username').val(),$('#pwd').val(),$('#authtype').val());
							break;

						case (myID==="MA"):
							loadMyPage('',myWebHost+'myadvisees.php','#nsgeocontent','');
							mPage('#geolocation1');
							break;
						case (myID==="TT"):
							loadMyPage('',myWebHost+'mytimetable.php','#mytimetable','');
							mPage('#timetable');
							break;

						case (myID==="MC"):
							loadMyPage('',myWebHost+'mycourses.php','#ndgeocontent','');
							mPage('#geoDistrict');
							break;

						case (myID==="ATT"):
							loadMyPage('',myWebHost+'myattendence.php','#nbgeocontent','');
							mPage('#geoBlock');
							break;
							
						case (myID==="EXT"):
							loadMyPage('',myWebHost+'myExtraClass.php','#nbgeocontent','');
							mPage('#geoBlock');
							break;

						case (myID==="GCL"):
		//					alert($('#cal').text("course"));
							$.post(myWebHost+'myattnxt.php',$('#calss').serialize(),function(data){
								$("#Attnxt").html(data);
								$("#Attnxt").trigger('create');
								myInit();
								mPage('#AttNxt');				
							});	
							break;

						case (myID==="RATT"):
		//					alert($('#cal').text("course"));
							$.post(myWebHost+'myreattnxt.php',$('#calss').serialize(),function(data){
								$("#reAttnxt").html(data);
								$("#reAttnxt").trigger('create');
								myInit();
								mPage('#reAttNxt');				
							});	
							break;

						case (myID==="EXTT"):
		//					alert($('#cal').text("course"));
							$.post(myWebHost+'myexattnxt.php',$('#calss').serialize(),function(data){
								$("#reAttnxt").html(data);
								$("#reAttnxt").trigger('create');
								myInit();
								mPage('#reAttNxt');				
							});	
							break;

						case (myID==="RESU"):
		//					alert($('#cal').text("course"));
							$.post(myWebHost+'myresattnxt.php',$('#Myres').serialize(),function(data){
								$("#resAttnxt").html(data);
								$("#resAttnxt").trigger('create');
								myInit();
								mPage('#resAttNxt');				
							});	
							break;

						case (myID==="AR"):
		//					alert($('#cal').text("course"));
							$.post(myWebHost+'myattreg.php',$('#cous').serialize(),function(data){
								$("#Attreg").html(data);
								$("#Attreg").trigger('create');
								myInit();
								mPage('#AttReg');				
							});	
							break;

						case (myID==="MYATTDB"):
							$.post(myWebHost+'myattbnxtstep.php',$('#Myatt').serialize(),function(data){
								$("#Attbnxt").html(data);
								$("#Attbnxt").trigger('create');
								myInit();
								mPage('#AttbNxt');				
							});		
							break;
						case (myID==="MYATTD"):
							$.post(myWebHost+'myattnxtstep.php',$('#Myatt').serialize(),function(data){
								$("#Attnxtstep").html(data);
								$("#Attnxtstep").trigger('create');
								myInit();
								mPage('#AttNxtStep');
							});		
							break;							
						case (myID==="PCR"):
							loadMyPage('',myWebHost+'myPCRcourses.php','#ndgeocontent','');
							mPage('#geoDistrict');
							break;
						case (myID==="PATT"):
							loadMyPage('',myWebHost+'myPatt.php','#nbgeocontent','');
							mPage('#geoBlock');
							break;
						case (myID==="FPWD"):
							loadMyPage('',myWebHost+'myFpwd.php','#nbgeocontent','');
							mPage('#geoBlock');
							break;
						case (myID==="PTT"):
							loadMyPage('',myWebHost+'myPTT.php','#mytimetable','');
							mPage('#timetable');
							break;
						case (myID==="PRES"):
							loadMyPage('',myWebHost+'myPRES.php','#nbgeocontent','');
							mPage('#geoBlock');
							break;
						case (myID==="PWRD"):
							loadMyPage('',myWebHost+'myPWRD.php?a=aut','#nsgeocontent','');
							mPage('#geolocation1');
							break;
						case (myID==="PSATT"):
							$.post(myWebHost+'myPSATT.php',$('#FRMATT').serialize(),function(data){
								$("#Attnxt").html(data);
								$("#Attnxt").trigger('create');
								myInit();
								mPage('#AttNxt');				
							});		
							break;							
						case (myID==="CPWD"):
							var pd=$('#chgpwd').val();
							var cpd=$('#cchgpwd').val();
//							alert(pd);
							if(pd===cpd){							
								$.post(myWebHost+'myCpwd.php',$('#CPWDF').serialize(),function(data){
									if(data.trim()==1){
										alert ("Password Changed Succesfully!");
										mPage('#pagelang');		
									}
								});		
							} else {
								alert ("Both Password do not match !")	;
								pd="";
								cpd="";
							}
							
							
							break;							
						case (myID==="PSRES"):
							var psres_yr=$('#psres_year').val();
							var psres_sem=$(".psres_sem:checked").val();
							if(psres_yr && psres_sem>0){
								$.post(myWebHost+'myPSRES.php',$('#FRMRES').serialize(),function(data){
									$("#Attnxt").html(data);
									$("#Attnxt").trigger('create');
									myInit();
									mPage('#AttNxt');				
								});		
							} else {
								if(!psres_yr){
									alert('Please provide Academic Year e.g for 2018-2019 enter 2018!!')	
								}
								if(!psres_sem){
									alert('Please provide Semester!!')	
								}
								
							}

							break;							
						case (myID==="PSTT"):
							$.post(myWebHost+'myPSTT.php',$('#FRMTT').serialize(),function(data){
								$("#Attnxt").html(data);
								$("#Attnxt").trigger('create');
								myInit();
								mPage('#AttNxt');				
							});		
							break;							
						case (myID==="PSCR"):
							var pscr_yr=$('#pscr_year').val();
							var pscr_sem=$(".pscr_sem:checked").val();
							if(pscr_yr && pscr_sem>0){
								$.post(myWebHost+'myPSCR.php',$('#FRMCR').serialize(),function(data){
									$("#Attnxt").html(data);
									$("#Attnxt").trigger('create');
									myInit();
									mPage('#AttNxt');				
								});	
							} else {
								if(!pscr_yr){
									alert('Please provide Academic Year e.g for 2018-2019 enter 2018!!')	
								}
								if(!pscr_sem){
									alert('Please provide Semester!!')	
								}
								
							}
							break;							

							

							
						default:
							break;
						}
						$.mobile.loading('hide');	
					});
				}
		});
	


