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
}

function setStaffhasPrise(staff) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("staffHasPrise").innerHTML = (`<p class="winner-staff">${staff.name} - ${staff.idst}</p>`);
    document.getElementById("changeButton").innerHTML = (`<div class="confirmButton"  onclick="showStaffAndPrise()"></div>`)
}

function showStaffAndPrise() {
    const staffhasprise = JSON.parse(localStorage.getItem("staffHasPrise") || "[]");
    const prize = staffhasprise.hasPrise;
    if (prize === 1) {
        prise = "Giải Nhất";
        value = "Mười tỏi"
    } else if (prize === 2) {
        prise = "Giải Nhì";
        value = "5 tỏi"
    } else {
        prise = "Giải Ba";
        value = "2 tỏi";
    };
    const daden = staffhasprise.gender;
    if (staffhasprise.vp === "1") {
        vp = "VP HN";
    } else if ( staffhasprise.vp === "2") {
        vp = "VP ĐN";
    } else {
        vp = "VP HCM"
    };
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
    <div class="awards">
        <p class="priseAndGifts">${prise}</p>
        <p class="staff">${daden} ${staffhasprise.name}</p>
        <p class="staff">${staffhasprise.department} - ${vp}</p>
        <p class="priseAndGifts">${value}</p>
    </div>`);
    document.getElementById("changeButton").style.display = "none";
    document.getElementById("selectValue").hidden = true;
    document.getElementById("loading").hidden = true;
    document.getElementById("continueButton").hidden = false;
}

function setStaffHasPriseToLocal(listStaff, staffRandom) {
    let listStaffHasPrise = [];
    const value = getPrise();
    for (let i = 0; i < listStaff.length; i++) {
        if (listStaff[i].idst === staffRandom.idst) {
            listStaff[i].hasPrise = value;
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
}


function randomStaff() {
    const vp = getVp();
    if (vp === 1) {
        listStaff = vphn;
    }
    if (vp === 0) {
        listStaff = vphcm;
    }
    const staffRandom = listStaff[Math.floor(Math.random() * listStaff.length)];
    setStaffHasPriseToLocal(listStaff, staffRandom);
    return staffRandom.idst;
}

function getPrise() {
    const prise = document.querySelector("#prise");
    if (prise.value === "1") {
        return 1;
    } else if (prise.value === "2") {
        return 2;
    } else if (prise.value === "3") {
        return 3;
    }
}

function getVp() {
    const vp = document.querySelector("#vp");
    if (vp.value === "1") {
        return 1;
    } else if (vp.value === "2") {
        return 0;
    }
}

function loading() {
    document.getElementById("selectValue").style.display = "none";
    document.getElementById("loading").innerHTML = (`
    <div id="myProgress">
        <div id="myBar"></div>
    </div>`);
    document.getElementById("changeButton").innerHTML = "";
    move();
}

function rollingNumber(aclass, index, numberAfterRandom) {
    for (let i = 0; i <= index; i++) {
        setTimeout(function () {
            animation(aclass, 0, 9, 500);
        }, 100 + i * 500);
    }
    setTimeout(function () {
        animation(aclass, 0, numberAfterRandom, 650);
    }, 100 + index * 500);
}

function roll() {
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
}

function ConfettiGenerator(params) {

    var appstate = {
        target: 'confetti-holder', // Id of the canvas
        max: 300, // Max itens to render
        size: 2, // prop size
        animate: true, // Should animate?
        respawn: true, // Should confettis be respawned when getting out of screen?
        props: ['circle', 'square', 'triangle', 'line'], // Types of confetti
        // colors: [[255, 228, 80], [255, 255, 109], [255, 255, 137], [255, 255, 165]], // Colors to render confetti
        colors: [[165,104,246],[230,61,135],[0,199,228],[253,214,126]], // Colors to render confetti
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
}

const vphn = [
    {
        "id": "1",
        "idst": "0016",
        "name": "PHAN BÁCH",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "2",
        "idst": "0020",
        "name": "HOÀNG THỊ THU TRANG",
        "gender": "CHỊ",
        "department": "BAN TCKT",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "3",
        "idst": "0022",
        "name": "TRẦN QUỲNH VI",
        "gender": "CHỊ",
        "department": "TTKD1",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "4",
        "idst": "0027",
        "name": "NGUYỄN THÀNH AN",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "5",
        "idst": "0028",
        "name": "NGUYỄN VIỆT AN",
        "gender": "ANH ",
        "department": "TTKD1",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "6",
        "idst": "0031",
        "name": "NGUYỄN THĂNG LONG",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "7",
        "idst": "0042",
        "name": "NGUYỄN ĐỨC ANH",
        "gender": "ANH ",
        "department": "TTKD2",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "8",
        "idst": "0060",
        "name": "NGUYỄN THANH TUẤN",
        "gender": "ANH ",
        "department": "TTKD2",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "9",
        "idst": "0068",
        "name": "BẠCH HOÀI KHANH",
        "gender": "ANH ",
        "department": "TTKD2",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "10",
        "idst": "0085",
        "name": "PHẠM THU TRANG",
        "gender": "CHỊ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "11",
        "idst": "0086",
        "name": "MAI THỊ HƯƠNG",
        "gender": "CHỊ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "12",
        "idst": "0096",
        "name": "PHAN MINH HẢI",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "13",
        "idst": "0108",
        "name": "ĐINH THỊ MINH KHÁNH",
        "gender": "CHỊ",
        "department": "BAN MH & HTKD",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "14",
        "idst": "0144",
        "name": "PHẠM DIỄM QUỲNH",
        "gender": "CHỊ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "15",
        "idst": "0149",
        "name": "NGUYỄN THỊ HẢI LINH",
        "gender": "CHỊ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "16",
        "idst": "0185",
        "name": "TẠ CÔNG CHIẾN",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "17",
        "idst": "0195",
        "name": "NGUYỄN ĐỨC THIỆN",
        "gender": "ANH ",
        "department": "TTKD1",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "18",
        "idst": "0270",
        "name": "TRẦN MẠNH HÀ",
        "gender": "ANH ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "19",
        "idst": "0279",
        "name": "NGUYỄN QUỐC TOẢN",
        "gender": "ANH ",
        "department": "TTKD2",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "20",
        "idst": "0345",
        "name": "TÔ DUY LINH",
        "gender": "ANH ",
        "department": "TTKD2",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "21",
        "idst": "0347",
        "name": "ĐINH TỐ QUYÊN",
        "gender": "CHỊ",
        "department": "TTKD2",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "22",
        "idst": "0356",
        "name": "ĐẶNG TÙNG ANH",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "23",
        "idst": "0384",
        "name": "NGUYỄN THU HÀ",
        "gender": "CHỊ",
        "department": "SAIGONCTT",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "24",
        "idst": "0389",
        "name": "BÙI TUẤN ANH",
        "gender": "ANH ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "25",
        "idst": "0395",
        "name": "LÊ THANH HIẾU",
        "gender": "ANH ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "26",
        "idst": "0402",
        "name": "ĐINH VIẾT LUÂN",
        "gender": "ANH ",
        "department": "TTKD1",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "27",
        "idst": "0421",
        "name": "NGUYỄN MẠNH DŨNG",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "28",
        "idst": "0438",
        "name": "PHẠM VĂN QUYẾT",
        "gender": "ANH ",
        "department": "TTKD2",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "29",
        "idst": "0440",
        "name": "NGUYỄN XUÂN QUANG",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "30",
        "idst": "0446",
        "name": "LÊ VIỆT HƯNG",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "31",
        "idst": "0453",
        "name": "TRẦN VIỆT PHƯƠNG",
        "gender": "ANH ",
        "department": "TTKD1",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "32",
        "idst": "0454",
        "name": "NGUYỄN THỊ PHƯỢNG",
        "gender": "CHỊ",
        "department": "BAN TCKT",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "33",
        "idst": "0461",
        "name": "LÊ ĐỨC CƯỜNG",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "34",
        "idst": "3003",
        "name": "BÙI ĐÌNH KHÁNH",
        "gender": "ANH ",
        "department": "TTPM",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "35",
        "idst": "3004",
        "name": "VŨ ĐÌNH ĐỨC",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "36",
        "idst": "3012",
        "name": "BÙI NGỌC HƯƠNG",
        "gender": "CHỊ",
        "department": "BAN MH & HTKD",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "37",
        "idst": "3013",
        "name": "NGUYỄN THU TRANG",
        "gender": "CHỊ",
        "department": "TTPM",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "38",
        "idst": "3017",
        "name": "VÕ QUÝ ĐỨC",
        "gender": "ANH ",
        "department": "TTPM",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "39",
        "idst": "3019",
        "name": "LÊ KIM THANH",
        "gender": "CHỊ",
        "department": "SAIGONCTT",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "40",
        "idst": "3022",
        "name": "PHẠM NGỌC HOÀNG NGÂN",
        "gender": "CHỊ",
        "department": "BAN NS - TT",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "41",
        "idst": "3024",
        "name": "NGUYỄN HỮU DUY",
        "gender": "ANH ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "42",
        "idst": "3029",
        "name": "NGUYỄN ANH TUẤN",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "43",
        "idst": "3032",
        "name": "NGUYỄN VIỆT HƯNG",
        "gender": "ANH ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "44",
        "idst": "3040",
        "name": "LÊ THỊ THÙY AN",
        "gender": "CHỊ",
        "department": "BAN NS - TT",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "45",
        "idst": "3041",
        "name": "NGUYỄN QUANG THUẬN",
        "gender": "ANH ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "46",
        "idst": "3043",
        "name": "TRẦN VĂN DUY",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "47",
        "idst": "3045",
        "name": "NGÔ MỸ NHẬT LINH",
        "gender": "CHỊ",
        "department": "BAN TCKT",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "48",
        "idst": "3047",
        "name": "PHẠM THẾ CƯỜNG",
        "gender": "ANH ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "49",
        "idst": "3048",
        "name": "PHẠM THANH HIẾU",
        "gender": "ANH ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "50",
        "idst": "3053",
        "name": "VŨ ĐỨC MINH HIẾU",
        "gender": "ANH ",
        "department": "TTKD1",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "51",
        "idst": "3054",
        "name": "NGUYỄN TUẤN DŨNG",
        "gender": "ANH ",
        "department": "TTKD2",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "52",
        "idst": "3055",
        "name": "TRẦN VĂN NGHĨA",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "53",
        "idst": "3056",
        "name": "NGUYỄN PHÚC THANH",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "54",
        "idst": "3057",
        "name": "NGUYỄN THU THUỲ",
        "gender": "CHỊ",
        "department": "BAN NS - TT",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "55",
        "idst": "3058",
        "name": "NGUYỄN THUÝ HÀ",
        "gender": "CHỊ",
        "department": "BAN MH & HTKD",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "56",
        "idst": "3061",
        "name": "ĐOÀN VIẾT HÙNG",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "57",
        "idst": "3063",
        "name": "NGUYỄN VIẾT ĐỨC",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "58",
        "idst": "3065",
        "name": "NGÔ VĂN NHẬT",
        "gender": "ANH ",
        "department": "TTKD2",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "59",
        "idst": "3067",
        "name": "PHẠM THANH LONG",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "60",
        "idst": "3068",
        "name": "CAO MINH THỊNH",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "61",
        "idst": "3070",
        "name": "NGUYỄN MẠNH THẮNG",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "62",
        "idst": "3079",
        "name": "ĐỖ MINH ANH",
        "gender": "ANH ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "63",
        "idst": "3081",
        "name": "NGUYỄN QUỐC THÁI",
        "gender": "ANH ",
        "department": "TTKD1",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "64",
        "idst": "3085",
        "name": "TẠ HOÀNG TRANG",
        "gender": "CHỊ",
        "department": "BAN MH & HTKD",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "65",
        "idst": "3083",
        "name": "NGUYỄN THỊ HOÀI TRANG",
        "gender": "CHỊ",
        "department": "BAN MH & HTKD",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "66",
        "idst": "3086",
        "name": "HOÀNG VŨ DƯƠNG",
        "gender": "ANH ",
        "department": "TTKD1",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "67",
        "idst": "3090",
        "name": "NGUYỄN DUY THÀNH",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "68",
        "idst": "3091",
        "name": "NGUYỄN ĐỨC HOÀNG",
        "gender": "ANH ",
        "department": "SAIGONCTT",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "69",
        "idst": "3094",
        "name": "NGUYỄN THỊ HÀ ANH",
        "gender": "CHỊ",
        "department": "SAIGONCTT",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "70",
        "idst": "3095",
        "name": "NGUYỄN HOÀNG NAM",
        "gender": "ANH ",
        "department": "TTKD1",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "71",
        "idst": "3098",
        "name": "NGUYỄN THANH TÙNG",
        "gender": "ANH ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "72",
        "idst": "3099",
        "name": "DƯƠNG HOÀNG GIANG",
        "gender": "ANH ",
        "department": "TTPM",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "73",
        "idst": "3100",
        "name": "TRƯƠNG KHÁNH LINH",
        "gender": "CHỊ",
        "department": "BAN NS - TT",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "74",
        "idst": "3101",
        "name": "TÔ THẾ DŨNG",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "75",
        "idst": "3102",
        "name": "CHỬ VĂN HOÀNG",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "76",
        "idst": "3104",
        "name": "DƯƠNG QUANG PHÚC",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "77",
        "idst": "3106",
        "name": "LÊ NGỌC ANH",
        "gender": "CHỊ",
        "department": "BAN MH & HTKD",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "78",
        "idst": "3108",
        "name": "VŨ ĐÌNH TRUNG",
        "gender": "ANH ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "79",
        "idst": "3109",
        "name": "NGUYỄN THỊ UYÊN",
        "gender": "CHỊ",
        "department": "SAIGONCTT",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "80",
        "idst": "3111",
        "name": "NGUYỄN KHÁNH LINH",
        "gender": "CHỊ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "81",
        "idst": "3112",
        "name": "LÊ THỊ THU HƯƠNG",
        "gender": "CHỊ",
        "department": "SAIGONCTT",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "82",
        "idst": "3113",
        "name": "NGUYỄN DUY LINH",
        "gender": "ANH ",
        "department": "TTPM",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "83",
        "idst": "3114",
        "name": "TRẦN VŨ VINH",
        "gender": "ANH ",
        "department": "SAIGONCTT",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "84",
        "idst": "3115",
        "name": "NGUYỄN THỊ HẠNH",
        "gender": "CHỊ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "85",
        "idst": "3117",
        "name": "NGUYỄN HOÀNG DƯƠNG",
        "gender": "ANH ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "86",
        "idst": "3118",
        "name": "NGUYỄN HOÀNG MINH",
        "gender": "ANH ",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "87",
        "idst": "3120",
        "name": "PHẠM DUY HIỆP",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "88",
        "idst": "3121",
        "name": "NGÔ THẾ CHUNG",
        "gender": "ANH ",
        "department": "TTKD2",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "89",
        "idst": "3122",
        "name": "LÂM BẢO YẾN",
        "gender": "CHỊ",
        "department": "BAN NS - TT",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "90",
        "idst": "3123",
        "name": "NGUYỄN NGUYỆT MINH",
        "gender": "CHỊ",
        "department": "SAIGONCTT",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "91",
        "idst": "3124",
        "name": "DƯƠNG QUỐC VIỆT",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "92",
        "idst": "3126",
        "name": "PHẠM TUẤN NAM",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "93",
        "idst": "3128",
        "name": "NGUYỄN THẾ HƯỞNG",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "94",
        "idst": "3131",
        "name": "ĐẶNG XUÂN DUY",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "95",
        "idst": "3132",
        "name": "VŨ HOÀNG ",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "96",
        "idst": "3133",
        "name": "PHẠM VĂN ĐẠT",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "97",
        "idst": "3134",
        "name": "PHẠM DIỆU HUYỀN",
        "gender": "CHỊ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "98",
        "idst": "3135",
        "name": "TRỊNH XUÂN ĐẠT",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "99",
        "idst": "3136",
        "name": "NGUYỄN HOÀNG DƯƠNG",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "100",
        "idst": "3137",
        "name": "NGUYỄN CÔNG TÌNH",
        "gender": "ANH ",
        "department": "TTKD2",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "101",
        "idst": "3140",
        "name": "BÙI ĐÌNH THIÊN TÌNH",
        "gender": "ANH ",
        "department": "TTPM",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "102",
        "idst": "3141",
        "name": "LÊ CÔNG MẠNH",
        "gender": "ANH ",
        "department": "TTKD1",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "103",
        "idst": "3142",
        "name": "VŨ HỮU MINH ",
        "gender": "ANH ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "104",
        "idst": "3143",
        "name": "LÊ TRUNG KIÊN",
        "gender": "ANH ",
        "department": "TTKD1",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "105",
        "idst": "3144",
        "name": "CAO MINH TÂM",
        "gender": "ANH ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "106",
        "idst": "3145",
        "name": "NGÔ GIA HƯNG",
        "gender": "ANH ",
        "department": "TTPM",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "107",
        "idst": "3146",
        "name": "ĐẶNG THANH BÌNH",
        "gender": "ANH ",
        "department": "TTPM",
        "hasPrise": "0",
        "vp": "1"
    },
    {
        "id": "108",
        "idst": "0266",
        "name": "HUỲNH PHƯỚC THUẬN",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "2"
    },
    {
        "id": "109",
        "idst": "0401",
        "name": "HUỲNH THÀNH CÔNG",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "2"
    },
    {
        "id": "110",
        "idst": "3075",
        "name": "HÀ ĐỨC TÀI",
        "gender": "ANH ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "2"
    }
]

const vphcm = [
    {
        "id": "1",
        "idst": "0002",
        "name": "HOÀNG THỊ TÚ ANH",
        "gender": "CHỊ",
        "department": "VP HĐQT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "2",
        "idst": "0010",
        "name": "NGUYỄN VŨ TRUNG THÀNH",
        "gender": "ANH",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "3",
        "idst": "0012",
        "name": "LƯƠNG LÊ TUẤN",
        "gender": "ANH",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "4",
        "idst": "0014",
        "name": "THANG NGỌC BẢO TRÂN",
        "gender": "CHỊ",
        "department": "BAN TCKT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "5",
        "idst": "0015",
        "name": "TRỊNH THỊ THANH HUYỀN",
        "gender": "CHỊ",
        "department": "VP HĐQT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "6",
        "idst": "0043",
        "name": "NGUYỄN VĂN BÍNH",
        "gender": "ANH",
        "department": "VP HĐQT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "7",
        "idst": "0048",
        "name": "TRỊNH VIẾT DŨNG",
        "gender": "ANH",
        "department": "VP HĐQT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "8",
        "idst": "0057",
        "name": "NGUYỄN VĂN DỰ",
        "gender": "ANH",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "9",
        "idst": "0076",
        "name": "ĐỖ THỊ NGỌC CHÂU",
        "gender": "CHỊ",
        "department": "BAN TCKT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "10",
        "idst": "0089",
        "name": "NGUYỄN TRÍ CƯƠNG",
        "gender": "ANH",
        "department": "BAN MH & HTKD",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "11",
        "idst": "0098",
        "name": "ĐẶNG THỊ KIM KHÁNH",
        "gender": "CHỊ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "12",
        "idst": "0117",
        "name": "NGHÊ THỊ PHƯƠNG UYÊN",
        "gender": "CHỊ",
        "department": "VP HĐQT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "13",
        "idst": "0118",
        "name": "NGUYỄN NGỌC CHÂU",
        "gender": "CHỊ",
        "department": "BAN TCKT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "14",
        "idst": "0119",
        "name": "PHẠM THỊ CẨM CHÂU",
        "gender": "CHỊ",
        "department": "BAN MH & HTKD",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "15",
        "idst": "0123",
        "name": "HUỲNH THẾ PHƯƠNG",
        "gender": "ANH",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "16",
        "idst": "0127",
        "name": "NGUYỄN TRUNG HẢI",
        "gender": "ANH",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "17",
        "idst": "0136",
        "name": "NGUYỄN VIỆT HẢI",
        "gender": "ANH",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "18",
        "idst": "0173",
        "name": "VŨ THANH NGUYỆT",
        "gender": "CHỊ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "19",
        "idst": "0203",
        "name": "LÊ HOÀNG NGUYÊN",
        "gender": "ANH",
        "department": "SAIGONCTT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "20",
        "idst": "0257",
        "name": "TRẦN THỊ THANH THẢO",
        "gender": "CHỊ",
        "department": "BAN TCKT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "21",
        "idst": "0200",
        "name": "CÔ THỊ MỸ DUNG",
        "gender": "CHỊ",
        "department": "BAN TCKT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "22",
        "idst": "0350",
        "name": "NGUYỄN VŨ THANH TÂM",
        "gender": "ANH",
        "department": "VP HĐQT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "23",
        "idst": "0361",
        "name": "TRẦN THÀNH TRÍ",
        "gender": "ANH",
        "department": "SAIGONCTT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "24",
        "idst": "0382",
        "name": "NGUYỄN VĂN THÀNH",
        "gender": "ANH",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "25",
        "idst": "0386",
        "name": "HUỲNH THỊ AN NY",
        "gender": "CHỊ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "26",
        "idst": "0404",
        "name": "NGUYỄN HOÀNG VIỆT",
        "gender": "ANH",
        "department": "TTKD MIỀN NAM",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "27",
        "idst": "0408",
        "name": "NGUYỄN VĂN KIÊN",
        "gender": "ANH",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "28",
        "idst": "0430",
        "name": "HUỲNH THỊ KIM NGỌC",
        "gender": "CHỊ",
        "department": "BAN TCKT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "29",
        "idst": "0420",
        "name": "NGUYỄN THANH THẢO",
        "gender": "CHỊ",
        "department": "BAN TCKT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "30",
        "idst": "0480",
        "name": "NGUYỄN THỊ THANH HƯƠNG",
        "gender": "CHỊ",
        "department": "BAN MH & HTKD",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "31",
        "idst": "6001",
        "name": "NGUYỄN THANH TUẤN",
        "gender": "ANH",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "32",
        "idst": "6002",
        "name": "LÊ THỊ BÍCH TRÂM",
        "gender": "CHỊ",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "33",
        "idst": "6013",
        "name": "TRẦN VIỆT DŨNG",
        "gender": "ANH",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "34",
        "idst": "6014",
        "name": "NGUYỄN TUẤN PHƯƠNG",
        "gender": "ANH",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "35",
        "idst": "6043",
        "name": "MAI THÀNH TÂM",
        "gender": "ANH",
        "department": "VP HĐQT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "36",
        "idst": "6069",
        "name": "NGUYỄN VĂN TÁM",
        "gender": "ANH",
        "department": "VP HĐQT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "37",
        "idst": "6075",
        "name": "ĐẶNG THỊ TƯƠI",
        "gender": "CHỊ",
        "department": "BAN TCKT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "38",
        "idst": "6078",
        "name": "HUỲNH HUYỀN CHÂN",
        "gender": "CHỊ",
        "department": "BAN TCKT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "39",
        "idst": "6086",
        "name": "NGUYỄN HƯNG",
        "gender": "ANH",
        "department": "TTKD MIỀN NAM",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "40",
        "idst": "6085",
        "name": "NGUYỄN VĂN ANH TRỌNG",
        "gender": "ANH",
        "department": "SAIGONCTT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "41",
        "idst": "6093",
        "name": "NGUYỄN MINH DƯƠNG",
        "gender": "ANH",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "42",
        "idst": "6094",
        "name": "TRƯƠNG MINH ĐẠT",
        "gender": "ANH",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "43",
        "idst": "6095",
        "name": "LÊ MINH ĐỨC",
        "gender": "ANH",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "44",
        "idst": "6102",
        "name": "LÊ THỊ THÙY LINH",
        "gender": "CHỊ",
        "department": "BAN MH & HTKD",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "45",
        "idst": "6111",
        "name": "LÊ ANH TUẤN",
        "gender": "ANH",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "46",
        "idst": "6113",
        "name": "NGUYỄN NGỌC HOÀI ÂN",
        "gender": "ANH",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "47",
        "idst": "6114",
        "name": "NGUYỄN THỊ XUÂN TRANG",
        "gender": "CHỊ",
        "department": "BAN TCKT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "48",
        "idst": "6117",
        "name": "NGUYỄN TRẦN VIỆT HẰNG",
        "gender": "CHỊ",
        "department": "BAN NS - TT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "49",
        "idst": "6120",
        "name": "NGUYỄN TẤT TUẤN",
        "gender": "ANH",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "50",
        "idst": "6124",
        "name": "LÊ TRỌNG VINH",
        "gender": "ANH",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "51",
        "idst": "6125",
        "name": "HUỲNH HOÀNG TIẾN ĐẠT",
        "gender": "ANH",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "52",
        "idst": "6126",
        "name": "PHẠM THỊ DIỄM TRANG",
        "gender": "CHỊ",
        "department": "SAIGONCTT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "53",
        "idst": "6129",
        "name": "NGUYỄN THỊ KIM ANH",
        "gender": "CHỊ",
        "department": "BAN TCKT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "54",
        "idst": "6130",
        "name": "NGUYỄN THỊ NHUNG",
        "gender": "CHỊ",
        "department": "BAN MH & HTKD",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "55",
        "idst": "6131",
        "name": "NGUYỄN VŨ THÚY NGA",
        "gender": "CHỊ",
        "department": "BAN TCKT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "56",
        "idst": "6134",
        "name": "MAI TÂM VŨ",
        "gender": "ANH",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "57",
        "idst": "6135",
        "name": "NGUYỄN MINH TÂN",
        "gender": "ANH",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "58",
        "idst": "6136",
        "name": "TỪ TUYẾT NHI",
        "gender": "CHỊ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "59",
        "idst": "6137",
        "name": "LÊ THỊ NGỌC THẢO",
        "gender": "CHỊ",
        "department": "BAN HCTH",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "60",
        "idst": "6139",
        "name": "HUỲNH TRẦN KIM THOA",
        "gender": "CHỊ",
        "department": "BAN NS - TT",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "61",
        "idst": "6144",
        "name": "NGUYỄN VĂN THANH PHONG",
        "gender": "ANH",
        "department": "KHỐI DVTK",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "62",
        "idst": "6147",
        "name": "NGUYỄN THỊ MINH TUYẾT",
        "gender": "CHỊ",
        "department": "BAN MH & HTKD",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "63",
        "idst": "6148",
        "name": "DƯƠNG THỊ NGỌC TRÂN",
        "gender": "CHỊ",
        "department": "BAN MH & HTKD",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "64",
        "idst": "6149",
        "name": "NGUYỄN TƯỜNG GIÁNG MY",
        "gender": "CHỊ",
        "department": "BAN MH & HTKD",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "65",
        "idst": "0003",
        "name": "LÊ QUANG CHIỂU",
        "gender": "ANH",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "66",
        "idst": "0034",
        "name": "ĐINH THỊ MAI LAN",
        "gender": "CHỊ",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "67",
        "idst": "0193",
        "name": "HOÀNG THÁI HÒA",
        "gender": "ANH",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "68",
        "idst": "6072",
        "name": "TRẦN HỒ PHƯƠNG NAM",
        "gender": "ANH",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "69",
        "idst": "6074",
        "name": "DU NGUYÊN CHƯƠNG",
        "gender": "ANH",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "70",
        "idst": "6096",
        "name": "PHẠM CÔNG THÀNH",
        "gender": "ANH",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "71",
        "idst": "6123",
        "name": "NGUYỄN TẤN VƯƠNG",
        "gender": "ANH",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "72",
        "idst": "0021",
        "name": "NGUYỄN THỊ HIỀN",
        "gender": "CHỊ",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "73",
        "idst": "6112",
        "name": "TRẦN LÊ BẢO TRINH",
        "gender": "CHỊ",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "74",
        "idst": "6140",
        "name": "NGUYỄN THỊ THÙY DUNG",
        "gender": "CHỊ",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "75",
        "idst": "6141",
        "name": "LÊ HOÀNG QUÂN",
        "gender": "ANH",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "76",
        "idst": "6142",
        "name": "TRẦN NGUYỄN DUNG HẠ",
        "gender": "CHỊ",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "77",
        "idst": "6145",
        "name": "VÕ VĂN KHÔI",
        "gender": "ANH",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "78",
        "idst": "6146",
        "name": "PHẠM ĐÌNH TẠO",
        "gender": "ANH",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "vp": "0"
    },
    {
        "id": "79",
        "idst": "6143",
        "name": "PHẠM NGỌC QUÝ",
        "gender": "ANH",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "vp": "0"
    }
]