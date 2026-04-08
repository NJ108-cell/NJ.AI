        /* ============================================================
           CUSTOM CURSOR
        ============================================================ */
        var dot = document.getElementById('cdot'), ring = document.getElementById('cring');
        var mx = window.innerWidth / 2, my = window.innerHeight / 2, rx = mx, ry = my;
        if (window.innerWidth > 768) {
            document.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px' });
            document.querySelectorAll('a,button,.pc,.ccard,.skg,.holo-crd,.sp,.skp,.ach-crd').forEach(function (el) {
                el.addEventListener('mouseenter', function () { ring.classList.add('hov') });
                el.addEventListener('mouseleave', function () { ring.classList.remove('hov') });
            });
            (function anim() { rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12; ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; requestAnimationFrame(anim) })();
        }

        /* ============================================================
           MOBILE MENU
        ============================================================ */
        function toggleMob() { document.getElementById('mob-menu').classList.toggle('open') }
        function closeMob() { document.getElementById('mob-menu').classList.remove('open') }

        /* ============================================================
           NAVBAR SCROLL
        ============================================================ */
        window.addEventListener('scroll', function () { document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60) });

        /* ============================================================
           TYPEWRITER
        ============================================================ */
        var roles = ['AI Engineer', 'ML Developer', 'LLM Architect', 'Python Expert', 'AI Builder'], ri = 0, ci = 0, del = false;
        var tel = document.getElementById('typed');
        function type() {
            var cur = roles[ri];
            if (!del) { tel.textContent = cur.slice(0, ci + 1); ci++; if (ci === cur.length) { del = true; setTimeout(type, 1800); return } }
            else { tel.textContent = cur.slice(0, ci - 1); ci--; if (ci === 0) { del = false; ri = (ri + 1) % roles.length; setTimeout(type, 400); return } }
            setTimeout(type, del ? 55 : 88);
        }
        setTimeout(type, 600);

        /* ============================================================
           FADE-UP OBSERVER
        ============================================================ */
        var obs = new IntersectionObserver(function (entries) { entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('vis') } }) }, { threshold: .1, rootMargin: '0px 0px -50px 0px' });
        document.querySelectorAll('.fu').forEach(function (el) { obs.observe(el) });

        /* ============================================================
           CARD 3D TILT
        ============================================================ */
        function tilt(e, card) {
            var r = card.getBoundingClientRect();
            var x = e.clientX - r.left - r.width / 2, y = e.clientY - r.top - r.height / 2;
            card.style.transform = 'perspective(900px) rotateX(' + ((-y / r.height) * 12) + 'deg) rotateY(' + ((x / r.width) * 12) + 'deg) scale(1.03)';
            card.style.borderColor = card.querySelector('.cbar').style.background.replace('linear-gradient(90deg,', '').split(',')[0] + '55';
        }
        function untilt(card) { card.style.transform = ''; card.style.borderColor = 'rgba(0,212,255,.14)' }

        /* ============================================================
           DATA STREAMS
        ============================================================ */
        var chars = 'アイウエオカキクケコ01アBCDE10ナニネノ';
        var dsc = document.getElementById('ds-container');
        for (var i = 0; i < 14; i++) {
            var d = document.createElement('div'); d.className = 'ds';
            var t = ''; for (var j = 0; j < 28; j++)t += chars[Math.floor(Math.random() * chars.length)] + '\n';
            d.textContent = t; d.style.left = Math.random() * 100 + '%';
            d.style.animationDuration = (6 + Math.random() * 9) + 's'; d.style.animationDelay = (Math.random() * 8) + 's';
            d.style.color = i % 3 === 0 ? '#00d4ff' : i % 3 === 1 ? '#7c3aed' : '#ff006e'; d.style.opacity = String(.05 + Math.random() * .12);
            dsc.appendChild(d);
        }

        /* ============================================================
           THREE.JS 3D SCENE
        ============================================================ */
        if (typeof THREE !== 'undefined') {
            var canvas = document.getElementById('bg-canvas');
            var renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            renderer.setClearColor(0, 0);

            var scene = new THREE.Scene();
            scene.fog = new THREE.Fog(0x030712, 22, 65);

            var camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
            camera.position.set(0, 2, 14); camera.lookAt(0, 0, 0);

            /* LIGHTS */
            scene.add(new THREE.AmbientLight(0x060d1f, 2));
            var lc = new THREE.PointLight(0x00d4ff, 3, 50); lc.position.set(-12, 8, -8); scene.add(lc);
            var lp = new THREE.PointLight(0x7c3aed, 2.5, 45); lp.position.set(12, 6, -6); scene.add(lp);
            var la = new THREE.PointLight(0xff006e, 1.5, 35); la.position.set(0, 15, -10); scene.add(la);

            /* STARS */
            var sg = new THREE.BufferGeometry(), sp = [];
            for (var i = 0; i < 4500; i++)sp.push((Math.random() - .5) * 200, (Math.random() - .5) * 200, (Math.random() - .5) * 200);
            sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3));
            var sm = new THREE.PointsMaterial({ color: 0xaaaaff, size: .12, transparent: true, opacity: .7 });
            scene.add(new THREE.Points(sg, sm));

            /* GRID */
            var grid = new THREE.GridHelper(60, 60, 0x00d4ff, 0x0f172a);
            grid.position.y = -5.5; grid.material.transparent = true; grid.material.opacity = .25; scene.add(grid);

            /* ---- DRONE ---- */
            var drone = new THREE.Group();
            var BM = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: .95, roughness: .05 });
            var AM = new THREE.MeshStandardMaterial({ color: 0x00d4ff, emissive: 0x00d4ff, emissiveIntensity: .5, metalness: .6 });
            var PM = new THREE.MeshStandardMaterial({ color: 0x00d4ff, transparent: true, opacity: .65, emissive: 0x00d4ff, emissiveIntensity: .3 });
            drone.add(new THREE.Mesh(new THREE.BoxGeometry(.9, .15, .9), BM));
            var dm = new THREE.Mesh(new THREE.SphereGeometry(.28, 16, 16), AM); dm.position.y = .18; drone.add(dm);
            var dc = new THREE.Mesh(new THREE.SphereGeometry(.09, 8, 8), new THREE.MeshStandardMaterial({ color: 0xff006e, emissive: 0xff006e, emissiveIntensity: 2 })); dc.position.y = -.14; drone.add(dc);
            var dProps = [];
            [[.5, .08, .5], [-.5, .08, .5], [.5, .08, -.5], [-.5, .08, -.5]].forEach(function (p, i) {
                var arm = new THREE.Mesh(new THREE.BoxGeometry(.52, .05, .07), new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: .9 }));
                arm.position.set(p[0] * .5, 0, p[2] * .5); arm.rotation.y = Math.PI / 4 * (i < 2 ? 1 : -1); drone.add(arm);
                var pg = new THREE.Group(); pg.position.set(p[0], p[1], p[2]);
                var b1 = new THREE.Mesh(new THREE.BoxGeometry(.48, .025, .07), PM); pg.add(b1);
                var b2 = new THREE.Mesh(new THREE.BoxGeometry(.48, .025, .07), PM); b2.rotation.y = Math.PI / 2; pg.add(b2);
                var tr = new THREE.Mesh(new THREE.TorusGeometry(.22, .02, 8, 24), new THREE.MeshStandardMaterial({ color: 0x7c3aed, emissive: 0x7c3aed, emissiveIntensity: .6 })); tr.rotation.x = Math.PI / 2; pg.add(tr);
                drone.add(pg); dProps.push({ g: pg, d: i % 2 === 0 ? 1 : -1 });
            });
            var dl = new THREE.PointLight(0x00d4ff, 2, 7); drone.add(dl);
            drone.scale.set(.65, .65, .65); scene.add(drone);

            /* ---- ROCKET ---- */
            var rk = new THREE.Group();
            rk.add(new THREE.Mesh(new THREE.CylinderGeometry(.28, .35, 2.2, 16), new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: .85, roughness: .15 })));
            var rn = new THREE.Mesh(new THREE.ConeGeometry(.28, .8, 16), new THREE.MeshStandardMaterial({ color: 0xff006e, emissive: 0xff006e, emissiveIntensity: .3, metalness: .6 })); rn.position.y = 1.6; rk.add(rn);
            [0, 120, 240].forEach(function (deg) {
                var f = new THREE.Mesh(new THREE.BoxGeometry(.05, .65, .45), new THREE.MeshStandardMaterial({ color: 0x7c3aed, metalness: .7 }));
                f.position.set(Math.sin(deg * Math.PI / 180) * .38, -.9, Math.cos(deg * Math.PI / 180) * .38); f.rotation.y = deg * Math.PI / 180; rk.add(f);
            });
            var rw = new THREE.Mesh(new THREE.CircleGeometry(.12, 16), new THREE.MeshStandardMaterial({ color: 0x00d4ff, emissive: 0x00d4ff, emissiveIntensity: 1.5 })); rw.position.set(0, .4, .32); rk.add(rw);
            var fg = new THREE.Group();
            var fm = new THREE.Mesh(new THREE.ConeGeometry(.28, 1.3, 12), new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 3, transparent: true, opacity: .9 })); fm.rotation.x = Math.PI; fg.add(fm);
            var fi = new THREE.Mesh(new THREE.ConeGeometry(.15, .8, 12), new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 4, transparent: true, opacity: .85 })); fi.rotation.x = Math.PI; fg.add(fi);
            var fl = new THREE.PointLight(0xff4400, 4, 10); fg.add(fl); fg.position.y = -1.6; rk.add(fg);
            rk.add(new THREE.PointLight(0x7c3aed, 1.5, 5)); rk.position.set(5, -15, -5); scene.add(rk);
            var rkVy = -12, rkOn = false, rkCd = 10;

            /* ---- ROBOT ---- */
            var rb = new THREE.Group();
            var RM = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: .92, roughness: .08 });
            var RX = new THREE.MeshStandardMaterial({ color: 0x7c3aed, emissive: 0x7c3aed, emissiveIntensity: .6, metalness: .7 });
            var RE = new THREE.MeshStandardMaterial({ color: 0x00d4ff, emissive: 0x00d4ff, emissiveIntensity: 2 });
            rb.add(new THREE.Mesh(new THREE.BoxGeometry(.65, .9, .45), RM));
            var pan = new THREE.Mesh(new THREE.BoxGeometry(.45, .55, .02), RX); pan.position.set(0, .1, .24); rb.add(pan);
            var cl = new THREE.Mesh(new THREE.CircleGeometry(.08, 12), new THREE.MeshStandardMaterial({ color: 0x00d4ff, emissive: 0x00d4ff, emissiveIntensity: 2 })); cl.position.set(0, .1, .26); rb.add(cl);
            rb.add(Object.assign(new THREE.PointLight(0x00d4ff, 1.5, 3), { position: new THREE.Vector3(0, .1, .3) }));
            var hd = new THREE.Group();
            hd.add(new THREE.Mesh(new THREE.BoxGeometry(.55, .52, .5), RM));
            var eL = new THREE.Mesh(new THREE.SphereGeometry(.075, 10, 10), RE); eL.position.set(.13, .05, .26); hd.add(eL);
            var eR = new THREE.Mesh(new THREE.SphereGeometry(.075, 10, 10), RE); eR.position.set(-.13, .05, .26); hd.add(eR);
            var elL = new THREE.PointLight(0x00d4ff, 1.5, 2); elL.position.set(.13, .05, .35); hd.add(elL);
            var elR = new THREE.PointLight(0x00d4ff, 1.5, 2); elR.position.set(-.13, .05, .35); hd.add(elR);
            var mth = new THREE.Mesh(new THREE.BoxGeometry(.25, .04, .01), new THREE.MeshStandardMaterial({ color: 0xff006e, emissive: 0xff006e, emissiveIntensity: 1 })); mth.position.set(0, -.12, .26); hd.add(mth);
            var ant = new THREE.Mesh(new THREE.CylinderGeometry(.02, .02, .3), RX); ant.position.set(0, .38, 0); hd.add(ant);
            var atop = new THREE.Mesh(new THREE.SphereGeometry(.055, 10, 10), new THREE.MeshStandardMaterial({ color: 0xff006e, emissive: 0xff006e, emissiveIntensity: 2.5 })); atop.position.set(0, .55, 0); hd.add(atop);
            hd.position.set(0, .82, 0); rb.add(hd);
            function mkArm(x) { var g = new THREE.Group(); var m = new THREE.Mesh(new THREE.CylinderGeometry(.1, .09, .56), RM.clone()); m.position.y = -.28; g.add(m); var h = new THREE.Mesh(new THREE.BoxGeometry(.2, .2, .2), RX.clone()); h.position.y = -.6; g.add(h); g.position.set(x, .22, 0); rb.add(g); return g; }
            function mkLeg(x) { var g = new THREE.Group(); var m = new THREE.Mesh(new THREE.CylinderGeometry(.12, .1, .64), RM.clone()); m.position.y = -.32; g.add(m); var f = new THREE.Mesh(new THREE.BoxGeometry(.22, .16, .32), RX.clone()); f.position.set(0, -.68, .06); g.add(f); g.position.set(x, -.6, 0); rb.add(g); return g; }
            var laG = mkArm(.48), raG = mkArm(-.48), llG = mkLeg(.2), rlG = mkLeg(-.2);
            rb.scale.set(.75, .75, .75); scene.add(rb);
            var rbX = -7, rbD = 1;

            /* ---- FLOATING SHAPES ---- */
            var fShapes = [], fGeos = [new THREE.IcosahedronGeometry(1, 0), new THREE.OctahedronGeometry(1, 0), new THREE.TetrahedronGeometry(1, 0), new THREE.TorusGeometry(.8, .25, 8, 16)];
            var fCols = [0x00d4ff, 0x7c3aed, 0xff006e, 0x00ff88];
            for (var i = 0; i < 18; i++) {
                var sc = .12 + Math.random() * .3, col = fCols[i % 4];
                var mat = new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: .2, wireframe: i % 3 === 0, metalness: .8, roughness: .2, transparent: true, opacity: .5 });
                var msh = new THREE.Mesh(fGeos[i % 4], mat);
                msh.position.set((Math.random() - .5) * 22, (Math.random() - .5) * 12, (Math.random() - .5) * 8 - 5);
                msh.scale.set(sc, sc, sc); msh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                msh.userData = { by: msh.position.y, sp: .2 + Math.random() * .5, of: Math.random() * Math.PI * 2 };
                scene.add(msh); fShapes.push(msh);
            }

            /* MOUSE PARALLAX */
            var mpx = 0, mpy = 0, ctx = 0, cty = 0;
            document.addEventListener('mousemove', function (e) { mpx = (e.clientX / window.innerWidth - .5) * 2; mpy = -(e.clientY / window.innerHeight - .5) * 2 });

            /* RESIZE */
            window.addEventListener('resize', function () { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight) });

            /* ANIMATION LOOP */
            var t0 = Date.now(), lf = 0;
            function loop() {
                requestAnimationFrame(loop);
                var t = (Date.now() - t0) / 1000, dt = Math.min(t - lf, .05); lf = t;

                /* Camera parallax */
                ctx += (mpx * 1.2 - ctx) * .04; cty += (mpy * .8 - cty) * .04;
                camera.position.x = ctx; camera.position.y = 2 + cty; camera.lookAt(0, 0, 0);

                /* Drone */
                drone.position.x = Math.sin(t * .45) * 7; drone.position.y = 3 + Math.sin(t * .9) * 1.2; drone.position.z = Math.cos(t * .45) * 4 - 3;
                drone.rotation.z = -Math.cos(t * .45) * .25; drone.rotation.x = Math.sin(t * .9) * .15;
                dProps.forEach(function (p) { p.g.rotation.y += .45 * p.d }); dl.intensity = 1.5 + Math.sin(t * 8) * .5;

                /* Rocket */
                rkCd -= dt;
                if (!rkOn && rkCd <= 0) { rkOn = true; rkVy = -12; rk.position.set(5, -15, -5); rkCd = 18 }
                if (rkOn) {
                    rkVy += dt * .8; rk.position.y += rkVy * dt * 2.5; rk.position.x = 5 + Math.sin(t * 2) * .15;
                    fg.scale.y = .8 + Math.random() * .4; fg.scale.x = .8 + Math.random() * .3;
                    if (rk.position.y > 20) { rkOn = false; rk.position.set(5, -15, -5) }
                }

                /* Robot */
                rbX += .018 * rbD; if (rbX > 7) rbD = -1; if (rbX < -7) rbD = 1;
                rb.position.set(rbX, -4.2, -1); rb.rotation.y = rbD > 0 ? 0 : Math.PI;
                var wk = t * 4;
                llG.rotation.x = Math.sin(wk) * .5; rlG.rotation.x = -Math.sin(wk) * .5;
                laG.rotation.x = -Math.sin(wk) * .4; raG.rotation.x = Math.sin(wk) * .4;
                hd.rotation.y = Math.sin(t * .8) * .25;
                var eg = 1.5 + Math.sin(t * 3) * .5; elL.intensity = eg; elR.intensity = eg;

                /* Floating shapes */
                fShapes.forEach(function (m) { m.rotation.x += .003 * m.userData.sp; m.rotation.y += .005 * m.userData.sp; m.position.y = m.userData.by + Math.sin(t * .3 * m.userData.sp + m.userData.of) * .8 });

                renderer.render(scene, camera);
            }
            loop();
        }
