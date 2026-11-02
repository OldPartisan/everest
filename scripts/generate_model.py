#!/usr/bin/env python3
"""Build a compact, stylised 3D terrain of the Everest massif from SRTM.

Source: NASA SRTM 1 arc-second tiles distributed by the AWS Open Data
Terrain Tiles program (public domain). The mesh is deliberately simplified:
a 176 x 190 height field with vertex colours and no textures.

Usage:
    python3 scripts/generate_model.py /tmp/N27E086.hgt /tmp/N28E086.hgt
"""
from __future__ import annotations

import json
import math
import struct
import sys
from pathlib import Path

WEST, EAST = 86.735, 87.105
SOUTH, NORTH = 27.830, 28.160
GRID_X, GRID_Z = 176, 190
BASE_ELEV = 5000.0
MODEL_SIZE = 4.2
MODEL_HEIGHT = 1.8
OUT = Path(__file__).resolve().parents[1] / 'public' / 'models' / 'everest.glb'


def read_tile(path: Path) -> bytes:
    data = path.read_bytes()
    if len(data) != 3601 * 3601 * 2:
        raise ValueError(f'{path} is not a 3601x3601 SRTM tile')
    return data


def sample(tiles: dict[int, bytes], lat: float, lon: float) -> float:
    tile_lat = math.floor(lat)
    tile_lon = math.floor(lon)
    data = tiles.get(tile_lat)
    if data is None:
        return BASE_ELEV
    row = (tile_lat + 1 - lat) * 3600.0
    col = (lon - tile_lon) * 3600.0
    r0 = max(0, min(3600, int(math.floor(row))))
    c0 = max(0, min(3600, int(math.floor(col))))
    r1 = min(3600, r0 + 1)
    c1 = min(3600, c0 + 1)
    fr, fc = row - r0, col - c0

    def h(r: int, c: int) -> float:
        off = (r * 3601 + c) * 2
        value = struct.unpack_from('>h', data, off)[0]
        return float(value) if value > -1000 else BASE_ELEV

    top = h(r0, c0) * (1 - fc) + h(r0, c1) * fc
    bottom = h(r1, c0) * (1 - fc) + h(r1, c1) * fc
    return top * (1 - fr) + bottom * fr


def main(paths: list[str]) -> None:
    tiles: dict[int, bytes] = {}
    for raw in paths:
        path = Path(raw)
        tile_lat = int(path.name[1:3])
        tiles[tile_lat] = read_tile(path)

    center_lon = (WEST + EAST) / 2
    center_lat = (SOUTH + NORTH) / 2
    meters_per_deg_lon = 111_320 * math.cos(math.radians(center_lat))
    world_width = (EAST - WEST) * meters_per_deg_lon
    world_depth = (NORTH - SOUTH) * 111_320
    horizontal_scale = MODEL_SIZE / max(world_width, world_depth)

    points: list[tuple[float, float, float]] = []
    for iz in range(GRID_Z):
        lat = NORTH - (NORTH - SOUTH) * iz / (GRID_Z - 1)
        for ix in range(GRID_X):
            lon = WEST + (EAST - WEST) * ix / (GRID_X - 1)
            elevation = sample(tiles, lat, lon)
            points.append(
                (
                    (lon - center_lon) * meters_per_deg_lon * horizontal_scale,
                    elevation,
                    -(lat - center_lat) * 111_320 * horizontal_scale,
                )
            )

    max_elev = max(p[1] for p in points)
    vertical_scale = MODEL_HEIGHT / (max_elev - BASE_ELEV)
    positions: list[float] = []
    colors: list[float] = []
    for index, (x, elevation, z) in enumerate(points):
        y = max(0.0, (elevation - BASE_ELEV) * vertical_scale)
        ix = index % GRID_X
        iz = index // GRID_X
        edge = min(ix, GRID_X - 1 - ix, iz, GRID_Z - 1 - iz)
        taper = min(1.0, edge / 12.0)
        taper = taper * taper * (3.0 - 2.0 * taper)
        y *= taper
        positions.extend((x, y, z))

        # Cool grey palette: snow on high, wind-scoured rock below.
        n = math.sin(x * 17.17 + z * 31.73) * 0.5 + 0.5
        snow_line = 0.63 + 0.04 * n
        normalized = y / MODEL_HEIGHT
        if normalized > snow_line:
            shade = 0.74 + 0.1 * n
            r, g, b = shade, shade + 0.012, shade + 0.03
        else:
            shade = 0.34 + 0.2 * normalized + 0.06 * n
            r, g, b = shade, shade + 0.02, shade + 0.045
        # Slightly darken the lower valleys for depth.
        depth = max(0.0, 1.0 - normalized * 2.2)
        r, g, b = r - depth * 0.06, g - depth * 0.05, b - depth * 0.02
        colors.extend((max(0.0, min(1.0, r)), max(0.0, min(1.0, g)), max(0.0, min(1.0, b))))

    # Smooth normals from the height field: cross product of east and south tangents.
    normals: list[float] = [0.0] * len(positions)
    stride = 3
    for iz in range(GRID_Z):
        for ix in range(GRID_X):
            i = iz * GRID_X + ix
            left = iz * GRID_X + max(0, ix - 1)
            right = iz * GRID_X + min(GRID_X - 1, ix + 1)
            north = max(0, iz - 1) * GRID_X + ix
            south = min(GRID_Z - 1, iz + 1) * GRID_X + ix

            tx_x = positions[right * stride] - positions[left * stride]
            tx_y = positions[right * stride + 1] - positions[left * stride + 1]
            tz_y = positions[south * stride + 1] - positions[north * stride + 1]
            tz_z = positions[south * stride + 2] - positions[north * stride + 2]

            # tangent_z x tangent_x
            nx = -tz_z * tx_y
            ny = tz_z * tx_x
            nz = -tz_y * tx_x
            length = math.sqrt(nx * nx + ny * ny + nz * nz) or 1.0
            normals[i * stride : i * stride + 3] = (nx / length, ny / length, nz / length)

    indices: list[int] = []
    for iz in range(GRID_Z - 1):
        for ix in range(GRID_X - 1):
            a = iz * GRID_X + ix
            b = a + 1
            c = a + GRID_X
            d = c + 1
            indices.extend((a, c, b, b, c, d))

    positions_bytes = struct.pack(f'<{len(positions)}f', *positions)
    normals_bytes = struct.pack(f'<{len(normals)}f', *normals)
    colors_bytes = struct.pack(f'<{len(colors)}f', *colors)
    indices_bytes = struct.pack(f'<{len(indices)}I', *indices)

    views: list[dict] = []
    offset = 0

    def add_view(data: bytes, target: int) -> int:
        nonlocal offset
        padding = (-offset) % 4
        if padding:
            raise ValueError('buffer chunk is not 4-byte aligned')
        views.append({'buffer': 0, 'byteOffset': offset, 'byteLength': len(data), 'target': target})
        offset += len(data)
        return len(views) - 1

    pos_view = add_view(positions_bytes, 34962)
    norm_view = add_view(normals_bytes, 34962)
    color_view = add_view(colors_bytes, 34962)
    index_view = add_view(indices_bytes, 34963)

    ys = positions[1::3]
    accessors = [
        {
            'bufferView': pos_view,
            'componentType': 5126,
            'count': len(points),
            'type': 'VEC3',
            'min': [
                min(positions[0::3]),
                min(ys),
                min(positions[2::3]),
            ],
            'max': [
                max(positions[0::3]),
                max(ys),
                max(positions[2::3]),
            ],
        },
        {'bufferView': norm_view, 'componentType': 5126, 'count': len(points), 'type': 'VEC3'},
        {'bufferView': color_view, 'componentType': 5126, 'count': len(points), 'type': 'VEC3'},
        {
            'bufferView': index_view,
            'componentType': 5125,
            'count': len(indices),
            'type': 'SCALAR',
        },
    ]

    binary = positions_bytes + normals_bytes + colors_bytes + indices_bytes
    gltf = {
        'asset': {
            'version': '2.0',
            'generator': 'everest/scripts/generate_model.py',
            'copyright': 'SRTM data: NASA/USGS, public domain. Mesh: project authors, MIT.',
        },
        'scene': 0,
        'scenes': [{'nodes': [0]}],
        'nodes': [{'mesh': 0, 'name': 'Everest_Massif'}],
        'meshes': [
            {
                'name': 'Everest_Massif',
                'primitives': [
                    {
                        'attributes': {'POSITION': 0, 'NORMAL': 1, 'COLOR_0': 2},
                        'indices': 3,
                        'material': 0,
                        'mode': 4,
                    }
                ],
            }
        ],
        'materials': [
            {
                'name': 'SnowAndRock',
                'pbrMetallicRoughness': {
                    'baseColorFactor': [1.0, 1.0, 1.0, 1.0],
                    'metallicFactor': 0.0,
                    'roughnessFactor': 0.94,
                },
                'doubleSided': False,
            }
        ],
        'buffers': [{'byteLength': len(binary)}],
        'bufferViews': views,
        'accessors': accessors,
    }

    json_bytes = json.dumps(gltf, separators=(',', ':')).encode('utf-8')
    json_bytes += b' ' * ((4 - len(json_bytes) % 4) % 4)
    binary += b'\x00' * ((4 - len(binary) % 4) % 4)
    total = 12 + 8 + len(json_bytes) + 8 + len(binary)
    glb = (
        b'glTF'
        + struct.pack('<II', 2, total)
        + struct.pack('<I', len(json_bytes))
        + b'JSON'
        + json_bytes
        + struct.pack('<I', len(binary))
        + b'BIN\x00'
        + binary
    )
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes(glb)
    print(
        f'{OUT}: {len(glb) / 1024:.0f} KB, {len(points)} vertices, '
        f'{len(indices) // 3} triangles, max elevation {max_elev:.0f} m'
    )


if __name__ == '__main__':
    if len(sys.argv) != 3:
        raise SystemExit('usage: generate_model.py N27E086.hgt N28E086.hgt')
    main(sys.argv[1:])
