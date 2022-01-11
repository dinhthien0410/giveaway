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
        value = "5.000.000VNĐ"
    } else if (prize === 2) {
        prise = "Giải Nhì";
        value = "3.000.000VNĐ"
    } else {
        prise = "Giải Ba";
        value = "2.000.000VNĐ";
    };
    const daden = staffhasprise.GENDER;
    const vp = staffhasprise.VP;
    document.getElementById("my-canvas").hidden = false;
    startCanvasConfetti();
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

function setStaffHasPriseToLocal(listStaff, staffRandom, vp) {
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
                listStaff.splice(i, 1);
                if (vp === 1) {
                    localStorage.setItem("listStaffHN", JSON.stringify(listStaff));
                } else {
                    localStorage.setItem("listStaffHCM", JSON.stringify(listStaff));
                }
                const s = JSON.parse(localStorage.getItem("staffHasPrise"));
                setStaffhasPrise(s);
            }, 8000);
        }
    }
};


function randomStaff() {
    const vp = getVp();
    let listStaffHN = [];
    let listStaffHCM = [];
    let storage1 = localStorage.getItem('listStaffHN');
    let storage2 = localStorage.getItem('listStaffHCM');
    if (storage1) {
        listStaffHN = JSON.parse(storage1);
    }
    if (storage2) {
        listStaffHCM = JSON.parse(storage2);
    }
    if (vp === 1) {
        const listHN = JSON.parse(localStorage.getItem('HN'));
        const listDN = JSON.parse(localStorage.getItem('ĐN'));
        if (listStaffHN.length === 0) {
            localStorage.setItem('listStaffHN', JSON.stringify(listHN.concat(listDN)));
            listStaff = JSON.parse(localStorage.getItem('listStaffHN'));
        } else {
            listStaff = JSON.parse(localStorage.getItem('listStaffHN'));
        }
    }
    if (vp === 0) {
        const listHCM = JSON.parse(localStorage.getItem('HCM'));
        if (listStaffHCM.length === 0) {
            localStorage.setItem('listStaffHCM', JSON.stringify(listHCM));
            listStaff = JSON.parse(localStorage.getItem('listStaffHCM'));
        } else {
            listStaff = JSON.parse(localStorage.getItem('listStaffHCM'));
        }
    }
    const staffRandom = listStaff[Math.floor(Math.random() * listStaff.length)];
    setStaffHasPriseToLocal(listStaff, staffRandom, vp);
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

function onClickLogo() {
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
};

function onClickAddNew() {
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
    if (HN.length === 0 || HCM.length === 0) {
        alert("Yêu cầu nhập danh sách đầy đủ các văn phòng!");
        localStorage.clear();
    } else {
        console.log(HN[0].name);
        if (HN[0].NAME === undefined || HN[0].DEPARTMENT === undefined || HN[0].HASPRIZE === undefined) {
            localStorage.clear();
            alert("Vui lòng nhập file đúng định dạng!")
        } else {
            alert("Thêm mới thành công!");
            var modal = document.getElementById("myModal");
            modal.style.display = "none";
        }
    }
}
function startCanvasConfetti() {
    var myCanvas = document.createElement('canvas');
    document.body.appendChild(myCanvas);
    var end = Date.now() + (15 * 1000);

    // go Buckeyes!
    var colors = ['#FFFF33', '#ffffff'];

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}