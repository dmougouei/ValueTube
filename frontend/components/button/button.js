class Button {
    constructor(parent) {
        this.parent = parent;
        this.text = "Button"
    }
    
    render() {
        this.parent.innerHTML += `
            <div class="btn caps">` + this.text + `</div>
        `;
    }
}

export default Button;