let hozirgiTil = "uz";

const matnlar = {
    uz: { h1: "TilKo‘prigi: AI Tarjimoni", p: "Har qanday konferensiyada AI orqali real-time tarjima qiling!", btn: "Tarjima qilish" },
    ru: { h1: "TilKo‘prigi: AI Переводчик", p: "Реальный перевод через ИИ в любой конференции!", btn: "Перевести" },
    en: { h1: "TilKo‘prigi: AI Translator", p: "Real-time AI translation in any conference!", btn: "Translate" }
};

function ozgar(til) {
    hozirgiTil = til;
    document.documentElement.lang = til;

    const titles = { uz: "TilKo‘prigi", ru: "TilKo‘prigi", en: "TilKo‘prigi" };
    const descs  = { 
        uz: "Har qanday konferensiyada real-time AI tarjima", 
        ru: "Реальный AI-перевод на любой конференции", 
        en: "Real-time AI translation in any conference" 
    };
    const btns   = { uz: "Tarjima qilish", ru: "Перевести", en: "Translate" };

    document.querySelector("h1").innerText = titles[til];
    document.getElementById("matn").innerText = descs[til];
    document.getElementById("tugma").innerText = btns[til];
    document.getElementById("til-tugma").innerText = til.toUpperCase();
}

// HAQIQIY GOOGLE TARJIMA (bepul)
async function googleTarjima(text, targetLang) {
    const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
    const data = await res.json();
    return data[0][0][0]; // tarjima qilingan matn
}

async function tarjimaQil() {
    const kirish = document.getElementById("kirish-matn").value.trim();
    if (!kirish) {
        alert("Iltimos, matn kiriting!");
        return;
    }

    document.getElementById("tarjima-natija").innerText = "Tarjima qilinmoqda...";

    try {
        const natija = await googleTarjima(kirish, hozirgiTil);
        document.getElementById("tarjima-natija").innerText = natija;

        // Konfeti yomg‘iri
        confetti({ particleCount: 250, spread: 80, origin: { y: 0.6 } });
    } catch (err) {
        document.getElementById("tarjima-natija").innerText = "Internetni tekshiring yoki keyinroq urining.";
    }
}

window.onload = () => ozgar("uz");
// Ovozli tarjima (Web Speech API – Chrome/Edge da ishlaydi)
let recognition;
let tinglayapti = false;

function ovozBoshla() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Kechirasiz, bu brauzer ovozli tarjima qo‘llab-quvvatlamaydi. Chrome ishlatib ko‘ring.");
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    recognition.lang = hozirgiTil === "uz" ? "uz-UZ" : hozirgiTil === "ru" ? "ru-RU" : "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    if (tinglayapti) {
        recognition.stop();
        document.getElementById("mikrofon").classList.remove("recording");
        document.getElementById("mikrofon").innerHTML = "Mikrofon";
        tinglayapti = false;
        return;
    }

    // Tinglash boshlanganda
document.getElementById("mikrofon").innerHTML = "● REC";
document.getElementById("mikrofon").classList.add("recording");

    tinglayapti = true;

    recognition.start();

    recognition.onresult = (event) => {
        const gap = event.results[0][0].transcript;
        document.getElementById("kirish-matn").value = gap;
        tinglayapti = false;
     
// Tinglash tugaganda
document.getElementById("mikrofon").innerHTML = "Mikrofon";
document.getElementById("mikrofon").classList.remove("recording");
        // Avtomatik tarjima qil
        setTimeout(tarjimaQil, 500);
    };

    recognition.onerror = () => {
        alert("Ovoz tanib bo‘lmadi. Yana urining.");
        tinglayapti = false;
        document.getElementById("mikrofon").classList.remove("recording");
        document.getElementById("mikrofon").innerHTML = "Mikrofon";
    };
}
