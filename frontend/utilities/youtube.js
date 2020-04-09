let elements = document.getElementsByClassName('youtube-link')
for (let i = 0; i < elements.length; i++) {
    elements[i].onclick = (e) => {
        window.location.href = elements[i].getAttribute('data-url');
        e.stopPropagation();
    };
}