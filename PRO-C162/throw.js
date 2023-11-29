AFRAME.registerComponent("bowling-balls", {
    init: function () {
      this.throwBall();
    },
    throwBall: function () {
      window.addEventListener("keydown", (e) => {
        if (e.key === "z") {
          var  ball = document.createElement("a-entity");
  
          ball.setAttribute("gltf-model", "models/bowling_ball/scene.gltf");
  
          ball.setAttribute("scale", { x: 3, y: 3,  z: 3});
  
          var cam = document.querySelector("#camera");
  
          pos = cam.getAttribute("position");
  
          ball.setAttribute("position", {
            x: pos.x,
            y: pos.y-1.2,
            z: pos.z,
          });
  
          var camera = document.querySelector("#camera").object3D;
  
         
          var direction = new THREE.Vector3();
          camera.getWorldDirection(direction);
  
          
          ball.setAttribute("velocity", direction.multiplyScalar(-10));
  
          var scene = document.querySelector("#scene");
          
          //Establecer la bola como una identidad dinamica NUEVO
          ball.setAttribute("dynamic-body", {
            shape:"sphere",
            mass:0
          });

          //Agregar la escucha del evento de colision NUEVO
          ball.addEventListener("collide",this.removeBall);

          scene.appendChild(ball);
        }
      });
    },
    removeBall: function (e) {
      // Entidad original (bola)
      console.log(e.detail.target.el);
  
      // Otra entidad que la bola toque
      console.log(e.detail.body.el);
  
      // Elemento de la bala
      var element = e.detail.target.el;
  
      // Elemento que es golpeado
      var elementHit = e.detail.body.el;
  
      if (elementHit.id.includes("pin")) 
        {
          // Establecer el atributo "material"
          elementHit.setAttribute("material",{
            opacity:1,
            transparent: true,
          });
  
          // Impulso y vector punto
          var impulse = new CANNON.Vec3(0, 1, -15);
          var worldPoint = new CANNON.Vec3().copy(
            elementHit.getAttribute("position")
          );
          
          elementHit.body.applyImpulse(impulse,worldPoint);
          // Eliminar escucha de evento
          element.removeEventListener("collide",this.removeBall);
          
          // Remover la bola de la escena
          var scene = document.querySelector("#scene");
          scene.removeChild(element);
      }
    },
  });
  