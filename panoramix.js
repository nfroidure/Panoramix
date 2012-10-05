
var vOrientationTolerance=20, hOrientationTolerance=10, angleTolerance=10, numFrames=10, sizeX=(window.innerHeight/3>window.innerWidth/4?window.innerWidth:window.innerHeight/3*4), sizeY=(window.innerHeight/3<window.innerWidth/4?window.innerHeight:window.innerHeight/4*3), initialCountDown=5, cursorW=40, cursorH=20;
var origGamma, origAlpha, origBeta, video, canvas, ctx, ecanvas, ectx, keepedAngle=0, keepedCountdown=initialCountDown, anglePace=Math.ceil(360/numFrames);

// Creating canvas for previsualization & exportation
ecanvas = document.createElement("canvas");
ecanvas.setAttribute('width',(sizeX*numFrames)+'px');
ecanvas.setAttribute('height',sizeY+'px');
document.body.appendChild(ecanvas);
ectx= ecanvas.getContext('2d');
ectx.fillStyle = "#CCC";
ectx.fillRect(0, 0, numFrames*sizeX, sizeY);
ectx.fillStyle = "#fffff0";
ecanvas.setAttribute('style','width:'+sizeX+'px;height:'+Math.round(sizeY/numFrames)+'px;position:absolute;z-index:3;bottom:0;left:0;');
// Creation a video element to display camera stream
video = document.createElement("video");
video.autoplay = true;
video.setAttribute('style','width:'+sizeX+'px;height:'+sizeY+'px;position:absolute;z-index:1;top:0;left:0;');
document.body.appendChild(video);
// Creating a canvas element to display orientation helpers
canvas = document.createElement("canvas");
document.body.appendChild(canvas);
canvas.setAttribute('width',sizeX+'px');
canvas.setAttribute('height',sizeY+'px');
canvas.setAttribute('style','width:'+sizeX+'px;height:'+sizeY+'px;position:absolute;z-index:2;top:0;left:0;');
ctx= canvas.getContext('2d');

// Getting cam stream
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL;

if(navigator.getUserMedia)
	{
	navigator.getUserMedia({video: true}, function(localMediaStream)
		{
		video.src = window.URL.createObjectURL(localMediaStream);
		}, function(error)
		{
		console.log(error);
		});
	}

// Getting device orientation
window.addEventListener('deviceorientation', function(e)
	{
	if(ctx)
		{
		ctx.clearRect(0,0,sizeX,sizeY);
		var portrait=(window.matchMedia&&window.matchMedia('(orientation: portrait)').matches);
		  ctx.fillStyle = "#CCC";
		  ctx.globalAlpha=1;
		  ctx.fillRect((sizeX/2)-((cursorW+hOrientationTolerance)/2),(sizeY/2)-((cursorH+vOrientationTolerance)/2),cursorW+hOrientationTolerance,cursorH+vOrientationTolerance);
		  ctx.fillRect(0,(sizeY/2)-1,sizeX,2);
		if(!origGamma)
			{
			origGamma=e.gamma;
			origBeta=e.beta;
			origAlpha=e.alpha;
			}
		
		/* Setting the cursor position */
		//var pos=(sizeX*(e.alpha/360));
		if(portrait)
			{
			var x=(sizeX/2)+((sizeX/2)*(e.gamma/90)); // crap
			var y=(sizeY/2)+((sizeY/2)*((Math.abs(e.beta)-90)/90)); // crap
			}
		else
			{
			var x=(sizeX/2)+(Math.abs(e.beta)>90?((sizeX/2)*((180-Math.abs(e.beta))/180)):((sizeX/2)*((e.beta)/90))); // crap
			var y=(sizeY/2)+((sizeY/2)*(1-(Math.abs(e.gamma)/90))); // crap
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
		ctx.textAlign='center';
		ctx.font='30px Arial';
		ctx.fillText(Math.round(e.alpha),(sizeY/2), 0);
		/* Setting the cursor look */
		var angleOk=false, orientOk=false;
		if(Math.round(e.alpha)%anglePace>=(anglePace-(angleTolerance/2))
			||Math.round(e.alpha)%anglePace<=(angleTolerance/2)) // Angle is ok
			angleOk=true;
		if(
			((!portrait)&&(Math.abs(Math.round(e.beta))>=180-(vOrientationTolerance/2)
					||Math.abs(Math.round(e.beta))<=vOrientationTolerance/2)
				&&(Math.abs(Math.round(e.gamma))>=90-(vOrientationTolerance/2)))
			||(portrait&&(Math.abs(Math.round(e.beta))>=180-(vOrientationTolerance/2)
					||Math.abs(Math.round(e.beta))<=vOrientationTolerance/2)
				&&(Math.abs(Math.round(e.gamma))>=90-(vOrientationTolerance/2)))
			) // Orientation is ok
			orientOk=true;
		if(angleOk&&orientOk)
			{
			ctx.fillStyle = '#00FF00';
			if(keepedAngle==parseInt(Math.round(e.alpha)/anglePace))
				{ keepedCountdown--; }
			else
				{ keepedAngle=parseInt(Math.round(e.alpha)/anglePace); keepedCountdown=initialCountDown; }
			if(keepedCountdown<=0) // Keeped position enought times
				{
				keepedCountdown=initialCountDown;
				ectx.drawImage(video, 0, 0, sizeX, sizeY, parseInt(Math.round(e.alpha)/anglePace)*sizeX, 0, sizeX, sizeY);
				}
			}
		else
			{
			keepedCountdown=initialCountDown;
			if(orientOk)
				ctx.fillStyle = '#FFFF00';
			else if(angleOk)
				ctx.fillStyle = '#FF0000';
			else
				ctx.fillStyle = '#000000';
			}
		ctx.globalAlpha=0.8;
		ctx.fillRect(Math.round(x)-(cursorW/2),Math.round(y)-(cursorH/2),cursorW,cursorH);
		ctx.globalAlpha=1;
		ctx.fillStyle = '#000';
		ctx.font='30px Arial';
		ctx.textBaseline='middle';
		ctx.textAlign='center';
		ctx.fillText((keepedCountdown<initialCountDown?keepedCountdown:'X'),sizeX/2, sizeY/2,200, 40);
		}
	}, true);