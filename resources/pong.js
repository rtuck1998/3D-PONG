 /*
 * Final Assignment / Capstone Project
 *
 * See more information in the 
 * Final_Assignment_Document.pdf
 *
 * Stephen Walsh 201317674
 * Ryan Tuck 201609104
 *
 */

"use strict";

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  gl.clearColor(1, 1, 1, 1.0);  // Clear to black, fully opaque
  
  const textureProgramInfo = webglUtils.createProgramInfo(gl, ['vertex-shader-3d', 'fragment-shader-3d']);
  
  // creates buffers with position, normal, texcoord, and vertex color
  // data for primitives by calling gl.createBuffer, gl.bindBuffer,
  // and gl.bufferData
  const sphereBufferInfo = primitives.createSphereWithVertexColorsBufferInfo(gl, 2, 12, 6);
  //const sphereBufferInfo2 = primitives.createSphereWithVertexColorsBufferInfo(gl, 0.5, 12, 6);
  const cube1BufferInfo   = primitives.createCubeWithVertexColorsBufferInfo(gl, 10);
  const cube2BufferInfo  = primitives.createCubeWithVertexColorsBufferInfo(gl, 10);

  
  
  // setup GLSL program
  var programInfo = webglUtils.createProgramInfo(gl, ["vertex-shader-3d", "fragment-shader-3d"]);

  
  // make a pong texture
  const PongTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, PongTexture);
  gl.texImage2D(
      gl.TEXTURE_2D,
      0,                // mip level
      gl.LUMINANCE,     // internal format
      8,                // width
      8,                // height
      0,                // border
      gl.LUMINANCE,     // format
      gl.UNSIGNED_BYTE, // type
      new Uint8Array([  // data
        0xBB, 0xC0, 0xFF, 0xFF, 0xFF, 0xFF, 0xC0, 0xBB,
        0xBB, 0xC0, 0xFF, 0xFF, 0xFF, 0xFF, 0xC0, 0xBB,
        0xBB, 0xC0, 0xFF, 0xFF, 0xFF, 0xFF, 0xC0, 0xBB,
        0xBB, 0xC0, 0xFF, 0xFF, 0xFF, 0xFF, 0xC0, 0xBB,
        0xBB, 0xC0, 0xFF, 0xFF, 0xFF, 0xFF, 0xC0, 0xBB,
        0xBB, 0xC0, 0xFF, 0xFF, 0xFF, 0xFF, 0xC0, 0xBB,
        0xBB, 0xC0, 0xFF, 0xFF, 0xFF, 0xFF, 0xC0, 0xBB,
        0xBB, 0xC0, 0xFF, 0xFF, 0xFF, 0xFF, 0xC0, 0xBB,
      ]));
  gl.generateMipmap(gl.TEXTURE_2D);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);  
  
 
  
  
  
  
  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var cameraAngleRadians = degToRad(0);
  var fieldOfViewRadians = degToRad(60);
  var cameraHeight = 50;
  var p1score = 0;
  var p2score = 0;
  document.getElementById("p1score").innerHTML = p1score;
  document.getElementById("p2score").innerHTML = p2score;
  var alerts = true;

  // Uniforms for each object.
  var sphereCol = Math.random();
  var sphereUniforms = {
    u_colorMult: [1, 1, 1, 1],
    u_matrix: m4.identity(),

  };
  var sphereUniforms2 = {
    u_colorMult: [Math.random(), Math.random(), Math.random(), 1],
    u_matrix: m4.identity(),

  };
  var cube1Uniforms = {
    u_colorMult: [Math.random(), Math.random(), Math.random(), 1],
    u_matrix: m4.identity(),
	u_texture: PongTexture,
  };
  var cube2Uniforms = {
    u_colorMult: [Math.random(), Math.random(), Math.random(), 1],
    u_matrix: m4.identity(),
	u_texture: PongTexture,
  };
  var sphereTranslation = [  0, 0, 0];
  var sphereTranslation2 = [  0, 0, 0];
  var cube1Translation   = [-52, 0, 0];
  var cube2Translation   = [ 52, 0, 0];
 
  var sphereScale = [ 1, 1, 1];
  var sphereScale2 = [ 1, 1, 1];
  var cube1Scale   = [0.25, 3, 0.25];
  var cube2Scale  = [0.25, 3, 0.25];
 


 
 
 
  function computeMatrix(viewProjectionMatrix, translation, xRotation, yRotation, scale) {
	
	//Update pos1 and pos2
	cube1Translation   = [-52, p1_pos, p1_pos_z];  
	cube2Translation   = [52, p2_pos, p2_pos_z]; 
	sphereTranslation = [ball_x, ball_y, 0]; 
	sphereTranslation2 = [ball_x - 3, ball_y, ball_z]; 
	 
	 

	 document.getElementById( "Alert" ).onclick = function () {
        alertsOn = false;
    };
	
	document.getElementById( "Alert2" ).onclick = function () {
        alertsOn = true;
    };
	 
	if(ball_x >= 55 || ball_x <= -55){ // reset pos
		if(ball_x >= 55) {
			p1score = p1score + 1;
			if (alertsOn) {
			alert("Player 1: " + p1score + " (+1)");
			}
			document.getElementById("p1score").innerHTML = p1score;
		}
		if(ball_x <= -55) {
			p2score = p2score + 1;
			if (alertsOn) {
			alert("Player 2: " + p2score + " (+1)");
			}
			document.getElementById("p2score").innerHTML = p2score;
		}
		ball_x = 0; ball_y = 0;
		} 
	 
	
	
	
	
	
	if(ball_x <= -50 && ball_y <= p1_top && ball_y >= p1_bottom && p1_pos_z < 2 && p1_pos_z > -2){ 
		speed_y = speed_y; 
		speed_x = -speed_x; 
		ball_x = ball_x + 2;
		impact.play();
	
	}
	if(ball_x >= 50 && ball_y <= p2_top && ball_y >= p2_bottom && p2_pos_z < 2 && p2_pos_z > -2){ 
		speed_y = speed_y; 
		speed_x = -speed_x; 
		ball_x = ball_x - 2;
		impact.play();
	
	}
	
	
	if(ball_y >= 50 || ball_y <= -50){
		speed_y = -speed_y;
		ball_y = ball_y - speed_y;
	} // Bounce off top and bottom walls
	
	
	
	document.getElementById( "SpeedBall" ).onclick = function () {
        speed_x *= 1.5;
		speed_y *= 1.5;
    };
	
	document.getElementById( "SpeedPlayer" ).onclick = function () {
        speed_player *= 1.5;
    };
	
	document.getElementById( "SlowBall" ).onclick = function () {
        speed_x /= 1.5;
		speed_y /= 1.5;
    };
	
	document.getElementById( "SlowPlayer" ).onclick = function () {
        speed_player /= 1.5;
    };
	
	document.getElementById( "Width" ).onclick = function () {
		zoomX += zoomChange;
		zoom += zoomChange;
		if (zoom > 151) {
			zoomChange = -zoomChange;
		}
		if (zoom < 0) {
			zoomChange = -zoomChange;
		}
    };
	
	document.getElementById( "Height" ).onclick = function () {
        zoomX -= zoomChange;
		zoom -= zoomChange;
		if (zoom > 151) {
			zoomChange = -zoomChange;
		}
		if (zoom < 0) {
			zoomChange = -zoomChange;
		}
    };
	
	document.getElementById( "Width2" ).onclick = function () {
        zoomY += zoomChange;
		zoom += zoomChange;
		if (zoom > 151) {
			zoomChange = -zoomChange;
		}
		if (zoom < 0) {
			zoomChange = -zoomChange;
		}
    };
	
	document.getElementById( "Height2" ).onclick = function () {
        zoomY -= zoomChange;
		zoom -= zoomChange;
		if (zoom > 151) {
			zoomChange = -zoomChange;
		}
		if (zoom < 0) {
			zoomChange = -zoomChange;
		}
    };
	
	
	
	 



	 
	 
    var matrix = m4.translate(viewProjectionMatrix,
        translation[0],
        translation[1],
        translation[2]);
    //matrix = m4.xRotate(matrix, xRotation);
	//console.log(p1_pos);
	matrix = m4.scale(matrix,
        scale[0],
        scale[1],
        scale[2]);


    return m4.yRotate(matrix, yRotation);
  }

  requestAnimationFrame(drawScene);

  // Draw the scene.
  function drawScene(time) {
    time *= 0.0005;

    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    // Clear the canvas AND the depth buffer.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Compute the projection matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    var projectionMatrix =
        m4.perspective(fieldOfViewRadians, aspect, 1, 2000);

    // Compute the camera's matrix using look at.
    var cameraPosition = [zoomX, zoomY, zoom];
    var target = [0, 0, 0];
    var up = [0, 1, 0];
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    var sphereXRotation =  time;
    var sphereYRotation =  time;
	var sphereXRotation2 =  time;
    var sphereYRotation2 =  time;
    var cube1XRotation   = -time;
    var cube1YRotation   =  time;
    var cube2XRotation   =  time;
    var cube2YRotation   = -time;
	ball_x = ball_x - -speed_x;
	ball_y = ball_y - speed_y/2;
	ball_z = time/3;
	p1_top = p1_pos + 15;
	p1_bottom = p1_pos - 15;
	
	p2_top = p2_pos + 15;
	p2_bottom = p2_pos - 15;
	
  window.onkeydown = function (event) { // Starts/Stops animation
		var key = String.fromCharCode(event.keyCode);
		switch (event.keyCode) {
			case 87: //"Player 1 Up"
				if(p1_pos <= 42)p1_pos += speed_player;
				//console.log(p1_pos);
			break;
			case 83: //"Player 1 Down"
				if(p1_pos >= -42)p1_pos -= speed_player;
				//console.log(p1_pos);
			break;
			case 65: //"Player 1 Out"
				p1_pos_z += speed_player;
			break;
			case 68: //"Player 1 In"
				p1_pos_z -= speed_player;
			break;
			case 73: //"Player 2 Up"
				if(p2_pos <= 42)p2_pos += speed_player;
				//console.log(p1_pos);
			break;
			case 75: //"Player 2 Down"
				if(p2_pos >= -42)p2_pos -= speed_player;
				//console.log(p1_pos);
			break;
			case 74: //"Player 2 Out"
				p2_pos_z += speed_player;
			break;
			case 76: //"Player 2 In"
				p2_pos_z -= speed_player;
			break;
		
		}
	}	
	
    // ------ Draw the sphere --------

    gl.useProgram(programInfo.program);

    // Setup all the needed attributes.
    webglUtils.setBuffersAndAttributes(gl, programInfo, sphereBufferInfo);

    sphereUniforms.u_matrix = computeMatrix(
        viewProjectionMatrix,
        sphereTranslation,
        sphereXRotation,
        sphereYRotation,
		sphereScale);

    // Set the uniforms we just computed
    webglUtils.setUniforms(programInfo, sphereUniforms);

    gl.drawArrays(gl.TRIANGLES, 0, sphereBufferInfo.numElements);
	
	/**webglUtils.setBuffersAndAttributes(gl, programInfo, sphereBufferInfo2);

    sphereUniforms2.u_matrix = computeMatrix(
        viewProjectionMatrix,
        sphereTranslation2,
        sphereXRotation2,
        sphereYRotation2,
		sphereScale2);

    // Set the uniforms we just computed
    webglUtils.setUniforms(programInfo, sphereUniforms2);

    gl.drawArrays(gl.TRIANGLES, 0, sphereBufferInfo2.numElements);**/

    // ------ Draw the cube1 --------

    // Setup all the needed attributes.
    webglUtils.setBuffersAndAttributes(gl, programInfo, cube1BufferInfo);

    cube1Uniforms.u_matrix = computeMatrix(
        viewProjectionMatrix,
        cube1Translation,
        cube1XRotation,
        cube1YRotation,
		cube1Scale);

    // Set the uniforms we just computed
    webglUtils.setUniforms(programInfo, cube1Uniforms);

    gl.drawArrays(gl.TRIANGLES, 0, cube1BufferInfo.numElements);

    // ------ Draw the cube2 --------

    // Setup all the needed attributes.
    webglUtils.setBuffersAndAttributes(gl, programInfo, cube2BufferInfo);

    cube2Uniforms.u_matrix = computeMatrix(
        viewProjectionMatrix,
        cube2Translation,
        cube2XRotation,
        cube2YRotation,
		cube2Scale);

    // Set the uniforms we just computed
	

	
    webglUtils.setUniforms(programInfo, cube2Uniforms);

    gl.drawArrays(gl.TRIANGLES, 0, cube2BufferInfo.numElements);

    requestAnimationFrame(drawScene);
  }
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "anonymous");
    this.sound.setAttribute("controls", "anonymous");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}

var p1_pos = 0.0;
var p2_pos = 0.0;
var p1_pos_z = 0.0;
var p2_pos_z = 0.0;

var p1_top = 0.0;
var p1_bottom = 0.0;

var p2_top = 0.0;
var p2_bottom = 0.0;

var wide = 1;
var tall = 1;
var zoom = 100;
var zoomX = 0;
var zoomY = 0;
var zoomChange = 1.1;

var ball_x = 0.0;
var ball_y = 0.0;
var ball2_x = 0.0;
var ball2_y = 0.0;
var ball_z = 0.0;
var speed_x = -0.4;
var speed_y = -0.4;
var speed_player = 1.5;
var background_col = 0;
var alertsOn = false;

var impact = new sound("hit.mp3");

document.getElementById( "start" ).onclick = function () {
        main();
    };