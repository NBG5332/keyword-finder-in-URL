document.addEventListener('DOMContentLoaded', function() {
    const checkButton = document.getElementById('checkButton');
    const downloadButton = document.getElementById('downloadButton');
    const urlList = document.getElementById('urlList');
    const pluginList = document.getElementById('pluginList');
    const addPluginButton = document.getElementById('addPlugin');
    const resultsTable = document.getElementById('resultsTable').getElementsByTagName('tbody')[0];

    addPluginButton.addEventListener('click', function() {
        const newLi = document.createElement('li');
        newLi.innerHTML = '<input type="text" value="">';
        pluginList.appendChild(newLi);
    });

    checkButton.addEventListener('click', function() {
        const urls = urlList.value.split('\n').filter(url => url.trim() !== '');
        const plugins = Array.from(pluginList.getElementsByTagName('input')).map(input => input.value.trim()).filter(plugin => plugin !== '');

        resultsTable.innerHTML = ''; // Clear previous results

        urls.forEach(url => {
            fetch('/check_plugins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, plugins }),
            })
            .then(response => response.json())
            .then(data => {
                const row = resultsTable.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                cell1.textContent = url;
                cell2.textContent = Object.keys(data).join(', ');
            })
            .catch(error => console.error('Error:', error));
        });
    });

    downloadButton.addEventListener('click', function() {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "URL,Plugins Used\n"
            + Array.from(resultsTable.rows).map(row => 
                row.cells[0].textContent + "," + row.cells[1].textContent
            ).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "plugin_results.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
