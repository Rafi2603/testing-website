document.addEventListener('DOMContentLoaded', () => {


    // Add available years dynamically based on data (replace with actual years if needed)
    const availableYears = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
    const yearSelect = document.getElementById('yearSelect');
    availableYears.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });

    // Function to filter the table by year
    window.filterTableByYear = function() {
        const selectedYear = document.getElementById('yearSelect').value;
        const table = document.getElementById('data-table');
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        
        for (let i = 0; i < rows.length; i++) {
            const yearCell = rows[i].getElementsByTagName('td')[1]; // Assuming year is in the 2nd column (index 1)
            const year = yearCell.textContent || yearCell.innerText;
            
            if (selectedYear === "" || year === selectedYear) {
                rows[i].style.display = ""; // Show row
            } else {
                rows[i].style.display = "none"; // Hide row
            }
        }
    };


    // Add available sections dynamically
    const availableSections = ['A', 'B'];
    const sectionSelect = document.getElementById('sectionSelect');
    availableSections.forEach(section => {
        const option = document.createElement('option');
        option.value = section;
        option.textContent = section;
        sectionSelect.appendChild(option);
    });

    // Function to filter the table by section
    window.filterTableBySection = function() {
    const selectedSection = document.getElementById('sectionSelect').value;
    const table = document.getElementById('checklist-k3-table');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const sectionCell = rows[i].getElementsByTagName('td')[1]; // Assuming section is in the 2nd column (index 0)
        const section = sectionCell.textContent || sectionCell.innerText;
        
        if (selectedSection === "" || section === selectedSection) {
            rows[i].style.display = ""; // Show row
        } else {
            rows[i].style.display = "none"; // Hide row
        }
    }
};



// Fungsi untuk format tanggal ke format YYYY-MM-DD
function formatTanggal(tanggal) {
    const date = new Date(tanggal);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tambahkan padding untuk bulan
    const day = String(date.getDate()).padStart(2, '0'); // Tambahkan padding untuk hari
    return `${day}-${month}-${year}`; // Format YYYY-MM-DD
}

    // Fetch data for Rekap Data K3 JAGORAWI
    fetch('https://testing-website-rafi-fauzans-projects.vercel.app/getdatajagorawi')
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Data Found') {
                const tableBody = document.querySelector('#data-table tbody');
                tableBody.innerHTML = ''; // Clear existing rows

                data.showItems.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.no || ''}</td>
                        <td>${item.tahun || ''}</td>
                        <td>${item.bulan || ''}</td>
                        <td>${item.jumlah_karyawan_ops || ''}</td>
                        <td>${item.jumlah_karyawan_non_ops || ''}</td>
                        <td>${item.jumlah_hari_kerja_ops || ''}</td>
                        <td>${item.jumlah_hari_kerja_non_ops || ''}</td>
                        <td>${item.jumlah_jam_kerja || ''}</td>
                        <td>${item.kecelakaan_berat_ops || ''}</td>
                        <td>${item.kecelakaan_berat_non_ops || ''}</td>
                        <td>${item.kecelakaan_ringan_ops || ''}</td>
                        <td>${item.kecelakaan_ringan_non_ops || ''}</td>
                        <td>${item.kecelakaan_meninggal_ops || ''}</td>
                        <td>${item.kecelakaan_meninggal_non_ops || ''}</td>
                        <td>${item.kecelakaan_near_miss_ops || ''}</td>
                        <td>${item.kecelakaan_near_miss_non_ops || ''}</td>
                        <td>${item.fire_accident || ''}</td>
                        <td>${item.damaged_property || ''}</td>
                        <td>${item.jumlah_hari_hilang_ops || ''}</td>
                        <td>${item.jumlah_hari_hilang_non_ops || ''}</td>
                        <td>${item.jumlah_hari_tanpa_hilang_ops || ''}</td>
                        <td>${item.jumlah_hari_tanpa_hilang_non_ops || ''}</td>
                        <td>${item.lti_ops || ''}</td>
                        <td>${item.lti_non_ops || ''}</td>
                        <td>${item.man_hour_ops || ''}</td>
                        <td>${item.man_hour_non_ops || ''}</td>
                        <td>${item.fr || ''}</td>
                        <td>${item.sr || ''}</td>
                        <td>${item.ir || ''}</td>
                        <td>${item.atlr || ''}</td>
                    `;
                    tableBody.appendChild(row);
                });

                // Inisialisasi DataTables untuk tabel Rekap Data K3
                $('#data-table').DataTable();
            } else {
                console.error('Data not found');
            }
        })
        .catch(error => console.error('Error fetching data:', error));

    // Fetch data for Personel K3
    fetch('https://testing-website-rafi-fauzans-projects.vercel.app/getpersoneljagorawi')
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Data Found') {
                const personelK3TableBody = document.querySelector('#personel-k3-table tbody');
                personelK3TableBody.innerHTML = ''; // Clear existing rows

                data.showItems.forEach(item => {
                    // Gunakan fungsi formatTanggal untuk mengubah format tanggal
                    const formattedDate = item.batas_masa_berlaku ? formatTanggal(item.batas_masa_berlaku) : '';
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.personel_k3_id || ''}</td>
                        <td>${item.nama || ''}</td>
                        <td>${item.role_personel_k3 || ''}</td>
                        <td>${formattedDate || ''}</td>
                    `;
                    personelK3TableBody.appendChild(row);
                });

                // Inisialisasi DataTables untuk tabel Personel K3
                $('#personel-k3-table').DataTable();
            } else {
                console.error('Personel K3 Data not found');
            }
        })
        .catch(error => console.error('Error fetching Personel K3 data:', error));




// Fetch data for Personel K3
fetch('https://testing-website-rafi-fauzans-projects.vercel.app/getkecelakaanjagorawi')
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Data Found') {
            const kecelakaankerjaTableBody = document.querySelector('#kecelakaan-kerja-table tbody');
            kecelakaankerjaTableBody.innerHTML = ''; // Clear existing rows

            data.showItems.forEach(item => {
                // Gunakan fungsi formatTanggal untuk mengubah format tanggal
                const formattedDate = item.tanggal ? formatTanggal(item.tanggal) : '';
                const formattedDate2 = item.perawatan_di_rs ? formatTanggal(item.perawatan_di_rs) : '';
                
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.kecelakaan_kerja_id || ''}</td>
                    <td>${formattedDate}</td> <!-- Tanggal sudah diformat ke YYYY-MM-DD -->
                    <td>${item.nik || ''}</td>
                    <td>${item.nama || ''}</td>
                    <td>${item.jabatan || ''}</td>
                    <td>${item.ruas || ''}</td>
                    <td>${item.kronologis || ''}</td>
                    <td>${item.kategori_kecelakaan || ''}</td>
                    <td>${item.tindak_lanjut || ''}</td>
                    <td>${formattedDate2 || ''}</td>
                `;
                kecelakaankerjaTableBody.appendChild(row);
            });

            // Inisialisasi DataTables untuk tabel Personel K3
            $('#kecelakaan-kerja-table').DataTable();
        } else {
            console.error('Personel K3 Data not found');
        }
    })
    .catch(error => console.error('Error fetching Personel K3 data:', error));

            // Fetch data for Personel K3
    fetch('https://testing-website-rafi-fauzans-projects.vercel.app/getkejadianjagorawi')
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Data Found') {
                const kejadiankerjaTableBody = document.querySelector('#kejadian-kerja-table tbody');
                kejadiankerjaTableBody.innerHTML = ''; // Clear existing rows

                data.showItems.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.kejadian_darurat_id || ''}</td>
                        <td>${item.kejadian_darurat || ''}</td>
                        <td>${item.lokasi || ''}</td>
                        <td>${item.kronologi_kejadian || ''}</td>
                        <td>${item.tindak_lanjut || ''}</td>
                        <td>${item.evidence || ''}</td>
                    `;
                    kejadiankerjaTableBody.appendChild(row);
                });

                // Inisialisasi DataTables untuk tabel Personel K3
                $('#kejadian-kerja-table').DataTable();
            } else {
                console.error('Kejadian kerja K3 Data not found');
            }
        })
        .catch(error => console.error('Error fetching Personel K3 data:', error));

                    // Fetch data for Personel K3
    fetch('https://testing-website-rafi-fauzans-projects.vercel.app/getstrukturjagorawi')
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Data Found') {
            const strukturTableBody = document.querySelector('#struktur-organisasi-table tbody');
            strukturTableBody.innerHTML = ''; // Clear existing rows

            data.showItems.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.struktur_id || ''}</td>
                    <td>${item.nama || ''}</td>
                    <td>${item.jabatan || ''}</td>
                `;
                strukturTableBody.appendChild(row);
            });

            // Inisialisasi DataTables untuk tabel Personel K3
            $('#struktur-organisasi-table').DataTable();
        } else {
            console.error('Struktur Organisasi Data not found');
        }
    })
    .catch(error => console.error('Error fetching Struktur Organisasi:', error));


    fetch('/getchecklistjagorawi')
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Data Found') {
            const checklistTableBody = document.querySelector('#checklist-k3-table tbody');
            checklistTableBody.innerHTML = ''; // Clear existing rows

            data.showItems.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.checklist_id}</td>
                    <td>${item.section}</td>
                    <td>${item.indikator_k3}</td>
                    <td>${item.jumlah_item}</td>
                    <td>${item.expired_date}</td>
                    <td>${item.check_list_pemeriksaan}</td>
                    <td>${item.rambu_apar}</td>
                    <td>${item.kelengkapan_box_hydrant}</td>
                    <td>${item.ruang_laktasi}</td>
                    <td>${item.ruang_p3k}</td>
                    <td>${item.organik}</td>
                    <td>${item.non_organik}</td>
                    <td>${item.limbah_b3}</td>
                    <td>${item.smoking_area}</td>
                    <td>${item.dll}</td>
                `;
                checklistTableBody.appendChild(row);
            });

            // Inisialisasi DataTables untuk tabel Personel K3
            $('#checklist-k3-table').DataTable();
        } else {
            console.error('Data Checklist K3 not found');
        }
    })
    .catch(error => console.error('Error fetching Data Checklist K3:', error));
});