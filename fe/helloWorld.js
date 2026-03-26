const app = document.getElementById('app');

const onClick = () => {
    fetch('http://localhost:3000/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // cors
        },
        credentials: 'include'
    }).then(response => response.json())
    .then(data => {
        console.log(data);
    });
}

function helloWorld() {
    const btn = document.createElement('button');
    btn.innerHTML = 'Click me';
    btn.className = 'bg-blue-500 text-white p-2 rounded-md m-2 hover:bg-blue-600 duration-300';
    btn.addEventListener('click', () => {
        onClick();
    });
    app.appendChild(btn);
}

export default helloWorld;