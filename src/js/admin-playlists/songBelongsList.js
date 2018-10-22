{
    let view = {
        el: '.songBelongsList-displayArea',
        init() {
            this.$el = $(this.el)
        },
        template: `
        <ul class="playList-music">
            <ul v-for="playlist in playlists">
            </ul>
        </ul>
        `,
        render(data) {
            let $el = $(this.el)
            $el.html(this.template)
            let liList = []
            for(i=0;i<data.songs.length;i++){
                let $li = $('<ul></ul>').html(
                    `<svg class="icon" aria-hidden="true"><use xlink: href="#icon-wangyiyunyinyuemusic1193417easyiconnet"></use></svg>
                        <li>${
                        data.songs[i].name
                        }</li><li><svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-micc"></use>
                        </svg>${data.songs[i].artist}</li>
                    `
                ).attr('data-songMap-id',data.templateMap[i])
                liList.push($li)
            }
            console.log(data.templateMap)
            console.log(liList)
            $el.find('.playList-music').empty()
            liList.map(domLi => {
                $el.find('.playList-music').append(domLi)
            })
        }
    }
    let model = {
        data: {
            songs: [],
            templateMap: []
        },
        init() {
            this.data = {
                songs: [],
                templateMap: []
            }
        },
        findSongs(playlistId) {
            let playlistResult = new AV.Object.createWithoutData(
                'Playlist',
                playlistId
            )
            var query = new AV.Query('playlistMap')
            query.equalTo('playlistPointer', playlistResult)
            return query
                .find()
                .then(playlistMap => {
                    let songResultsId = []
                    playlistMap.forEach(scm => {
                        this.data.templateMap.push(scm.id)
                        var songs = scm.get('songPointer')
                        songResultsId.push(songs.id)
                    })
                    return songResultsId
                })
                .then(async songResultsId => {
                    let songAfter = []
                    var searchSong = new AV.Query('Song')
                    for (i = 0; i < songResultsId.length; i++) {
                        await searchSong.get(songResultsId[i]).then(songResult => {
                            songAfter.push(songResult)
                        })
                    }
                    return songAfter
                })
                .then(songAfter => {
                    this.data.songs = songAfter.map(song => {
                        return {
                            id: song.id,
                            ...song.attributes
                        }
                    })
                })
        }
    }
    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.bindEvent()
        },
        getAllPlaylistsInnerSong(playlistId) {
            this.model.data.songs = []
            this.model.data.templateMap = []
            this.model.findSongs(playlistId).then(() => {
                this.view.render(this.model.data)
            })
        },
        bindEvent() {
            window.eventHub.on('addSong', playlistId => {
                this.getAllPlaylistsInnerSong(playlistId)
            })
            window.eventHub.on('selectPlaylist', selectedPlaylistId => {
                this.getAllPlaylistsInnerSong(selectedPlaylistId)
            })
        }
    }
    controller.init(view, model)
}
