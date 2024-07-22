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

        // Send request to Python backend
        fetch('/check_plugins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ urls, plugins }),
        })
        .then(response => response.json())
        .then(data => {
            resultsTable.innerHTML = ''; // Clear previous results
            data.forEach(result => {
                const row = resultsTable.insertRow();
                const cell1 = row.insertCell(0);
                const cell2 = row.insertCell(1);
                cell1.textContent = result.url;
                cell2.textContent = result.plugins.join(', ');
            });
        })
        .catch(error => console.error('Error:', error));
    });

    downloadButton.addEventListener('click', function() {
        fetch('/download_csv')
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'plugin_results.csv';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => console.error('Error:', error));
    });
});
