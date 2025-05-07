document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.getElementById("login-Btn");
    const responseMessage = document.getElementById("responseMessage");

    loginBtn.addEventListener("click", function() {
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        responseMessage.innerText = "";

        if (!email || !password) {
            responseMessage.innerText = "Iltimos, email va parolni to‘ldiring.";
            return;
        }

        fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({ email, password })
            })
            .then(async response => {
                const data = await response.json();

                if (!response.ok) {
                    responseMessage.innerText = data.message || "Xatolik yuz berdi";
                    return;
                }

                if (data.access_token) {
                    const role = data.role || ""; // backenddan alohida role kelmoqda

                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('user_name', data.user.name);
                    localStorage.setItem('user_role', role);

                    closeLoginModal();

                    document.getElementById("loginBtn").style.display = "none";
                    document.getElementById("userDropdown").style.display = "block";
                    document.getElementById("userName").textContent = data.user.name || "Foydalanuvchi";

                    // 🧭 Rolga qarab yo'naltirish
                    if (role === "super_admin") {
                        window.location.href = "admin/index.html";
                    } else if (role === "masul") {
                        window.location.href = "admin/index.html";
                    } else if (role === "talaba") {
                        window.location.href = "index.html";
                    } else {
                        alert("Noma'lum Foydalanuvchi!!!" + role);
                    }

                } else {
                    responseMessage.innerText = "Noma’lum xatolik: token topilmadi";
                }
            })
            .catch(error => {
                console.error("Xatolik:", error);
                responseMessage.innerText = "Serverga ulanishda muammo yuz berdi.";
            });
    });

    // Logout funksiyasi
    window.logout = function() {
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
                // LocalStorage ma'lumotlarini tozalash
                localStorage.removeItem("token");
                localStorage.removeItem("user_name");
                localStorage.removeItem("user_role");

                // UI holatini tiklash (ixtiyoriy)
                document.getElementById("loginBtn").style.display = "inline-block";
                document.getElementById("userDropdown").style.display = "none";

                // Foydalanuvchini login sahifasiga yo'naltirish
                window.location.href = "index.html";
            })
            .catch(error => {
                console.error("Logoutda xatolik:", error);
            });
    };

    // Brauzer yangilanganda token bor-yo‘qligini tekshirish
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("user_name");

    if (token && name) {
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("userDropdown").style.display = "block";
        document.getElementById("userName").textContent = name;
    }
});