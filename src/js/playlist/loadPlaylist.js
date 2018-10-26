{
    let view = {
        el: 'header',
        template: `
        <div class="playlistArea">
        <section class="coverContainer">
            <div class="coverImg"></div>
            <div class="playlist-title">{{playlist.name}}</div>
        </section>
        <section class="summary">
            <div class="summaryContent">简介：{{playlist.summary}}</div>
            <div class="buttonMore"></div>
        </section>
        </div>
        `,
        init() {
            this.$el = $(this.el)
        },
        render(data) {
            let { playlists } = data
            let $li = $(
                this.template
                    .replace('{{playlist.name}}', playlists.name)
                    .replace('{{playlist.summary}}', playlists.summary)
            )
            $li.find('.coverContainer').css('background-image', `url(${playlists.url})`)
            $li.find('.coverImg').css('background-image', `url(${playlists.url})`)
            this.$el.append($li)
        }
    }
    let model = {
        data: {
            playlists: []
        },
        getPlaylist(playlists) {
            var query = new AV.Query('Playlist');
            return query.get(playlists).then((playlist) => {
                Object.assign(this.data.playlists, {
                    id: playlist.id,
                    ...playlist.attributes
                })
                return playlist
            });
        }
    }
    let controller = {
        init() {
            this.view = view
            this.view.init()
            this.model = model

            this.bindEventHub()
        },
        changeTitle() {

        },
        bindEventHub() {
            window.eventHub.on('getPlaylist', playlist => {
                this.model.getPlaylist(playlist).then(() => {
                    this.view.render(this.model.data)

                })
            })
        }
    }
    controller.init(view, model)
}