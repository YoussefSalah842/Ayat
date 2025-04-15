$(document).ready(function () {
    // Loading Screen
    function showLoadingScreen() {
        $("#loading-screen").show();
        setTimeout(function () {
            $("#loading-screen").addClass("fade-out");
            setTimeout(function () {
                $("#loading-screen").hide();
                $("#main-content").fadeIn();
            }, 500);
        }, 5000);
    }
    showLoadingScreen();

    // Dark Mode Toggle
    $("#dark-mode-toggle").click(function () {
        $("body").toggleClass("dark-mode");
        $(this).find("i").toggleClass("fa-sun fa-moon");
        localStorage.setItem("darkMode", $("body").hasClass("dark-mode"));
    });
    if (localStorage.getItem("darkMode") === "true") {
        $("body").addClass("dark-mode");
        $("#dark-mode-toggle i").removeClass("fa-sun").addClass("fa-moon");
    }

    // Settings Modal
    $("#settings-toggle").click(function () {
        $("#settings-modal").fadeIn();
    });
    $(".close-button").click(function () {
        $(this).closest(".modal").fadeOut();
    });

    // Font and Background Settings
    $("#font-select").change(function () {
        $("body").css("font-family", $(this).val() + ", sans-serif");
        localStorage.setItem("font", $(this).val());
    });
    $("#bg-color-select").change(function () {
        $("body").css("background-color", $(this).val());
        localStorage.setItem("bgColor", $(this).val());
    });
    if (localStorage.getItem("font")) {
        $("body").css("font-family", localStorage.getItem("font") + ", sans-serif");
        $("#font-select").val(localStorage.getItem("font"));
    }
    if (localStorage.getItem("bgColor")) {
        $("body").css("background-color", localStorage.getItem("bgColor"));
        $("#bg-color-select").val(localStorage.getItem("bgColor"));
    }

    // Notifications Toggle
    $("#notifications-toggle").change(function () {
        localStorage.setItem("notifications", $(this).is(":checked"));
    });
    if (localStorage.getItem("notifications") === "true") {
        $("#notifications-toggle").prop("checked", true);
    }

    // Tasbe7 Counter
    let counter = 0;
    let goal = 100;
    $("#circle").click(function () {
        counter++;
        $("#score").text("العدد: " + counter);
        let progress = (counter / goal) * 100;
        $("#progress").text("التقدم: " + Math.min(progress, 100).toFixed(0) + "%");
        if (counter >= goal) {
            $("#circle").css("background-color", "#28a745");
            $("#text").text("مبروك! اكتمل التسبيح");
            $("#progress").text("التقدم: 100%");
        }
        localStorage.setItem("tasbe7Counter", counter);
        updateStats("tasbe7", counter);
    });
    function resetCounter() {
        counter = 0;
        $("#score").text("العدد: 0");
        $("#progress").text("التقدم: 0%");
        $("#circle").css("background-color", "#692079");
        $("#text").text("ابدأ التسبيح");
        localStorage.setItem("tasbe7Counter", counter);
        updateStats("tasbe7", counter);
    }
    if (localStorage.getItem("tasbe7Counter")) {
        counter = parseInt(localStorage.getItem("tasbe7Counter"));
        $("#score").text("العدد: " + counter);
        let progress = (counter / goal) * 100;
        $("#progress").text("التقدم: " + Math.min(progress, 100).toFixed(0) + "%");
        if (counter >= goal) {
            $("#circle").css("background-color", "#28a745");
            $("#text").text("مبروك! اكتمل التسبيح");
        }
    }
    window.resetCounter = resetCounter;

    // Prayer Times
    function populateCountries() {
        const countries = [
            "مصر", "السعودية", "الإمارات", "الكويت", "قطر", "البحرين", "الأردن", "لبنان", "العراق",
            "الجزائر", "المغرب", "تونس", "ليبيا", "السودان", "فلسطين", "سوريا", "اليمن", "عمان"
        ];
        $("#country").empty().append('<option value="">اختر الدولة</option>');
        countries.forEach(function (country) {
            $("#country").append(`<option value="${country}">${country}</option>`);
        });
    }
    function populateCities(country) {
        const cities = {
            "مصر": ["القاهرة", "الإسكندرية", "الجيزة", "شرم الشيخ", "الأقصر", "أسوان", "المنصورة"],
            "السعودية": ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الطائف"],
            "الإمارات": ["دبي", "أبوظبي", "الشارقة", "العين", "رأس الخيمة"],
            "الكويت": ["مدينة الكويت", "حولي", "الفروانية", "الأحمدي"],
            "قطر": ["الدوحة", "الريان", "الوكرة"],
            "البحرين": ["المنامة", "المحرق", "الرفاع"],
            "الأردن": ["عمان", "إربد", "الزرقاء", "العقبة"],
            "لبنان": ["بيروت", "طرابلس", "صيدا", "صور"],
            "العراق": ["بغداد", "البصرة", "الموصل", "أربيل"],
            "الجزائر": ["الجزائر العاصمة", "وهران", "قسنطينة", "عنابة"],
            "المغرب": ["الرباط", "الدار البيضاء", "فاس", "مراكش"],
            "تونس": ["تونس العاصمة", "صفاقس", "سوسة", "القيروان"],
            "ليبيا": ["طرابلس", "بنغازي", "مصراتة", "سبها"],
            "السودان": ["الخرطوم", "أم درمان", "بورتسودان", "نيالا"],
            "فلسطين": ["غزة", "رام الله", "القدس", "نابلس"],
            "سوريا": ["دمشق", "حلب", "حمص", "اللاذقية"],
            "اليمن": ["صنعاء", "عدن", "تعز", "الحديدة"],
            "عمان": ["مسقط", "صلالة", "صحار", "نزوى"]
        };
        $("#city").empty().append('<option value="">اختر المنطقة</option>');
        if (cities[country]) {
            cities[country].forEach(function (city) {
                $("#city").append(`<option value="${city}">${city}</option>`);
            });
        }
    }
    $("#country").change(function () {
        let country = $(this).val();
        if (country) populateCities(country);
    });
    window.getPrayerTimes = function () {
        sleeptime(1000);
        let country = $("#country").val();
        let city = $("#city").val();
        if (!country || !city) {
            showError("يرجى اختيار الدولة والمنطقة");
            return;
        }
        $.getJSON(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=5`, function (data) {
            let timings = data.data.timings;
            let date = data.data.date.readable;
            let table = `
                <table>
                    <tr><th>الصلاة</th><th>الوقت</th></tr>
                    <tr><td>الفجر</td><td>${timings.Fajr}</td></tr>
                    <tr><td>الظهر</td><td>${timings.Dhuhr}</td></tr>
                    <tr><td>العصر</td><td>${timings.Asr}</td></tr>
                    <tr><td>المغرب</td><td>${timings.Maghrib}</td></tr>
                    <tr><td>العشاء</td><td>${timings.Isha}</td></tr>
                </table>
                <p>التاريخ: ${date}</p>`;
            $("#prayer-times").html(table);
        }).fail(function () {
            showError("حدث خطأ أثناء جلب مواقيت الصلاة");
        });
    };
    window.getPrayerTimesByLocation = function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                $.getJSON(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=5`, function (data) {
                    let timings = data.data.timings;
                    let date = data.data.date.readable;
                    let table = `
                        <table>
                            <tr><th>الصلاة</th><th>الوقت</th></tr>
                            <tr><td>الفجر</td><td>${timings.Fajr}</td></tr>
                            <tr><td>الظهر</td><td>${timings.Dhuhr}</td></tr>
                            <tr><td>العصر</td><td>${timings.Asr}</td></tr>
                            <tr><td>المغرب</td><td>${timings.Maghrib}</td></tr>
                            <tr><td>العشاء</td><td>${timings.Isha}</td></tr>
                        </table>
                        <p>التاريخ: ${date}</p>`;
                    $("#prayer-times").html(table);
                }).fail(function () {
                    showError("حدث خطأ أثناء جلب مواقيت الصلاة");
                });
            }, function () {
                showError("يرجى السماح بتحديد الموقع");
            });
        } else {
            showError("المتصفح لا يدعم تحديد الموقع");
        }
    };
    populateCountries();

    // Quran Section
    const suraData = [
        { name: "الفاتحة", verses: 7, type: "مكية" },
        { name: "البقرة", verses: 286, type: "مدنية" },
        { name: "آل عمران", verses: 200, type: "مدنية" },
        { name: "النساء", verses: 176, type: "مدنية" },
        { name: "المائدة", verses: 120, type: "مدنية" },
        { name: "الأنعام", verses: 165, type: "مكية" },
        { name: "الأعراف", verses: 206, type: "مكية" },
        { name: "الأنفال", verses: 75, type: "مدنية" },
        { name: "التوبة", verses: 129, type: "مدنية" },
        { name: "يونس", verses: 109, type: "مكية" },
        { name: "هود", verses: 123, type: "مكية" },
        { name: "يوسف", verses: 111, type: "مكية" },
        { name: "الرعد", verses: 43, type: "مدنية" },
        { name: "إبراهيم", verses: 52, type: "مكية" },
        { name: "الحجر", verses: 99, type: "مكية" },
        { name: "النحل", verses: 128, type: "مكية" },
        { name: "الإسراء", verses: 111, type: "مكية" },
        { name: "الكهف", verses: 110, type: "مكية" },
        { name: "مريم", verses: 98, type: "مكية" },
        { name: "طه", verses: 135, type: "مكية" },
        { name: "الأنبياء", verses: 112, type: "مكية" },
        { name: "الحج", verses: 78, type: "مدنية" },
        { name: "المؤمنون", verses: 118, type: "مكية" },
        { name: "النور", verses: 64, type: "مدنية" },
        { name: "الفرقان", verses: 77, type: "مكية" },
        { name: "الشعراء", verses: 227, type: "مكية" },
        { name: "النمل", verses: 93, type: "مكية" },
        { name: "القصص", verses: 88, type: "مكية" },
        { name: "العنكبوت", verses: 69, type: "مكية" },
        { name: "الروم", verses: 60, type: "مكية" },
        { name: "لقمان", verses: 34, type: "مكية" },
        { name: "السجدة", verses: 30, type: "مكية" },
        { name: "الأحزاب", verses: 73, type: "مدنية" },
        { name: "سبأ", verses: 54, type: "مكية" },
        { name: "فاطر", verses: 45, type: "مكية" },
        { name: "يس", verses: 83, type: "مكية" },
        { name: "الصافات", verses: 182, type: "مكية" },
        { name: "ص", verses: 88, type: "مكية" },
        { name: "الزمر", verses: 75, type: "مكية" },
        { name: "غافر", verses: 85, type: "مكية" },
        { name: "فصلت", verses: 54, type: "مكية" },
        { name: "الشورى", verses: 53, type: "مكية" },
        { name: "الزخرف", verses: 89, type: "مكية" },
        { name: "الدخان", verses: 59, type: "مكية" },
        { name: "الجاثية", verses: 37, type: "مكية" },
        { name: "الأحقاف", verses: 35, type: "مكية" },
        { name: "محمد", verses: 38, type: "مدنية" },
        { name: "الفتح", verses: 29, type: "مدنية" },
        { name: "الحجرات", verses: 18, type: "مدنية" },
        { name: "ق", verses: 45, type: "مكية" },
        { name: "الذاريات", verses: 60, type: "مكية" },
        { name: "الطور", verses: 49, type: "مكية" },
        { name: "النجم", verses: 62, type: "مكية" },
        { name: "القمر", verses: 55, type: "مكية" },
        { name: "الرحمن", verses: 78, type: "مدنية" },
        { name: "الواقعة", verses: 96, type: "مكية" },
        { name: "الحديد", verses: 29, type: "مدنية" },
        { name: "المجادلة", verses: 22, type: "مدنية" },
        { name: "الحشر", verses: 24, type: "مدنية" },
        { name: "الممتحنة", verses: 13, type: "مدنية" },
        { name: "الصف", verses: 14, type: "مدنية" },
        { name: "الجمعة", verses: 11, type: "مدنية" },
        { name: "المنافقون", verses: 11, type: "مدنية" },
        { name: "التغابن", verses: 18, type: "مدنية" },
        { name: "الطلاق", verses: 12, type: "مدنية" },
        { name: "التحريم", verses: 12, type: "مدنية" },
        { name: "الملك", verses: 30, type: "مكية" },
        { name: "القلم", verses: 52, type: "مكية" },
        { name: "الحاقة", verses: 52, type: "مكية" },
        { name: "المعارج", verses: 44, type: "مكية" },
        { name: "نوح", verses: 28, type: "مكية" },
        { name: "الجن", verses: 28, type: "مكية" },
        { name: "المزمل", verses: 20, type: "مكية" },
        { name: "المدثر", verses: 56, type: "مكية" },
        { name: "القيامة", verses: 40, type: "مكية" },
        { name: "الإنسان", verses: 31, type: "مدنية" },
        { name: "المرسلات", verses: 50, type: "مكية" },
        { name: "النبأ", verses: 40, type: "مكية" },
        { name: "النازعات", verses: 46, type: "مكية" },
        { name: "عبس", verses: 42, type: "مكية" },
        { name: "التكوير", verses: 29, type: "مكية" },
        { name: "الإنفطار", verses: 19, type: "مكية" },
        { name: "المطففين", verses: 36, type: "مكية" },
        { name: "الإنشقاق", verses: 25, type: "مكية" },
        { name: "البروج", verses: 22, type: "مكية" },
        { name: "الطارق", verses: 17, type: "مكية" },
        { name: "الأعلى", verses: 19, type: "مكية" },
        { name: "الغاشية", verses: 26, type: "مكية" },
        { name: "الفجر", verses: 30, type: "مكية" },
        { name: "البلد", verses: 20, type: "مكية" },
        { name: "الشمس", verses: 15, type: "مكية" },
        { name: "الليل", verses: 21, type: "مكية" },
        { name: "الضحى", verses: 11, type: "مكية" },
        { name: "الشرح", verses: 8, type: "مكية" },
        { name: "التين", verses: 8, type: "مكية" },
        { name: "العلق", verses: 19, type: "مكية" },
        { name: "القدر", verses: 5, type: "مكية" },
        { name: "البينة", verses: 8, type: "مدنية" },
        { name: "الزلزلة", verses: 8, type: "مدنية" },
        { name: "العاديات", verses: 11, type: "مكية" },
        { name: "القارعة", verses: 11, type: "مكية" },
        { name: "التكاثر", verses: 8, type: "مكية" },
        { name: "العصر", verses: 3, type: "مكية" },
        { name: "الهمزة", verses: 9, type: "مكية" },
        { name: "الفيل", verses: 5, type: "مكية" },
        { name: "قريش", verses: 4, type: "مكية" },
        { name: "الماعون", verses: 7, type: "مكية" },
        { name: "الكوثر", verses: 3, type: "مكية" },
        { name: "الكافرون", verses: 6, type: "مكية" },
        { name: "النصر", verses: 3, type: "مدنية" },
        { name: "المسد", verses: 5, type: "مكية" },
        { name: "الإخلاص", verses: 4, type: "مكية" },
        { name: "الفلق", verses: 5, type: "مكية" },
        { name: "الناس", verses: 6, type: "مكية" },
    ];

    function loadQuranResults() {
        $("#quranResults").empty();
        suraData.forEach((sura, index) => {
            $("#quranResults").append(`
                <div class="sura-button" data-sura="${index + 1}">
                    ${sura.name}
                    <div class="sura-type">${sura.type}</div>
                </div>
            `);
        });
        $("#quranResults").show();
        $("#quranContent").hide();
    }

    loadQuranResults();

    $(document).on("click", ".sura-button", function () {
        let suraNumber = $(this).data("sura");
        $.getJSON(`https://api.alquran.cloud/v1/surah/${suraNumber}/ar`, function (data) {
            let sura = data.data;
            $("#suraTitle").text(sura.name);
            $("#suraText").empty();
            sura.ayahs.forEach((ayah, index) => {
                $("#suraText").append(`
                    <div class="quran-text">
                        ${ayah.text} <span class="ayah-number">${ayah.numberInSurah}</span>
                    </div>
                `);
            });
            $("#quranResults").hide();
            $("#quranContent").show();
            updateStats("quran", parseInt(localStorage.getItem("quranCount") || "0") + 1);
        }).fail(function () {
            showError("حدث خطأ أثناء جلب نصوص القرآن");
        });
    });

    window.backToResults = function () {
        $("#quranContent").hide();
        $("#quranResults").show();
    };

    // Azkar Section
    let currentZikrIndex = {
        "azkar-sabah": 0,
        "azkar-masaa": 0,
        "azkar-nawm": 0
    };

    function selectAzkarSection(section) {
        $(".azkar-section").hide();
        $(`#${section}`).show();
        updateAzkarDisplay(section);
    }

    function updateAzkarDisplay(section) {
        let items = $(`#${section} .azkar-item`);
        items.hide();
        items.eq(currentZikrIndex[section]).show();
        $(`#${section} .azkar-navigation button`).prop("disabled", false);
        if (currentZikrIndex[section] === 0) {
            $(`#${section} .azkar-navigation button:contains('السابق')`).prop("disabled", true);
        }
        if (currentZikrIndex[section] === items.length - 1) {
            $(`#${section} .azkar-navigation button:contains('التالي')`).prop("disabled", true);
        }
    }

    window.selectAzkarSection = selectAzkarSection;

    window.nextZikr = function (section) {
        let items = $(`#${section} .azkar-item`);
        if (currentZikrIndex[section] < items.length - 1) {
            currentZikrIndex[section]++;
            updateAzkarDisplay(section);
        }
    };

    window.prevZikr = function (section) {
        if (currentZikrIndex[section] > 0) {
            currentZikrIndex[section]--;
            updateAzkarDisplay(section);
        }
    };

    $("#azkarGalleryBtn").click(function () {
        $("#galleryImages").html(`
            <img src="1.jpg" alt="Azkar Image 1" />
            <img src="2.jpg" alt="Azkar Image 2" />
            <img src="3.jpg" alt="Azkar Image 3" />
        `);
        $("#galleryModal").fadeIn();
    });

    $(".close-gallery, .close-image").click(function () {
        $("#galleryModal, #imageModal").fadeOut();
    });

    $(document).on("click", "#galleryImages img", function () {
        let src = $(this).attr("src");
        $("#largeImage").attr("src", src);
        $("#downloadLink").attr("href", src);
        $("#imageModal").fadeIn();
    });

    $("#moreAzkarDesignsBtn").click(function () {
        window.open("https://www.pinterest.com/search/pins/?q=azkar%20designs", "_blank");
    });

    // Questions Section
    const questions = [
        { question: "من هو أول نبي؟", answer: "آدم عليه السلام" },
        { question: "كم عدد أنبياء الله؟", answer: "124,000" },
        { question: "ما هي أول سورة نزلت في القرآن؟", answer: "سورة العلق" },
        { question: "من هو خاتم الأنبياء؟", answer: "محمد صلى الله عليه وسلم" },
        { question: "ما هي السورة التي تسمى قلب القرآن؟", answer: "سورة يس" },
    ];
    let currentQuestionIndex = 0;

    function showQuestion() {
        $("#questions-content").html(`
            <p>${questions[currentQuestionIndex].question}</p>
            <p>الإجابة: ${questions[currentQuestionIndex].answer}</p>
        `);
    }
    showQuestion();

    window.nextQuestion = function () {
        currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
        showQuestion();
    };
    window.prevQuestion = function () {
        currentQuestionIndex = (currentQuestionIndex - 1 + questions.length) % questions.length;
        showQuestion();
    };

    // Asma Allah Section
    const asmaAllah = [
        "الرحمن", "الرحيم", "الملك", "القدوس", "السلام", "المؤمن",
        "المهيمن", "العزيز", "الجبار", "المتكبر", "الخالق", "البارئ",
        "المصور", "الغفار", "القهار", "الوهاب", "الرزاق", "الفتاح",
        "العليم", "القابض", "الباسط", "الخافض", "الرافع", "المعز",
        "المذل", "السميع", "البصير", "الحكم", "العدل", "اللطيف",
        "الخبير", "الحليم", "العظيم", "الغفور", "الشكور", "العلي",
        "الكبير", "الحفيظ", "المقيت", "الحسيب", "الجليل", "الكريم",
        "الرقيب", "المجيب", "الواسع", "الحكيم", "الودود", "المجيد",
        "الباعث", "الشهيد", "الحق", "الوكيل", "القوي", "المتين",
        "الولي", "الحميد", "المحصي", "المبدئ", "المعيد", "المحيي",
        "المميت", "الحي", "القيوم", "الواجد", "الماجد", "الواحد",
        "الأحد", "الصمد", "القادر", "المقتدر", "المقدم", "المؤخر",
        "الأول", "الآخر", "الظاهر", "الباطن", "الوالي", "المتعالي",
        "البر", "التواب", "المنتقم", "العفو", "الرؤوف", "مالك الملك",
        "ذو الجلال والإكرام", "المقسط", "الجامع", "الغني", "المغني",
        "المانع", "الضار", "النافع", "النور", "الهادي", "البديع",
        "الباقي", "الوارث", "الرشيد", "الصبور"
    ];

    function loadAsmaAllah() {
        $("#asma-content").empty();
        asmaAllah.forEach(name => {
            $("#asma-content").append(`<div class="asma-item">${name}</div>`);
        });
    }
    loadAsmaAllah();

    // Advice Section
    const adviceData = {
        prayer: {
            title: "كيف تنتظم في الصلاة؟",
            text: "حدد أوقاتًا ثابتة للصلاة يوميًا، واستخدم التذكيرات إذا لزم الأمر. حاول أن تصلي في جماعة قدر الإمكان، واجعل الصلاة جزءًا من روتينك اليومي."
        },
        fajr: {
            title: "كيف تواظب على صلاة الفجر؟",
            text: "حاول النوم مبكرًا، واضبط منبهًا بعيدًا عن سريرك، وكافئ نفسك بعد الصلاة بشيء تحبه مثل فنجان قهوة."
        },
        azkar: {
            title: "كيف تدوام على الأذكار اليومية؟",
            text: "خصص وقتًا محددًا للأذكار صباحًا ومساءً، واستخدم تطبيقًا مثل آيات لتذكيرك، وحاول ربط الأذكار بروتين يومي مثل بعد الصلاة."
        },
        repentance: {
            title: "كيف تتوب إلى الله توبة نصوحة؟",
            text: "أخلص النية، واستغفر الله بصدق، وتجنب المعاصي قدر الإمكان، وأكثر من الأعمال الصالحة."
        },
        quran: {
            title: "كيف تحفظ القرآن الكريم؟",
            text: "ابدأ بحفظ جزء صغير يوميًا، وكرره باستمرار، واستمع لتلاوة القرآن من قارئ مفضل، وادعُ الله أن ييسر لك الحفظ."
        },
        wudu: {
            title: "إزاي تحافظ على وضوءك طول اليوم؟",
            text: "جدد وضوءك بعد كل صلاة، وحاول البقاء على طهارة قدر الإمكان، واعتبر الوضوء وسيلة للانتعاش الروحي."
        },
        dailyQuran: {
            title: "إزاي تقرأ ورد يومي من القرآن؟",
            text: "خصص وقتًا يوميًا ثابتًا للقراءة، ولو 10 دقايق بعد صلاة الفجر، واستخدم تطبيق زي آيات عشان تتابع تقدمك."
        },
        goodDeeds: {
            title: "إزاي تخلي يومك مليان حسنات؟",
            text: "أكثر من الذكر في أي وقت، ساعد غيرك حتى لو بشيء بسيط، وابتسم في وجه الناس، لأن الابتسامة صدقة."
        },
        avoidSins: {
            title: "إزاي تتجنب المعاصي اللي بتتكرر منك؟",
            text: "حدد المواقف اللي بتوقعك في الذنب، وابعد عنها، وأكثر من الدعاء بأن الله يقويك، واشغل وقتك بحاجة نافعة."
        },
        endDay: {
            title: "إزاي تختم يومك بذكر حسن؟",
            text: "قبل النوم، اقرأ أذكار النوم، واستغفر الله 100 مرة، وحاول تفكر في يومك وتشكر الله على نعمه."
        },
        cleanHeart: {
            title: "إزاي تحافظ على قلبك سليم ونظيف؟",
            text: "ابعد عن الحقد والحسد، وأكثر من الاستغفار، وحاول تسامح الناس حتى لو ظلموك."
        },
        noProcrastination: {
            title: "إزاي تبعد عن التسويف في العبادات؟",
            text: "خلّي شعارك: اللي أقدر أعمله دلوقتي، ما أأجلوش. وابدأ بخطوات صغيرة، زي صلاة ركعتين قبل ما تشتت."
        },
        freeTime: {
            title: "إزاي تستغل وقت فراغك في حاجة تنفعك؟",
            text: "اقرأ كتاب ديني، أو اسمع بودكاست مفيد، أو حتى ساعد أهلك في البيت، وابعد عن السوشيال ميديا لو مش هتستفيد."
        },
        strongerFaith: {
            title: "إزاي تقوّي علاقتك بربنا؟",
            text: "أكثر من الدعاء والتفكر في خلق الله، وحاول تقرأ في سيرة النبي صلى الله عليه وسلم، وخلّي ليك ورد يومي من القرآن."
        },
        khushoo: {
            title: "إزاي تخلي صلاتك بخشوع؟",
            text: "ركز في معاني الكلام اللي بتقوله في الصلاة، وتخيل إنك واقف قدام ربنا، وابعد عن أي مشتتات زي الموبايل."
        },
        abandonSin: {
            title: "إزاي تسيب ذنب متعلق بيك بقاله سنين؟",
            text: "أخلص النية إنك عايز تتغير، واستعين بالله، وابحث عن بديل إيجابي للذنب ده، زي إنك تشغل وقتك بقراءة القرآن."
        },
        guardTongue: {
            title: "إزاي تحافظ على لسانك من الغيبة والنميمة؟",
            text: "قبل ما تتكلم، اسأل نفسك: لو الشخص قدامي، هقول الكلام ده؟ وأكثر من ذكر الله عشان لسانك يفضل مشغول بالخير."
        },
        blessedHome: {
            title: "إزاي تخلي بيتك فيه بركة وراحة نفسية؟",
            text: "أكثر من قراءة سورة البقرة في البيت، وحافظ على النظافة، وخلّي الأذكار دايمًا موجودة في يومك."
        },
        friday: {
            title: "إزاي تستغل يوم الجمعة صح؟",
            text: "اقرأ سورة الكهف، وأكثر من الصلاة على النبي، وحاول تحضر خطبة الجمعة وتستغل الساعة اللي فيها إجابة للدعاء."
        },
        positiveStart: {
            title: "إزاي تبدأ يومك بطاقة إيجابية؟",
            text: "صلّي الفجر في وقتها، اقرأ أذكار الصباح، واشكر ربنا على نعمة إنك صحيت النهاردة."
        },
        protectEnvy: {
            title: "إزاي تحمي نفسك من الحسد والعين؟",
            text: "أكثر من قراءة المعوذتين وآية الكرسي، وحافظ على أذكار الصباح والمساء، وما تعلنش كل نعمك على السوشيال."
        },
        contentment: {
            title: "إزاي تحس بالرضا في حياتك؟",
            text: "فكّر في النعم اللي عندك واشكر ربنا عليها، وابعد عن مقارنة نفسك بغيرك، وادعي دايمًا بالخير."
        }
    };

    let currentAdviceKey = "";
    window.showAdvice = function (key) {
        currentAdviceKey = key;
        $("#advice-title").text(adviceData[key].title);
        $("#advice-text").text(adviceData[key].text);
        $("#advice-list").hide();
        $("#advice-content").show();
    };
    window.backToAdviceList = function () {
        $("#advice-content").hide();
        $("#advice-list").show();
    };

    // Hadith Section
    window.loadHadith = function () {
        $.getJSON("https://api.hadith.gading.dev/books/muslim/random", function (data) {
            $("#hadith-text").text(data.data.hadith.text);
            $("#hadith-reference").text(data.data.book + " - " + data.data.number);
        }).fail(function () {
            showError("حدث خطأ أثناء جلب الحديث");
        });
    };
    loadHadith();

    // Stories Section
    const stories = [
        { title: "قصة آدم عليه السلام", videoId: "dQw4w9WgXcQ" },
        { title: "قصة نوح عليه السلام", videoId: "e4q6eaLn2mY" },
        { title: "قصة إبراهيم عليه السلام", videoId: "yXzM2zQ3a0w" },
        { title: "قصة يوسف عليه السلام", videoId: "placeholder4" },
        { title: "قصة موسى عليه السلام", videoId: "placeholder5" },
        { title: "قصة عيسى عليه السلام", videoId: "placeholder6" },
        { title: "قصة محمد صلى الله عليه وسلم", videoId: "placeholder7" },
        { title: "قصة هود عليه السلام", videoId: "placeholder8" },
        { title: "قصة صالح عليه السلام", videoId: "placeholder9" },
        { title: "قصة لوط عليه السلام", videoId: "placeholder10" },
        { title: "قصة شعيب عليه السلام", videoId: "placeholder11" },
        { title: "قصة إسماعيل عليه السلام", videoId: "placeholder12" },
        { title: "قصة إسحاق عليه السلام", videoId: "placeholder13" },
        { title: "قصة يعقوب عليه السلام", videoId: "placeholder14" },
        { title: "قصة أيوب عليه السلام", videoId: "placeholder15" },
        { title: "قصة ذو الكفل عليه السلام", videoId: "placeholder16" },
        { title: "قصة يونس عليه السلام", videoId: "placeholder17" },
        { title: "قصة زكريا عليه السلام", videoId: "placeholder18" },
        { title: "قصة يحيى عليه السلام", videoId: "placeholder19" },
        { title: "قصة الياس عليه السلام", videoId: "placeholder20" },
        { title: "قصة إدريس عليه السلام", videoId: "placeholder21" }
    ];

    function loadStories() {
        $("#stories-grid").empty();
        stories.forEach(story => {
            $("#stories-grid").append(`
                <div>
                    <iframe src="https://www.youtube.com/embed/${story.videoId}" title="${story.title}"></iframe>
                    <p>${story.title}</p>
                </div>
            `);
        });
    }
    loadStories();

    // Podcasts Section
    const podcasts = [
        { title: "بودكاست ديني 1", videoId: "dQw4w9WgXcQ" },
        { title: "بودكاست ديني 2", videoId: "e4q6eaLn2mY" },
        { title: "بودكاست ديني 3", videoId: "yXzM2zQ3a0w" },
        { title: "بودكاست ديني 4", videoId: "placeholder4" },
        { title: "بودكاست ديني 5", videoId: "placeholder5" },
        { title: "بودكاست ديني 6", videoId: "placeholder6" },
        { title: "بودكاست ديني 7", videoId: "placeholder7" },
        { title: "بودكاست ديني 8", videoId: "placeholder8" },
        { title: "بودكاست ديني 9", videoId: "placeholder9" },
        { title: "بودكاست ديني 10", videoId: "placeholder10" }
    ];

    function loadPodcasts() {
        $("#podcasts-grid").empty();
        podcasts.forEach(podcast => {
            $("#podcasts-grid").append(`
                <div>
                    <iframe src="https://www.youtube.com/embed/${podcast.videoId}" title="${podcast.title}"></iframe>
                    <p>${podcast.title}</p>
                </div>
            `);
        });
    }
    loadPodcasts();

    // Duaa Quran Section
    const duas = [
        { content: "ربنا تقبل منا إنك أنت السميع العليم، وتب علينا إنك أنت التواب الرحيم." },
        { content: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار." },
        { content: "ربنا أفرغ علينا صبرا وثبت أقدامنا وانصرنا على القوم الكافرين." },
        { content: "ربنا لا تؤاخذنا إن نسينا أو أخطأنا، ربنا ولا تحمل علينا إصرا كما حملته على الذين من قبلنا." },
        { content: "ربنا ولا تحملنا ما لا طاقة لنا به واعف عنا واغفر لنا وارحمنا أنت مولانا فانصرنا على القوم الكافرين." },
        { content: "ربنا لا تزغ قلوبنا بعد إذ هديتنا وهب لنا من لدنك رحمة إنك أنت الوهاب." },
        { content: "ربنا إنك جامع الناس ليوم لا ريب فيه إن الله لا يخلف الميعاد." },
        { content: "رب هب لي من لدنك ذرية طيبة إنك سميع الدعاء." },
        { content: "ربنا آمنا بما أنزلت واتبعنا الرسول فاكتبنا مع الشاهدين." },
        { content: "ربنا اغفر لنا ذنوبنا وإسرافنا في أمرنا وثبت أقدامنا وانصرنا على القوم الكافرين." }
    ];

    let currentDuaIndex = 0;

    function updateDua() {
        $(".duaa-items").empty();
        $(".duaa-items").append(`
            <div class="duaa-item">
                <p>${duas[currentDuaIndex].content}</p>
                <button onclick="addToFavorites('duaa-quran', '${duas[currentDuaIndex].content}')">إضافة للمفضلة</button>
            </div>
        `);
        $(".duaa-navigation button:contains('السابق')").prop("disabled", currentDuaIndex === 0);
        $(".duaa-navigation button:contains('التالي')").prop("disabled", currentDuaIndex === duas.length - 1);
        updateStats("duaa", parseInt(localStorage.getItem("duaaCount") || "0") + 1);
    }

    window.nextDuaa = function () {
        if (currentDuaIndex < duas.length - 1) {
            currentDuaIndex++;
            updateDua();
        }
    };

    window.prevDuaa = function () {
        if (currentDuaIndex > 0) {
            currentDuaIndex--;
            updateDua();
        }
    };

    updateDua();

    // Hijri Calendar Section
    function loadHijriDate() {
        $.getJSON("https://api.aladhan.com/v1/gToH", function (data) {
            let hijriDate = data.data.hijri;
            let gregorianDate = data.data.gregorian;
            let events = getReligiousEvents(hijriDate.month.number, hijriDate.day);
            $("#hijri-table-body").html(`
                <tr>
                    <td>${hijriDate.day} ${hijriDate.month.ar} ${hijriDate.year}</td>
                    <td>${gregorianDate.day} ${gregorianDate.month.en} ${gregorianDate.year}</td>
                    <td>${hijriDate.weekday.ar}</td>
                    <td>${events || "لا توجد أحداث"}</td>
                </tr>
            `);
        }).fail(function () {
            showError("حدث خطأ أثناء جلب التاريخ الهجري");
        });
    }

    function getReligiousEvents(month, day) {
        const events = {
            "1": { "10": "يوم عاشوراء" },
            "9": { "1": "بداية شهر رمضان" },
            "10": { "1": "عيد الفطر" },
            "12": { "10": "عيد الأضحى" }
        };
        return events[month] && events[month][day] ? events[month][day] : "";
    }

    loadHijriDate();

    // Audio Quran Section
    window.downloadAudio = function (sheikhId) {
        // Placeholder function until actual URLs are provided
        alert(`جاري تحميل تلاوة الشيخ ${sheikhId}... (سيتم إضافة الرابط لاحقًا)`);
    };

    // Prophetic Duas Section
    const propheticDuas = [
        { text: "اللهم اغفر لي ذنبي كله، دقه وجله، وأوله وآخره، وعلانيته وسره.", source: "صحيح مسلم" },
        { text: "اللهم إني أعوذ بك من الهم والحزن، والعجز والكسل.", source: "صحيح البخاري" },
        { text: "اللهم اجعل في قلبي نورا، وفي بصري نورا، وفي سمعي نورا.", source: "صحيح البخاري" },
        { text: "اللهم إني أسألك علما نافعا، ورزقا طيبا، وعملا متقبلا.", source: "سنن ابن ماجه" },
        { text: "اللهم إني أعوذ بك من زوال نعمتك، وتحول عافيتك، وفجاءة نقمتك، وجميع سخطك.", source: "صحيح مسلم" }
    ];

    function loadPropheticDuas() {
        $("#duas-list").empty();
        propheticDuas.forEach(dua => {
            $("#duas-list").append(`
                <div class="dua-item">
                    <p class="dua-text">${dua.text}</p>
                    <p class="dua-source">${dua.source}</p>
                    <button onclick="addToFavorites('prophetic-duas', '${dua.text} [${dua.source}]')">إضافة للمفضلة</button>
                </div>
            `);
        });
    }
    loadPropheticDuas();

    // Stats Section
    function updateStats(type, value) {
        localStorage.setItem(type + "Count", value);
        $("#stats-" + type).text(value);
    }

    function loadStats() {
        updateStats("tasbe7", localStorage.getItem("tasbe7Count") || "0");
        updateStats("quran", localStorage.getItem("quranCount") || "0");
        updateStats("duaa", localStorage.getItem("duaaCount") || "0");
    }
    loadStats();

    // Challenges Section
    const challenges = [
        { id: "tasbe7-100", title: "التسبيح 100 مرة", reward: "100 حسنة" },
        { id: "quran-page", title: "قراءة صفحة من القرآن", reward: "حسنة لكل حرف" },
        { id: "dua-daily", title: "الدعاء اليومي", reward: "قربة إلى الله" },
    ];

    function loadChallenges() {
        $("#challenges-list").empty();
        challenges.forEach(challenge => {
            let completed = localStorage.getItem("challenge-" + challenge.id) === "true";
            $("#challenges-list").append(`
                <div class="challenge-item ${completed ? 'completed' : ''}">
                    <span>${challenge.title} (${challenge.reward})</span>
                    <button onclick="completeChallenge('${challenge.id}')">${completed ? 'مكتمل' : 'إكمال'}</button>
                </div>
            `);
        });
    }
    loadChallenges();

    window.completeChallenge = function (id) {
        localStorage.setItem("challenge-" + id, "true");
        loadChallenges();
    };

    // Favorites Section
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    function loadFavorites() {
        $("#favorites-list").empty();
        favorites.forEach((item, index) => {
            $("#favorites-list").append(`
                <div class="favorite-item">
                    <p>${item.content} (${item.type})</p>
                    <button onclick="removeFromFavorites(${index})">إزالة</button>
                </div>
            `);
        });
    }
    loadFavorites();

    window.addToFavorites = function (type, content) {
        favorites.push({ type, content });
        localStorage.setItem("favorites", JSON.stringify(favorites));
        loadFavorites();
    };

    window.removeFromFavorites = function (index) {
        favorites.splice(index, 1);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        loadFavorites();
    };

    // Error Modal
    function showError(message) {
        $("#error-message").text(message);
        $("#error-modal").fadeIn();
        setTimeout(function () {
            $("#error-modal").fadeOut();
        }, 3000);
    }

    // Open Tab
    window.openTab = function (tabName) {
        $(".tab-content").hide();
        $("#" + tabName).show();
        $(".tab").css("background-color", "#692079");
        $(`.tab[onclick="openTab('${tabName}')"]`).css("background-color", "#5a1a6a");
    };
    openTab("tasbe7");
});