function downloadTextAsFile(filename, text, fileType = 'text/plain') {
    const blob = new Blob([text], { type: fileType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = downloadTextAsFile;
}