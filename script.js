$(document).ready(function() {
    $("#main-content").show();
    openTab('tasbe7');
    loadCountries();
    setupModals();
    loadQuran();
    initCompass();
    loadCustomAzkar();
    displayAsmaAllah();
    $("#azkarGalleryBtn").click(function() {
        openGallery();
    });
});

function openTab(tabName) {
    $(".tab-content").hide();
    $("#" + tabName).show();
}

let tasbe7at = ["سبحان الله", "الحمد لله", "لا إله إلا الله", "الله أكبر"];
let clicks = 10, n = 0, score = 0;
function count() {
    clicks--;
    if (clicks === 0) {
        score++;
        clicks = 10;
        n++;
        if (n >= tasbe7at.length) { n = 0; }
    }
    $("#text").html(tasbe7at[n] + ": " + clicks);
    $("#score").html("العدد: " + score);
    $("#circle").css("transform", "scale(0.95)").animate({ transform: "scale(1)" }, 200);
}
function resetCounter() {
    score = 0; clicks = 10; n = 0;
    $("#score").html("العدد: " + score);
    $("#text").html("ابدأ التسبيح");
}

async function getPrayerTimesByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude,
                  long = position.coords.longitude;
            $("#prayer-times").html("جاري تحميل مواقيت الصلاة...");
            try {
                const response = await fetch(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${long}&method=5`);
                const data = await response.json();
                displayPrayerTimes(data.data.timings);
            } catch (error) {
                showError("حدث خطأ أثناء جلب مواقيت الصلاة.");
            }
        }, (error) => {
            showError("لم يتم تحديد الموقع.");
        });
    } else {
        showError("المتصفح لا يدعم تحديد الموقع الجغرافي.");
    }
}

async function getPrayerTimes() {
    const city = $("#city").val(), country = $("#country").val();
    try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=5`);
        const data = await response.json();
        displayPrayerTimes(data.data.timings);
    } catch (error) {
        showError("حدث خطأ أثناء جلب مواقيت الصلاة. تحقق من المدينة والدولة.");
    }
}

function displayPrayerTimes(times) {
    const prayers = { Fajr: "الفجر", Dhuhr: "الظهر", Asr: "العصر", Maghrib: "المغرب", Isha: "العشاء" };
    let html = '<table>';
    html += '<tr><th>الصلاة</th><th>الوقت</th></tr>';
    for (let prayer in prayers) {
        html += `<tr><td>${prayers[prayer]}</td><td>${times[prayer]}</td></tr>`;
    }
    html += '</table>';
    $("#prayer-times").html(html);
}

async function loadCountries() {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const countries = await response.json();
        const countrySelect = $("#country");
        countries.sort((a, b) => a.name.common.localeCompare(b.name.common));
        countries.forEach(country => {
            countrySelect.append(`<option value="${country.cca2}">${country.name.common}</option>`);
        });
    } catch (error) {
        showError("حدث خطأ أثناء تحميل الدول.");
    }
}

$("#country").change(function() {
    let countryCode = $(this).val();
    loadProvinces(countryCode);
});

function loadProvinces(countryCode) {
    let provinces = [];
    if(countryCode === "EG") {
        provinces = ["القاهرة", "الإسكندرية", "جيزة", "أسوان", "الأقصر"];
    }
    $("#province").remove();
    if(provinces.length > 0) {
        let selectElem = '<label for="province">اختر المحافظة:</label><select id="province">';
        provinces.forEach(function(province) {
            selectElem += `<option value="${province}">${province}</option>`;
        });
        selectElem += '</select>';
        $("#salah").append(selectElem);
    } else {
        $("#salah").append('<label for="province">لا توجد محافظات</label>');
    }
}

let azkar = [
    "أذكار الصباح: اللهم بك أصبحنا وبك أمسينا...",
    "أذكار المساء: اللهم بك أمسينا وبك أصبحنا...",
    "أذكار النوم: باسمك ربي وضعت جنبي..."
];
let currentZikr = 0;
function nextZikr() {
    currentZikr = (currentZikr + 1) % azkar.length;
    $("#azkar-content").html(`<p style="font-size: 1.2em;">${azkar[currentZikr]}</p>`);
}
function prevZikr() {
    currentZikr = (currentZikr - 1 + azkar.length) % azkar.length;
    $("#azkar-content").html(`<p style="font-size: 1.2em;">${azkar[currentZikr]}</p>`);
}

let questions = [
    { q: "ما هو تعريف الصلاة؟", a: "الصلاة هي عبادة الله تعالى وتواصل بين العبد وربه." },
    { q: "ما هي أركان الإسلام؟", a: "الشهادة، الصلاة، الزكاة، الصوم، والحج." },
    { q: "ما هي أركان الإيمان؟", a: "الإيمان بالله، وملائكته، وكتبه، ورسله، واليوم الآخر، والقدر خيره وشره." },
    { q: "ما هي السور المكية؟", a: "السور المكية هي التي نزلت قبل الهجرة." },
    { q: "ما هي السور المدنية؟", a: "السور المدنية هي التي نزلت بعد الهجرة." }
];
let currentQuestion = 0;
function nextQuestion() {
    currentQuestion = (currentQuestion + 1) % questions.length;
    $("#questions-content").html(
      `<p style="font-size: 1.2em;">س: ${questions[currentQuestion].q}</p>` +
      `<p style="font-size: 1.2em;">ج: ${questions[currentQuestion].a}</p>`
    );
}
function prevQuestion() {
    currentQuestion = (currentQuestion - 1 + questions.length) % questions.length;
    $("#questions-content").html(
      `<p style="font-size: 1.2em;">س: ${questions[currentQuestion].q}</p>` +
      `<p style="font-size: 1.2em;">ج: ${questions[currentQuestion].a}</p>`
    );
}

function showError(message) {
    $("#error-message").html(message);
    $("#error-modal").fadeIn();
}
function setupModals() {
    $(".close-button").click(function() {
        $("#error-modal").fadeOut();
        $("#galleryModal").fadeOut();
        $("#imageModal").fadeOut();
    });
}

function loadQuran() {
    fetch('https://api.alquran.cloud/v1/surah')
        .then(response => response.json())
        .then(data => {
            let suraList = "";
            data.data.sort((a, b) => a.number - b.number).forEach(sura => {
                suraList += `
                    <div class="sura-button" onclick="showSura(${sura.number})">
                        ${sura.name}
                        <div class="sura-type">${sura.revelationType === "Meccan" ? "مكية" : "مدنية"}</div>
                    </div>
                `;
            });
            $("#quranResults").html(suraList);
        })
        .catch(error => showError("حدث خطأ أثناء تحميل السور القرآنية."));
}

function showSura(number) {
    fetch(`https://api.alquran.cloud/v1/surah/${number}`)
        .then(response => response.json())
        .then(data => {
            $("#suraTitle").html(data.data.name);
            $("#suraText").html(
              data.data.ayahs.map(ayah =>
                `<p class="quran-text" style="font-family: 'QCF_P601', serif; font-size: 1.5em;">${ayah.text}</p>`
              ).join('')
            );
            $("#quranResults").hide();
            $("#quranContent").show();
        })
        .catch(error => showError("حدث خطأ أثناء تحميل السورة."));
}

function backToResults() {
    $("#quranContent").hide();
    $("#quranResults").show();
}

function openGallery() {
    const images = ["1.jpg", "2.jpg", "3.jpg"];
    let galleryHTML = "";
    images.forEach((src, index) => {
        galleryHTML += `<img src="${src}" alt="Azkar ${index + 1}" onclick="openImageModal('${src}')" />`;
    });
    $("#galleryImages").html(galleryHTML);
    $("#galleryModal").fadeIn();
}

$(".close-gallery").click(function() {
    $("#galleryModal").fadeOut();
});

function openImageModal(src) {
    $("#largeImage").attr("src", src);
    $("#downloadLink").attr("href", src).attr("download", `Azkar_${src.split('/').pop()}`);
    $("#imageModal").fadeIn();
}

$(".close-image").click(function() {
    $("#imageModal").fadeOut();
});

function loadCustomAzkar() {
    if (localStorage.getItem("customAzkar")) {
        $("#customAzkarList").html(localStorage.getItem("customAzkar"));
    }
}

function addCustomAzkar() {
    const customZikr = $("#customAzkarInput").val();
    if (customZikr) {
        const listItem = `<li style="font-size: 1.2em;">${customZikr}</li>`;
        $("#customAzkarList").append(listItem);
        localStorage.setItem("customAzkar", $("#customAzkarList").html());
        $("#customAzkarInput").val("");
    } else {
        showError("الرجاء إدخال ذكر مخصص.");
    }
}

function initCompass() {
}

let asmaAllah = [
  "الرحمن", "الرحيم", "الملك", "القدوس", "السلام", "المؤمن", "المهيمن",
  "العزيز", "الجبار", "المتكبر", "الخالق", "البارئ", "المصور", "الغفار",
  "القهار", "الوهاب", "الرزاق", "الفتاح", "العليم", "القابض", "الباسط",
  "الخافض", "الرافع", "المعز", "المذل", "السميع", "البصير", "الحكم",
  "العدل", "اللطيف", "الخبير", "الحليم", "العظيم", "الغفور", "الشكور",
  "العلي", "الكبير", "الحفيظ", "المقيت", "الحسيب", "الجليل", "الكريم",
  "الرقيب", "المجيب", "الواسع", "الحكيم", "الودود", "المجيد", "الباعث",
  "الشهيد", "الحق", "الوكيل", "القوي", "المتين", "الولي", "الحميد",
  "المحصي", "المبدئ", "المعيد", "المحيي", "المميت", "الحي", "القيوم",
  "الواجد", "الماجد", "الواحد", "الصمد", "القادر", "المقتدر", "المقدم",
  "المؤخر", "الأول", "الآخر", "الظاهر", "الباطن", "الوالي", "المتعالى",
  "البر", "التواب", "المنتقم", "العفو", "الرؤوف", "مالك الملك",
  "ذو الجلال والإكرام", "المقسط", "الجامع", "الغني", "المغني", "المانع",
  "الضار", "النافع", "النور", "الهادي", "البديع", "الباقي", "الوارث",
  "الرشيد", "الصبور"
];
function displayAsmaAllah() {
    let html = "";
    asmaAllah.forEach(name => {
        html += `<span class="asma-item">${name}</span>`;
    });
    $("#asma-content").html(html);
}

const adviceData = {
    prayer: {
        title: "كيف تنتظم في الصلاة؟",
        text: "لتنتظم في الصلاة، حاول تحديد أوقات ثابتة للصلاة، واستخدم المنبهات لتذكيرك بأوقات الصلاة."
    },
    fajr: {
        title: "كيف تواظب على صلاة الفجر؟",
        text: "لتواظب على صلاة الفجر، نم مبكرًا، واستخدم منبه قوي، وضع نية قوية للاستيقاظ للصلاة."
    },
    azkar: {
        title: "كيف تدوام على الأذكار اليومية؟",
        text: "لتدوام على الأذكار اليومية، احمل معك كتاب أذكار، أو استخدم تطبيقات الأذكار على هاتفك."
    },
    repentance: {
        title: "كيف تتوب إلى الله توبة نصوحة؟",
        text: "لتتوب إلى الله توبة نصوحة، اعترف بذنوبك، واطلب المغفرة، واعزم على عدم العودة إليها."
    },
    quran: {
        title: "كيف تحفظ القرآن الكريم؟",
        text: "لتحفظ القرآن الكريم، خصص وقتًا يوميًا للحفظ، واستمع إلى التلاوات، وكرر ما تحفظه باستمرار."
    }
};

function showAdvice(key) {
    const advice = adviceData[key];
    $("#advice-title").html(advice.title);
    $("#advice-text").html(advice.text);
    $("#advice-list").hide();
    $("#advice-content").show();
}

function backToAdviceList() {
    $("#advice-content").hide();
    $("#advice-list").show();
}