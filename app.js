// The MIT License
// Copyright © 2024 Braulio Solorio
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

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



