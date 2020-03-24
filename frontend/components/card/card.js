class Card {
    constructor(parent, metadata) {
        this.parent = parent;
        this.metadata = metadata;
    }
    
    render() {
        this.parent.innerHTML += `
            <div class="card">
                <div class="card-preview">
                    <img src="` + this.metadata.thumbnail + `"/>
                    <div class="duration">` + this.metadata.duration + `</div>
                </div>
                <div class="card-details">
                    <div class="video-title">` + this.metadata.title + `</div>
                    <div class="content-creator">` + this.metadata.contentCreator + `</div>
                    <div class="views">` + this.metadata.views + ' views' + `</div>
                    <div class="published">` + this.metadata.published + `</div>
                </div>
            </div>
        `;
    }
}

export default Card;