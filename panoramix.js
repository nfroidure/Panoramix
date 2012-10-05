var origGamma, origAlpha, origBeta, video, canvas, ctx, ecanvas, ectx, keepedAngle=0, keepedCountdown=5;

// Creating canvas for previsualization & exportation
ecanvas = document.createElement("canvas");
ecanvas.setAttribute('width',(640*8)+'px');
ecanvas.setAttribute('height',480+'px');
document.body.appendChild(ecanvas);
ectx= ecanvas.getContext('2d');
ectx.fillStyle = "#ffff00";
ectx.fillRect(0, 0, 8*640, 480);
ectx.fillStyle = "#fffff0";
ecanvas.setAttribute('style','width:'+(64*8)+'px;height:48px;position:absolute;z-index:3;bottom:0;right:0;');
// Creation a video element to display cam
video = document.createElement("video");
video.autoplay = true;
document.body.appendChild(video);
// Creating a canvas element to display cursors
canvas = document.createElement("canvas");
document.body.appendChild(canvas);
video.setAttribute('style','width:640px;height:480px;position:absolute;z-index:1;top:0;left:0;');
canvas.setAttribute('width','640px');
canvas.setAttribute('height','480px');
canvas.setAttribute('style','width:640px;height:480px;position:absolute;z-index:2;top:0;left:0;');
ctx= canvas.getContext('2d');

// Getting cam stream
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

navigator.getUserMedia({video: true}, function(localMediaStream) { 
  video.src = window.URL.createObjectURL(localMediaStream);
  //video.src = localMediaStream;
  ctx.fillStyle = "#ffffff";
  ctx.globalAlpha=0.5;
  ctx.fillRect(300,230,40,20);
  ctx.fillRect(0,239,640,2);
}, function(error) {
  console.log(error);
});

// Getting device orientation
window.addEventListener('deviceorientation', function(e)
	{
	if(ctx)
		{
		ctx.clearRect(0,0,640,480);
		var portrait=(window.matchMedia&&window.matchMedia('(orientation: portrait)').matches);
		ctx.fillStyle = "#ccc";
		ctx.globalAlpha=1;
		ctx.fillRect(295,225,50,30);
		ctx.globalAlpha=0.5;
		ctx.fillRect(0,239,640,2);
		 ctx.fillStyle = "#000";
		if(!origGamma)
			{
			origGamma=e.gamma;
			origBeta=e.beta;
			origAlpha=e.alpha;
			}
		
		/* Setting the cursor position */
		var pos=(640*(e.alpha/360));
		if(portrait)
			{
			var x=320+(320*(e.gamma/90)); // crap
			var y=240+(240*((Math.abs(e.beta)-90)/90)); // crap
			}
		else
			{
			var x=320+(Math.abs(e.beta)>90?(320*((180-Math.abs(e.beta))/180)):(320*((e.beta)/90))); // crap
			var y=240+(240*(1-(Math.abs(e.gamma)/90))); // crap
			}
		/* Debug : printing cursor positions *
		ctx.fillStyle = '#000000';
		ctx.font='15px Arial';
		ctx.textBaseline='top';
		ctx.textAlign='left';
		ctx.fillText((portrait?'portrait':'landscape')+'('+Math.round(x)+','+Math.round(y)+':'+Math.round(e.beta)+','+Math.round(e.gamma)+')',10, 10,300);
		/* Debug : printing angle */
		ctx.fillStyle = '#000000';
		ctx.textBaseline='top';
		ctx.textAlign='left';
		ctx.font='30px Arial';
		ctx.fillText(Math.round(e.alpha),10, 10,300);
		/* Setting the cursor look */
		if(Math.round(e.alpha)%45>=40||Math.round(e.alpha)%45<=5) // Angle is ok
			{
			if(
				((!portrait)&&(Math.abs(Math.round(e.beta))>=160||Math.abs(Math.round(e.beta))<=20)
					&&(Math.abs(Math.round(e.gamma))>=70))
				||(portrait&&(Math.abs(Math.round(e.beta))>=160||Math.abs(Math.round(e.beta))<=20)
					&&(Math.abs(Math.round(e.gamma))>=70))
				) // Orientation is ok
				{
				ctx.fillStyle = '#00FF00';
				if(keepedAngle==parseInt(Math.round(e.alpha)/45))
					{ keepedCountdown--; }
				else
					{ keepedAngle=parseInt(Math.round(e.alpha)/45); keepedCountdown=5; }
				if(keepedCountdown<=0) // Keeped position enought time
					{
					keepedCountdown=5;
					ectx.drawImage(video, 0, 0, 640, 480, parseInt(Math.round(e.alpha)/45)*640, 0, 640, 480);
					}
				}
			else
				{
				keepedCountdown=5;
				ctx.fillStyle = '#FFFF00';
				}
			}
		else
			{
			keepedCountdown=5;
			ctx.fillStyle = '#FF0000';
			}
		ctx.globalAlpha=0.8;
		ctx.fillRect(Math.round(x)-20,Math.round(y)-10,40,20);
		ctx.globalAlpha=1;
		ctx.fillStyle = '#000';
		ctx.font='30px Arial';
		ctx.textBaseline='middle';
		ctx.textAlign='center';
		ctx.fillText((keepedCountdown<5?keepedCountdown:'X'),320, 240,200, 40);
		}
	}, true);