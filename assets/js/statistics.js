fetch('http://127.0.0.1:8000/api/statistics')
    .then(response => response.json())
    .then(data => {
        // Modal
        document.getElementById('total-modal').textContent = data.total;
        document.getElementById('approved-modal').textContent = data.approved;
        document.getElementById('rejected-modal').textContent = data.rejected;
        document.getElementById('pending-modal').textContent = data.pending;

        document.getElementById('totalStudentCapacity-modal').textContent = data.totalStudentCapacity;
        document.getElementById('vacantSeats-modal').textContent = data.vacantSeats;
        document.getElementById('reservedSeats-modal').textContent = data.reservedSeats;
        document.getElementById('occupancyRate-modal').textContent = data.occupancyRate + ' %'; 

        // Statistika
        document.getElementById('total-stat').textContent = data.total;
        document.getElementById('approved-stat').textContent = data.approved;
        document.getElementById('rejected-stat').textContent = data.rejected;
        document.getElementById('pending-stat').textContent = data.pending;

        // Talabalar Sig‘imi Grafik (Pie chart)
        new Chart(document.getElementById('studentChart'), {
            type: 'bar',
            data: {
                labels: ["Jami Talabalar Sig`imi", "Bo'sh joylar", "Band qilingan joylar", "Bandlik Ko'rsatkichi %"],
                datasets: [{
                    label: 'Jami talabalar Sig‘imi',
                    data: [data.totalStudentCapacity, data.vacantSeats, data.reservedSeats, data.occupancyRate],
                    backgroundColor: ['#0000FF', '#FFA500', '#008080', '#DB7093'],
                    borderWidth: 1,
                }]
            },
            options: {
                indexAxis: 'y', // Grafikni gorizontal qiladi
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff' // Legenda matni oq
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#fff' // X o‘qi yozuvi oq
                        },
                        title: {
                            color: '#fff'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#fff' // Y o‘qi yozuvi oq
                        },
                        title: {
                            color: '#fff'
                        }
                    }
                }
            }
        });

        // Arizalar Statistikasi Grafik (Bar chart)
        new Chart(document.getElementById('applicationChart'), {
            type: 'bar',
            data: {
                labels: ['Yuborilgan arizalar', 'Qabul qilingan arizalar', 'Rad etilgan arizalar', 'Jarayondagi arizalar'],
                datasets: [{
                    label: 'Yuborilgan arizalar',
                    data: [data.total, data.approved, data.rejected, data.pending],
                    backgroundColor: ['#800080', '#008000', '#FF0000', '#4B0082'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: '#fff' // Legenda matni oq
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#fff' // X o‘qi yozuvi oq
                        },
                        title: {
                            color: '#fff'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#fff' // Y o‘qi yozuvi oq
                        },
                        title: {
                            color: '#fff'
                        }
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error('Xatolik:', error);
    });
