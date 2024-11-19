export const COLORS = {
    "blue": "#bfdbfe",
    "red": "#fecaca",
    "green": "#bbf7d0",
    "grey": "#e2e8f0",
    "yellow": "#fef08a",
    "purple": "#e9d5ff"
  };
  

export class NodeState {

    
    constructor(id, color, posX, posY, title, subtitle, previous, descr, icon) {
        this.id = String(id);
        this.color = COLORS[color] || color;
        this.posX = String(posX);
        this.posY = String(posY);
        this.title = String(title);
        this.subtitle = String(subtitle);
        this.previous = previous;
        this.descr = String(descr);
        this.icon = String(icon);
    }

    static fromJSON(jsonNode) {
        return new NodeState(
            jsonNode.id,
            jsonNode.color || "#e2e8f0",
            jsonNode.posX || "0",
            jsonNode.posY || "0",
            jsonNode.title || "",
            jsonNode.subtitle || "", // subtitle not in JSON
            jsonNode.previous || [],
            jsonNode.description || "",
            jsonNode.icon || "📄"
        );
    }

    static fromJSONTechTree(jsonNode) {
        return new NodeState(
            jsonNode.id,
            jsonNode.color || "#e2e8f0",
            jsonNode.col || "0",
            jsonNode.row || "0",
            jsonNode.title || "",
            jsonNode.subtitle || "", // subtitle not in JSON
            jsonNode.requiredTechs|| [],
            jsonNode.description || "",
            jsonNode.icon || "📄"
        );
    }
}
