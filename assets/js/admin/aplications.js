document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('user-table-body');
    const paginationWrapper = document.querySelector('.pagination');
    const token = localStorage.getItem('token'); // token login vaqtida saqlangan bo‘lishi kerak

    fetch('http://127.0.0.1:8000/api/arizalar', {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error("Arizalarni olishda xatolik.");
            }
            return res.json();
        })
        .then(response => {
            const arizalar = response.data;
            const total = response.total; // Umumiy arizalar soni
            const currentPage = response.current_page; // Joriy sahifa
            const lastPage = response.last_page; // Oxirgi sahifa

            tableBody.innerHTML = ''; // jadvalni tozalaymiz
            arizalar.forEach((ariza, index) => {
                const userName = ariza.user?.name || 'Nomaʼlum foydalanuvchi'; // foydalanuvchi bor yoki yo‘qligini tekshiramiz
                // Harakatlar (statusga qarab)
                let actionsHTML = `
                <button class="post-view" onclick='openModal(${JSON.stringify(ariza)})'>
                    <i class="fa-solid fa-eye""></i> 
                    Ko'rish
                </button>
            `;

                if (ariza.status === 'pending') {
                    actionsHTML += `
                    <button class="post-confirmation">
                        <i class="fa-solid fa-check"></i> 
                        <a href="#">Tasdiqlash</a>
                    </button>
                    <button class="post-delete">
                        <i class="fa-solid fa-xmark"></i> 
                        <a href="#">Rad etish</a>
                    </button>
                `;
                } else if (ariza.status === 'approved') {
                    actionsHTML +=
                        `<span class="badge badge-success" 
                        style="
                        color: green; 
                        align-items: center; 
                        font-weight: bold; 
                        font-size: 20px;
                        display: flex;
                        gap: 5px;">
                        <i class="fa-solid fa-check"></i> 
                        <span>Tasdiqlangan</span>
                    </span>`;
                } else if (ariza.status === 'rejected') {
                    actionsHTML +=
                        `<span class="badge badge-danger" 
                        style="
                        color: red; 
                        align-items: center; 
                        font-weight: bold; 
                        font-size: 20px;
                        display: flex;
                        gap: 5px;">
                        <i class="fa-solid fa-xmark"></i> 
                        <span>Rad etilgan</span>
                    </span>`;
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                <td class="td-post-id" data-id="${ariza.id}">${index + 1}</td>
                <td class="td-post-title">${userName}</td>
                <td class="td-post-status" 
                    style="
                        font-weight: 
                        bold; color: 
                        ${ariza.status === 'approved' ? 'green' :
                        ariza.status === 'rejected' ? 'red' : 'black'
                    };
                    "
                >${ariza.status}</td>
                <td class="buttons">${actionsHTML}</td>
            `;
                tableBody.appendChild(row);
            });

            // Paginatsiya
            paginationWrapper.innerHTML = '';
            if (currentPage > 1) {
                paginationWrapper.innerHTML += `<li><a href="#" onclick="loadPage(${currentPage - 1})">&lt;</a></li>`;
            }
            for (let i = 1; i <= lastPage; i++) {
                if (i === currentPage) {
                    paginationWrapper.innerHTML += `<li class="active"><a href="#" onclick="loadPage(${i})">${i}</a></li>`;
                } else {
                    paginationWrapper.innerHTML += `<li><a href="#" onclick="loadPage(${i})">${i}</a></li>`;
                }
            }
            if (currentPage < lastPage) {
                paginationWrapper.innerHTML += `<li><a href="#" onclick="loadPage(${currentPage + 1})">&gt;</a></li>`;
            }
        })
        .catch(error => {
            console.error("Xatolik:", error);
            tableBody.innerHTML = `<tr><td colspan="4">Ma'lumotlar yuklanmadi</td></tr>`;
        });
});

function loadPage(pageNumber) {
    const token = localStorage.getItem('token');
    fetch(`http://127.0.0.1:8000/api/arizalar?page=${pageNumber}`, {
        headers: {
            'Authorization': 'Bearer ' + token,
            'Accept': 'application/json'
        }
    })
        .then(res => res.json())
        .then(response => {
            const tableBody = document.getElementById('user-table-body');
            const paginationWrapper = document.querySelector('.pagination');

            const arizalar = response.data;
            const currentPage = response.current_page;
            const lastPage = response.last_page;

            tableBody.innerHTML = ''; // Jadvalni tozalaymiz

            arizalar.forEach((ariza, index) => {
                const userName = ariza.user?.name || 'Nomaʼlum foydalanuvchi';
                let actionsHTML = `
                    <button class="post-view" onclick='openModal(${JSON.stringify(ariza)})'>
                        <i class="fa-solid fa-eye"></i> 
                        Ko'rish
                    </button>
                `;

                if (ariza.status === 'pending') {
                    actionsHTML += `
                        <button class="post-confirmation">
                            <i class="fa-solid fa-check"></i> 
                            <a href="#">Tasdiqlash</a>
                        </button>
                        <button class="post-delete">
                            <i class="fa-solid fa-xmark"></i> 
                            <a href="#">Rad etish</a>
                        </button>
                    `;
                } else if (ariza.status === 'approved') {
                    actionsHTML += `
                        <span class="badge badge-success" 
                            style="color: green; font-weight: bold; font-size: 20px;">
                            <i class="fa-solid fa-check"></i> 
                            <span>Tasdiqlangan</span>
                        </span>
                    `;
                } else if (ariza.status === 'rejected') {
                    actionsHTML += `
                        <span class="badge badge-danger" 
                            style="color: red; font-weight: bold; font-size: 20px;">
                            <i class="fa-solid fa-xmark"></i> 
                            <span>Rad etilgan</span>
                        </span>
                    `;
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="td-post-id" data-id="${ariza.id}">${index + 1}</td>
                    <td class="td-post-title">${userName}</td>
                    <td class="td-post-status" style="font-weight: bold; color: ${ariza.status === 'approved' ? 'green' : ariza.status === 'rejected' ? 'red' : 'black'};">
                        ${ariza.status}
                    </td>
                    <td class="buttons">${actionsHTML}</td>
                `;
                tableBody.appendChild(row);
            });

            // --- PAGINATIONNI YANGILAYMIZ ---
            paginationWrapper.innerHTML = '';

            if (currentPage > 1) {
                paginationWrapper.innerHTML += `<li><a href="#" onclick="loadPage(${currentPage - 1})">&lt;</a></li>`;
            }

            for (let i = 1; i <= lastPage; i++) {
                if (i === currentPage) {
                    paginationWrapper.innerHTML += `<li class="active"><a href="#" onclick="loadPage(${i})">${i}</a></li>`;
                } else {
                    paginationWrapper.innerHTML += `<li><a href="#" onclick="loadPage(${i})">${i}</a></li>`;
                }
            }

            if (currentPage < lastPage) {
                paginationWrapper.innerHTML += `<li><a href="#" onclick="loadPage(${currentPage + 1})">&gt;</a></li>`;
            }
        })
        .catch(error => console.error("Xatolik:", error));
}

// Modalni ochish va ma'lumotlarni to'ldirish
function openModal(ariza) {
    document.getElementById('show-aplication-Modal').style.display = 'block';
    const h2_tag_status = document.getElementById('h2_tag_status');

    // h2_tag_status.textContent = 
    //     ariza.status == "approved" ? "Tasdiqlangan" 
    //     : ariza.status == "rejected" ? "Rad etilgan" 
    //     : "Kutilmoqda";
    //     const h2_tag_status = document.getElementById('h2_tag_status');

    // Ranglarni belgilash
    if (ariza.status == "approved") {
        h2_tag_status.textContent = "Tasdiqlangan";
        h2_tag_status.style.color = "#fff";
        h2_tag_status.style.padding = '10px';
        h2_tag_status.style.background = "green";
    } else if (ariza.status == "rejected") {
        h2_tag_status.textContent = "Rad etilgan";
        h2_tag_status.style.color = "#fff";
        h2_tag_status.style.padding = '10px';
        h2_tag_status.style.background = "red";
    } else {
        h2_tag_status.textContent = "Kutilmoqda";
        h2_tag_status.style.color = "#fff";
        h2_tag_status.style.padding = '10px';  // Sarig' rang
        h2_tag_status.style.background = "#ffc107";  // Sarig' rang
    }

    const username_values = document.querySelectorAll('.username_values');
    username_values[0].textContent = ariza.user?.name || "Noma'lum";

    const values = document.querySelectorAll('.application-info .value');
    values[0].textContent = ariza.user?.name || "Noma'lum";
    values[1].textContent = ariza.jshshir || "-";
    values[2].textContent = ariza.passport || "-";
    values[3].textContent = ariza.passport_date || "-";
    values[4].textContent = ariza.region || "-";
    values[5].textContent = ariza.district || "-";
    values[6].textContent = ariza.address || "-";
    values[7].textContent = ariza.university || "-";
    values[8].textContent = ariza.has_sibling === 1 ? 'Ha' : 'Yo‘q';
    values[9].textContent = ariza.sibling_relation || "-";
    values[10].textContent = ariza.sibling_jshshir || "-";
    values[11].textContent = ariza.privilege || "-";
    values[12].textContent = ariza.phone || "-";
    values[13].textContent = ariza.email || "-";
}

function closeModal() {
    document.getElementById('show-aplication-Modal').style.display = 'none';
}

document.addEventListener('click', (event) => {
    const token = localStorage.getItem('token');

    if (event.target.closest('.post-confirmation')) {
        event.preventDefault();
        const row = event.target.closest('tr');
        const arizaId = row.querySelector('.td-post-id').dataset.id;

        fetch(`http://127.0.0.1:8000/api/ariza/approve/${arizaId}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Accept': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                location.reload(); // yangilash
            })
            .catch(error => console.error('Tasdiqlash xatoligi:', error));
    }

    if (event.target.closest('.post-delete')) {
        event.preventDefault();
        const row = event.target.closest('tr');
        const arizaId = row.querySelector('.td-post-id').dataset.id;

        const reason = prompt("Rad etish sababini kiriting:");
        if (!reason) return;

        fetch(`http://127.0.0.1:8000/api/ariza/reject/${arizaId}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ reason: reason })
        })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
                location.reload();
            })
            .catch(error => console.error('Rad etish xatoligi:', error));
    }
});