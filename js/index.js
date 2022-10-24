function searchVideo() {
    let loadingField = document.getElementById('loading')
    loadingField.innerHTML = '<i class="fa-solid fa-car rotation"></i>'

    const textBox = document.getElementById('text-box')
    const searchWord = textBox.value

    fetch(`https://kawecoman.pythonanywhere.com/search?q=${searchWord}`)
        .then(res => {
            return res.json()
        })
        .then(videos => {
            if (videos['error'] == 'TokenUnavailable') {
                alert('トークンを補充してください')
            }

            const output = document.getElementById('videos')
            output.innerHTML = ''

            videos['items'].forEach(element => {
                let commentBlock = `
                <div>
                    <hr size="1">
                    <p>${element['channelTitle']}&nbsp;&nbsp;―&nbsp;&nbsp;${element['videoTitle']}</p>
                    <button onclick="displayVideo(this)" data-id="${element['id']}">視聴</button>
                </div>
                `

                output.insertAdjacentHTML('beforeend', commentBlock);
            });

            loadingField.innerHTML = ''

            if (videos['nextPageToken']) {
                commentBlock = `<button id="add" onclick="addSearchVideo('${videos['nextPageToken']}')">さらに表示</button>`
                output.insertAdjacentHTML('beforeend', commentBlock);
            }
        })
}


function addSearchVideo(token) {
    let loadingField = document.getElementById('loading')
    loadingField.innerHTML = '<i class="fa-solid fa-car rotation"></i>'

    fetch(`https://kawecoman.pythonanywhere.com/add?token=${token}`)
        .then(res => {
            return res.json()
        })
        .then(videos => {
            if (videos['error'] == 'TokenUnavailable') {
                alert('トークンを補充してください')
            }

            const output = document.getElementById('videos')
            const button = document.getElementById('add')

            button.remove()

            videos['items'].forEach(element => {
                let commentBlock = `
                <div>
                    <hr size="1">
                    <p>${element['channelTitle']}&nbsp;&nbsp;―&nbsp;&nbsp;${element['videoTitle']}</p>
                    <button onclick="displayVideo(this)" data-id="${element['id']}">視聴</button>
                </div>
                `

                output.insertAdjacentHTML('beforeend', commentBlock);
            });

            loadingField.innerHTML = ''

            if (videos['nextPageToken']) {
                commentBlock = `<button id="add" onclick="addSearchVideo('${videos['nextPageToken']}')">さらに表示</button>`
                output.insertAdjacentHTML('beforeend', commentBlock);
            }
        })
}


function displayVideo(button) {
    let loadingField = document.getElementById('loading')
    loadingField.innerHTML = '<i class="fa-solid fa-car rotation"></i>'

    const id = button.dataset.id

    fetch(`https://kawecoman.pythonanywhere.com/video?id=${id}`)
        .then(res => {
            return res.json()
        })
        .then(data => {
            if (data['error'] == 'TokenUnavailable') {
                alert('トークンを補充してください')
            }

            const output = document.getElementById('video')
            output.innerHTML = ''

            let commentBlock = `
            <video src="${data['videoUrl']}" controls width="500"></video>
            <p>${data['channelTitle']}&nbsp;&nbsp;―&nbsp;&nbsp;${data['videoTitle']}</p>
            <p><i class="fas fa-chart-bar"></i>&nbsp;&nbsp;${data['viewCount']} ・ ${data['publishedAt']}</p>
            <p><i class="fa-solid fa-thumbs-up"></i>&nbsp;&nbsp;${data['likeCount']}</p>

            <button onclick="displayComment(this)" data-id="${id}">コメント</button>
            <div id="comment"></div>
            `

            output.insertAdjacentHTML('beforeend', commentBlock);

            loadingField.innerHTML = ''

            window.scroll({top: 0, behavior: 'smooth'})
        })
}


function displayComment(button) {
    let loadingField = document.getElementById('loading')
    loadingField.innerHTML = '<i class="fa-solid fa-car rotation"></i>'

    const id = button.dataset.id

    fetch(`https://kawecoman.pythonanywhere.com/comment?id=${id}`)
        .then(res => {
            return res.json()
        })
        .then(comments => {
            if (comments['error'] == 'TokenUnavailable') {
                alert('トークンを補充してください')
            }

            const output0 = document.getElementById('comment')

            if (output0.innerHTML != '') {
                output0.innerHTML = ''
                loadingField.innerHTML = ''
                return
            }

            output0.insertAdjacentHTML('beforeend', '<div id="comments"></div>')

            const output = document.getElementById('comments')

            comments.forEach(element => {
                let commentBlock = `
                <div>
                    <hr size="1">
                    <div class="comment-thread">
                        <p class="author-name">${element['author']} ・ ${element['publishedAt']}</p>
                        <p>${element['content']}</p>
                    </div>
                </div>
                `

                output.insertAdjacentHTML('beforeend', commentBlock);
            })

            loadingField.innerHTML = ''
        })
}
