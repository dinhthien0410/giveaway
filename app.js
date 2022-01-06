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

function setStaffhasPrise(staff, dp) {
    document.getElementById("loading").style.display = "none";
    document.getElementById("staffHasPrise").innerHTML = (`<p class="winner-staff">${staff.name} - ${staff.idst}</p>`);
    document.getElementById("changeButton").innerHTML = (`<div class="confirmButton"  onclick="showStaffAndPrise(${dp})"></div>`)
}

function showStaffAndPrise(dp) {
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
    const daden = staffhasprise.gender === "1" ? "ANH" : "CHỊ";
    const vp = dp === 1 ? "VP HN" : "VP HCM";
    // var confettiSettings = { target: 'my-canvas' };
    // var confetti = new ConfettiGenerator(confettiSettings);
    // document.getElementById("my-canvas").hidden = false;
    // confetti.render();
    setTimeout(function () {
        document.getElementById("my-canvas").hidden = true;
    }, 4000)
    document.getElementById("banner").innerHTML = (`<div class="congratulation"> 
    </div>`)
    document.getElementById("staffHasPrise").innerHTML = (`
        <p class="priseAndGifts">${prise}</p>
        <p class="staff">${daden} ${staffhasprise.name}</p>
        <p class="staff">KHỐI ${staffhasprise.department} - ${vp}</p>
        <p class="priseAndGifts">${value}</p>`);
    document.getElementById("changeButton").style.display = "none";
    document.getElementById("selectValue").hidden = true;
    document.getElementById("loading").hidden = true;
    document.getElementById("continueButton").hidden = false;
}

function setStaffHasPriseToLocal(listStaff, staffRandom, dp) {
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
            let st = listStaff.find(i => listStaff === listStaff[i]);
            if (st) {
                setStaffHasPriseToLocal(listStaff.splice(i, 1), staffRandom);
            } else {
                listStaffHasPrise.push(st);
            }
            localStorage.setItem('listStaffHasPrise', JSON.stringify(listStaffHasPrise));
            setTimeout(function () {
                setStaffhasPrise(listStaff[i], dp);
            }, 000);
        }
    }
}


function randomStaff() {
    const vp = getVp();
    if (vp === 1) {
        listStaff = male;
        dp = 1;
    }
    if (vp === 0) {
        listStaff = female;
        dp = 0;
    }
    const staffRandom = listStaff[Math.floor(Math.random() * listStaff.length)];
    setStaffHasPriseToLocal(listStaff, staffRandom, dp);
    console.log(staffRandom.idst);
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
        animation(aclass, 0, numberAfterRandom, 500);
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
            console.log(result);
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
        size: 10, // prop size
        animate: true, // Should animate?
        respawn: true, // Should confettis be respawned when getting out of screen?
        props: ['circle', 'square', 'triangle', 'line'], // Types of confetti
        colors: [[255, 228, 80], [255, 255, 109], [255, 255, 137], [255, 255, 165]], // Colors to render confetti
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

const male = [
    {
        "id": "1",
        "idst": "0016",
        "name": "PHAN BÁCH",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "2",
        "idst": "0020",
        "name": "HOÀNG THỊ THU TRANG",
        "department": "BAN TÀI CHÍNH KẾ TOÁN",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "3",
        "idst": "0022",
        "name": "TRẦN QUỲNH VI",
        "department": "TTKD KHỐI KHÁCH HÀNG VIỄN THÔNG VÀ TRUYỀN HÌNH",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "4",
        "idst": "0027",
        "name": "NGUYỄN THÀNH AN",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "5",
        "idst": "0028",
        "name": "NGUYỄN VIỆT AN",
        "department": "TTKD KHỐI KHÁCH HÀNG VIỄN THÔNG VÀ TRUYỀN HÌNH",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "6",
        "idst": "0031",
        "name": "NGUYỄN THĂNG LONG",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "7",
        "idst": "0042",
        "name": "NGUYỄN ĐỨC ANH",
        "department": "TTKD KHỐI KHÁCH HÀNG CHÍNH PHỦ NGÂN HÀNG DOANH NGHIỆP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "8",
        "idst": "0060",
        "name": "NGUYỄN THANH TUẤN",
        "department": "TTKD KHỐI KHÁCH HÀNG CHÍNH PHỦ NGÂN HÀNG DOANH NGHIỆP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "9",
        "idst": "0068",
        "name": "BẠCH HOÀI KHANH",
        "department": "TTKD KHỐI KHÁCH HÀNG CHÍNH PHỦ NGÂN HÀNG DOANH NGHIỆP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "10",
        "idst": "0085",
        "name": "PHẠM THU TRANG",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "11",
        "idst": "0086",
        "name": "MAI THỊ HƯƠNG",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "12",
        "idst": "0096",
        "name": "PHAN MINH HẢI",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "13",
        "idst": "0108",
        "name": "ĐINH THỊ MINH KHÁNH",
        "department": "MUA HÀNG & HTKD",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "14",
        "idst": "0144",
        "name": "PHẠM DIỄM QUỲNH",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "15",
        "idst": "0149",
        "name": "NGUYỄN THỊ HẢI LINH",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "16",
        "idst": "0185",
        "name": "TẠ CÔNG CHIẾN",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "17",
        "idst": "0195",
        "name": "NGUYỄN ĐỨC THIỆN",
        "department": "TTKD KHỐI KHÁCH HÀNG VIỄN THÔNG VÀ TRUYỀN HÌNH",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "18",
        "idst": "0266",
        "name": "HUỲNH PHƯỚC THUẬN",
        "department": "DỊCH VỤ TRIỂN KHAI- ĐÀ NẴNG",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "19",
        "idst": "0270",
        "name": "TRẦN MẠNH HÀ",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "20",
        "idst": "0279",
        "name": "NGUYỄN QUỐC TOẢN",
        "department": "TTKD KHỐI KHÁCH HÀNG CHÍNH PHỦ NGÂN HÀNG DOANH NGHIỆP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "21",
        "idst": "0345",
        "name": "TÔ DUY LINH",
        "department": "TTKD KHỐI KHÁCH HÀNG CHÍNH PHỦ NGÂN HÀNG DOANH NGHIỆP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "22",
        "idst": "0347",
        "name": "ĐINH TỐ QUYÊN",
        "department": "TTKD KHỐI KHÁCH HÀNG CHÍNH PHỦ NGÂN HÀNG DOANH NGHIỆP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "23",
        "idst": "0356",
        "name": "ĐẶNG TÙNG ANH",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "24",
        "idst": "0384",
        "name": "NGUYỄN THU HÀ",
        "department": "TTKD DỊCH VỤ ĐÀO TẠO",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "25",
        "idst": "0389",
        "name": "BÙI TUẤN ANH",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "26",
        "idst": "0395",
        "name": "LÊ THANH HIẾU",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "27",
        "idst": "0401",
        "name": "HUỲNH THÀNH CÔNG",
        "department": "DỊCH VỤ TRIỂN KHAI- ĐÀ NẴNG",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "28",
        "idst": "0402",
        "name": "ĐINH VIẾT LUÂN",
        "department": "TTKD KHỐI KHÁCH HÀNG VIỄN THÔNG VÀ TRUYỀN HÌNH",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "29",
        "idst": "0421",
        "name": "NGUYỄN MẠNH DŨNG",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "30",
        "idst": "0438",
        "name": "PHẠM VĂN QUYẾT",
        "department": "TTKD KHỐI KHÁCH HÀNG CHÍNH PHỦ NGÂN HÀNG DOANH NGHIỆP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "31",
        "idst": "0440",
        "name": "NGUYỄN XUÂN QUANG",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "32",
        "idst": "0446",
        "name": "LÊ VIỆT HƯNG",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "33",
        "idst": "0453",
        "name": "TRẦN VIỆT PHƯƠNG",
        "department": "TTKD KHỐI KHÁCH HÀNG VIỄN THÔNG VÀ TRUYỀN HÌNH",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "34",
        "idst": "0454",
        "name": "NGUYỄN THỊ PHƯỢNG",
        "department": "BAN TÀI CHÍNH KẾ TOÁN",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "35",
        "idst": "0461",
        "name": "LÊ ĐỨC CƯỜNG",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "36",
        "idst": "3003",
        "name": "BÙI ĐÌNH KHÁNH",
        "department": "TRUNG TÂM PHẦN MỀM",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "37",
        "idst": "3004",
        "name": "VŨ ĐÌNH ĐỨC",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "38",
        "idst": "3012",
        "name": "BÙI NGỌC HƯƠNG",
        "department": "MUA HÀNG & HTKD",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "39",
        "idst": "3013",
        "name": "NGUYỄN THU TRANG",
        "department": "TRUNG TÂM PHẦN MỀM",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "40",
        "idst": "3017",
        "name": "VÕ QUÝ ĐỨC",
        "department": "TRUNG TÂM PHẦN MỀM",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "41",
        "idst": "3019",
        "name": "LÊ KIM THANH",
        "department": "TTKD DỊCH VỤ ĐÀO TẠO",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "42",
        "idst": "3022",
        "name": "PHẠM NGỌC HOÀNG NGÂN",
        "department": "NHÂN SỰ & TRUYỀN THÔNG",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "43",
        "idst": "3024",
        "name": "NGUYỄN HỮU DUY",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "44",
        "idst": "3029",
        "name": "NGUYỄN ANH TUẤN",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "45",
        "idst": "3032",
        "name": "NGUYỄN VIỆT HƯNG",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "46",
        "idst": "3040",
        "name": "LÊ THỊ THÙY AN",
        "department": "NHÂN SỰ & TRUYỀN THÔNG",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "47",
        "idst": "3041",
        "name": "NGUYỄN QUANG THUẬN",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "48",
        "idst": "3043",
        "name": "TRẦN VĂN DUY",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "49",
        "idst": "3045",
        "name": "NGÔ MỸ NHẬT LINH",
        "department": "BAN TÀI CHÍNH KẾ TOÁN",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "50",
        "idst": "3047",
        "name": "PHẠM THẾ CƯỜNG",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "51",
        "idst": "3048",
        "name": "PHẠM THANH HIẾU",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "52",
        "idst": "3053",
        "name": "VŨ ĐỨC MINH HIẾU",
        "department": "TTKD KHỐI KHÁCH HÀNG VIỄN THÔNG VÀ TRUYỀN HÌNH",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "53",
        "idst": "3054",
        "name": "NGUYỄN TUẤN DŨNG",
        "department": "TTKD KHỐI KHÁCH HÀNG CHÍNH PHỦ NGÂN HÀNG DOANH NGHIỆP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "54",
        "idst": "3055",
        "name": "TRẦN VĂN NGHĨA",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "55",
        "idst": "3056",
        "name": "NGUYỄN PHÚC THANH",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "56",
        "idst": "3057",
        "name": "NGUYỄN THU THUỲ",
        "department": "NHÂN SỰ & TRUYỀN THÔNG",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "57",
        "idst": "3058",
        "name": "NGUYỄN THUÝ HÀ",
        "department": "MUA HÀNG & HTKD",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "58",
        "idst": "3061",
        "name": "ĐOÀN VIẾT HÙNG",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "59",
        "idst": "3063",
        "name": "NGUYỄN VIẾT ĐỨC",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "60",
        "idst": "3065",
        "name": "NGÔ VĂN NHẬT",
        "department": "TTKD KHỐI KHÁCH HÀNG CHÍNH PHỦ NGÂN HÀNG DOANH NGHIỆP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "61",
        "idst": "3067",
        "name": "PHẠM THANH LONG",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "62",
        "idst": "3068",
        "name": "CAO MINH THỊNH",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "63",
        "idst": "3070",
        "name": "NGUYỄN MẠNH THẮNG",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "64",
        "idst": "3075",
        "name": "HÀ ĐỨC TÀI",
        "department": "DỊCH VỤ TRIỂN KHAI- ĐÀ NẴNG",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "65",
        "idst": "3079",
        "name": "ĐỖ MINH ANH",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "66",
        "idst": "3081",
        "name": "NGUYỄN QUỐC THÁI",
        "department": "TTKD KHỐI KHÁCH HÀNG VIỄN THÔNG VÀ TRUYỀN HÌNH",
        "hasPrise": "0",
        "gender": "1"
    },
    {
        "id": "67",
        "idst": "3085",
        "name": "TẠ HOÀNG TRANG",
        "department": "MUA HÀNG & HTKD",
        "hasPrise": "0",
        "gender": "1"
    }
]

const female = [
    {
        "id": "1",
        "idst": "3083",
        "name": "NGUYỄN THỊ HOÀI TRANG",
        "department": "MUA HÀNG & HTKD",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "2",
        "idst": "3086",
        "name": "HOÀNG VŨ DƯƠNG",
        "department": "TTKD KHỐI KHÁCH HÀNG VIỄN THÔNG VÀ TRUYỀN HÌNH",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "3",
        "idst": "3090",
        "name": "NGUYỄN DUY THÀNH",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "4",
        "idst": "3091",
        "name": "NGUYỄN ĐỨC HOÀNG",
        "department": "TTKD DỊCH VỤ ĐÀO TẠO",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "5",
        "idst": "3094",
        "name": "NGUYỄN THỊ HÀ ANH",
        "department": "TTKD DỊCH VỤ ĐÀO TẠO",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "6",
        "idst": "3095",
        "name": "NGUYỄN HOÀNG NAM",
        "department": "TTKD KHỐI KHÁCH HÀNG VIỄN THÔNG VÀ TRUYỀN HÌNH",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "7",
        "idst": "3098",
        "name": "NGUYỄN THANH TÙNG",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "8",
        "idst": "3099",
        "name": "DƯƠNG HOÀNG GIANG",
        "department": "TRUNG TÂM PHẦN MỀM",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "9",
        "idst": "3100",
        "name": "TRƯƠNG KHÁNH LINH",
        "department": "NHÂN SỰ & TRUYỀN THÔNG",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "10",
        "idst": "3101",
        "name": "TÔ THẾ DŨNG",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "11",
        "idst": "3102",
        "name": "CHỬ VĂN HOÀNG",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "12",
        "idst": "3104",
        "name": "DƯƠNG QUANG PHÚC",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "13",
        "idst": "3106",
        "name": "LÊ NGỌC ANH",
        "department": "MUA HÀNG & HTKD",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "14",
        "idst": "3108",
        "name": "VŨ ĐÌNH TRUNG",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "15",
        "idst": "3109",
        "name": "NGUYỄN THỊ UYÊN",
        "department": "TTKD DỊCH VỤ ĐÀO TẠO",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "16",
        "idst": "3111",
        "name": "NGUYỄN KHÁNH LINH",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "17",
        "idst": "3112",
        "name": "LÊ THỊ THU HƯƠNG",
        "department": "TTKD DỊCH VỤ ĐÀO TẠO",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "18",
        "idst": "3113",
        "name": "NGUYỄN DUY LINH",
        "department": "TRUNG TÂM PHẦN MỀM",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "19",
        "idst": "3114",
        "name": "TRẦN VŨ VINH",
        "department": "TTKD DỊCH VỤ ĐÀO TẠO",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "20",
        "idst": "3115",
        "name": "NGUYỄN THỊ HẠNH",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "21",
        "idst": "3117",
        "name": "NGUYỄN HOÀNG DƯƠNG",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "22",
        "idst": "3118",
        "name": "NGUYỄN HOÀNG MINH",
        "department": "DTS TELECOM",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "23",
        "idst": "3120",
        "name": "PHẠM DUY HIỆP",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "24",
        "idst": "3121",
        "name": "NGÔ THẾ CHUNG",
        "department": "TTKD KHỐI KHÁCH HÀNG CHÍNH PHỦ NGÂN HÀNG DOANH NGHIỆP",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "25",
        "idst": "3122",
        "name": "LÂM BẢO YẾN",
        "department": "NHÂN SỰ & TRUYỀN THÔNG",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "26",
        "idst": "3123",
        "name": "NGUYỄN NGUYỆT MINH",
        "department": "TTKD DỊCH VỤ ĐÀO TẠO",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "27",
        "idst": "3124",
        "name": "DƯƠNG QUỐC VIỆT",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "28",
        "idst": "3126",
        "name": "PHẠM TUẤN NAM",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "29",
        "idst": "3128",
        "name": "NGUYỄN THẾ HƯỞNG",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "30",
        "idst": "3131",
        "name": "ĐẶNG XUÂN DUY",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "31",
        "idst": "3132",
        "name": "VŨ HOÀNG ",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "32",
        "idst": "3133",
        "name": "PHẠM VĂN ĐẠT",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "33",
        "idst": "3134",
        "name": "PHẠM DIỆU HUYỀN",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "34",
        "idst": "3135",
        "name": "TRỊNH XUÂN ĐẠT",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "35",
        "idst": "3136",
        "name": "NGUYỄN HOÀNG DƯƠNG",
        "department": "DỊCH VỤ TRIỂN KHAI",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "36",
        "idst": "3137",
        "name": "NGUYỄN CÔNG TÌNH",
        "department": "TTKD KHỐI KHÁCH HÀNG CHÍNH PHỦ NGÂN HÀNG DOANH NGHIỆP",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "37",
        "idst": "3140",
        "name": "BÙI ĐÌNH THIÊN TÌNH",
        "department": "TRUNG TÂM PHẦN MỀM",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "38",
        "idst": "3141",
        "name": "LÊ CÔNG MẠNH",
        "department": "TTKD KHỐI KHÁCH HÀNG VIỄN THÔNG VÀ TRUYỀN HÌNH",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "39",
        "idst": "3142",
        "name": "VŨ HỮU MINH ",
        "department": "HÀNH CHÍNH TỔNG HỢP",
        "hasPrise": "0",
        "gender": "0"
    },
    {
        "id": "40",
        "idst": "3143",
        "name": "LÊ TRUNG KIÊN",
        "department": "TTKD KHỐI KHÁCH HÀNG VIỄN THÔNG VÀ TRUYỀN HÌNH",
        "hasPrise": "0",
        "gender": "0"
    }
]