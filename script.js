// ==UserScript==
// @name         Discord Channel ID Extractor
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Extract Discord channel IDs from links on the page
// @author       Your Name
// @match        https://discord.com/*
// @grant        none
// @license      You can modify as long as you credit me
// ==/UserScript==

(function() {
    'use strict';

    let observer;
    let isBoxVisible = false;

    function makeElementDraggable(el) {
        el.onmousedown = function(event) {
            event.preventDefault();

            let shiftX = event.clientX - el.getBoundingClientRect().left;
            let shiftY = event.clientY - el.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                el.style.left = Math.min(Math.max(0, pageX - shiftX), window.innerWidth - el.offsetWidth) + 'px';
                el.style.top = Math.min(Math.max(0, pageY - shiftY), window.innerHeight - el.offsetHeight) + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mouseup', onMouseUp);
        };

        el.ondragstart = function() {
            return false;
        };
    }

    function addResizeButtons(el, initialWidth, initialHeight) {
        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.right = '5px';
        buttonContainer.style.top = '5px';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '5px';
        el.appendChild(buttonContainer);

        const enlargeButton = document.createElement('button');
        enlargeButton.textContent = '＋';
        enlargeButton.style.padding = '2px 5px';
        enlargeButton.style.fontSize = '10px';
        enlargeButton.style.backgroundColor = '#575757';
        enlargeButton.style.color = '#ffffff';
        enlargeButton.style.border = 'none';
        enlargeButton.style.borderRadius = '3px';
        enlargeButton.style.cursor = 'pointer';
        enlargeButton.style.transition = 'color 0.3s, background-color 0.3s';
        enlargeButton.onmouseenter = () => {
            enlargeButton.style.backgroundColor = '#4CAF50';
            enlargeButton.style.color = '#ffffff';
        };
        enlargeButton.onmouseleave = () => {
            enlargeButton.style.backgroundColor = '#575757';
            enlargeButton.style.color = '#ffffff';
        };
        buttonContainer.appendChild(enlargeButton);

        const shrinkButton = document.createElement('button');
        shrinkButton.textContent = '－';
        shrinkButton.style.padding = '2px 5px';
        shrinkButton.style.fontSize = '10px';
        shrinkButton.style.backgroundColor = '#575757';
        shrinkButton.style.color = '#ffffff';
        shrinkButton.style.border = 'none';
        shrinkButton.style.borderRadius = '3px';
        shrinkButton.style.cursor = 'pointer';
        shrinkButton.style.transition = 'color 0.3s, background-color 0.3s';
        shrinkButton.onmouseenter = () => {
            shrinkButton.style.backgroundColor = '#f44336';
            shrinkButton.style.color = '#ffffff';
        };
        shrinkButton.onmouseleave = () => {
            shrinkButton.style.backgroundColor = '#575757';
            shrinkButton.style.color = '#ffffff';
        };
        buttonContainer.appendChild(shrinkButton);

        enlargeButton.addEventListener('click', () => {
            el.style.height = (el.clientHeight + 150) + 'px';
        });

        shrinkButton.addEventListener('click', () => {
            el.style.width = initialWidth;
            el.style.height = initialHeight;
        });
    }

    const initialWidth = '170px';
    const initialHeight = '320px';

    const container = document.createElement('div');
    container.id = 'channelIDContainer';
    container.style.position = 'fixed';
    container.style.top = '120px';
    container.style.left = '280px';
    container.style.backgroundColor = '#000000';
    container.style.color = '#ffffff';
    container.style.padding = '5px';
    container.style.borderRadius = '5px';
    container.style.zIndex = '1000';
    container.style.width = initialWidth;
    container.style.height = initialHeight;
    container.style.display = 'none';
    document.body.appendChild(container);

    makeElementDraggable(container);
    addResizeButtons(container, initialWidth, initialHeight);

    const title = document.createElement('h2');
    title.textContent = 'AARR Ex Channel IDs';
    title.style.margin = '0 0 5px 0';
    title.style.fontSize = '15px';
    container.appendChild(title);

    const toolsLink = document.createElement('a');
    toolsLink.href = 'https://aarr-homepage.github.io/page/about5.html';
    toolsLink.target = '_blank';
    toolsLink.style.color = '#00BFFF';
    toolsLink.style.textDecoration = 'underline';
    toolsLink.style.display = 'inline-block';
    toolsLink.style.marginBottom = '10px';
    toolsLink.style.fontSize = '12px';
    toolsLink.textContent = '🔗other tools';
    container.appendChild(toolsLink);

    const idList = document.createElement('ul');
    idList.style.listStyleType = 'none';
    idList.style.padding = '0';
    idList.style.fontSize = '10px';
    idList.style.height = 'calc(100% - 120px)';
    idList.style.overflowY = 'scroll';
    container.appendChild(idList);

    const startButton = document.createElement('button');
    startButton.textContent = ' Start ';
    startButton.style.marginTop = '5px';
    startButton.style.padding = '2px 5px';
    startButton.style.fontSize = '10px';
    startButton.style.backgroundColor = '#575757';
    startButton.style.color = '#ffffff';
    startButton.style.border = 'none';
    startButton.style.borderRadius = '3px';
    startButton.style.cursor = 'pointer';
    startButton.style.transition = 'color 0.3s, background-color 0.3s';
    startButton.onmouseenter = () => {
        startButton.style.backgroundColor = '#4CAF50';
        startButton.style.color = '#ffffff';
    };
    startButton.onmouseleave = () => {
        startButton.style.backgroundColor = '#575757';
        startButton.style.color = '#ffffff';
    };
    container.appendChild(startButton);

    const stopButton = document.createElement('button');
    stopButton.textContent = ' Stop ';
    stopButton.style.marginTop = '5px';
    stopButton.style.padding = '2px 5px';
    stopButton.style.fontSize = '10px';
    stopButton.style.backgroundColor = '#575757';
    stopButton.style.color = '#ffffff';
    stopButton.style.border = 'none';
    stopButton.style.borderRadius = '3px';
    stopButton.style.cursor = 'pointer';
    stopButton.style.transition = 'color 0.3s, background-color 0.3s';
    stopButton.onmouseenter = () => {
        stopButton.style.backgroundColor = '#f44336';
        stopButton.style.color = '#ffffff';
    };
    stopButton.onmouseleave = () => {
        stopButton.style.backgroundColor = '#575757';
        stopButton.style.color = '#ffffff';
    };
    container.appendChild(stopButton);

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.style.marginTop = '5px';
    resetButton.style.padding = '2px 5px';
    resetButton.style.fontSize = '10px';
    resetButton.style.backgroundColor = '#575757';
    resetButton.style.color = '#ffffff';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '3px';
    resetButton.style.cursor = 'pointer';
    resetButton.style.transition = 'color 0.3s, background-color 0.3s';
    resetButton.onmouseenter = () => {
        resetButton.style.backgroundColor = '#f44336';
        resetButton.style.color = '#ffffff';
    };
    resetButton.onmouseleave = () => {
        resetButton.style.backgroundColor = '#575757';
        resetButton.style.color = '#ffffff';
    };
    container.appendChild(resetButton);

    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy CIDs';
    copyButton.style.marginTop = '5px';
    copyButton.style.padding = '2px 5px';
    copyButton.style.fontSize = '10px';
    copyButton.style.backgroundColor = '#575757';
    copyButton.style.color = '#ffffff';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '3px';
    copyButton.style.cursor = 'pointer';
    copyButton.style.transition = 'color 0.3s, background-color 0.3s';
    copyButton.onmouseenter = () => {
        copyButton.style.backgroundColor = '#4CAF50';
        copyButton.style.color = '#ffffff';
    };
    copyButton.onmouseleave = () => {
        copyButton.style.backgroundColor = '#575757';
        copyButton.style.color = '#ffffff';
    };
    container.appendChild(copyButton);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save File';
    saveButton.style.marginTop = '5px';
    saveButton.style.padding = '2px 5px';
    saveButton.style.fontSize = '10px';
    saveButton.style.backgroundColor = '#575757';
    saveButton.style.color = '#ffffff';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '3px';
    saveButton.style.cursor = 'pointer';
    saveButton.style.transition = 'color 0.3s, background-color 0.3s';
    saveButton.onmouseenter = () => {
        saveButton.style.backgroundColor = '#4CAF50';
        saveButton.style.color = '#ffffff';
    };
    saveButton.onmouseleave = () => {
        saveButton.style.backgroundColor = '#575757';
        saveButton.style.color = '#ffffff';
    };
    container.appendChild(saveButton);

    function extractChannelIDs() {
        const channelElements = document.querySelectorAll('a[href*="/channels/"]');
        const ids = new Set();
        channelElements.forEach(link => {
            const urlParts = link.href.split('/');
            if (urlParts.length > 5) {
                ids.add(urlParts[5]);
            }
        });
        return Array.from(ids);
    }

    function updateChannelIDList() {
        const channelIDs = extractChannelIDs();
        channelIDs.forEach(id => {
            if (!Array.from(idList.children).some(li => li.textContent === id)) {
                const listItem = document.createElement('li');
                listItem.textContent = id;
                listItem.style.color = 'yellow';
                idList.appendChild(listItem);
            }
        });
    }

    function copyIDsToClipboard() {
        const ids = Array.from(idList.children).map(li => li.textContent).join('\n');
        navigator.clipboard.writeText(ids).then(() => {
        }).catch(err => {
            console.error('Failed to copy IDs: ', err);
        });
    }

    function resetIDList() {
        idList.innerHTML = '';
        if (observer) {
            observer.disconnect();
        }
    }

    function saveIDsToFile() {
        const ids = Array.from(idList.children).map(li => li.textContent).join('\n');
        const blob = new Blob([ids], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'channel_ids.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    startButton.addEventListener('click', () => {
        if (observer) {
            observer.disconnect();
        }
        updateChannelIDList();
        observer = new MutationObserver(() => {
            setTimeout(updateChannelIDList, 1000);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

    stopButton.addEventListener('click', () => {
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    });

    copyButton.addEventListener('click', copyIDsToClipboard);
    resetButton.addEventListener('click', resetIDList);
    saveButton.addEventListener('click', saveIDsToFile);

    const toggleImage = document.createElement('img');
    toggleImage.src = 'https://i.imgur.com/RaOkQOA.png';
    toggleImage.style.position = 'fixed';
    toggleImage.style.width = '30px';
    toggleImage.style.height = '30px';
    toggleImage.style.cursor = 'pointer';
    toggleImage.style.zIndex = '1001';
    toggleImage.style.left = '75px';
    toggleImage.style.bottom = '90px';
    document.body.appendChild(toggleImage);

    function adjustToggleImagePosition() {
      
    }

    window.addEventListener('resize', adjustToggleImagePosition);
    adjustToggleImagePosition();

    toggleImage.addEventListener('click', () => {
        isBoxVisible = !isBoxVisible;
        container.style.display = isBoxVisible ? 'block' : 'none';
    });
})();
