export interface Lab {
    id: string;
    label: string;
    thumbnail: string;
    panorama: string;
    type?: string;
    meta?: {
        floor?: number;
        equipment?: string[];
        [key: string]: any;
    };
}

export interface Block {
    id: string;
    label: string;
    short: string;
    svgAnchor: { x: number; y: number };
    svgPath?: string;
    labs: Lab[];
}

export interface Manifest {
    campusName: string;
    blocks: Block[];
}
