"use strict";

document.addEventListener('DOMContentLoaded', () => {
    const checkButton = setInterval(() => {
        const button = document.querySelector('div.insext-btn');
        if (button) {
            clearInterval(checkButton);
            button.click();
        }
    }, 10);
})
