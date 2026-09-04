// world.js — the physics world, the letter-blocks, and tower construction.
//
// Physics is cannon-es 0.20.0 (MIT), vendored. Three.js renders; cannon simulates;
// nothing is shared between them but a position and a quaternion copied each frame.
//
// Stacking is the hard case for a rigid-body solver — a tower that jitters itself
// apart is worse than no physics at all — so the settings below are chosen for
// stack stability rather than for speed, and are stated here rather than tuned by
// feel and forgotten:
//
//   solver.iterations 14   more constraint passes = less penetration creep
//   contact friction 0.5   letters are stone, not ice
//   restitution      0.05  almost no bounce; bouncy stacks never settle
//   allowSleep       true  a settled tower must actually stop, or nothing is stable
//   sleepSpeedLimit  0.12  generous, so towers sleep rather than shiver
//
// The one place the source is bent for playability is mass: abjad runs 1..1000,
// three orders of magnitude, which no solver stacks well. build_letters.py takes
// log10 so the ORDER is exact and the RATIO is compressed. That is documented
// there and surfaced in the Tome.

import * as THREE from '../vendor/three.module.js';
import * as CANNON from '../vendor/cannon-es.js';

// Jenga proportions, and the reason is structural: three blocks laid side by side
// must form a SQUARE, so that the next course laid crosswise covers the same
// footprint. width = 3 x depth is what makes that true. An earlier version used
// 1.0 x 0.6 and the footprint came out a narrow cross — every tower tipped itself
// over while settling, which reads as a physics bug and is really a geometry one.
export const BLOCK = { w: 1.5, h: 0.5, d: 0.5 };
const GROUND_Y = 0;

export class World {
  constructor(canvasHost) {
    this.host = canvasHost;
    this.blocks = [];          // { body, mesh, letter, alive, ghostUntil, baseMass }
    this.debris = [];
    this.projectiles = [];
    this.pending = [];         // delayed effects, e.g. the talisman's arrival
    this.time = 0;
    this._initThree();
    this._initPhysics();
  }

  /* ------------------------------------------------------------ rendering -- */

  _initThree() {
    const w = this.host.clientWidth || 800, h = this.host.clientHeight || 600;
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.host.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#171620');
    this.scene.fog = new THREE.Fog('#171620', 26, 60);

    this.camera = new THREE.PerspectiveCamera(46, w / h, 0.1, 200);
    this.camOrbit = { yaw: 0.6, pitch: 0.22, dist: 12, target: new THREE.Vector3(0, 1.9, 0) };
    this._applyCamera();

    // Unlike the folio scenes, this one is a lit 3-D space and says so: these are
    // solid objects casting real shadows, not flat plates from a painting.
    this.scene.add(new THREE.HemisphereLight(0xbfd4ff, 0x40361f, 0.55));
    const key = new THREE.DirectionalLight(0xfff0d0, 1.5);
    key.position.set(9, 16, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    const s = 18;
    Object.assign(key.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 60 });
    this.scene.add(key);
    const rim = new THREE.DirectionalLight(0x6f8fd0, 0.45);
    rim.position.set(-8, 6, -9);
    this.scene.add(rim);

    const ground = new THREE.Mesh(
      new THREE.CylinderGeometry(14, 14, 0.6, 48),
      new THREE.MeshStandardMaterial({ color: 0x2f2a3a, roughness: 0.95, metalness: 0 })
    );
    ground.position.y = GROUND_Y - 0.3;
    ground.receiveShadow = true;
    this.scene.add(ground);

    const grid = new THREE.GridHelper(28, 28, 0xc99a2e, 0x3a3448);
    grid.material.opacity = 0.14;
    grid.material.transparent = true;
    grid.position.y = GROUND_Y + 0.005;
    this.scene.add(grid);

    // The target line: what "below" and "above" mean in every mode.
    const lineGeo = new THREE.TorusGeometry(3.4, 0.03, 8, 64);
    this.lineMesh = new THREE.Mesh(lineGeo,
      new THREE.MeshBasicMaterial({ color: 0xe0a255, transparent: true, opacity: 0.65 }));
    this.lineMesh.rotation.x = Math.PI / 2;
    this.scene.add(this.lineMesh);

    this.raycaster = new THREE.Raycaster();
  }

  _applyCamera() {
    const c = this.camOrbit, cp = Math.cos(c.pitch);
    this.camera.position.set(
      c.target.x + Math.sin(c.yaw) * cp * c.dist,
      c.target.y + Math.sin(c.pitch) * c.dist,
      c.target.z + Math.cos(c.yaw) * cp * c.dist);
    this.camera.lookAt(c.target);
  }

  setTargetLine(y) {
    this.targetY = y;
    this.lineMesh.position.y = y;
  }

  /* -------------------------------------------------------------- physics -- */

  _initPhysics() {
    this.world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) });
    this.world.broadphase = new CANNON.SAPBroadphase(this.world);
    this.world.solver.iterations = 14;
    this.world.allowSleep = true;

    this.mat = new CANNON.Material('block');
    this.world.addContactMaterial(new CANNON.ContactMaterial(this.mat, this.mat, {
      friction: 0.5, restitution: 0.05,
      contactEquationStiffness: 1e7, contactEquationRelaxation: 4,
    }));

    const ground = new CANNON.Body({
      type: CANNON.Body.STATIC, shape: new CANNON.Plane(), material: this.mat,
    });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    ground.position.y = GROUND_Y;
    this.world.addBody(ground);
  }

  /* --------------------------------------------------------------- blocks -- */

  _blockMaterial(letter, ghost = false) {
    // Light letters read warm and pale, dark letters cool and deep — so the 14/14
    // split is visible before it is explained, and Inversion is legible as an event.
    const light = letter.class === 'nurani';
    return new THREE.MeshStandardMaterial({
      color: light ? 0xe8d5ae : 0x4a4668,
      roughness: light ? 0.55 : 0.7,
      metalness: light ? 0.15 : 0.05,
      emissive: light ? 0x2a1f0a : 0x0a0a18,
      transparent: ghost, opacity: ghost ? 0.28 : 1,
    });
  }

  _glyphTexture(letter) {
    // The glyph is drawn to a canvas rather than shipped as an image: 28 letters
    // at any resolution, no asset pipeline, and it stays crisp when you zoom.
    const S = 256;
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const g = c.getContext('2d');
    const light = letter.class === 'nurani';
    g.fillStyle = light ? '#e8d5ae' : '#4a4668';
    g.fillRect(0, 0, S, S);
    g.fillStyle = light ? '#3a2c12' : '#d8cfe8';
    g.font = `${Math.round(S * 0.62)}px "Segoe UI", "Noto Naskh Arabic", serif`;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText(letter.glyph, S / 2, S * 0.52);
    g.font = `${Math.round(S * 0.13)}px system-ui`;
    g.globalAlpha = 0.65;
    g.fillText(String(letter.abjad), S / 2, S * 0.88);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
    return t;
  }

  addBlock(letter, x, y, z, rotY = 0) {
    const geo = new THREE.BoxGeometry(BLOCK.w, BLOCK.h, BLOCK.d);
    const face = new THREE.MeshStandardMaterial({
      map: this._glyphTexture(letter), roughness: 0.6, metalness: 0.05,
    });
    const side = this._blockMaterial(letter);
    // Glyph on the two broad faces (+Z/-Z); plain stone on the rest.
    const mesh = new THREE.Mesh(geo, [side, side, side, side, face, face]);
    mesh.castShadow = mesh.receiveShadow = true;
    this.scene.add(mesh);

    const body = new CANNON.Body({
      mass: letter.mass,
      shape: new CANNON.Box(new CANNON.Vec3(BLOCK.w / 2, BLOCK.h / 2, BLOCK.d / 2)),
      material: this.mat,
      position: new CANNON.Vec3(x, y, z),
      sleepSpeedLimit: 0.12,
      sleepTimeLimit: 0.4,
    });
    body.quaternion.setFromEuler(0, rotY, 0);
    this.world.addBody(body);

    const b = {
      body, mesh, letter, alive: true, ghostUntil: 0,
      baseMass: letter.mass, massUntil: 0,
    };
    body.userData = b;
    mesh.userData = b;
    this.blocks.push(b);
    return b;
  }

  removeBlock(b, { burst = true } = {}) {
    if (!b.alive) return;
    b.alive = false;
    this.world.removeBody(b.body);
    this.scene.remove(b.mesh);
    if (burst) this._burst(b.mesh.position, b.letter);
  }

  _burst(pos, letter) {
    // Cheap, unlit, additive sparks. No particle system, no dependency.
    const n = 14;
    const g = new THREE.BufferGeometry();
    const p = new Float32Array(n * 3), v = [];
    for (let i = 0; i < n; i++) {
      p[i * 3] = pos.x; p[i * 3 + 1] = pos.y; p[i * 3 + 2] = pos.z;
      v.push(new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.9, Math.random() - 0.5)
        .multiplyScalar(3 + Math.random() * 3));
    }
    g.setAttribute('position', new THREE.BufferAttribute(p, 3));
    const pts = new THREE.Points(g, new THREE.PointsMaterial({
      color: letter.class === 'nurani' ? 0xffd98a : 0x9d8ff0,
      size: 0.16, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    this.scene.add(pts);
    this.debris.push({ pts, v, life: 0.9 });
  }

  /** A thrown stone: a body already in the world, plus something to look at. */
  addProjectile(body, radius) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 20, 14),
      new THREE.MeshStandardMaterial({ color: 0x8d8577, roughness: 0.9, metalness: 0.05 })
    );
    mesh.castShadow = true;
    this.scene.add(mesh);
    this.projectiles.push({ body, mesh });
    return mesh;
  }

  clear() {
    for (const b of [...this.blocks]) if (b.alive) this.removeBlock(b, { burst: false });
    this.blocks.length = 0;
    for (const d of this.debris) this.scene.remove(d.pts);
    this.debris.length = 0;
    for (const p of this.projectiles) { this.scene.remove(p.mesh); this.world.removeBody(p.body); }
    this.projectiles.length = 0;
    this.pending.length = 0;
  }

  /* --------------------------------------------------------------- queries -- */

  liveBlocks() { return this.blocks.filter(b => b.alive); }

  highestY() {
    let y = 0;
    for (const b of this.liveBlocks()) y = Math.max(y, b.body.position.y);
    return y;
  }

  /** Is the tower still moving? Modes must not judge a structure mid-collapse. */
  isSettled(eps = 0.22) {
    for (const b of this.liveBlocks()) {
      if (b.body.velocity.length() > eps || b.body.angularVelocity.length() > eps) return false;
    }
    return true;
  }

  pick(clientX, clientY) {
    const r = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((clientX - r.left) / r.width) * 2 - 1,
      -((clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    const meshes = this.liveBlocks().map(b => b.mesh);
    const hit = this.raycaster.intersectObjects(meshes, false)[0];
    return hit ? { block: hit.object.userData, point: hit.point } : null;
  }

  aimRay(clientX, clientY) {
    const r = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((clientX - r.left) / r.width) * 2 - 1,
      -((clientY - r.top) / r.height) * 2 + 1);
    this.raycaster.setFromCamera(ndc, this.camera);
    return this.raycaster.ray.direction.clone().normalize();
  }

  /* ------------------------------------------------------------------ loop -- */

  step(dt) {
    this.time += dt;

    // Expire ghosting (khalʿ) and temporary mass changes (ism, inversion).
    for (const b of this.blocks) {
      if (!b.alive) continue;
      if (b.ghostUntil && this.time >= b.ghostUntil) {
        b.ghostUntil = 0;
        b.body.collisionResponse = true;
        b.mesh.material.forEach?.(m => { m.transparent = false; m.opacity = 1; });
        if (Array.isArray(b.mesh.material)) {
          b.mesh.material.forEach(m => { m.transparent = false; m.opacity = 1; });
        }
        b.body.wakeUp();
      }
      if (b.massUntil && this.time >= b.massUntil) {
        b.massUntil = 0;
        b.body.mass = b.baseMass;
        b.body.updateMassProperties();
        b.body.wakeUp();
      }
    }

    // Delayed effects (the talisman's force arriving through the barzakh).
    for (let i = this.pending.length - 1; i >= 0; i--) {
      if (this.time >= this.pending[i].at) { this.pending[i].run(); this.pending.splice(i, 1); }
    }

    this.world.step(1 / 60, dt, 3);

    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      p.mesh.position.copy(p.body.position);
      p.mesh.quaternion.copy(p.body.quaternion);
      if (p.body.position.y < -8) {
        this.scene.remove(p.mesh); this.world.removeBody(p.body); this.projectiles.splice(i, 1);
      }
    }

    for (const b of this.blocks) {
      if (!b.alive) continue;
      b.mesh.position.copy(b.body.position);
      b.mesh.quaternion.copy(b.body.quaternion);
      // A block that falls off the world is gone, not tracked forever.
      if (b.body.position.y < -8) this.removeBlock(b, { burst: false });
    }

    for (let i = this.debris.length - 1; i >= 0; i--) {
      const d = this.debris[i];
      d.life -= dt;
      const pos = d.pts.geometry.attributes.position;
      for (let k = 0; k < d.v.length; k++) {
        d.v[k].y -= 9.8 * dt;
        pos.array[k * 3] += d.v[k].x * dt;
        pos.array[k * 3 + 1] += d.v[k].y * dt;
        pos.array[k * 3 + 2] += d.v[k].z * dt;
      }
      pos.needsUpdate = true;
      d.pts.material.opacity = Math.max(0, d.life);
      if (d.life <= 0) { this.scene.remove(d.pts); this.debris.splice(i, 1); }
    }

    this._applyCamera();
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const w = this.host.clientWidth, h = this.host.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }
}
