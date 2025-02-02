// Configuration
const UPLOAD_LIMIT = 10 * 1024 * 1024; // 10 MB
const MAX_FILES = 70;
const STORAGE_KEY = 'uploadedFiles';

// Upload Files
function uploadFiles() {
    const files = document.getElementById('fileInput').files;
    const status = document.getElementById('status');
    const storedFiles = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    if (storedFiles.length + files.length > MAX_FILES) {
        status.textContent = `Cannot upload more than ${MAX_FILES} files.`;
        return;
    }

    for (let file of files) {
        if (file.size > UPLOAD_LIMIT) {
            status.textContent = `File ${file.name} exceeds 10MB limit.`;
            return;
        }
    }

    [...files].forEach(file => {
        const reader = new FileReader();
        reader.onload = function (e) {
            storedFiles.push({ name: file.name, data: e.target.result });
            localStorage.setItem(STORAGE_KEY, JSON.stringify(storedFiles));
            status.textContent = 'Upload successful!';
        };
        reader.readAsDataURL(file);
    });
}

// View Files
function displayFiles() {
    const fileList = document.getElementById('fileList');
    const files = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    if (files.length === 0) {
        fileList.innerHTML = '<li>No files uploaded yet.</li>';
        return;
    }

    files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.className = 'file-item';
        listItem.innerHTML = `
            <span>${file.name}</span>
            <button class="button" onclick="downloadFile('${file.name}')">Download</button>
        `;
        fileList.appendChild(listItem);
    });
}

// Download Files
function downloadFile(fileName) {
    const files = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    const file = files.find(f => f.name === fileName);
    if (file) {
        const link = document.createElement('a');
        link.href = file.data;
        link.download = file.name;
        link.click();
    }
}

// Initialize file view
if (document.getElementById('fileList')) {
    displayFiles();
}
