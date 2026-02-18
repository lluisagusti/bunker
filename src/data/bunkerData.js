export const bunkerData = [
    {
        id: "command-center",
        name: "Command Center",
        description: "The nerve center of the bunker. All strategic decisions are made here. Equipped with advanced surveillance and communication systems.",
        image: "https://placehold.co/600x400/1a1a1a/06b6d4?text=Command+Center",
        // Position around the central shaft (radius, angle, height)
        // We'll map these to 3D coordinates in the component
        level: 0,
        angle: 0,
        color: "#06b6d4",
        type: "octagonal"
    },
    {
        id: "power-plant",
        name: "Geothermal Reactor",
        description: "Generates power for the entire facility using deep-earth geothermal energy. Critical infrastructure.",
        image: "https://placehold.co/600x400/1a1a1a/eab308?text=Power+Plant",
        level: -5,
        angle: 180,
        color: "#eab308",
        type: "circular"
    },
    {
        id: "infirmary",
        name: "Medical Bay",
        description: "Fully stocked medical facility with surgical capabilities and quarantine zones.",
        image: "https://placehold.co/600x400/1a1a1a/ef4444?text=Medical+Bay",
        level: -1,
        angle: 90,
        color: "#ef4444",
        type: "cross"
    },
    {
        id: "barracks-alpha",
        name: "Living Quarters Alpha",
        description: "Sleeping quarters for shift A personnel. Compact but comfortable sleeping pods.",
        image: "https://placehold.co/600x400/1a1a1a/3b82f6?text=Barracks+Alpha",
        level: -2,
        angle: 45,
        color: "#3b82f6",
        type: "rounded"
    },
    {
        id: "barracks-beta",
        name: "Living Quarters Beta",
        description: "Sleeping quarters for shift B personnel.",
        image: "https://placehold.co/600x400/1a1a1a/3b82f6?text=Barracks+Beta",
        level: -2,
        angle: 225,
        color: "#3b82f6",
        type: "rounded"
    },
    {
        id: "storage-food",
        name: "Food Storage",
        description: "Temperature-controlled storage for dehydrated and canned rations. Sufficient for 5 years.",
        image: "https://placehold.co/600x400/1a1a1a/10b981?text=Food+Storage",
        level: -3,
        angle: 315,
        color: "#10b981",
        type: "hexagonal"
    },
    {
        id: "storage-water",
        name: "Water Purification",
        description: "Advanced filtration system recycling 98% of water. Connected to deep aquifer pumps.",
        image: "https://placehold.co/600x400/1a1a1a/0ea5e9?text=Water+Purification",
        level: -4,
        angle: 135,
        color: "#0ea5e9",
        type: "circular"
    },
    {
        id: "armory",
        name: "Security & Armory",
        description: "Restricted access area containing defense equipment and tactical gear.",
        image: "https://placehold.co/600x400/1a1a1a/f97316?text=Armory",
        level: -1,
        angle: 270,
        color: "#f97316",
        type: "pentagon"
    },
    {
        id: "lab",
        name: "Research Lab",
        description: "General purpose laboratory for analysis and hydroponics research.",
        image: "https://placehold.co/600x400/1a1a1a/8b5cf6?text=Research+Lab",
        level: -3,
        angle: 135,
        color: "#8b5cf6",
        type: "l-shaped"
    },
    {
        id: "hydroponics",
        name: "Hydroponics Garden",
        description: "Vertical farming modules providing fresh vegetables and oxygen.",
        image: "https://placehold.co/600x400/1a1a1a/22c55e?text=Hydroponics",
        level: -3,
        angle: 45,
        color: "#22c55e",
        type: "glass"
    },
    {
        id: "comms",
        name: "Comms Array",
        description: "Surface uplink and internal network processing monitoring.",
        image: "https://placehold.co/600x400/1a1a1a/6366f1?text=Comms",
        level: 0.5, // Slightly elevated
        angle: 180,
        color: "#6366f1",
        type: "diamond"
    },
    {
        id: "engineering",
        name: "Engineering Workshop",
        description: "Fabrication and repair shop for maintaining bunker systems.",
        image: "https://placehold.co/600x400/1a1a1a/f59e0b?text=Engineering",
        level: -4,
        angle: 0,
        color: "#f59e0b",
        type: "trapezoid"
    },
    {
        id: "air-filtration",
        name: "Air Filtration",
        description: "CO2 scrubbers and particle filters. Maintains positive pressure.",
        image: "https://placehold.co/600x400/1a1a1a/a8a29e?text=Air+Filtration",
        level: -0.5,
        angle: 315,
        color: "#a8a29e",
        type: "box"
    },
    {
        id: "server-room",
        name: "Data Center",
        description: "Server banks storing historical archives and AI cores.",
        image: "https://placehold.co/600x400/1a1a1a/ec4899?text=Data+Center",
        level: -2,
        angle: 135,
        color: "#ec4899",
        type: "box"
    }
];
