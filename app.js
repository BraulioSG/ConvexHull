const btn = document.getElementById("play")
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onresize = (evt) => {
    console.log("hello")
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const POINTS_PER_GROUP = 10;

const colors = [
    "#ef476f",
    "#ffd166",
    "#06d6a0",
    "#118ab2",
    "#073b4c",
]

const points = [];
const hulls = [];

colors.forEach(color => {
    let colorGroup = [];
    for (let i = 0; i < POINTS_PER_GROUP; i++) {
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);
        colorGroup.push(new Point2D(ctx, x, y, color, 5));
    }
    points.push(colorGroup);
    hulls.push(new ConvexHull(ctx, colorGroup, color))
})

hulls.push(new ConvexHull(ctx, points.flat(), "white"));
let playing = true;
btn.onclick = () => {
    playing = !playing
}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.flat().forEach(point => {
        if (playing) point.update(canvas.width, canvas.height);
        point.draw();
    })

    hulls.forEach(hull => {
        hull.calcHull2();
        hull.draw();
    })
    window.requestAnimationFrame(animate);
}

animate();



