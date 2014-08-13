//Desarrollado por Daniel Xutuc (dahngeek)
//twitter: @dahngeek
//Website: dahngeek.com
//Iniciamos el Sistema.
//Estado Caja es para saber si está extendido u oculta la caja de información.

var estadocaja = true;
jQuery(document).ready(function($){
	$("#masinfo").click(function(){
		var estadocaja = true;
		$(this).fadeOut("slow");
		$("#contenido").delay(900).slideDown();
	});
	$("#cierra").click(function(){
		var estadocaja = false;
		$("#contenido").slideUp();
		$("#masinfo").delay(900).fadeIn("slow");
	});
});
require([], function(){
	// detect WebGL
	if( !Detector.webgl ){
		Detector.addGetWebGLMessage();
		throw 'WebGL No disponible'
	} 
	// poner el WebGL a pagina completa
	var renderer	= new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	// iniciar la Escena y una camara
	var scene	= new THREE.Scene();
	//PerspectiveCamera( fov (alto de vista), aspect, near, far )
	var camera	= new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.00001, 10);
	camera.position.z = 0.02;

	// declare the rendering loop
	var onRenderFcts= [];

	// handle window resize events
	var winResize	= new THREEx.WindowResize(renderer, camera)

	//////////////////////////////////////////////////////////////////////////////////
	//		default 3 points lightning					//
	//////////////////////////////////////////////////////////////////////////////////
	
	var ambientLight= new THREE.AmbientLight( 0xfefefe )
	scene.add( ambientLight)
	var frontLight	= new THREE.DirectionalLight('white', 1)
	frontLight.position.set(-0.5, -0.5, -2)
	frontLight.castShadow = true;
	//frontLight.shadowCameraVisible = true;
	scene.add( frontLight )
	var backLight	= new THREE.DirectionalLight('black', 0.35)
	backLight.position.set(0.5, 0.5, 2)
	scene.add( backLight )		

	//scene.add( light );	
	//FONDO////////////////////////////////////////////////777
	//////////////////////////////////////////////////////////
	//universo
		var geometry  = new THREE.SphereGeometry(4, 32, 32)
		// Creamos el material el universo
		var material  = new THREE.MeshBasicMaterial()
		material.map   = THREE.ImageUtils.loadTexture('img/estrellas/galaxies.jpg')
		material.side  = THREE.BackSide;
		material.opacity = 0.3;
		material.transparent = true;
		material.wrapS = material.wrapT = THREE.RepeatWrapping;
		//Crear el mesh :D
		var mesh  = new THREE.Mesh(geometry, material)
		scene.add(mesh);
	//Estrellas
		var geometryStars  = new THREE.SphereGeometry(3, 32, 32)
		// Creamos el material las estrellas
		var materialStars  = new THREE.MeshBasicMaterial()
		materialStars.map   = THREE.ImageUtils.loadTexture('img/estrellas/stars-transparent.png')
		materialStars.transparent = true
		materialStars.opacity = 0.5
		materialStars.side  = THREE.BackSide
		materialStars.wrapS = materialStars.wrapT = THREE.RepeatWrapping;
		//Crear el mesh :D
		var meshEstrellas  = new THREE.Mesh(geometryStars, materialStars)
		scene.add(meshEstrellas);

	//////////////////////////////////////////////////////////////////////////////////
	//		Planetas funciones				//
	//////////////////////////////////////////////////////////////////////////////////

	////////sol
		var geometriaSol   = new THREE.SphereGeometry(0.009284075, 32, 32);
		var materialSol  = new THREE.MeshPhongMaterial();
		var solMesh = new THREE.Mesh(geometriaSol,materialSol);
		materialSol.map = THREE.ImageUtils.loadTexture('img/sol/preview_sun.jpg');
		solMesh.position.x = 0;
		solMesh.position.y = 0;
		scene.add(solMesh);
	
	
	////////tierra
		var geometry   = new THREE.SphereGeometry(0.000425, 32, 32);
		var material  = new THREE.MeshPhongMaterial();
		var earthMesh = new THREE.Mesh(geometry, material);
		material.map = THREE.ImageUtils.loadTexture('img/tierra/earthmap1k.jpg');
		material.bumpMap    = THREE.ImageUtils.loadTexture('img/tierra/earthbump1k.jpg');
		material.bumpScale = 0.0001;
		material.specularMap    = THREE.ImageUtils.loadTexture('img/tierra/earthspec1k.jpg');
		material.specular  = new THREE.Color('grey');
		t = Math.PI/180 * 2;
		earthMesh.position.x = 0.0167+0.9994*Math.cos(t/1.000);
		earthMesh.castShadow = true;
		earthMesh.receiveShadow  = true;
		scene.add(earthMesh);
			/*creamos las nubes*/
			//Creamos el canvas que extrae las iamgenes para sacar transparencia
			// create destination canvas
				var canvasResult	= document.createElement('canvas')
				canvasResult.width	= 1024
				canvasResult.height	= 512
				var contextResult	= canvasResult.getContext('2d')		

				// load earthcloudmap
				var imageMap	= new Image();
				imageMap.addEventListener("load", function() {

					// create dataMap ImageData for earthcloudmap
					var canvasMap	= document.createElement('canvas')
					canvasMap.width	= imageMap.width
					canvasMap.height= imageMap.height
					var contextMap	= canvasMap.getContext('2d')
					contextMap.drawImage(imageMap, 0, 0)
					var dataMap	= contextMap.getImageData(0, 0, canvasMap.width, canvasMap.height)

					// load earthcloudmaptrans
					var imageTrans	= new Image();
					imageTrans.addEventListener("load", function(){
						// create dataTrans ImageData for earthcloudmaptrans
						var canvasTrans		= document.createElement('canvas')
						canvasTrans.width	= imageTrans.width
						canvasTrans.height	= imageTrans.height
						var contextTrans	= canvasTrans.getContext('2d')
						contextTrans.drawImage(imageTrans, 0, 0)
						var dataTrans		= contextTrans.getImageData(0, 0, canvasTrans.width, canvasTrans.height)
						// merge dataMap + dataTrans into dataResult
						var dataResult		= contextMap.createImageData(canvasMap.width, canvasMap.height)
						for(var y = 0, offset = 0; y < imageMap.height; y++){
							for(var x = 0; x < imageMap.width; x++, offset += 4){
								dataResult.data[offset+0]	= dataMap.data[offset+0]
								dataResult.data[offset+1]	= dataMap.data[offset+1]
								dataResult.data[offset+2]	= dataMap.data[offset+2]
								dataResult.data[offset+3]	= 255 - dataTrans.data[offset+0]
							}
						}
						// update texture with result
						contextResult.putImageData(dataResult,0,0)	
						material.map.needsUpdate = true;
					})
					imageTrans.src	= 'img/tierra/earthcloudmap.jpg';
				}, false);
				imageMap.src	= 'img/tierra/earthcloudmap1.jpg';


			//Creamos la esfera superior es decir las nubes
			var geometry   = new THREE.SphereGeometry(0.0004479, 32, 32);
			var material  = new THREE.MeshPhongMaterial({
			  map     : new THREE.Texture(canvasResult),
			  side        : THREE.DoubleSide,
			  opacity     : 0.6,
			  transparent : true,
			  depthWrite  : false,
			  castShadow  : true,
			  receiveShadow : true,
			});
			var cloudMesh = new THREE.Mesh(geometry, material);
			earthMesh.add(cloudMesh);

	//Mercurio
	var geometriaMerc = new THREE.SphereGeometry(0.0003261
,32,32);
	var materialMerc = new THREE.MeshPhongMaterial();
	var meshMerc = new THREE.Mesh(geometriaMerc,materialMerc);
	materialMerc.map = THREE.ImageUtils.loadTexture('img/mercurio/mercurymap.jpg');
	materialMerc.bumpMap = THREE.ImageUtils.loadTexture('img/mercurio/mercurymap.jpg');
	materialMerc.bumpScale = 0.0003;
	meshMerc.position.x = 0.0796+0.3871*Math.cos(t);
	scene.add(meshMerc);

	//Venus
	var geometriaVenus	= new THREE.SphereGeometry(0.0008091, 32,32);
	var materialVenus = new THREE.MeshPhongMaterial();
	var venusMesh = new THREE.Mesh(geometriaVenus,materialVenus);
	materialVenus.map = THREE.ImageUtils.loadTexture('img/venus/venusmap.jpg');
	materialVenus.bumpMap = THREE.ImageUtils.loadTexture('img/venus/venusbump.jpg');
	materialVenus.bumpScale = 0.0001;
	venusMesh.position.x = 0.0049+0.7206*Math.cos(t/0.615)
	scene.add(venusMesh);

	//Marte
	var geometriaMarte = new THREE.SphereGeometry(0.0004514,32,32);
	var materialMarte = new THREE.MeshPhongMaterial();
	var marteMesh = new THREE.Mesh(geometriaMarte,materialMarte);
	materialMarte.map = THREE.ImageUtils.loadTexture('img/marte/mars_1k_color.jpg');
	materialMarte.bumpMap = THREE.ImageUtils.loadTexture('img/marte/mars_1k_topo.jpg');
	materialMarte.bumpScale = 0.0001;
	marteMesh.position.x = 0.1422+1.5239*Math.cos(t/1.881);
	scene.add(marteMesh);

	// Jupiter
	var geometriaJupiter = new THREE.SphereGeometry(0.0095473,32,32);
	var materialJupiter = new THREE.MeshPhongMaterial();
	var jupiterMesh = new THREE.Mesh(geometriaJupiter,materialJupiter);
	materialJupiter.map = THREE.ImageUtils.loadTexture('img/jupiter/jupitermap.jpg');
	jupiterMesh.position.x = 0.2538+5.2035*Math.cos(t/11.859);
	scene.add(jupiterMesh);

	//saturno
	var geometriaSaturno = new THREE.SphereGeometry(0.0080484,32,32);
	var materialSaturno = new THREE.MeshPhongMaterial();
	var saturnoMesh = new THREE.Mesh(geometriaSaturno,materialSaturno);
	materialSaturno.map = THREE.ImageUtils.loadTexture('img/saturno/saturnmap.jpg');
	saturnoMesh.position.x = 0.5339+9.5813*Math.cos(t/29.657);
	scene.add(saturnoMesh);

	var geometriaAnillo = new THREE.RingGeometry(0.00905, 0.01385,40);
	var materialAnillo = new THREE.MeshBasicMaterial();
	var meshAnillo = new THREE.Mesh(geometriaAnillo,materialAnillo);
	materialAnillo.map = THREE.ImageUtils.loadTexture('img/saturno/saturnoanillo.png ');
	meshAnillo.rotation.x = Math.PI/2.1;
	meshAnillo.rotation.z = Math.PI/2.1;
	meshAnillo.position.copy(saturnoMesh.position);
	scene.add(meshAnillo);

	//Urano ..  hahaha :D
	var geometriaUrano = new THREE.SphereGeometry(0.0034130,32,32);
	var materialUrano = new THREE.MeshBasicMaterial();
	materialUrano.map = THREE.ImageUtils.loadTexture('img/urano/uranus.jpg');
	var uranoMesh = new THREE.Mesh(geometriaUrano,materialUrano);
	uranoMesh.position.x = 0.8539+19.2296*Math.cos(t);
	scene.add(uranoMesh);

	var geometriaAnillo = new THREE.RingGeometry(0.00405, 0.00685,40);
	var materialAnilloUrano = new THREE.MeshBasicMaterial();
	var meshAnilloUrano = new THREE.Mesh(geometriaAnillo,materialAnilloUrano);
	materialAnilloUrano.map = THREE.ImageUtils.loadTexture('img/urano/uranoanillo.png');
	materialAnilloUrano.transparent = true;
	meshAnilloUrano.rotation.x = Math.PI/180;
	//meshAnilloUrano.rotation.z = Math.PI/180;
	meshAnilloUrano.position.copy(uranoMesh.position);
	scene.add(meshAnilloUrano);
	//Neptuno
	var geometriaNeptuno = new THREE.SphereGeometry(0.0001533,32,32);
	var materialNeptuno = new THREE.MeshBasicMaterial();
	materialNeptuno.map = THREE.ImageUtils.loadTexture('img/neptuno/neptunemap.jpg');
	var neptunoMesh = new THREE.Mesh(geometriaNeptuno , materialNeptuno);
	neptunoMesh.position.x = 0.3376+30.1045*Math.cos(t);
	scene.add(neptunoMesh);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////HAGAMOS LAS LINEAS DE CADA PLANETA? //////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		var resolucion = 3000;
		var size = 360 / resolucion;
/////////hagamos la linea de mercurio /////////
		materialLinea = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.5, blending: THREE.AdditiveBlending } );
		geometriaLinea = new THREE.Geometry();
			for ( var i = 0; i <= resolucion; i ++ ) {
					piradianes = ( i * size ) * Math.PI/180;
					posicix = 0.0796+0.3871*Math.cos(piradianes);
					posiciz = 0+0.3788*Math.sin(piradianes);
					geometriaLinea.vertices.push(new THREE.Vector3( posicix, 0, posiciz ));
			}
		linea = new THREE.Line(  geometriaLinea, materialLinea);
		scene.add(linea);
		//Linea Venus
		materialLinea = new THREE.LineBasicMaterial( { color: 0x00cc00, opacity: 0.5, blending: THREE.AdditiveBlending } );
		geometriaLinea = new THREE.Geometry();
			for ( var i = 0; i <= resolucion; i ++ ) {
					piradianes = ( i * size ) * Math.PI/180;
					posicix = 0.0049+0.7206*Math.cos(piradianes);
					posiciz = 0+0.7206*Math.sin(piradianes);
					geometriaLinea.vertices.push(new THREE.Vector3( posicix, 0, posiciz ));
			}
		linea = new THREE.Line(  geometriaLinea, materialLinea);
		scene.add(linea);
		//Linea Tierra
		materialLinea = new THREE.LineBasicMaterial( { color: 0x47d4ff, opacity: 0.5, blending: THREE.AdditiveBlending } );
		geometriaLinea = new THREE.Geometry();
			for ( var i = 0; i <= resolucion; i ++ ) {
					piradianes = ( i * size ) * Math.PI/180;
					posicix = 0.0167+0.9994*Math.cos(piradianes);
					posiciz = 0+0.9993*Math.sin(piradianes);
					geometriaLinea.vertices.push(new THREE.Vector3( posicix, 0, posiciz ));
			}
		linea = new THREE.Line(  geometriaLinea, materialLinea);
		scene.add(linea);
		//Linea Marte
		materialLinea = new THREE.LineBasicMaterial( { color: 0xff6347, opacity: 0.5, blending: THREE.AdditiveBlending } );
		geometriaLinea = new THREE.Geometry();
			for ( var i = 0; i <= resolucion; i ++ ) {
					piradianes = ( i * size ) * Math.PI/180;
					posicix = 0.1422+1.5239*Math.cos(piradianes);
					posiciz = 0+1.5173*Math.sin(piradianes);
					geometriaLinea.vertices.push(new THREE.Vector3( posicix, 0, posiciz ));
			}
		linea = new THREE.Line(  geometriaLinea, materialLinea);
		scene.add(linea);
				//Linea Jupiter
		materialLinea = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 0.5, blending: THREE.AdditiveBlending } );
		geometriaLinea = new THREE.Geometry();
			for ( var i = 0; i <= resolucion; i ++ ) {
					piradianes = ( i * size ) * Math.PI/180;
					posicix = 0.2538+5.2035*Math.cos(piradianes);
					posiciz = 0+5.1973*Math.sin(piradianes);
					geometriaLinea.vertices.push(new THREE.Vector3( posicix, 0, posiciz ));
			}
		linea = new THREE.Line(  geometriaLinea, materialLinea);
		scene.add(linea);
				//Linea Saturno
		materialLinea = new THREE.LineBasicMaterial( { color: 0x00cc00, opacity: 0.5, blending: THREE.AdditiveBlending } );
		geometriaLinea = new THREE.Geometry();
			for ( var i = 0; i <= resolucion; i ++ ) {
					piradianes = ( i * size ) * Math.PI/180;
					posicix = 0.5339+9.5813*Math.cos(piradianes);
					posiciz = 0+9.5664*Math.sin(piradianes);
					geometriaLinea.vertices.push(new THREE.Vector3( posicix, 0, posiciz ));
			}
		linea = new THREE.Line(  geometriaLinea, materialLinea);
		scene.add(linea);
						//Linea Urano
		materialLinea = new THREE.LineBasicMaterial( { color: 0x47d4ff, opacity: 0.5, blending: THREE.AdditiveBlending } );
		geometriaLinea = new THREE.Geometry();
			for ( var i = 0; i <= resolucion; i ++ ) {
					piradianes = ( i * size ) * Math.PI/180;
					posicix = 0.8539+19.2296*Math.cos(piradianes);
					posiciz = 0+19.2106*Math.sin(piradianes);
					geometriaLinea.vertices.push(new THREE.Vector3( posicix, 0, posiciz ));
			}
		linea = new THREE.Line(  geometriaLinea, materialLinea);
		scene.add(linea);
						//Linea Neptuno
		materialLinea = new THREE.LineBasicMaterial( { color: 0xff6347, opacity: 0.5, blending: THREE.AdditiveBlending } );
		geometriaLinea = new THREE.Geometry();
			for ( var i = 0; i <= resolucion; i ++ ) {
					piradianes = ( i * size ) * Math.PI/180;
					posicix =0.3376+30.1045*Math.cos(piradianes);
					posiciz = 0+30.1026*Math.sin(piradianes);
					geometriaLinea.vertices.push(new THREE.Vector3( posicix, 0, posiciz ));
			}
		linea = new THREE.Line(  geometriaLinea, materialLinea);
		scene.add(linea);

	//////////////////////////////////////////////////////////////////////////////////
	//		ANIMACIÓNES	de rotación!!!!!!			//
	//////////////////////////////////////////////////////////////////////////////////	
	
	onRenderFcts.push(function(delta, now){
		//tierra = 1/32
		earthMesh.rotation.y += 2 * delta;
		cloudMesh.rotation.y += 1 * delta;	
		//sol	
		solMesh.rotation.y += 0.07984 * delta;
		//mercurio
		meshMerc.rotation.y += 0.03410 * delta;
		//venus
		venusMesh.rotation.y += 0.00823*delta;
		//marte
		marteMesh.rotation.y += 1.94940*delta;
		//jupiter
		jupiterMesh.rotation.y += 4.83676*delta;
		//saturno
		saturnoMesh.rotation.y += 4.55581*delta;
		//urano
		uranoMesh.rotation.y += 2.78424*delta;
		//Neptuno
		neptunoMesh.rotation.y += 2.97929*delta;
	})
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Camera Controls							//
	//////////////////////////////////////////////////////////////////////////////////
	var mouse	= {x : 0, y : 0};
	document.addEventListener('mousemove', function(event){
		mouse.x	= (event.clientX / window.innerWidth ) - 0.5
		mouse.y	= (event.clientY / window.innerHeight) - 0.5
	}, false);
	////////////  DEFINIMOS LOS  DE ZOOM  /////////////////////////
	var camaraaaz = camera.position.z;
	document.getElementById('zoommas').addEventListener('click',function() {
			camaraaaz = camera.position.z - 0.001;
	},false);
document.getElementById('zoommenos').addEventListener('click',function() {
				camaraaaz = camera.position.z + 0.001;
	},false);
//en el eje Y
	var camaraaay = camera.position.y;
	document.getElementById('masy').addEventListener('click',function() {
			camaraaay = camera.position.y - 0.001;
	},false);
document.getElementById('menosy').addEventListener('click',function() {
				camaraaay = camera.position.y + 0.001;
	},false);
	//////////   DEFINIMOS LOS DE PLANETAS ////////////
	document.addEventListener( 'keydown', function ( event ) {
				switch ( event.keyCode ) {

					case 8: // prevent browser back 
						event.preventDefault();
						break;
					case 77:
						camaraaaz = camera.position.z - 0.001;
						console.log("maszoom");
						break;
					case 78:
						camaraaaz = camera.position.z + 0.001;
						break;
					case 38:
						camaraaay = camera.position.y + 0.001;
						break;
					case 40:
						camaraaay = camera.position.y - 0.001;
						break;
					
				}

			} );
	/// fin teclas
	var planetaactivo = false;
	var planetaabuscar;
	document.getElementById('tierra').addEventListener('click',function() {
			planetaactivo = true;
			planetaabuscar = earthMesh;
			$(".planeta").fadeOut("slow");
			$("#contenido").slideUp();
			$("#TierraPl").delay(900).fadeIn("slow");
	},false);
	document.getElementById('sol').addEventListener('click',function() {
			planetaactivo = true;
			planetaabuscar = solMesh;
			$(".planeta").fadeOut("slow");
			$("#contenido").slideUp();
			$("#SolPl").delay(900).fadeIn("slow");
	},false);
	document.getElementById('mercurio').addEventListener('click',function() {
			planetaactivo = true;
			planetaabuscar = meshMerc;
			$(".planeta").fadeOut("slow");
			$("#contenido").slideUp();
			$("#MercurioPl").delay(900).fadeIn("slow");
	},false);
	document.getElementById('venus').addEventListener('click',function() {
			planetaactivo = true;
			planetaabuscar = venusMesh;
			$(".planeta").fadeOut("slow");
			$("#contenido").slideUp();
			$("#VenusPl").delay(900).fadeIn("slow");
	},false);
	document.getElementById('marte').addEventListener('click',function() {
			planetaactivo = true;
			planetaabuscar = marteMesh;
			$(".planeta").fadeOut("slow");
			$("#contenido").slideUp();
			$("#MartePl").delay(900).fadeIn("slow");
	},false);
	document.getElementById('jupiter').addEventListener('click',function() {
			planetaactivo = true;
			planetaabuscar = jupiterMesh;
			$(".planeta").fadeOut("slow");
			$("#contenido").slideUp();
			$("#JupiterPl").delay(900).fadeIn("slow");
	},false);
	document.getElementById('saturno').addEventListener('click',function() {
			planetaactivo = true;
			planetaabuscar = saturnoMesh;
			$(".planeta").fadeOut("slow");
			$("#contenido").slideUp();
			$("#SaturnoPl").delay(900).fadeIn("slow");
	},false);
	document.getElementById('urano').addEventListener('click',function() {
			planetaactivo = true;
			planetaabuscar = uranoMesh;
			$(".planeta").fadeOut("slow");
			$("#contenido").slideUp();
			$("#UranoPl").delay(900).fadeIn("slow");
	},false);
		document.getElementById('neptuno').addEventListener('click',function() {
			planetaactivo = true;
			planetaabuscar = neptunoMesh;
			$(".planeta").fadeOut("slow");
			$("#contenido").slideUp();
			$("#NeptunoPl").delay(900).fadeIn("slow");
	},false);

	
		console.log(solMesh.position);
	//camera.position.x = earthMesh.position.x;
		camera.position.x = scene.position.x;
		camera.position.y = 0.001;
		camera.lookAt( scene.position );

	var frenteluz = new THREE.Vector3( 0.5, 0.5, 0.2 );
	var backluz = new THREE.Vector3( 10.9, -0.5, -0.2 );

	onRenderFcts.push(function(delta, now){
		//camera.position.x += (mouse.x*0.5 - camera.position.x) * (delta*0.3)
		//camera.position.y += (mouse.y*0.5 - camera.position.y) * (delta*0.3)
		//console.log(camera.position);
		camera.position.z = camaraaaz;
		camera.position.y = camaraaay;
		if(planetaactivo) {
			mesh.position.copy(camera.position);
			meshEstrellas.position.copy(camera.position);
				var nuevovectorposfrente = new THREE.Vector3();
				nuevovectorposfrente.subVectors(planetaabuscar.position,backluz);
				var nuevovectorposatras = new THREE.Vector3();
				nuevovectorposatras.subVectors(planetaabuscar.position,frenteluz);
				frontLight.position.copy(nuevovectorposfrente);
				backLight.position.copy(nuevovectorposatras);
				//console.log(nuevovectorposfrente);
				var valorabs = Math.abs(planetaabuscar.position.x - camera.position.x);
				posicionpl = planetaabuscar.position.x;
				//console.log("pab pos:"+posicionpl+"cp:"+camera.position.x);
				if(valorabs < 0.01){
					camera.position.x = posicionpl;
					planetaactivo = false;
					if(estadocaja){
					$("#contenido").slideDown();} else {}
					//camera.position.z = camaraaaz;
					//console.log("estamos a a"+planetaabuscar);
				}else{
					if (camera.position.x < posicionpl){
						
						camera.position.x = camera.position.x + 0.01;
						//console.log(camera.position.x);
						//camera.position.z = 0;
						//console.log("yendo a"+planetaabuscar);
					} else {
						if (camera.position.x > posicionpl) {
							camera.position.x = camera.position.x-0.01;
							
						};
					}
				}
				camera.lookAt( planetaabuscar.position )
		}
	})

	//////////////////////////////////////////////////////////////////////////////////
	//		render the scene						//
	//////////////////////////////////////////////////////////////////////////////////
	onRenderFcts.push(function(){
		renderer.render( scene, camera );
	})
	
	//////////////////////////////////////////////////////////////////////////////////
	//		Rendering Loop runner						//
	//////////////////////////////////////////////////////////////////////////////////
	var lastTimeMsec= null
	requestAnimationFrame(function animate(nowMsec){
		// keep looping
		requestAnimationFrame( animate );
		// measure time
		lastTimeMsec	= lastTimeMsec || nowMsec-1000/60
		var deltaMsec	= Math.min(200, nowMsec - lastTimeMsec)
		lastTimeMsec	= nowMsec
		// call each update function
		onRenderFcts.forEach(function(onRenderFct){
			onRenderFct(deltaMsec/1000, nowMsec/1000)
		})
	})
});
