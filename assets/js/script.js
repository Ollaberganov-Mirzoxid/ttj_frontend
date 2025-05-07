// =================== Modal oynalarni boshqarish ===================
function toggleModal(id, show) {
    const modal = document.getElementById(id);
    if (!modal) return;

    modal.classList.toggle("show", show);
}

// Kirish modalini ochish
function openLoginModal() {
    toggleModal("loginModal", true);
}

// Kirish modalini yopish
function closeLoginModal() {
    toggleModal("loginModal", false);
    // Modal yopilganda inputlarni tozalash
    document.pending('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('responseMessage').innerText = '';
}

// Mening Arizalarim modalini ochish
function openMyApplicationsModal() {
    toggleModal("MyApplicationsModal", true);
}

// Mening Arizalarim modalini yopish
function closeMyApplicationsModal() {
    toggleModal("MyApplicationsModal", false);
}

// Statistika modalini ochish
function openStatisticsModal() {
    toggleModal("statisticsModal", true);
}

// Statistika modalini yopish
function closeStatisticsModal() {
    toggleModal("statisticsModal", false);
}

// =================== Escape tugmasi orqali yopish =================
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        closeLoginModal();
        closeStatisticsModal();
    }
});

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

function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 0-based
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}.${month}.${year} / ${hours}:${minutes}:${seconds}`;
}

function loadMyApplications() {
    const token = localStorage.getItem('token');
    const container = document.getElementById('myApplicationsList');

    if (!token) {
        container.innerHTML = "<p>Avval tizimga kiring.</p>";
        return;
    }

    fetch('http://127.0.0.1:8000/api/arizalar/my', {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Arizalarni yuklashda xatolik.");
            }
            return res.json();
        })
        .then(arizalar => {
            container.innerHTML = '';

            if (arizalar.length === 0) {
                container.innerHTML = "<p>Hozircha hech qanday ariza topilmadi.</p>";
                return;
            }

            arizalar.forEach(ariza => {
                const div = document.createElement("div");

                let statusClass = '';
                let statusColor = '';
                let reasonMessage = '';

                if (ariza.status === 'approved') {
                    reasonMessage = 'Sizning arizangiz tasdiqlandi.';
                } else if (ariza.status === 'rejected') {
                    reasonMessage = `${ariza.reason || 'Sabab ko‘rsatilmagan.'}`;
                } else if (ariza.status === 'pending') {
                    reasonMessage = 'Sizning arizangiz ko‘rib chiqilmoqda.';
                }

                if (ariza.status === 'approved') {
                    statusClass = 'success';
                    statusColor = '#28a745';
                } else if (ariza.status === 'rejected') {
                    statusClass = 'danger';
                    statusColor = '#dc3545';
                } else {
                    statusClass = 'warning';
                    statusColor = '#ffc107';
                }

                div.className = `myapplications-item ${statusClass}`;
                div.innerHTML = `
                    <div style="display: flex;">
                        <div style="width: 40%;">
                            <strong>${formatDate(ariza.created_at)}</strong><br>
                            <span>Status: <span style="color: ${statusColor}; font-weight: bold;">${ariza.status}</span></span>
                        </div>
                        <div style="width: 60%;">
                            <strong style="display: inline-block; width: 100%; text-align: ;">Izoh:</strong><br> 
                            <span style="color: ${statusColor};">${reasonMessage}</span>
                        </div>
                    </div>
                `;
                container.appendChild(div);
            });
        })
        .catch(error => {
            console.error("Xatolik:", error);
            container.innerHTML = "<p>Arizalarni yuklashda muammo yuz berdi.</p>";
        });
}

function openMyApplicationsModal() {
    toggleModal("MyApplicationsModal", true);
    loadMyApplications(); // Arizalarni yuklaydi
}