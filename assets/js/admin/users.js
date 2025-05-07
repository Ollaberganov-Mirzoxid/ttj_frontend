// ======================== Talaba Qo'shish ========================
function openModal() {
    document.getElementById('studentModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('studentModal').style.display = 'none';
}

document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let data = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        password_confirmation: document.getElementById('password_confirmation').value,
    };

    fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.user) {
                window.location.href = "users.html";
                closeModal();
                document.getElementById('registerForm').reset();
            } else {
                alert("Xatolik: " + JSON.stringify(result));
            }
        })
        .catch(error => {
            console.error("Xatolik:", error);
            alert("Xatolik yuz berdi!");
        });
});

// ================= Talabalarni ekranga chiqarish =================
document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('user-table-body');
    const token = localStorage.getItem('token'); // token login vaqtida saqlangan bo‘lishi kerak

    fetch('http://127.0.0.1:8000/api/users', {
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
        .then(users => {
            tableBody.innerHTML = ''; // jadvalni tozalaymiz
            users.forEach((user, index) => {
                const row = document.createElement('tr');
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
                </td>
            `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Xatolik:", error);
            tableBody.innerHTML = `<tr><td colspan="4">Ma'lumotlar yuklanmadi</td></tr>`;
        });
});