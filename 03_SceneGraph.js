// 임포트 THREE three.module.js
import * as THREE from '../three.js-master/build/three.module.js';
import { OrbitControls } from "../three.js-master/examples/jsm/controls/OrbitControls.js"


//앞으로 추가할 코드
class App{
    constructor(){
		/*div요소 저장 및 class의 필드로 정의*/
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

		/*renderer 생성코드*/
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);
        this._renderer = renderer;

		/*scene 객체 생성코드*/
        const scene = new THREE.Scene();
        this._scene = scene;

		/*setup 해야 할 코드*/
        this._setupCamera();
        this._setupLight();
        this._setupModel(); //geometry , material
        this._setupControls();


		/* 웹 페이지 사이즈 조절에 맞게 리사이즈*/
        window.onresize = this.resize.bind(this);
        this.resize();
		
		/*자바스크립트 API*/
        requestAnimationFrame(this.render.bind(this));
    }

    /* setupControls 정의 */
    _setupControls(){
        new OrbitControls(this._camera,this._divContainer);
      }


    /*카메라 setup*/
    //three.js가 3차원 그래픽을 출력할 영역에 대한 가로세로 크기를 얻어옴
    _setupCamera(){
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        //카메라 객체 생성
        const camera = new THREE.PerspectiveCamera(
            75,
            width/height,
            0.1,
            100
        );
        camera.position.z = 25;
        this._camera = camera;
    }

    /*Light setup*/
    _setupLight(){
        //광원 색상 세기 값 설정
        const color = 0xffffff;
        const intensity = 1;
        //광원 생성
        const light = new THREE.DirectionalLight(color, intensity);
        //광원 위치설정
        light.position.set(-1, 2, 4);
        //씬의 구성요소로 추가
        this._scene.add(light);
    }

    /*Model setup*/
    _setupModel(){
        /* solarSystem 오브젝트 생성 및 _scene 추가*/
        const solarSystem = new THREE.Object3D();
        this._scene.add(solarSystem);

        const radius = 1;
        const widthSegments = 12;
        const heightSegments = 12;
        const sphereGeometry = new THREE.SphereGeometry(radius,widthSegments,heightSegments);
        const sunMaterial = new THREE.MeshPhongMaterial({emissive: 0xffff00, flatshading: true});
       
        /*오브젝트에 메쉬 추가*/
        const sunMesh = new THREE.Mesh(sphereGeometry,sunMaterial);
        sunMesh.scale.set(3,3,3);
        solarSystem.add(sunMesh);

        /* earthOrbit 오브젝트 생성 및 solarSystem 추가*/
        const earthOrbit = new THREE.Object3D();
        solarSystem.add(earthOrbit); //자식으로 추가

        /* earth 머티리얼 및 메쉬 추가*/
        const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233ff, emissive: 0x112244, flatshading: true});

            const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
            earthOrbit.position.x = 10;
            earthOrbit.add(earthMesh);

        /* moonOrbit 오브젝트 생성 및 earthOrbit 추가*/
        const moonOrbit = new THREE.Object3D();
        moonOrbit.position.x = 2;
        earthOrbit.add(moonOrbit);

        /* moon 머티리얼 및 메쉬 추가*/
        const moonMaterial = new THREE.MeshPhongMaterial({color: 0x888888, emissive: 0x222222, flatshading: true});
        const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
        moonMesh.scale.set(0.5,0.5,0.5);
        moonOrbit.add(moonMesh);

        //필드화
        this._solarSystem = solarSystem;
        this._earthOrbit = earthOrbit;
        this._moonOrbit = moonOrbit;
    }

    /* resize */
    resize(){
        //_divContainer의 크기 가져옴
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;
        //카메라 속성 값 설정
        this._camera.aspect = width/height;
        //변경된 값을 카메라에 적용
        this._camera.updateProjectionMatrix();
        //렌더러의 크기 설정
        this._renderer.setSize(width,height);
    }

    /* render */
    render(time){
        //랜더러가 씬을 카메라의 시점을 이용해서 랜더링하라는 의미
        this._renderer.render(this._scene,this._camera);
        this.update(time);

        requestAnimationFrame(this.render.bind(this));
    }

    /* update */
    update(time){
        time *= 0.001; //second unit
        
        this._solarSystem.rotation.y = time / 2;
        this._earthOrbit.rotation.y = time * 2;
        this._moonOrbit.rotation.y = time * 5;
    }

}

/*윈도우 온로드에서 앱 클래스를 생성함*/
window.onload = function(){
    new App();
}