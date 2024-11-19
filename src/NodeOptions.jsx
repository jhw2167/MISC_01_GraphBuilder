import { COLORS } from './NodeState';

export const DEFAULT_OPTIONS = {
    color: "grey",
    icon: "📄",
    showDescription: true,
    showSubtitle: true,
    fontSize: "normal",
    borderStyle: "solid"
};

export const COLOR_OPTIONS = [
    { label: "Grey", value: "grey" },
    { label: "Blue", value: "blue" },
    { label: "Red", value: "red" },
    { label: "Green", value: "green" },
    { label: "Yellow", value: "yellow" },
    { label: "Purple", value: "purple" }
];

export const ICON_OPTIONS = [
    { label: "Document", value: "📄" },
    { label: "Book", value: "📚" },
    { label: "Gear", value: "⚙️" },
    { label: "Star", value: "⭐" },
    { label: "Light", value: "💡" },
    { label: "Check", value: "✅" }
];

export const FONT_SIZE_OPTIONS = [
    { label: "Small", value: "small" },
    { label: "Normal", value: "normal" },
    { label: "Large", value: "large" }
];

export const BORDER_STYLE_OPTIONS = [
    { label: "Solid", value: "solid" },
    { label: "Dashed", value: "dashed" },
    { label: "Dotted", value: "dotted" }
];
