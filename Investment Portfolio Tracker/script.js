document.addEventListener('DOMContentLoaded', () => {
    const investmentForm = document.getElementById('investmentForm');
    const addInvestmentBtn = document.getElementById('addInvestmentBtn');
    const addBtn = document.getElementById('addBtn');
    const updateForm = document.getElementById('updateForm');
    const updateBtn = document.getElementById('updateBtn');
    const list = document.getElementById('list');
    const totalValue = document.getElementById('totalValue');
    const pieChartCtx = document.getElementById('pieChart').getContext('2d');
    
    let investments = JSON.parse(localStorage.getItem('investments')) || [];
    let chart;

    function renderInvestments() {
        list.innerHTML = '';
        let total = 0;
        investments.forEach((investment, index) => {
            const percentageChange = ((investment.currentValue - investment.investedAmount) / investment.investedAmount) * 100;
            total += investment.currentValue;

            const li = document.createElement('li');
            li.innerHTML = `
                <span>${investment.assetName}</span>
                <span>$${investment.investedAmount}</span>
                <span>$${investment.currentValue}</span>
                <span>${percentageChange.toFixed(2)}%</span>
                <button class="updateBtn" data-index="${index}">Update</button>
                <button class="removeBtn" data-index="${index}">Remove</button>
            `;
            list.appendChild(li);
        });
        totalValue.textContent = total.toFixed(2);
        updateChart();
    }

    function addInvestment() {
        const assetName = document.getElementById('assetName').value;
        const investedAmount = parseFloat(document.getElementById('investedAmount').value);
        const currentValue = parseFloat(document.getElementById('currentValue').value);

        investments.push({ assetName, investedAmount, currentValue });
        localStorage.setItem('investments', JSON.stringify(investments));
        renderInvestments();
        investmentForm.reset();
    }

    function removeInvestment(index) {
        investments.splice(index, 1);
        localStorage.setItem('investments', JSON.stringify(investments));
        renderInvestments();
    }

    function updateInvestment(index) {
        const currentValue = parseFloat(document.getElementById('updateCurrentValue').value);
        investments[index].currentValue = currentValue;
        localStorage.setItem('investments', JSON.stringify(investments));
        renderInvestments();
        updateForm.style.display = 'none';
        investmentForm.style.display = 'block';
    }

    function updateChart() {
        if (chart) {
            chart.destroy();
        }
        const labels = investments.map(inv => inv.assetName);
        const data = investments.map(inv => inv.currentValue);
        chart = new Chart(pieChartCtx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                }]
            }
        });
    }

    addInvestmentBtn.addEventListener('click', () => {
        updateForm.style.display = 'none';
        investmentForm.style.display = 'block';
    });

    addBtn.addEventListener('click', addInvestment);

    list.addEventListener('click', (e) => {
        if (e.target.classList.contains('removeBtn')) {
            const index = e.target.getAttribute('data-index');
            removeInvestment(index);
        } else if (e.target.classList.contains('updateBtn')) {
            const index = e.target.getAttribute('data-index');
            document.getElementById('updateAssetName').value = investments[index].assetName;
            document.getElementById('updateInvestedAmount').value = investments[index].investedAmount;
            document.getElementById('updateCurrentValue').value = investments[index].currentValue;
            updateForm.style.display = 'block';
            investmentForm.style.display = 'none';
            updateBtn.setAttribute('data-index', index);
        }
    });

    updateBtn.addEventListener('click', () => {
        const index = updateBtn.getAttribute('data-index');
        updateInvestment(index);
    });

    renderInvestments();
});
