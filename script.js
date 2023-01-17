"use strict";
// demo from: https://gist.github.com/bellbind/c4f8c502fcacbe29422e5ac315273858

// simplified on three.js/examples/webgl_loader_gltf2.html
function main() {
  // renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight - 4);
  document.body.appendChild(renderer.domElement);

  // camera
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    2000
  );
  camera.position.set(0, 2, 2.5);
  camera.rotation.x = 100;

  // scene and lights
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff));

  // load gltf model and texture
  const objs = [];
  let vanModel = undefined;
  let vans = [];
  const loader = new THREE.GLTFLoader();

  // Basic geometry example
  const geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  cube.position.set(2, 0.3, -3);
  scene.add(cube);

  // GLTF Loader example
  loader.load("./assets/parking_lot_uf.glb", (gltf) => {
    console.log("gltf loaded", gltf);

    gltf.scene.scale.set(0.6, 0.6, 0.6);
    gltf.scene.position.set(0, 0, 0);

    scene.add(gltf.scene);
    objs.push({ gltf });
  });

  loader.load("./assets/car.glb", (gltf) => {
    gltf.scene.scale.set(0.15, 0.15, 0.15);
    gltf.scene.position.set(-2, 0.15, 1);
    gltf.scene.rotation.set(0,1.5,0);

    scene.add(gltf.scene);
    objs.push({ gltf });
  });

  loader.load("./assets/van.glb", (gltf) => {
    gltf.scene.scale.set(0.03, 0.03, 0.03);
    gltf.scene.position.set(0.33, 0.15, 0.5);

    vanModel = gltf;
    vans.push(vanModel.scene);
  });

  // Number of vans
  const rangeInput = document.querySelector('#cars');
  let numberOfVans = 1;
  if (rangeInput) {
    numberOfVans = rangeInput.value;
  }
  rangeInput.addEventListener('input', (e) => {
    if (e.target.value) {
      numberOfVans = e.target.value;
    }
    if (numberOfVans > 0) {
      if (vans.length > 0) {
        vans.forEach(van => {
          scene.remove(van);
        })
      }
      vans = [];
      for(let i = 0; i < numberOfVans; i++) {
        const anotherVan = vanModel.scene.clone();
        anotherVan.position.x += 0.14 * i;
        vans.push(anotherVan);
      }
      console.log(vans);
    }
  })

  // animation rendering
  const clock = new THREE.Clock();
  let backwards = false;
  let moveForwards = false;
  let moveBackwards = false;
  let moveLeft = false;
  let moveRight = false;

  window.addEventListener("keydown", (ev) => {
    switch (ev.key) {
      case "ArrowDown":
        moveForwards = true;
        break;
      case "ArrowUp":
        moveBackwards = true;
        break;
      case "ArrowLeft":
        moveLeft = true;
        break;
      case "ArrowRight":
        moveRight = true;
        break;
      default:
        break;
    }
  });
  window.addEventListener("keyup", (ev) => {
    switch (ev.key) {
      case "ArrowDown":
        moveForwards = false;
        break;
      case "ArrowUp":
        moveBackwards = false;
        break;
      case "ArrowLeft":
        moveLeft = false;
        break;
      case "ArrowRight":
        moveRight = false;
        break;
    }
  });

  (function animate() {
    // animation with THREE.AnimationMixer.update(timedelta)
    // objs.forEach(({ mixer }) => { mixer.update(clock.getDelta());} );

    // if (objs[0]) {
    //   const parkingLot = objs[0].gltf.scene;
    // }

    cube.rotation.y += 0.01;

    if (objs[1]) {
      const car = objs[1].gltf.scene;
      if (moveForwards) {
        car.position.z += 0.01;
      }
      if (moveBackwards) {
        car.position.z -= 0.01;
      }
      if (moveLeft) {
        car.position.x -= 0.04;
      }
      if (moveRight) {
        car.position.x += 0.03;
      }
    }

    // if(objs[2]) {
      // const van = objs[1].gltf.scene;
      // console.log('swat', van);
    // }

    // vans
    if (vanModel && numberOfVans) {
      vans.forEach(van => {
        scene.add(van);
      });
    }

    // set up camera animation back and forth
    if (camera.rotation.y >= 0.2) {
      backwards = true;
    } else if (camera.rotation.y <= -0.2) {
      backwards = false;
    }
    if (backwards) {
      camera.rotation.y -= 0.0005;
    } else {
      camera.rotation.y += 0.0005;
    }

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  })();
  return objs;
}

const objs = main();
