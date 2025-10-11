// script.js

window.addEventListener('load', () => {
    if (window.Telegram && window.Telegram.WebApp) {
        const tg = window.Telegram.WebApp;
        tg.ready();

        const userInfoElement = document.getElementById('user-info');
        if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
            const user = tg.initDataUnsafe.user;
            userInfoElement.textContent = `Welcome, ${user.first_name} ${user.last_name || ''} (@${user.username})!`;
        } else {
            userInfoElement.textContent = "Welcome! Could not retrieve user data.";
        }

        fetchTasks();
        fetchPersonnel();

    } else {
        console.error("Telegram Web App SDK not found.");
        document.body.innerHTML = "<h1>Error: This app must be run inside Telegram.</h1>";
    }
});

/**
 * Fetches task data from the backend API and renders it.
 */
async function fetchTasks() {
    const tasksList = document.getElementById('tasks-list');
    tasksList.innerHTML = '<p>Loading tasks...</p>';

    try {
        const response = await fetch('/api/get_tasks');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const tasks = await response.json();

        if (!tasks || tasks.length === 0) {
            tasksList.innerHTML = '<p>No tasks found.</p>';
            return;
        }

        tasksList.innerHTML = '';
        tasks.slice(-5).reverse().forEach(task => { // Show 5 most recent
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <h3>${task.Task_ID || 'No ID'} - [${task.Status || 'No Status'}]</h3>
                <p>${task.Description || 'No description.'}</p>
            `;
            tasksList.appendChild(item);
        });

    } catch (error) {
        console.error('Error fetching tasks:', error);
        tasksList.innerHTML = '<p>Failed to load tasks.</p>';
    }
}

/**
 * Fetches personnel data from the backend API and renders it.
 */
async function fetchPersonnel() {
    const personnelList = document.getElementById('personnel-list');
    personnelList.innerHTML = '<p>Loading personnel...</p>';

    try {
        const response = await fetch('/api/get_personnel');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const personnel = await response.json();

        if (!personnel || personnel.length === 0) {
            personnelList.innerHTML = '<p>No personnel found.</p>';
            return;
        }

        personnelList.innerHTML = '';
        personnel.forEach(person => {
            const item = document.createElement('div');
            item.className = 'list-item';
            item.innerHTML = `
                <h3>${person.Name || 'No Name'} (${person.Type || 'N/A'})</h3>
                <p>Role: ${person.Role || 'N/A'}</p>
            `;
            personnelList.appendChild(item);
        });

    } catch (error) {
        console.error('Error fetching personnel:', error);
        personnelList.innerHTML = '<p>Failed to load personnel data.</p>';
    }
}
