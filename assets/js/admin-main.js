
// =================== Dropdown menyuni boshqarish ==================
document.addEventListener("DOMContentLoaded", () => {
    const userMenuBtn = document.getElementById("userMenuBtn");
    const userMenu = document.getElementById("userMenu");

    if (userMenuBtn) {
        userMenuBtn.addEventListener("click", () => {
            userMenu.style.display = userMenu.style.display === "block" ? "none" : "block";
        });

        // Tashqariga bosilganda menyuni yopish
        document.addEventListener("click", (e) => {
            if (!userMenuBtn.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.style.display = "none";
            }
        });
    }
});

// Profilni tahrirlashga yo‘naltirish (hozircha alert)
function editProfile() {
    alert("Profilni tahrirlash sahifasiga o'tish kerak.");
}

// =================== Ariza berish sahifasini boshqarish ===========
function goToApplication(event) {
    const token = localStorage.getItem("token");
    if (token) {
        // Login qilingan bo‘lsa sahifaga o‘tish
        window.location.href = "aplication.html";
    } else {
        // Linkning default harakatini to‘xtatamiz
        event.preventDefault();
        // Login qilinmagan bo‘lsa modalni ochamiz
        openLoginModal();
    }
}