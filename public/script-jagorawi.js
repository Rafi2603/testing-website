document.addEventListener('DOMContentLoaded', () => {
    // Add available years dynamically
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
        const selectedYear = yearSelect.value;
        const table = document.getElementById('data-table');
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        
        for (let row of rows) {
            const yearCell = row.getElementsByTagName('td')[1]; // Assuming year is in the 2nd column (index 1)
            const year = yearCell.textContent || yearCell.innerText;

            // Show or hide rows based on the selected year
            row.style.display = (selectedYear === "" || year === selectedYear) ? "" : "none";
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
        const selectedSection = sectionSelect.value;
        const table = document.getElementById('checklist-k3-table');
        const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
        
        for (let row of rows) {
            const sectionCell = row.getElementsByTagName('td')[1]; // Assuming section is in the 2nd column (index 1)
            const section = sectionCell.textContent || sectionCell.innerText;

            // Show or hide rows based on the selected section
            row.style.display = (selectedSection === "" || section === selectedSection) ? "" : "none";
        }
    };

    // Function to format dates to YYYY-MM-DD
    function formatTanggal(tanggal) {
        const date = new Date(tanggal);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    }

    // Function to fetch data for Rekap Data K3 JAGORAWI
    async function fetchData(url, tableBodyId) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.message === 'Data Found') {
                const tableBody = document.querySelector(tableBodyId);
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

                // Initialize DataTables after populating the table
                $(tableBodyId).DataTable();
            } else {
                console.error('Data not found');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Fetch data for Rekap Data K3 JAGORAWI
    fetchData('https://testing-website-rafi-fauzans-projects.vercel.app/getdatajagorawi', '#data-table tbody');

    // Fetch data for Personel K3
    fetchData('https://testing-website-rafi-fauzans-projects.vercel.app/getpersoneljagorawi', '#personel-k3-table tbody');

    // Fetch data for Kecelakaan Kerja
    fetchData('https://testing-website-rafi-fauzans-projects.vercel.app/getkecelakaanjagorawi', '#kecelakaan-kerja-table tbody');

    // Fetch data for Kejadian Darurat
    fetchData('https://testing-website-rafi-fauzans-projects.vercel.app/getkejadianjagorawi', '#kejadian-kerja-table tbody');

    // Fetch data for Struktur Organisasi
    fetchData('https://testing-website-rafi-fauzans-projects.vercel.app/getstrukturjagorawi', '#struktur-organisasi-table tbody');

    // Fetch data for Checklist K3
    fetchData('https://testing-website-rafi-fauzans-projects.vercel.app/getchecklistjagorawi', '#checklist-k3-table tbody');
});
