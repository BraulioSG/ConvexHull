// The MIT License
// Copyright © 2024 [Author name]
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

class Point2D {
    constructor(ctx, x, y, color = "#000000", size = 5) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;

        this.vx = (Math.random() * 2 - 1) * 0.5;
        this.vy = (Math.random() * 2 - 1) * 0.5;

        this.id = `${color}-${Math.round(Math.random() * 100000)}-${x}-${y}`
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.fillStyle = this.color;
        this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        this.ctx.fill();

    }
    update(width, height) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) {
            this.x = 1;
            this.vx = Math.abs(this.vx);
        }
        if (this.y < 0) {
            this.y = 1;
            this.vy = Math.abs(this.vy);
        }
        if (this.x > width) {
            this.x = width - 1;
            this.vx = -Math.abs(this.vx);

        }
        if (this.y > height) {
            this.y = height - 1;
            this.vy = -Math.abs(this.vy);

        }
    }

    distanceFrom(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;

        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    }

    angleFrom(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;


        if (dx == 0) {
            if (dy > 0) {
                return 0.5 * Math.PI;
            }
            if (dy < 0) {
                return 1.5 * Math.PI;
            }
            else {
                return 0;
            }
        }

        if (dy == 0) {
            if (dx >= 0) {
                return 0;
            }
            else {
                return Math.PI;
            }
        }

        let angle = Math.atan(Math.abs(dy) / Math.abs(dx));



        if (dx >= 0 && dy >= 0) {
            return angle;
        }
        if (dx < 0 && dy >= 0) {
            return Math.PI - angle;
        }
        if (dx < 0 && dy < 0) {
            return angle + Math.PI;
        }
        else {
            return (2 * Math.PI) - angle;
        }
    }

}

class LineEq {
    constructor(p1, p2) {
        this.m = (p2.y - p1.y) / (p2.x - p1.x);
        this.b = (p1.y - (this.m * p1.x))
    }

    solve(x) {
        return (this.m * x) + this.b;
    }

    intersectionWith(other) {
        const x = (other.b - this.b) / (this.m - other.m)

        return new Point2D(undefined, x, this.solve(x));
    }
}

class Node {
    constructor(value, next = null, prev = null) {
        this.value = value;
        this.next = next;
        this.prev = prev;
    }
}

class LinkedList {
    root = null;

    constructor(root = null) {
        if (root) {
            this.root = new Node(root);
        }
    }

    append(value) {
        const newNode = new Node(value);

        if (!this.root) {
            this.root = newNode;
        }
        else {
            let current = this.root;
            while (current.next) {
                current = current.next;
            }

            newNode.prev = current;
            current.next = newNode;
        }
    }

    insertAt(value, idx) {
        let current = this.root;
        const newNode = new Node(value);

        if (idx == 0) {
            newNode.next = this.root;
            this.root = newNode;
            return;
        }

        for (let i = 0; i < idx; i++) {
            if (!current.next) {
                current.next = newNode;
                newNode.prev = current;
                return;
            }

            current = current.next;
        }

        current.prev.next = newNode;
        newNode.prev = current.prev;
        current.prev = newNode;
        newNode.next = current;
    }

    find(value) {
        let current = this.root;

        while (current) {
            if (current.value.id === value.id) {
                return current;
            }

            current = current.next;
        }

        return null;
    }
}

class ConvexHull {
    center = null;
    constructor(ctx, points, color = null) {
        this.ctx = ctx;
        this.Hull = new LinkedList();
        this.color = color;
        this.points = points;

        if (points.length < 3) {
            throw Error("need at least 4 points");
        }

        this.calcHull();


    }

    calcHull2() {
        let points = this.points.sort((a, b) => {
            return a.x - b.x;
        })

        this.Hull = new LinkedList();

        this.Hull.append(points[0]) //more to the left

        let secondPoint = null;
        let secondTan = null;

        points.forEach(p => {

            const dx = p.x - this.Hull.root.value.x;
            const dy = p.y - this.Hull.root.value.y;

            if (dx == 0) return;
            const ang = Math.atan(Math.abs(dy) / Math.abs(dx));

            if (secondTan === null) {
                secondTan = ang;
                secondPoint = p;
            } else if (secondTan < ang) {
                secondTan = ang;
                secondPoint = p;
            }

        })
        this.Hull.append(secondPoint);

        const clockwise = secondPoint.y > this.Hull.root.value.y;

        let curr = this.Hull.root.next;
        for (; ;) {
            let nextP = null;
            let nextAng = null;

            const angBase = curr.value.angleFrom(curr.prev.value);

            points = points.filter(p => {
                if (this.Hull.find(p) === null) {
                    return true;
                }
                return p.id === this.Hull.root.value.id;
            })


            points.forEach(p => {
                if (p.id !== this.Hull.root.id) {
                }
                if (p.id === curr.prev.value.id) return;

                const pointAngle = curr.value.angleFrom(p);
                let ang = (pointAngle - angBase);

                if (ang < 0) {
                    ang = (2 * Math.PI) - (angBase - pointAngle)
                }


                if (nextAng === null) {
                    nextP = p;
                    nextAng = ang;
                }

                if (!clockwise) {
                    if (ang < nextAng) {
                        nextAng = ang;
                        nextP = p
                    }

                } else {
                    if (ang > nextAng) {
                        nextAng = ang;
                        nextP = p
                    }
                }

            })


            if (nextP.id === this.Hull.root.value.id) {
                break;
            }

            this.Hull.append(nextP);
            curr = curr.next;

        }

    }

    calcHull() {
        let points = this.points;
        this.Hull = new LinkedList();

        let minX = points[0];
        let maxX = points[0];

        let minY = points[0];
        let maxY = points[0];

        points.forEach(point => {

            if (point.x < minX.x) {
                minX = point;
            }
            if (point.x > maxX.x) {
                maxX = point;
            }
            if (point.y < minY.y) {
                minY = point;
            }
            if (point.y > maxY.y) {
                maxY = point;
            }
        });

        //first square
        this.Hull.append(minY);
        this.Hull.append(minX);
        this.Hull.append(maxY);
        this.Hull.append(maxX);


        //center
        let cx = 0.5 * (minX.x + maxX.x);
        let cy = 0.5 * (minY.y + maxY.y);

        this.center = new Point2D(this.ctx, cx, cy)


        while (points.length > 0) {

            let p1 = this.Hull.root;

            let remaining = [];

            points = points.filter(p => {
                if (this.Hull.find(p)) {
                    return false;
                }
                return true;
            })

            while (p1) {
                let p2 = p1.next;
                const next = p1.next;

                if (!p2) {
                    p2 = this.Hull.root;
                }

                let startAngle = this.center.angleFrom(p2.value);
                let endAngle = this.center.angleFrom(p1.value);

                let gap = endAngle - startAngle;

                const section = points.filter(p => {
                    let ang = this.center.angleFrom(p);

                    if (gap < 0) {
                        if (ang >= startAngle || ang <= endAngle) return true;
                        return false;
                    } else {
                        if (ang >= startAngle && ang <= endAngle) {
                            return true;
                        }
                        return false;
                    }
                })

                const sectionLine = new LineEq(p1.value, p2.value);
                let possible = []

                if (section.length > 0) {
                    let max = null;

                    possible = section.filter(p => {
                        const pointLine = new LineEq(this.center, p);
                        const intersection = sectionLine.intersectionWith(pointLine);
                        const distance = this.center.distanceFrom(p);


                        if (this.center.distanceFrom(intersection) < distance) {
                            if (max === null) {
                                max = p;
                            }
                            else if (distance > this.center.distanceFrom(max)) {
                                max = p;
                            }
                            return true;
                        }
                        return false;

                    });


                    if (max) {
                        const maxNode = new Node(max);
                        maxNode.next = p1.next;
                        maxNode.prev = p2.prev;

                        p1.next = maxNode;
                        p2.prev = maxNode;


                    }

                }
                p1 = next;

                remaining = [...remaining, ...possible];
            }

            points = remaining;

        }
    }

    draw() {

        let current = this.Hull.root;

        const color = this.color ? this.color : current.value.color;

        let point = current.value;


        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.moveTo(point.x, point.y);

        while (current) {
            point = current.value;
            this.ctx.lineTo(point.x, point.y);
            current = current.next;
        }

        this.ctx.lineTo(this.Hull.root.value.x, this.Hull.root.value.y);

        this.ctx.stroke();

    }
}
