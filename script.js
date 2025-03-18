$(document).ready(function() {
    $("#main-content").show();
    openTab('tasbe7');
    loadCountries();

    $("#azkarGalleryBtn").click(function() {
        openGallery();
    });

    $("#dark-mode-toggle").click(function() {
        $("body").toggleClass("dark-mode");
        if ($("body").hasClass("dark-mode")) {
            $("#dark-mode-toggle").html('<i class="fas fa-moon"></i>');
        } else {
            $("#dark-mode-toggle").html('<i class="fas fa-sun"></i>');
        }
    });

    $("#moreAzkarDesignsBtn").click(function() {
        window.open("YOUR_PINTEREST_LINK_HERE", "_blank");
    });

    setupModals();
});

function openTab(tabName) {
    $(".tab-content").hide();
    $("#" + tabName).show();

    switch (tabName) {
        case 'tasbe7':
            resetCounter();
            break;
        case 'salah':
            loadCountries();
            break;
        case 'azkar':
            prevZikr();
            break;
        case 'questions':
            prevQuestion();
            break;
        case 'asma-allah':
            displayAsmaAllah();
            break;
        case 'quran':
            loadQuran();
            break;
        case 'advice':
            break;
        case 'hadith':
            loadHadith();
            break;
        case 'stories':
            loadStories();
            break;
        case 'duaa-quran':
            loadDuaaQuran();
            break;
        case 'qibla':
            break;
        case 'hijri':
            loadHijriDate();
            break;
        case 'audio-quran':
            loadAudioQuran();
            break;
        case 'prophetic-duas':
            loadPropheticDuas();
            break;
        default:
            console.log("تبويب غير معروف: " + tabName);
    }
}

let tasbe7at = ["سبحان الله", "الحمد لله", "لا إله إلا الله", "الله أكبر"];
let clicks = 10, n = 0, score = 0, totalClicks = 40;

function count() {
    clicks--;
    if (clicks <= 0) {
        score++;
        clicks = 10;
        n = (n + 1) % tasbe7at.length;
    }
    $("#text").html(tasbe7at[n] + ": " + clicks);
    $("#score").html("العدد: " + score);
    let progress = Math.round((score * 10 / totalClicks) * 100);
    $("#progress").html("التقدم: " + progress + "%");
}

function resetCounter() {
    score = 0;
    clicks = 10;
    n = 0;
    $("#score").html("العدد: " + score);
    $("#text").html("ابدأ التسبيح");
    $("#progress").html("التقدم: 0%");
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
    if (!city || !country) {
        showError("يرجى اختيار الدولة والمنطقة.");
        return;
    }
    $("#prayer-times").html("جاري تحميل مواقيت الصلاة...");
    try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=5`);
        const data = await response.json();
        displayPrayerTimes(data.data.timings);
    } catch (error) {
        showError("حدث خطأ أثناء جلب مواقيت الصلاة. تحقق من الاتصال.");
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

function loadCountries() {
    const countrySelect = $("#country");
    countrySelect.empty();
    countrySelect.append('<option value="">اختر دولة</option>');

    const countries = {
        "مصر": "Egypt",
        "السعودية": "Saudi Arabia",
        "الإمارات": "United Arab Emirates",
        "الأردن": "Jordan",
        "قطر": "Qatar",
        "الكويت": "Kuwait",
        "البحرين": "Bahrain",
        "عمان": "Oman",
        "سوريا": "Syria",
        "العراق": "Iraq",
        "لبنان": "Lebanon",
        "المغرب": "Morocco",
        "الجزائر": "Algeria",
        "تونس": "Tunisia",
        "ليبيا": "Libya",
        "السودان": "Sudan",
        "اليمن": "Yemen"
    };

    for (let name in countries) {
        countrySelect.append(`<option value="${countries[name]}">${name}</option>`);
    }
}

$("#country").change(function() {
    const countryCode = $(this).val();
    loadCities(countryCode);
});

function loadCities(countryCode) {
    const citySelect = $("#city");
    citySelect.empty();
    citySelect.append('<option value="">اختر منطقة</option>');

    const cities = {
        "Egypt": ["القاهرة", "الإسكندرية", "الجيزة", "أسوان", "الأقصر"],
        "Saudi Arabia": ["الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام"],
        "United Arab Emirates": ["دبي", "أبوظبي", "الشارقة", "العين"],
        "Jordan": ["عمان", "إربد", "الزرقاء"],
        "Qatar": ["الدوحة", "الريان"],
        "Kuwait": ["مدينة الكويت", "حولي"],
        "Bahrain": ["المنامة", "المحرق"],
        "Oman": ["مسقط", "صلالة"],
        "Syria": ["دمشق", "حلب"],
        "Iraq": ["بغداد", "البصرة"],
        "Lebanon": ["بيروت", "طرابلس"],
        "Morocco": ["الرباط", "الدار البيضاء"],
        "Algeria": ["الجزائر العاصمة", "وهران"],
        "Tunisia": ["تونس", "صفاقس"],
        "Libya": ["طرابلس", "بنغازي"],
        "Sudan": ["الخرطوم", "أم درمان"],
        "Yemen": ["صنعاء", "عدن"]
    };

    if (cities[countryCode]) {
        cities[countryCode].forEach(city => {
            citySelect.append(`<option value="${city}">${city}</option>`);
        });
    }
}

let azkar = [
    "أذكار الصباح: اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور",
    "أذكار المساء: اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير",
    "أذكار النوم: باسمك ربي وضعت جنبي وبك أرفعه، إن أمسكت نفسي فارحمها، وإن أرسلتها فاحفظها بما تحفظ به عبادك الصالحين",
    "أستغفر الله العظيم الذي لا إله إلا هو الحي القيوم وأتوب إليه",
    "اللهم إني أسألك علماً نافعاً ورزقاً طيباً وعملاً متقبلاً",
    "سبحان الله وبحمده، عدد خلقه ورضا نفسه وزنة عرشه ومداد كلماته",
    "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير"
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
    { q: "من هو أول نبي؟", a: "آدم عليه السلام هو أول نبي ورسول." },
    { q: "ما هي أول سورة نزلت في القرآن؟", a: "سورة العلق (اقرأ باسم ربك)." },
    { q: "ما هو اسم أم النبي محمد؟", a: "آمنة بنت وهب." },
    { q: "كم عدد أسماء الله الحسنى؟", a: "99 اسمًا." },
    { q: "ما هو الكتاب الذي أنزل على عيسى عليه السلام؟", a: "الإنجيل." },
    { q: "ما هي السورة التي تسمى قلب القرآن؟", a: "سورة يس." },
    { q: "ما هي أول صلاة فرضت على المسلمين؟", a: "صلاة الفجر والعصر (قبل الإسراء والمعراج)." },
    { q: "من هو النبي الذي ابتلعه الحوت؟", a: "يونس عليه السلام." },
    { q: "ما هو اسم الجبل الذي رست عليه سفينة نوح؟", a: "جبل الجودي." },
    { q: "ما هي السورة التي نزلت كاملة؟", a: "سورة الفاتحة." }
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
    $("#error-modal").css("display", "flex");
}

function setupModals() {
    $(".close-button").click(function() {
        $("#error-modal").css("display", "none");
        $("#galleryModal").css("display", "none");
        $("#imageModal").css("display", "none");
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
                `<p class="quran-text">${ayah.text}<span class="ayah-number">${ayah.numberInSurah}</span></p>`
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
        galleryHTML += `<img src="${src}" alt="Azkar ${index + 1}" onclick="openImageModal('${src}')">`;
    });
    $("#galleryImages").html(galleryHTML);
    $("#galleryModal").css("display", "flex");
    $("#imageModal").css("display", "none"); // نتأكد إن مودال الصورة الكبيرة مختفي
}

function openImageModal(src) {
    $("#largeImage").attr("src", src);
    $("#downloadLink").attr("href", src).attr("download", `Azkar_${src.split('/').pop()}`);
    $("#galleryModal").css("display", "none"); // نخفي المعرض
    $("#imageModal").css("display", "flex"); // نظهر الصورة الكبيرة
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
    prayer: { title: "كيف تنتظم في الصلاة؟", text: "الصلاة من أهم العبادات اللي لازم نلتزم بيها ولما بنلتزم بها حياتنا بتتغير للأفضل وهيا صلة الانسان برب العباد وعلشان تنتظم في الصلاة لازم تحاول تحدد أوقات ثابتة للصلاة في اليوم بمعني انك هتبدء تنظم يومك بحيث تعرف إنك هتصلي في الوقت المحدد وخليك مع المنبهات والتطبيقات اللي بتذكرك بمواعيد الصلاة علشان مفيش حاجة تشغلك عنها واعرف ان كل ما اتعودت على النظام ده هتلاقي الصلاة بقت جزء من يومك بشكل طبيعي." },
    fajr: { title: "كيف تواظب على صلاة الفجر؟", text: "صلاة الفجر من أروع الصلوات وأكبر فرصة لربنا يفتح لنا أبواب الرزق والبركة فى بداية اليوم وعلشان تواظب عليها الزم نفسك إنك تنام بدري لأن النوم بدري بيساعدك تصحى في وقت الفجر واستخدم منبه ويفضل لو حطيت المنبه بعيد عن السرير عشان تضطر تقوم وتخلي عندك نية وتشغل ذهنك قبل ما تنام إنك هتصحى وتصلي الفجر عشان لما تعود نفسك على ده هتحس بتغيير كبير في حياتك." },
    azkar: { title: "كيف تدوام على الأذكار اليومية؟", text: "الأذكار اليومية حاجة بسيطة بس مؤثرة جدًا في حياتنا عشان تكون دائمًا متذكر لله وممكن تحمل معاك كتاب الأذكار في شنطتك أو جيبك او حتي كصور وفي ناس كمان بيحبوا يستخدموا تطبيقات الأذكار على الموبايل علشان تقدر تذكر الله في أي وقت وفي أي مكان وخلي الأذكار عادة يومية زي شرب المياه ومع الوقت هتحس بتغيير وطمأنينة في حياتك." },
    repentance: { title: "كيف تتوب إلى الله توبة نصوحة؟", text: "التوبة النصوحة هي التوبة الصادقة من القلب وعليها الالتزام ولها شروط علشان تكون مقبولة ان أول حاجة اعترف بذنوبك أمام الله واطلب المغفرة ولازم يكون عندك نية إنك مش هترجع للذنوب دي تاني وإنك هتبدأ صفحة جديدة مع ربنا وانك تاخد بالاسباب وتدور على صحبة صالحة لان التوبة مش بس بالكلام انما بالأفعال يعني تبعد عن الأسباب اللي بتخليك تقع في نفس المعاصي." },
    quran: { title: "كيف تحفظ القرآن الكريم؟", text: "حفظ القرآن مش صعب لو نظمنا وقتنا صح وأول حاجة خصص وقت يومي ثابت للحفظ ولو حتى نص ساعة في اليوم وتكون في مكان هادي علشان تركز بعيدا عن المشتتات والصوت العالي وابتدي تحفظ جزء صغير كل يوم وتسمع تلاوات القرآن من شيوخ مختلفين علشان يثبت في قلبك ولما تحفظ جزء كرره كتير لحد ما يتثبت في عقلك وذهنك وهنا ما تيأس لو تعبت وافتكر إن الحفظ بالنية والمثابرة هتلاقي نفسك حفظت أجزاء كبيرة مع الوقت." },
    wudu: { title: "إزاي تحافظ على وضوءك طول اليوم؟", text: "خلي معاك سبحة أو منبه يذكرك بالوضوء وكل ما ينقض وضوءك جَدّده على طول لأن الوضوء نور، وبيخليك دايمًا مستعد للصلاة" },
    dailyQuran: { title: "إزاي تقرأ ورد يومي من القرآن؟", text: "حدد وقت معين بعد الفجر أو قبل النوم حتى لو صفحة واحدة بس المهم الاستمرارية ولو مشغول اسمع قرآن وأنت ماشي أو بتشتغل" },
    goodDeeds: { title: "إزاي تخلي يومك مليان حسنات؟", text: "ابدأ يومك بنية صادقة ومخلصه لله سبحانه وتعالي وتخلي لسانك رطب بذكر الله ولو قدرت تساعد أي حد حتى بكلمة طيبة واحتسب كل حاجة عند ربنا" },
    avoidSins: { title: "إزاي تتجنب المعاصي اللي بتتكرر منك؟", text: "الحل الاول والصح انك تعرف سببها وحاول تبعد عنه غير بيئتك لو بتساعدك على الغلط بس اشغل وقتك بحاجة مفيدة واستعن بالله وادعيله يثبتك" },
    endDay: { title: "إزاي تختم يومك بذكر حسن؟", text: "نام على وضوء، واقرأ المعوذات وآية الكرسي، واستغفر لحد ما تنام، ولو عندك ذنب استغفر وتب لربنا بقلب صادق." },
    cleanHeart: { title: "إزاي تحافظ على قلبك سليم ونظيف؟", text: "حاول تسامح الناس ومتشيلش غِل لحد وأكثر من الاستغفار وحط دايمًا حسن الظن في اللي حواليك" },
    noProcrastination: { title: "إزاي تبعد عن التسويف في العبادات؟", text: "متستناش ان المزاج ييجي عشان تصلي أو تقرأ قرآن خدها عادة وإجبار نفسك على الخير هيعود عليك براحة قلب وسكينة" },
    freeTime: { title: "إزاي تستغل وقت فراغك في حاجة تنفعك؟", text: "بدل ما تضيع وقتك في السوشيال ميديا بدون فايدة استغل وقتك في سماع درس ديني ولا قراءة قرآن أو حتى تعلم حاجة جديدة" },
    strongerFaith: { title: "إزاي تقوّي علاقتك بربنا؟", text: "خليك قريب منه بالدعاء حتى في أبسط أمورك وكل ما تحس بضعف روح صلي ركعتين واشكي له" },
    khushoo: { title: "إزاي تخلي صلاتك بخشوع؟", text: "فكر إنك واقف قدام رب العالمين واقرأ الفاتحة بتمهل ومتستعجلش في الركوع والسجود وادعي من قلبك" },
    abandonSin: { title: "إزاي تسيب ذنب متعلق بيك بقاله سنين؟", text: "أول حاجة متيأسش من رحمة ربنا وقوي إرادتك وابعد عن كل حاجة بتوصلك للذنب خصوصا (الصحبة الغلط) واشتغل على نفسك" },
    guardTongue: { title: "إزاي تحافظ على لسانك من الغيبة والنميمة؟", text: "لو لقيت نفسك داخل في كلام عن حد غير الموضوع عطول أو افتكر إن اللي بتقوله هيتحسب عليك ودايمًا خلي كلامك فيه خير" },
    blessedHome: { title: "إزاي تخلي بيتك فيه بركة وراحة نفسية؟", text: "شغل قرآن باستمرار وحافظ على الصلاة فيه وابعد عن المعاصي وخليك دايمًا مبتسم وهادئ مع أهلك" },
    friday: { title: "إزاي تستغل يوم الجمعة صح؟", text: "اغتسل بدري واقرأ سوره الكهف وأكثر من الصلاة على النبي ﷺ وادعي في آخر ساعة قبل المغرب لإنها ساعة استجابة" },
    positiveStart: { title: "إزاي تبدأ يومك بطاقة إيجابية؟", text: "صلي الفجر واقرأ أذكار الصباح واحمد ربنا على النعم اللي عندك وابعد عن الأخبار السلبية أول ما تصحى" },
    protectEnvy: { title: "إزاي تحمي نفسك من الحسد والعين؟", text: "حافظ على الأذكار ومتحكيش عن كل حاجة حلوة عندك لكل الناس ولو شفت حاجة تعجبك قول (ما شاء الله لا قوة إلا بالله)" },
    contentment: { title: "إزاي تحس بالرضا في حياتك؟", text: "بصّ لنعم ربنا عليك وسيبك من مقارنة نفسك بغيرك ومتنساش إن كل حاجة بتحصل لحكمة حتى لو مش فاهمها دلوقتي" }
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

const hadiths = [
    { text: "الكلمة الطيبة صدقة", reference: "صحيح البخاري" },
    { text: "من كان يؤمن بالله واليوم الآخر فليقل خيرًا أو ليصمت", reference: "صحيح البخاري" },
    { text: "تبسمك في وجه أخيك صدقة", reference: "صحيح مسلم" }
];

function loadHadith() {
    const randomIndex = Math.floor(Math.random() * hadiths.length);
    const hadith = hadiths[randomIndex];
    $("#hadith-text").html(hadith.text);
    $("#hadith-reference").html(`[${hadith.reference}]`);
}

const videos = [
    { id: "5jGpjNu6seA", title: "قصة آدم عليه السلام" },
    { id: "_CtwHiJnYkk", title: "قصة إدريس عليه السلام" },
    { id: "LHDRo1o8Z3I", title: "قصة نوح عليه السلام الجزء الأول" },
    { id: "ksg__AfTgVg", title: "قصة نوح عليه السلام الجزء الثاني" },
    { id: "jH9xvvffB5o", title: "قصة هود عليه السلام" },
    { id: "VOEXU0suTMo", title: "قصة صالح عليه السلام" },
    { id: "H5t9ugFROvQ", title: "قصة إبراهيم عليه السلام الجزء الأول" },
    { id: "kKKAVtiaxdU", title: "قصة إبراهيم عليه السلام الجزء الثاني" },
    { id: "v_p-YK6ItqQ", title: "قصة إبراهيم عليه السلام الجزء الثالث" },
    { id: "zETPemfAzXA", title: "قصة لوط عليه السلام" },
    { id: "plfgl11XmFY", title: "قصة إسماعيل عليه السلام" },
    { id: "dtmBUp2zLu4", title: "قصة إسحاق عليه السلام" },
    { id: "yRBgCL9frWY", title: "قصة يعقوب عليه السلام" },
    { id: "S93Oqwvumw0", title: "قصة يوسف عليه السلام الجزء الأول" },
    { id: "Zoadcu3Ln_0", title: "قصة يوسف عليه السلام الجزء الثاني" },
    { id: "xWUbKvTYtuI", title: "قصة يوسف عليه السلام الجزء الثالث" },
    { id: "onudakV-4b4", title: "قصة شعيب عليه السلام" },
    { id: "dhJuEpCfnWw", title: "قصة أيوب عليه السلام" },
    { id: "73Egv37giAc", title: "قصة ذو الكفل عليه السلام" },
    { id: "yPVpe2g_ROY", title: "قصة يونس عليه السلام" },
    { id: "vt149FD7Oio", title: "قصة موسى عليه السلام الجزء الأول" },
];

function loadStories() {
    let html = "";
    videos.forEach(video => {
        html += `
            <iframe
                src="https://www.youtube.com/embed/${video.id}"
                title="${video.title}"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen>
            </iframe>
        `;
    });
    $("#stories-grid").html(html);
}

let lists = [
    { ayahnum: 6, souranum: 1, name: "الفاتحة" },
    { ayahnum: 127, souranum: 2, name: "البقرة" },
    { ayahnum: 201, souranum: 2, name: "البقرة" },
    { ayahnum: 250, souranum: 2, name: "البقرة" },
    { ayahnum: 286, souranum: 2, name: "البقرة" },
    { ayahnum: 8, souranum: 3, name: "آل عمران" },
    { ayahnum: 16, souranum: 3, name: "آل عمران" },
    { ayahnum: 38, souranum: 3, name: "آل عمران" },
    { ayahnum: 53, souranum: 3, name: "آل عمران" },
    { ayahnum: 147, souranum: 3, name: "آل عمران" }
];

function loadDuaaQuran() {
    const content = $("#duaa-quran .content");
    const souraNameSpan = $("#duaa-quran .soura_name");
    const ayahNumSpan = $("#duaa-quran .ayah_num");
    const leftBtn = $("#duaa-quran #left-btn");
    const rightBtn = $("#duaa-quran #right-btn");
    const audioBtn = $("#duaa-quran #audioBtn");
    const audio = $("#duaa-quran #myAudio")[0];

    let index = 0;
    let ayahs = [];
    let ayahSrc = [];
    let isPlaying = false;

    const fetchAllAyahs = async () => {
        try {
            for (let i = 0; i < lists.length; i++) {
                const response = await fetch(
                    `https://api.alquran.cloud/v1/ayah/${lists[i].souranum}:${lists[i].ayahnum}/ar.alafasy`
                );
                const data = await response.json();
                ayahs.push(data.data.text);
                ayahSrc.push(data.data.audio);
            }
            displayAyah();
        } catch (error) {
            showError("حدث خطأ أثناء جلب الأدعية من القرآن. تأكد من الاتصال بالإنترنت.");
            console.error(error);
        }
    };

    const displayAyah = () => {
        if (ayahs.length > 0) {
            content.html(ayahs[index]);
            souraNameSpan.html(`سورة ${lists[index].name}`);
            ayahNumSpan.html(`آية (${lists[index].ayahnum})`);
            audio.src = ayahSrc[index];
            leftBtn.css("opacity", index > 0 ? 1 : 0.5);
            rightBtn.css("opacity", index < lists.length - 1 ? 1 : 0.5);
        } else {
            content.html("جاري التحميل...");
        }
    };

    leftBtn.off("click").on("click", () => {
        if (index > 0) {
            index--;
            audio.pause();
            isPlaying = false;
            audioBtn.html('<i class="fas fa-play"></i>');
            displayAyah();
        }
    });

    rightBtn.off("click").on("click", () => {
        if (index < lists.length - 1) {
            index++;
            audio.pause();
            isPlaying = false;
            audioBtn.html('<i class="fas fa-play"></i>');
            displayAyah();
        }
    });

    audioBtn.off("click").on("click", () => {
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
            audioBtn.html('<i class="fas fa-play"></i>');
        } else {
            audio.play().catch(() => showError("تعذر تشغيل الصوت. تأكد من الاتصال."));
            isPlaying = true;
            audioBtn.html('<i class="fas fa-pause"></i>');
        }
    });

    audio.onended = () => {
        isPlaying = false;
        audioBtn.html('<i class="fas fa-play"></i>');
    };

    fetchAllAyahs();
}

async function loadHijriDate() {
    $("#hijri-date").html("جاري تحميل التاريخ الهجري...");
    try {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${formattedDate}`);
        const data = await response.json();
        if (data.code === 200) {
            const hijri = data.data.hijri;
            $("#hijri-date").html(`<p>اليوم: ${hijri.weekday.ar} ${hijri.day} ${hijri.month.ar} ${hijri.year} هـ</p>`);
        } else {
            showError("خطأ في استجابة الـ API للتاريخ الهجري.");
        }
    } catch (error) {
        showError("حدث خطأ أثناء جلب التاريخ الهجري. تأكد من الاتصال بالإنترنت.");
    }
}

function loadAudioQuran() {
    const readers = [
        "الشيخ مشاري العفاسي", "الشيخ عبد الباسط", "الشيخ السديس", "الشيخ الشريم",
        "الشيخ ماهر المعيقلي", "الشيخ ياسر الدوسري", "الشيخ الحصري", "الشيخ المنشاوي",
        "الشيخ سعود الشريم", "الشيخ أحمد العجمي", "الشيخ ناصر القطامي", "الشيخ إدريس أبكر",
        "الشيخ محمد صديق المنشاوي", "الشيخ عبد الرحمن السديس", "الشيخ خالد الجليل",
        "الشيخ فارس عباد", "الشيخ عبد الله بصفر", "الشيخ هاني الرفاعي", "الشيخ محمود خليل الحصري",
        "الشيخ عبد المحسن القاسم"
    ];

    let html = "";
    for (let i = 0; i < 20; i++) {
        html += `
            <div class="audio-item">
                <p>${readers[i]}</p>
                <button onclick="downloadAudio('AUDIO_LINK_${i}')">تحميل الآن</button>
            </div>
        `;
    }
    $("#audio-grid").html(html);

    $("#download-all-audio").click(function() {
        window.open("YOUR_FULL_AUDIO_LINK_HERE", "_blank");
    });
}

function downloadAudio(link) {
    window.open(link, "_blank");
}

function loadPropheticDuas() {
    const duas = [
        { text: "اللهم افتح لي أبواب رحمتك", source: "صحيح مسلم، حديث 713" },
        { text: "اللهم إني أسألك الهدى والتقى والعفاف والغنى", source: "صحيح مسلم، حديث 2721" },
        { text: "اللهم اغفر لي ذنبي كله، دقه وجله، وأوله وآخره، علانيته وسره", source: "صحيح مسلم، حديث 483" },
        { text: "اللهم إني أعوذ بك من العجز والكسل وضعف الهمة", source: "صحيح البخاري، حديث 6363" },
        { text: "اللهم اجعل في قلبي نورًا، وفي بصري نورًا، وفي سمعي نورًا", source: "صحيح البخاري، حديث 6316" },
        { text: "اللهم ارزقني حبك وحب من يحبك وحب كل عمل يقربني إليك", source: "سنن الترمذي، حديث 3490 (حسن)" },
        { text: "اللهم قني عذابك يوم تبعث عبادك", source: "صحيح مسلم، حديث 709" },
        { text: "اللهم إني أعوذ بك من زوال نعمتك وتحول عافيتك وفجاءة نقمتك وجميع سخطك", source: "صحيح مسلم، حديث 2739" },
        { text: "اللهم اهدني وسددني", source: "صحيح مسلم، حديث 2725" },
        { text: "اللهم إني أسألك العفو والعافية في الدنيا والآخرة", source: "سنن ابن ماجه، حديث 3871 (صحيح)" }
    ];

    let html = "";
    duas.forEach(dua => {
        html += `
            <div class="dua-item">
                <p class="dua-text">${dua.text}</p>
                <p class="dua-source">[${dua.source}]</p>
                <button onclick="navigator.clipboard.writeText('${dua.text}')">نسخ الدعاء</button>
            </div>
        `;
    });
    $("#duas-list").html(html);
}