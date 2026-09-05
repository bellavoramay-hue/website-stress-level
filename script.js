// Data Pertanyaan (10 Pertanyaan)
const questions = [
    "Selama sebulan terakhir,seberapa sering anda tidak nyaman karena sesuatu yang tidak terduga?",
    "Selama sebulan terakhir,seberapa sering anda merasa tidak mampu mengontrol hal-hal penting dalam kehidupan anda?",
    "Selama sebulan terakhir,seberapa sering anda merasa ketegangan dan stress?",
    "Selama sebulan terakhir, seberapa sering Anda merasa tidak percaya diri pada kemampuan Anda untuk menangani masalah pribadi?",
    "Selama sebulan terakhir, seberapa sering Anda merasa segala sesuatu yang terjadi tidak sesuai dengan harapan Anda?",
    "Selama sebulan terakhir,seberapa sering anda merasa tidak mampu menyelesaikan hal-hal yang harus dikerjakan?",
    "Selama sebulan terakhir, seberapa sering Anda tidak bisa mengendalikan gangguan dalam hidup Anda?",
    "Selama sebulan terakhir, seberapa sering Anda merasa bahwa Anda tidak memiliki kendali (tidak dapat mengendalikan semua urusan)?",
    "Selama sebulan terakhir,seberapa sering anda telah marah karena hal-hal diluar kendali anda?",
    "Selama sebulan terakhir,seberapa sering anda merasa kesulitan menumpuk begitu banyak dan anda tidak bisa mengatasinya?"
];

// Opsi Skala Jawaban
const scaleOptions = [
    { text: "Tidak Pernah", value: 0 },
    { text: "Jarang", value: 1 },
    { text: "Kadang-kadang", value: 2 },
    { text: "Sering", value: 3 },
    { text: "Hampir Selalu", value: 4 }
];

// Variabel Global
let currentQuestionIndex = 0;
let userAnswers = new Array(questions.length).fill(null);
let studentData = { name: "", kelas: "" };

// Fungsi Navigasi Halaman
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Memulai Tes & Validasi Form
function startTest() {
    const kelas = document.getElementById("kelas").value;
    let name = document.getElementById("nama").value;
    
    if (!kelas) {
        alert("Silakan pilih Kelas terlebih dahulu.");
        return;
    }
    
    studentData.name = name || "Siswa";
    studentData.kelas = kelas;
    
    currentQuestionIndex = 0;
    userAnswers.fill(null);
    renderQuestion();
    showPage('quiz-page');
}

// Menampilkan Pertanyaan dan Opsi
function renderQuestion() {
    // Update Teks Pertanyaan
    document.getElementById("question-text").innerText = questions[currentQuestionIndex];
    
    // Update Progress
    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    document.getElementById("progress-bar").style.width = `${progressPercent}%`;
    document.getElementById("progress-text").innerText = `Pertanyaan ${currentQuestionIndex + 1} dari ${questions.length}`;

    // Render Opsi Jawaban
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = "";
    
    scaleOptions.forEach((option) => {
        const isSelected = userAnswers[currentQuestionIndex] === option.value;
        const div = document.createElement("label");
        div.className = `option-label ${isSelected ? 'selected' : ''}`;
        
        div.innerHTML = `
            <input type="radio" name="answer" value="${option.value}" ${isSelected ? 'checked' : ''} onclick="selectOption(${option.value}, this)">
            ${option.text}
        `;
        optionsContainer.appendChild(div);
    });

    // Mengatur Tombol Navigasi
    document.getElementById("btn-prev").style.visibility = currentQuestionIndex === 0 ? "hidden" : "visible";
    
    if (currentQuestionIndex === questions.length - 1) {
        document.getElementById("btn-next").style.display = "none";
        document.getElementById("btn-result").style.display = "inline-block";
    } else {
        document.getElementById("btn-next").style.display = "inline-block";
        document.getElementById("btn-result").style.display = "none";
    }
}

// Menyimpan Jawaban Sementara
function selectOption(value, element) {
    userAnswers[currentQuestionIndex] = value;
    
    // Hapus kelas 'selected' dari semua opsi
    document.querySelectorAll('.option-label').forEach(lbl => lbl.classList.remove('selected'));
    // Tambah kelas 'selected' ke yang dipilih (parent dari input)
    element.parentElement.classList.add('selected');
}

// Tombol Selanjutnya
function nextQuestion() {
    if (userAnswers[currentQuestionIndex] === null) {
        alert("Silakan pilih salah satu jawaban sebelum melanjutkan.");
        return;
    }
    currentQuestionIndex++;
    renderQuestion();
}

// Tombol Sebelumnya
function prevQuestion() {
    currentQuestionIndex--;
    renderQuestion();
}

// Menghitung dan Menampilkan Hasil Akhir
function showResult() {
    if (userAnswers[currentQuestionIndex] === null) {
        alert("Silakan pilih jawaban terakhir sebelum melihat hasil.");
        return;
    }

    // Hitung Total Skor
    const totalScore = userAnswers.reduce((a, b) => a + b, 0);
    
    // Siapkan Data DOM
    document.getElementById("result-name").innerText = studentData.name;
    document.getElementById("result-class").innerText = `Kelas ${studentData.kelas}`;
    
    const scoreCircle = document.querySelector("#score-number");
    const circleContainer = document.querySelector(".score-circle");
    const stressLevelText = document.getElementById("stress-level");
    const explanationText = document.getElementById("stress-explanation");
    
    // Animasi Angka Skor
    let tempScore = 0;
    const interval = setInterval(() => {
        if (tempScore >= totalScore) {
            clearInterval(interval);
            scoreCircle.innerText = totalScore;
        } else {
            tempScore++;
            scoreCircle.innerText = tempScore;
        }
    }, 20);

    // Tentukan Kategori, Warna, Penjelasan, dan Nama Berkas Gambar
    let kategori = "";
    let color = "";
    let penjelasan = "";
    let primaryImg = ""; 
    let fallbackImg = "";

    if (totalScore <= 15) {
        kategori = "TINGKAT STRES RENDAH";
        color = "#4ade80"; 
        penjelasan = "Kondisi stres yang kamu rasakan saat ini relatif rendah. Ini hal yang sangat baik! Tetap jaga keseimbangan antara belajar, beristirahat, bermain, dan melakukan kegiatan yang kamu sukai.";
        primaryImg = "Stres rendah.jpeg"; 
        fallbackImg = "Stres rendah.jpg";
    } else if (totalScore <= 30) {
        kategori = "TINGKAT STRES SEDANG";
        color = "#fbbf24"; 
        penjelasan = "Kamu mungkin sedang menghadapi beberapa hal yang cukup membebani pikiran. Ini sangat wajar dialami oleh siswa. Cobalah mengatur waktu, beristirahat dengan cukup, dan jangan ragu bercerita.";
        primaryImg = "Stres sedang.jpg"; 
        fallbackImg = "Stres sedang.jpeg";
    } else if (totalScore <= 45) {
        kategori = "TINGKAT STRES TINGGI";
        color = "#f97316"; 
        penjelasan = "Jawabanmu menunjukkan bahwa kamu mungkin sedang mengalami tekanan yang cukup berat. Jangan menghadapi semuanya sendirian. Ada banyak orang yang peduli dan siap mendengarkanmu.";
        primaryImg = "Stres tinggi.jpeg"; 
        fallbackImg = "Stres tinggi.jpg";
    } else {
        kategori = "TINGKAT STRES SANGAT TINGGI";
        color = "#ef4444"; 
        penjelasan = "Jawabanmu menunjukkan bahwa kamu mungkin sedang merasa sangat terbebani. Kamu tidak harus menghadapi semuanya sendirian. Sangat disarankan untuk segera mencari teman cerita.";
        primaryImg = "Stres tinggi.jpeg"; 
        fallbackImg = "Stres tinggi.jpg";
    }

    // Terapkan ke DOM
    stressLevelText.innerText = kategori;
    stressLevelText.style.color = color;
    circleContainer.style.backgroundColor = color;
    explanationText.innerText = penjelasan;

    // Tampilkan gambar dengan proteksi otomatis
    const adviceImage = document.getElementById("advice-image");
    if (primaryImg !== "") {
        adviceImage.src = primaryImg;
        adviceImage.style.display = "block";
        
        // Fitur Auto-Fallback: Jika primaryImg tidak ditemukan, coba fallbackImg
        adviceImage.onerror = function() {
            if (!this.dataset.triedFallback) {
                this.dataset.triedFallback = "true";
                this.src = fallbackImg;
            } else {
                // Jika berkas tetap tidak ditemukan, sembunyikan agar tidak tampil ikon bingkai rusak
                this.style.display = "none";
            }
        };
    }

    showPage('result-page');
}

// Fungsi Navigasi Tips
function showTips() {
    showPage('tips-page');
}

// Fungsi Ulangi Tes
function resetTest() {
    if(confirm("Apakah kamu yakin ingin mengulangi tes dari awal?")) {
        showPage('home-page');
    }
}

// Fitur Interaksi Emoji Harian
function selectEmoji(element) {
    document.querySelectorAll('.emoji-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
}