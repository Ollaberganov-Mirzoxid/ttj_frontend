// ======================== Ma'sul Qo'shish ========================
function openMasulModal() {
    document.getElementById('masulModal').style.display = 'block';
}

function closeMasulModal() {
    document.getElementById('masulModal').style.display = 'none';
}

document.getElementById('masulForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let data = {
        name: document.getElementById('masul_name').value,
        email: document.getElementById('masul_email').value,
        password: document.getElementById('masul_password').value,
        // password_confirmation: document.getElementById('masul_password_confirmation').value,
    };

    fetch('http://127.0.0.1:8000/api/masullar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                // Agar kerak bo‘lsa, Authorization header ham qo‘shish mumkin
                'Authorization': 'Bearer ' + localStorage.getItem('token') // token joylashgan bo‘lsa
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.masul) {
                window.location.href = "masullar.html";
                closeMasulModal();
                document.getElementById('masulForm').reset();
            } else {
                alert("Xatolik: " + JSON.stringify(result));
            }
        })
        .catch(error => {
            console.error("Xatolik:", error);
            alert("Xatolik yuz berdi!");
        });
});
// ================= Ma'sullarni ekranga chiqarish =================
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('user-table-body');
    const token = localStorage.getItem('token'); // token login vaqtida saqlangan bo‘lishi kerak
    const userRole = localStorage.getItem("user_role");
    fetch('http://127.0.0.1:8000/api/masullar', {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Foydalanuvchilarni olishda xatolik.");
            }
            return res.json();
        })
        .then(masullar => {
            tableBody.innerHTML = ''; // jadvalni tozalaymiz
            masullar.forEach((user, index) => {
                const row = document.createElement('tr');

                if (userRole === "super_admin") {
                    row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td class="buttons">
                        <button class="post-view">
                            <i class="fa-solid fa-pen"></i> <a href="#">Tahrirlash</a>
                        </button>
                        <button class="post-delete">
                            <i class="fa-solid fa-trash"></i> <a href="#">O‘chirish</a>
                        </button>
                    </td>`;
                }
                else if (userRole === "masul") {
                    row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td class="buttons">
                        <p style="width: 270px; color: red; font-weight: bold">Sizda faqat ko‘rish huquqi mavjud.</p>
                    </td>`;

                }
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Xatolik:", error);
            tableBody.innerHTML = `<tr><td colspan="4">Ma'lumotlar yuklanmadi</td></tr>`;
        });
});