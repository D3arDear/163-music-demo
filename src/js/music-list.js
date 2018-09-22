{
    let view = {
        el: '#musicList-container',
        templete: `
        <ul class="musicList">
                    <li v-for="song in songs">
                    </li>
                </ul>
        `,
        render(data) {
            let $el = $(this.el)
            $el.html(this.templete)
            let { songs } = data
            let liList = songs.map(song => {
                let li = $('<li></li>').text(song.name)
                return li
            })
            $el.find('ul').empty()
            liList.map(domLi => {
                $el.find('ul').append(domLi)
            })
        },
        clearActive() {
            $(this.el)
                .find('.active')
                .removeClass('active')
        }
    }
    let model = {
        data: {
            songs: []
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            window.eventHub.on('upload', () => {
                this.view.clearActive()
            })
            window.eventHub.on('create', songData => {
                this.model.data.songs.push(songData)
                this.view.render(this.model.data)
            })
            var query = new AV.Query('')
            query.find().then(x => {
                console.log(x)
            })
        }
    }
    controller.init(view, model)
}
