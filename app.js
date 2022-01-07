const animation = (qSelector, start = 0, end, duration = 1000) => {
    const target = document.querySelector(qSelector);
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        target.innerText = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
};

function setInit() {
    window.location.reload();
    console.clear();
};

function setStaffhasPrise(staff) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("staffHasPrise").innerHTML = (`<p class="winner-staff">${staff.NAME} - ${staff.MSNV}</p>`);
    document.getElementById("changeButton").innerHTML = (`<div class="confirmButton"  onclick="showStaffAndPrise()"></div>`)
};

function showStaffAndPrise() {
    const staffhasprise = JSON.parse(localStorage.getItem("staffHasPrise") || "[]");
    const prize = staffhasprise.HASPRIZE;
    if (prize === 1) {
        prise = "Giải Nhất";
        value = "5 000 000Đ"
    } else if (prize === 2) {
        prise = "Giải Nhì";
        value = "3 000 000Đ"
    } else {
        prise = "Giải Ba";
        value = "2 000 000Đ";
    };
    const daden = staffhasprise.GENDER;
    const vp = staffhasprise.VP;
    var confettiSettings = { target: 'my-canvas' };
    var confetti = new ConfettiGenerator(confettiSettings);
    document.getElementById("my-canvas").hidden = false;
    confetti.render();
    setTimeout(function () {
        confetti.clear();
        document.getElementById("my-canvas").hidden = true;
    }, 3000)
    document.getElementById("banner").innerHTML = (`<div class="congratulation"> 
    </div>`)
    document.getElementById("staffHasPrise").innerHTML = (`
        <p class="priseAndGifts">${prise}</p>
        <p class="staff">${daden} ${staffhasprise.NAME}</p>
        <p class="staff">${staffhasprise.DEPARTMENT} - ${vp}</p>
        <p class="priseAndGifts">${value}</p>`
    );
    document.getElementById("changeButton").style.display = "none";
    document.getElementById("selectValue").hidden = true;
    document.getElementById("loading").hidden = true;
    document.getElementById("continueButton").hidden = false;
};

// const filterListStaff = (listStaff, staffRandom) => {
//     const listhaspr = browseList();
//     if (listhaspr.length > 0) {
//         for (let i = 0; i < listhaspr.length; i++) {
//             for (let j = 0; j < listStaff.length; j++) {
//                 if (listStaff[j].idst === listhaspr[i]) {
//                     const newList = listStaff.splice(j, 1);
//                     const lastList = listStaff.filter(n => !newList.includes(n));
//                     setTimeout(function () {
//                         setStaffHasPriseToLocal(lastList, staffRandom);
//                     }, 3000);
//                 }
//             }
//         }
//     } else {
//         setTimeout(function () {
//             setStaffHasPriseToLocal(listStaff, staffRandom);
//         }, 3000);
//     }
// }

// function browseList() {
//     let listStaffHasPrise = [];
//     const list = [];
//     let storage = localStorage.getItem('listStaffHasPrise');
//     if (storage) {
//         listStaffHasPrise = JSON.parse(storage);
//     }
//     for (let i = 0; i < listStaffHasPrise.length; i++) {
//         list.push(listStaffHasPrise[i].idst);
//     }
//     return list;
// }

function setStaffHasPriseToLocal(listStaff, staffRandom) {
    let listStaffHasPrise = [];
    const value = getPrise();
    for (let i = 0; i < listStaff.length; i++) {
        if (listStaff[i].MSNV === staffRandom.MSNV) {
            listStaff[i].HASPRIZE = value;
            localStorage.setItem("staffHasPrise", JSON.stringify(listStaff[i]));
            let storage = localStorage.getItem('listStaffHasPrise');
            if (storage) {
                listStaffHasPrise = JSON.parse(storage);
            }
            let st = listStaff[i];
            if (st) {
                listStaffHasPrise.push(st);
            }
            localStorage.setItem('listStaffHasPrise', JSON.stringify(listStaffHasPrise));
            setTimeout(function () {
                setStaffhasPrise(listStaff[i]);
            }, 8000);
        }
    }
};


function randomStaff() {
    const vp = getVp();
    if (vp === 1) {
        const listHN = JSON.parse(localStorage.getItem('HN'));
        const listDN = JSON.parse(localStorage.getItem('ĐN'));
        listStaff = listHN.concat(listDN);
    }
    if (vp === 0) {
        listStaff = JSON.parse(localStorage.getItem('HCM'));
    }
    const staffRandom = listStaff[Math.floor(Math.random() * listStaff.length)];
    setStaffHasPriseToLocal(listStaff, staffRandom);
    return staffRandom.MSNV;
};

function getPrise() {
    const prise = document.querySelector("#prise");
    if (prise.value === "1") {
        return 1;
    } else if (prise.value === "2") {
        return 2;
    } else if (prise.value === "3") {
        return 3;
    }
};

function getVp() {
    const vp = document.querySelector("#vp");
    if (vp.value === "1") {
        return 1;
    } else if (vp.value === "0") {
        return 0;
    }
};

function loading() {
    document.getElementById("selectValue").style.display = "none";
    document.getElementById("loading").innerHTML = (`
    <div id="myProgress">
        <div id="myBar"></div>
    </div>`);
    document.getElementById("changeButton").innerHTML = "";
    move();
};

function rollingNumber(aclass, index, numberAfterRandom) {
    for (let i = 0; i <= index; i++) {
        setTimeout(function () {
            animation(aclass, 0, 9, 500);
        }, 100 + i * 500);
    }
    setTimeout(function () {
        animation(aclass, 0, numberAfterRandom, 650);
    }, 100 + index * 500);
};

function roll() {
    let HN = [];
    let HCM = [];
    let storage1 = localStorage.getItem('HN');
    let storage2 = localStorage.getItem('HCM');
    if (storage1) {
        HN = JSON.parse(storage1);
    }
    if (storage2) {
        HCM = JSON.parse(storage2);
    }
    if (HN.length == 0 || HCM.length == 0) {
        alert('Vui lòng thêm danh sách nhân viên từ hai văn phòng.')
    } else {
        document.getElementById("addList").style.display = "none";
        async function asyncGetVp() {
            const result = await getVp();
            try {
                var myMusic = document.getElementById("music");
                myMusic.play();
                const random = [randomStaff()];
                const randomIdst = random.toString().split("");
                rollingNumber("#randomNumber1", 4, randomIdst[0]);
                rollingNumber("#randomNumber2", 7, randomIdst[1]);
                rollingNumber("#randomNumber3", 10, randomIdst[2]);
                rollingNumber("#randomNumber4", 13, randomIdst[3]);
                async function asyncGetPrise() {
                    const result = await getPrise();

                    loading();
                }
                asyncGetPrise()
            } catch (error) {
                console.log(error);
            }
        }
        asyncGetVp();
    }
};

var ExcelToJSON = function (name) {

    this.parseExcel = function (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            workbook.SheetNames.forEach(function (sheetName) {
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                var json_object = JSON.stringify(XL_row_object);
                console.log(JSON.parse(json_object));
                localStorage.setItem(sheetName, json_object);
            })
        };

        reader.onerror = function (ex) {
            console.log(ex);
        };

        reader.readAsBinaryString(file);
    };
};

function handleFileSelect(evt) {

    var files = evt.target.files; // FileList object
    var xl2json = new ExcelToJSON("listStaffHN");
    xl2json.parseExcel(files[0]);
};

function handleFileSelect1(evt) {

    var files = evt.target.files; // FileList object
    var xl2json = new ExcelToJSON("listStaffHCM");
    xl2json.parseExcel(files[0]);
};



var i = 0;
function move() {
    if (i === 0) {
        i = 1;
        var elem = document.getElementById("myBar");
        var width = 1;
        var id = setInterval(frame, 40);
        function frame() {
            if (width >= 100) {
                clearInterval(id);
                i = 0;
            } else {
                width += 0.5;
                elem.style.width = width + "%";
            }
        }
    }
};

function ConfettiGenerator(params) {

    var appstate = {
        target: 'confetti-holder', // Id of the canvas
        max: 300, // Max itens to render
        size: 2, // prop size
        animate: true, // Should animate?
        respawn: true, // Should confettis be respawned when getting out of screen?
        props: ['circle', 'square', 'triangle', 'line'], // Types of confetti
        // colors: [[255, 228, 80], [255, 255, 109], [255, 255, 137], [255, 255, 165]], // Colors to render confetti
        colors: [[165, 104, 246], [230, 61, 135], [0, 199, 228], [253, 214, 126]], // Colors to render confetti
        clock: 20, // Speed of confetti fall
        interval: null, // Draw interval holder
        rotate: false, // Whenever to rotate a prop
        start_from_edge: false, // Should confettis spawn at the top/bottom of the screen?
        width: window.innerWidth, // canvas width (as int, in px)
        height: window.innerHeight // canvas height (as int, in px)
    };


    if (params) {
        if (params.target)
            appstate.target = params.target;
        if (params.max)
            appstate.max = params.max;
        if (params.size)
            appstate.size = params.size;
        if (params.animate !== undefined && params.animate !== null)
            appstate.animate = params.animate;
        if (params.respawn !== undefined && params.respawn !== null)
            appstate.respawn = params.respawn;
        if (params.props)
            appstate.props = params.props;
        if (params.colors)
            appstate.colors = params.colors;
        if (params.clock)
            appstate.clock = params.clock;
        if (params.start_from_edge !== undefined && params.start_from_edge !== null)
            appstate.start_from_edge = params.start_from_edge;
        if (params.width)
            appstate.width = params.width;
        if (params.height)
            appstate.height = params.height;
        if (params.rotate !== undefined && params.rotate !== null)
            appstate.rotate = params.rotate;
    }


    if (
        typeof appstate.target != 'object' &&
        typeof appstate.target != 'string'
    ) {
        throw new TypeError('The target parameter should be a node or string');
    }

    if (
        (typeof appstate.target == 'object' && (appstate.target === null || !appstate.target instanceof HTMLCanvasElement)) ||
        (typeof appstate.target == 'string' && (document.getElementById(appstate.target) === null || !document.getElementById(appstate.target) instanceof HTMLCanvasElement))
    ) {
        throw new ReferenceError('The target element does not exist or is not a canvas element');
    }


    var cv = typeof appstate.target == 'object'
        ? appstate.target
        : document.getElementById(appstate.target);
    var ctx = cv.getContext("2d");
    var particles = [];


    function rand(limit, floor) {
        if (!limit) limit = 1;
        var rand = Math.random() * limit;
        return !floor ? rand : Math.floor(rand);
    }

    var totalWeight = appstate.props.reduce(function (weight, prop) {
        return weight + (prop.weight || 1);
    }, 0);
    function selectProp() {
        var rand = Math.random() * totalWeight;
        for (var i = 0; i < appstate.props.length; ++i) {
            var weight = appstate.props[i].weight || 1;
            if (rand < weight) return i;
            rand -= weight;
        }
    }


    function particleFactory() {
        var prop = appstate.props[selectProp()];
        var p = {
            prop: prop.type ? prop.type : prop, //prop type
            x: rand(appstate.width), //x-coordinate
            y: appstate.start_from_edge ? (appstate.clock >= 0 ? -10 : parseFloat(appstate.height) + 10) : rand(appstate.height), //y-coordinate
            src: prop.src,
            radius: rand(4) + 1, //radius
            size: prop.size,
            rotate: appstate.rotate,
            line: Math.floor(rand(65) - 30), // line angle
            angles: [rand(10, true) + 2, rand(10, true) + 2, rand(10, true) + 2, rand(10, true) + 2], // triangle drawing angles
            color: appstate.colors[rand(appstate.colors.length, true)], // color
            rotation: rand(360, true) * Math.PI / 180,
            speed: rand(appstate.clock / 7) + (appstate.clock / 30)
        };

        return p;
    }


    function particleDraw(p) {
        if (!p) {
            return;
        }

        var op = (p.radius <= 3) ? 0.4 : 0.8;

        ctx.fillStyle = ctx.strokeStyle = "rgba(" + p.color + ", " + op + ")";
        ctx.beginPath();

        switch (p.prop) {
            case 'circle': {
                ctx.moveTo(p.x, p.y);
                ctx.arc(p.x, p.y, p.radius * appstate.size, 0, Math.PI * 2, true);
                ctx.fill();
                break;
            }
            case 'triangle': {
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + (p.angles[0] * appstate.size), p.y + (p.angles[1] * appstate.size));
                ctx.lineTo(p.x + (p.angles[2] * appstate.size), p.y + (p.angles[3] * appstate.size));
                ctx.closePath();
                ctx.fill();
                break;
            }
            case 'line': {
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x + (p.line * appstate.size), p.y + (p.radius * 5));
                ctx.lineWidth = 2 * appstate.size;
                ctx.stroke();
                break;
            }
            case 'square': {
                ctx.save();
                ctx.translate(p.x + 15, p.y + 5);
                ctx.rotate(p.rotation);
                ctx.fillRect(-15 * appstate.size, -5 * appstate.size, 15 * appstate.size, 5 * appstate.size);
                ctx.restore();
                break;
            }
            case 'svg': {
                ctx.save();
                var image = new window.Image();
                image.src = p.src;
                var size = p.size || 15;
                ctx.translate(p.x + size / 2, p.y + size / 2);
                if (p.rotate)
                    ctx.rotate(p.rotation);
                ctx.drawImage(image, -(size / 2) * appstate.size, -(size / 2) * appstate.size, size * appstate.size, size * appstate.size);
                ctx.restore();
                break;
            }
        }
    }


    var _clear = function () {
        appstate.animate = false;
        clearInterval(appstate.interval);

        requestAnimationFrame(function () {
            ctx.clearRect(0, 0, cv.width, cv.height);
            var w = cv.width;
            cv.width = 1;
            cv.width = w;
        });
    }


    var _render = function () {
        cv.width = appstate.width;
        cv.height = appstate.height;
        particles = [];

        for (var i = 0; i < appstate.max; i++)
            particles.push(particleFactory());

        function draw() {
            ctx.clearRect(0, 0, appstate.width, appstate.height);

            for (var i in particles)
                particleDraw(particles[i]);

            update();

            if (appstate.animate) requestAnimationFrame(draw);
        }

        function update() {

            for (var i = 0; i < appstate.max; i++) {
                var p = particles[i];

                if (p) {
                    if (appstate.animate)
                        p.y += p.speed;

                    if (p.rotate)
                        p.rotation += p.speed / 35;

                    if ((p.speed >= 0 && p.y > appstate.height) || (p.speed < 0 && p.y < 0)) {
                        if (appstate.respawn) {
                            particles[i] = p;
                            particles[i].x = rand(appstate.width, true);
                            particles[i].y = p.speed >= 0 ? -10 : parseFloat(appstate.height);
                        } else {
                            particles[i] = undefined;
                        }
                    }
                }
            }

            if (particles.every(function (p) { return p === undefined; })) {
                _clear();
            }
        }

        return requestAnimationFrame(draw);
    };

    return {
        render: _render,
        clear: _clear
    }
};
