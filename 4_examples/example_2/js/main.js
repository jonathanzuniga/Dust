import FPS from './fps.js'
import Pointer from './pointer.js'
import Verlet from './verlet.js'
import Vec2 from './vec2.js'
//import Grid from './grid.js'

function run(){

    // initialize the app
    const canvas = document.querySelector("canvas")
    const ctx = canvas.getContext("2d")
    const pointer = Pointer.init(canvas)


    const NUM = 2000
    const NUM_GRID_RELAX = 1

    const sim = new Verlet.Sim()
    let mouse_force = true
    //const grid = new Grid(12, 0, 0)


    const a = sim.addPoint(200, 200, 5)
    const b = sim.addPoint(300, 250, 5)
    const c = sim.addPoint(200, 300, 5)

    // c.pinned = true

    sim.addLink(a, b, 200, 0.1)
    sim.addLink(b, c, 200, 0.1)
    sim.addLink(c, a, 200, 0.1)


    // main loop
    function loop(time) {

        // resize the canvas
        const width  = ctx.canvas.offsetWidth   // css size
        const height = ctx.canvas.offsetHeight
        const ratio  = window.devicePixelRatio
        if (ctx.canvas.width != width * ratio || ctx.canvas.height != height * ratio){
            ctx.canvas.width = width * ratio
            ctx.canvas.height = height * ratio
            //grid.resize(width, height)
        }

        // if (pointer.pressed){
        //     for (let i=0; i<5; i++) {
        //         if (sim.points.length >= NUM) break
        //         const part_radius = Math.random() < 0.5 ? 5 : 8
        //         const r = 30
        //         const rs = Math.sqrt(Math.random()*r*r)
        //         const a = Math.random() * Math.PI * 2
        //         const x = pointer.x + Math.cos(a) * rs
        //         const y = pointer.y + Math.sin(a) * rs
        //         const p = sim.addPoint(x, y, part_radius)
        //     }
        // }

        // if (grid_snap) {
        //     PVector n = new PVector(round(a.pos.x / snap_size_x) * snap_size_x, round(a.pos.y / snap_size_y) * snap_size_y);
        //     PVector v1 = PVector.sub(a.pos, n).normalize().mult(0.1);
        //     a.pos.add(v1);
        // }

        // mouse
        if (mouse_force) {
            for (const a of sim.points) {
                const m = new Vec2(pointer.x, pointer.y)
                const v = a.pos.sub(m)

                if (v.magSq() < 5000) {
                    v.normSelf()
                    v.multSelf(0.9)
                    a.pos.addSelf(v)
                }
            }
        }

        // Repulsion
        for (let k=0; k<1; k++) {
            for (let j = 0; j < sim.points.length; j++) {
                const a = sim.points[j]
                for (let i=j+1; i<sim.points.length; i++) {

                    const b = sim.points[i]

                    const v  = a.pos.sub(b.pos)
                    const m  = v.mag()
                    const rs = a.radius + b.radius
                    if (m < rs) {
                        v.normSelf()
                        v.multSelf(0.6/(0.4 + m*m))
                        a.pos.addSelf(v)
                        b.pos.subSelf(v)
                    }
                }
            }
        }

        sim.update(1)
        sim.bounds(height)

        ctx.save()
        ctx.scale(ratio, ratio)

        ctx.fillStyle = 'black'
        ctx.fillRect(0, 0, width, height)

        ctx.fillStyle = 'white'
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 2

        for (const l of sim.links) {
            ctx.beginPath();
            ctx.moveTo(l.a.pos.x, l.a.pos.y)
            ctx.lineTo(l.b.pos.x, l.b.pos.y)
            ctx.stroke()
        }

        for (const p of sim.points) {
            ctx.beginPath()
            ctx.ellipse(p.pos.x, p.pos.y, p.radius, p.radius, 0, 0, Math.PI * 2)
            ctx.fill()
        }

        ctx.restore()

        let out = ""

        out += "FPS       : " + Math.round(FPS.step(time)) + "\n"
        out += "num parts : " + sim.points.length + "\n"

        document.querySelector('#log').innerHTML = out

        requestAnimationFrame(loop)
    }

    // start the animation
    requestAnimationFrame(loop)

}

export default {
    run
}





