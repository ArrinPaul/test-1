import json

# Read manifest
with open('manifest.json', 'r', encoding='utf-8') as f:
    manifest = json.load(f)

# Create OUT/Outside block
outside_block = {
    "id": "outside",
    "label": "Outside Areas",
    "short": "Outside",
    "svgAnchor": {"x": 400, "y": 320},
    "svgPath": "M 220 230 L 300 230 L 300 310 L 220 310 Z",
    "labs": [
        {
            "id": "outside-105",
            "label": "Open Auditorium",
            "thumbnail": "exported/thumbnails/img105.jpg",
            "panorama": "exported/OUT/img105.jpg",
            "type": "equirectangular",
            "meta": {"filename": "img105.jpg", "directory": "OUT"}
        },
        {
            "id": "outside-116",
            "label": "Student Square",
            "thumbnail": "exported/thumbnails/img116.jpg",
            "panorama": "exported/OUT/img116.jpg",
            "type": "equirectangular",
            "meta": {"filename": "img116.jpg", "directory": "OUT"}
        },
        {
            "id": "outside-127",
            "label": "img127.jpg",
            "thumbnail": "exported/thumbnails/img127.jpg",
            "panorama": "exported/OUT/img127.jpg",
            "type": "equirectangular",
            "meta": {"filename": "img127.jpg", "directory": "OUT"}
        },
        {
            "id": "outside-138",
            "label": "img138.jpg",
            "thumbnail": "exported/thumbnails/img138.jpg",
            "panorama": "exported/OUT/img138.jpg",
            "type": "equirectangular",
            "meta": {"filename": "img138.jpg", "directory": "OUT"}
        }
    ]
}

# Add to manifest
manifest['blocks'].append(outside_block)

# Write back
with open('manifest.json', 'w', encoding='utf-8') as f:
    json.dump(manifest, f, indent=2)

print("✅ Successfully added Outside Areas block to manifest.json")
print(f"Total blocks: {len(manifest['blocks'])}")
