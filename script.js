document.addEventListener('DOMContentLoaded', function() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;  // Months are 0-based in JavaScript
    const year = today.getFullYear();
    const dateString = `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year.toString().slice(2)}`;
    const dateTitle = document.getElementById('dateTitle');
    dateTitle.innerText = `On-Call Information for ${dateString}`;

    // Fetch the JSON data
    fetch('calldata/roster.json')
        .then(response => response.json())
        .then(data => {
            const roster = data.DutyRoster;
            const todayRoster = roster.find(item => item.Date === dateString);

            if (todayRoster) {
                const tableBody = document.getElementById('callTable').getElementsByTagName('tbody')[0];
                const newRow = tableBody.insertRow();

                // Insert department
                const departmentCell = newRow.insertCell();
                departmentCell.textContent = data.Department;

                // First Call
                const firstCallCell = newRow.insertCell();
                firstCallCell.innerHTML = `<strong>${todayRoster.FirstCall.Name}</strong><br><span class="phone-number">${todayRoster.FirstCall.Number}</span>`;

                // Second Call
                const secondCallCell = newRow.insertCell();
                secondCallCell.innerHTML = `<strong>${todayRoster.SecondCall.Name}</strong><br><span class="phone-number">${todayRoster.SecondCall.Number}</span>`;

                // Add copy functionality for phone numbers
                document.querySelectorAll('.phone-number').forEach(cell => {
                    cell.addEventListener('click', function() {
                        const phoneNumber = this.textContent;
                        navigator.clipboard.writeText(phoneNumber).then(() => {
                            alert('Phone number copied to clipboard!');
                        });
                    });
                });
            } else {
                dateTitle.innerText = 'No on-call information available for today.';
            }
        })
        .catch(err => console.error('Error fetching JSON:', err));
});
