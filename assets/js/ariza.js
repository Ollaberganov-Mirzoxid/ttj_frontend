document.getElementById('myForm').addEventListener('submit', function(e) {
    e.preventDefault();

    let data = {
        jshshir: document.getElementById('jshshir').value,
        passport: document.getElementById('passport').value,
        passport_date: document.getElementById('passport_date').value,
        region: document.getElementById('region').value,
        district: document.getElementById('district').value,
        address: document.getElementById('address').value,
        university: document.getElementById('university').value,
        has_sibling: document.querySelector('input[name="imtiyoz"]:checked').id === 'ha',
        sibling_relation: document.getElementById('sibling_relation')?.value || null,
        sibling_jshshir: document.getElementById('sibling_jshshir')?.value || null,
        privilege: document.getElementById('privilege').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value
    };

    fetch('http://127.0.0.1:8000/api/ariza', {
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
                window.location.href = "aplıcatıon.html";
                closeModal();
                document.getElementById('myForm').reset();
            } else {
                alert("Xatolik: " + JSON.stringify(result));
            }
        })
        .catch(error => {
            console.error("Xatolik:", error);
            alert("Xatolik yuz berdi!");
        });
});