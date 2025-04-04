let currentSlide = 1; // Başlangıç slide'ı 1
const thumbnailsPerView = 4; // Aynı anda görünen thumbnail sayısı

// Thumbnail kaydırma işlevi
function scrollThumbnails(direction) {
    const thumbnailContainer = document.querySelector('.thumbnails');
    const totalThumbnails = document.querySelectorAll('.thumbnail').length;

    // Şu anki aktif thumbnail'ı güncelle
    currentSlide += direction;

    // Sınır kontrolleri
    if (currentSlide < 1) currentSlide = 1;
    if (currentSlide > totalThumbnails) currentSlide = totalThumbnails;

    // Seçilen resmin merkezde olması için kaydırma ayarı
    const containerWidth = document.querySelector('.thumbnail-container').offsetWidth;
    const thumbnailWidth = 110; // 100px resim genişliği + 5px margin sağ ve sol

    // Eğer son resme gelindiyse merkezde olmaması için offset ayarı
    let offset = (thumbnailWidth * (currentSlide - 1)) - (containerWidth / 2) + (thumbnailWidth / 2);
    if (currentSlide === totalThumbnails) {
        offset = (thumbnailWidth * (currentSlide - 1)) - containerWidth + thumbnailWidth; // Son resim için ayarlama
    }
    
    // Kaydırma işlemi
    thumbnailContainer.style.transform = `translateX(${-Math.max(0, offset)}px)`;

    // Tüm thumbnail'ları güncelle
    const thumbnails = document.querySelectorAll(".thumbnail");
    thumbnails.forEach(thumb => thumb.classList.remove("active"));
    thumbnails[currentSlide - 1].classList.add("active");

    // Ana resmi güncelle
    const mainImage = document.querySelector(".main-image");
    mainImage.src = thumbnails[currentSlide - 1].src;

    updateModalButtons(); // Butonları her resim değişiminde güncelle
    updateImageCounter(); // Resim sayısını güncelle
}

// Thumbnail tıklanınca büyük resmi değiştirme ve thumbnail'ı merkeze alma
function showImage(n) {
    const thumbnails = document.querySelectorAll(".thumbnail");
    const mainImage = document.querySelector(".main-image");

    thumbnails.forEach(thumb => thumb.classList.remove("active"));
    thumbnails[n - 1].classList.add("active");

    mainImage.src = thumbnails[n - 1].src;
    currentSlide = n; // Mevcut slide'ı güncelle

    scrollThumbnails(0); // Thumbnail'ı merkeze getir
    updateModalButtons(); // Butonları her resim değişiminde güncelle
    updateImageCounter(); // Resim sayısını güncelle
}

// Büyük resmi sağa sola kaydırma
function changeSlide(n) {
    currentSlide += n;
    scrollThumbnails(0); // direction'ı geçerek kaydırma işlemini çağır
    updateModalButtons(); // Her kaydırmada butonları güncelle
    updateImageCounter(); // Resim sayısını güncelle
}

// Scrollbar genişliğini hesapla
function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
}

// Modal açma ve resim büyütme
function openModal() {
    const modal = document.getElementById("imageModal");
    const mainImage = document.querySelector(".main-image");
    const modalImage = document.getElementById("modalImage");

    modalImage.src = mainImage.src;

    // Modal'ı görünür yap ve küçük bir gecikmeyle efekt başlat
    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add("open"); // Açılma efekti
    }, 10);

    // Scrollbar'ı gizle ve ekran kaymasını önlemek için padding-right ekle
    const scrollbarWidth = getScrollbarWidth();
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    // Modal boşluğa tıklandığında kapatma işlemi
    const closeModalOnClick = (event) => {
        if (event.target === modal) {
            closeModal();
            modal.removeEventListener("click", closeModalOnClick); // Kapatırken event listener'ı kaldır
        }
    };
    
    modal.addEventListener("click", closeModalOnClick);

    updateImageCounter(); // Resim sayısını güncelle
}

// Modal kapatma
function closeModal() {
    const modal = document.getElementById("imageModal");

    // Kapanma efekti için 'open' sınıfını kaldır
    modal.classList.remove("open");

    // Efekt tamamlandıktan sonra modal'ı gizle ve padding-right'ı sıfırla
    setTimeout(() => {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        document.body.style.paddingRight = "0px"; // Ekran kaymasını geri al
    }, 400); // CSS transition süresiyle uyumlu olmalı
}

// Modal'da butonları güncelle
function updateModalButtons() {
    const totalThumbnails = document.querySelectorAll(".thumbnail").length;
    const prevButton = document.querySelector(".modal-prev-btn");
    const nextButton = document.querySelector(".modal-next-btn");

    // Baştayken önceki butonunu gizle
    if (currentSlide === 1) {
        prevButton.style.display = "none";
    } else {
        prevButton.style.display = "block";
    }

    // Sondayken sonraki butonunu gizle
    if (currentSlide === totalThumbnails) {
        nextButton.style.display = "none";
    } else {
        nextButton.style.display = "block";
    }
}

// Modal içindeki resmi değiştirme ve thumbnail'ı güncelleme
function changeModalImage(direction) {
    const thumbnails = document.querySelectorAll(".thumbnail");
    currentSlide += direction;

    // Sınır kontrolleri
    if (currentSlide < 1) currentSlide = 1;
    if (currentSlide > thumbnails.length) currentSlide = thumbnails.length;

    const modalImage = document.getElementById("modalImage");
    modalImage.src = thumbnails[currentSlide - 1].src;

    // Thumbnail'ı güncelle
    thumbnails.forEach(thumb => thumb.classList.remove("active"));
    thumbnails[currentSlide - 1].classList.add("active");

    // Seçilen thumbnail'ı görünür alanın ortasına kaydır
    scrollThumbnails(0);

    // Butonları güncelle
    updateModalButtons();
    
    // Resim sayısını güncelle
    updateImageCounter();
}

// Resim sayısını güncelle
function updateImageCounter() {
    const totalThumbnails = document.querySelectorAll(".thumbnail").length;
    const imageCounter = document.getElementById("imageCounter");
    imageCounter.textContent = `${currentSlide} / ${totalThumbnails}`;
}