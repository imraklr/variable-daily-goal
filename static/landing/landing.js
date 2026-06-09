// Disable drag events
document.addEventListener('dragstart', e => {
    e.preventDefault();
});

// Disable copy
document.addEventListener('copy', e => {
    e.preventDefault();
});

// Disable cut
document.addEventListener('cut', e => {
    e.preventDefault();
});

// Disable context menu (right-click)
document.addEventListener('contextmenu', e => {
    e.preventDefault();
});
