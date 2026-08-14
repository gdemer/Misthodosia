let allData = {};

async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Δεν βρέθηκε το data.json');

        allData = await response.json();
        console.log('✅ Δεδομένα φορτώθηκαν');

        showAllowancesSection();
    } catch (error) {
        console.error("Σφάλμα:", error);
        const main = document.getElementById('main-content');
        if (main) main.innerHTML = `<div style="color:red;padding:60px;"><h2>Σφάλμα</h2><p>${error.message}</p></div>`;
    }
}

function showAllowancesSection() {
    const main = document.getElementById('main-content');
    if (!main) return;
    main.innerHTML = `<h2>✅ Επιδόματα</h2><p>Λειτουργεί κανονικά.</p>`;
}

function showSalaryScales() {
    const main = document.getElementById('main-content');
    if (!main) return;
    main.innerHTML = `<h2>✅ Μισθολογικά Κλιμάκια</h2><p>Λειτουργεί.</p>`;
}

function showSpecialCategoriesScales() {
    const main = document.getElementById('main-content');
    if (!main) return;
    main.innerHTML = `<h2>✅ Μισθολογικά Κλιμάκια Ειδικών Κατηγοριών</h2><p>Λειτουργεί.</p>`;
}
// ==================== ΥΠΟΛΟΓΙΣΜΟΣ ΥΠΕΡΩΡΙΩΝ ====================
function showOvertimeCalculator() {
    const main = document.getElementById('main-content');
    
    let html = `
        <div class="breadcrumb">Αρχική σελίδα / Υπερωρίες</div>
        <h2>Υπολογισμός Υπερωριών</h2>
        
        <div style="margin: 25px 0 20px;">
            <label><strong>Ημερομηνία ΑΠΟ:</strong> </label>
            <select id="overtime-date" onchange="calculateOvertime()" style="padding:10px; font-size:1.05em;">
            </select>
        </div>
        
        <div class="tabs" id="overtime-tabs"></div>
        <div id="overtime-result" class="table-container"></div>
    `;

    main.innerHTML = html;

    populateOvertimeDates();
    populateOvertimeTabs();
    calculateOvertime();
}
function populateOvertimeDates() {
    const select = document.getElementById('overtime-date');
    const dates = allData.overtimeRates?.dates || ["01/04/2026", "01/01/2026"];
    select.innerHTML = dates.map(d => `<option value="${d}">${d}</option>`).join('');
}

function populateOvertimeTabs() {
    const container = document.getElementById('overtime-tabs');
    const cats = Object.keys(allData.overtimeRates?.categories || {});
    container.innerHTML = cats.map((cat, i) => `
        <div class="tab-btn ${i === 0 ? 'active' : ''}" onclick="switchOvertimeTab('${cat}')">${cat}</div>
    `).join('');
}

let currentOvertimeCat = "ΠΕ";

function switchOvertimeTab(cat) {
    currentOvertimeCat = cat;
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.toggle('active', t.textContent === cat));
    calculateOvertime();
}

function calculateOvertime() {
    const date = document.getElementById('overtime-date').value;
    const catData = allData.overtimeRates?.categories[currentOvertimeCat];
    if (!catData) return;

    const basic = catData.basicSalary;
    const hourly = (basic / 280).toFixed(2);

    let html = `
        <h3>${currentOvertimeCat} — Βασικός Μισθός: <strong>${basic}€</strong></h3>
        <p><strong>Ωρομίσθιο:</strong> ${hourly} €</p>
        
        <table class="overtime-table">
            <thead>
                <tr>
                    <th>Είδος Υπερωρίας</th>
                    <th>Ποσοστό</th>
                    <th>Αμοιβή ανά ώρα</th>
                </tr>
            </thead>
            <tbody>
    `;

    allData.overtimeRates.overtimeTypes.forEach(type => {
        const pay = (hourly * type.multiplier).toFixed(2);
        html += `
            <tr>
                <td>${type.name}</td>
                <td style="text-align:center; font-weight:bold;">${(type.multiplier * 100 - 100).toFixed(0)}%</td>
                <td style="text-align:right; font-weight:bold; color:#1a73e8;">${pay} €</td>
            </tr>`;
    });

    html += `</tbody></table>`;
    document.getElementById('overtime-result').innerHTML = html;
}
// Εκκίνηση
document.addEventListener('DOMContentLoaded', loadData);