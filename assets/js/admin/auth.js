document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("user_name");
    const userRole = localStorage.getItem("user_role");

    if (!token) {
        // login qilmagan bo‘lsa, login sahifasiga qaytaramiz
        window.location.href = "login.html";
    } else {
        // login qilingan bo‘lsa, ismni chiqaramiz
        document.getElementById("userNameDisplay").textContent = userName;

        // Agar superadmin bo‘lsa, faqat o‘sha linklar ko‘rsatiladi
        if (userRole === "super_admin") {
            document.querySelectorAll(".faqat-superadmin").forEach(el => {
                el.style.display = "block";
            });
        }
    }
});

function logout() {
    const token = localStorage.getItem("token");

    if (!token) return;

    fetch("http://127.0.0.1:8000/api/logout", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        })
        .then(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user_name");
            localStorage.removeItem("user_role");

            // login sahifasiga yo‘naltirish
            window.location.href = "../index.html";
        })
        .catch(error => {
            console.error("Logoutda xatolik:", error);
        });
}