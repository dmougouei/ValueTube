module.exports = class Button {
    constructor(text, style, color, link) {
        this.text = text;
        this.style = style;
        this.color = color;
        this.link = link;
    }
    
    render() {
        return `
            <div class="btn ` + this.style + ` ` + this.color + `" onclick="window.location.href='` + this.link + `'">` + this.text + `</div>
        `;
    }
}