export class NodeState {
    constructor(id, color, posX, posY, title, subtitle, descr, icon) {
        this.id = String(id);
        this.color = String(color);
        this.posX = String(posX);
        this.posY = String(posY);
        this.title = String(title);
        this.subtitle = String(subtitle);
        this.descr = String(descr);
        this.icon = String(icon);
    }

    static fromJSON(jsonNode) {
        return new NodeState(
            jsonNode.id,
            jsonNode.color || "#e2e8f0",
            jsonNode.positionX || "0",
            jsonNode.positionY || "0",
            jsonNode.title || "",
            "", // subtitle not in JSON
            jsonNode.description || "",
            jsonNode.icon || "📄"
        );
    }
}
