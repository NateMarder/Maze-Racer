import { MazeState } from "@/maze/types";


export function smallMaze(): MazeState {
    return {
        "height": 240,
        "width": 240,
        "spacing": 60,
        "cols": 4,
        "rows": 4,
        "nodes": [
            {
                "key": "30.30",
                "isVisited": false,
                "isDest": false,
                "isStart": true,
                "distFromStart": 0,
                "siblingKeys": [
                    "30.90"
                ],
                "pathDirections": [],
                "x": 30,
                "y": 30
            },
            {
                "key": "30.90",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "30.30",
                    "90.90"
                ],
                "pathDirections": [],
                "x": 30,
                "y": 90
            },
            {
                "key": "30.150",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "30.210"
                ],
                "pathDirections": [],
                "x": 30,
                "y": 150
            },
            {
                "key": "30.210",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "90.210",
                    "30.150"
                ],
                "pathDirections": [],
                "x": 30,
                "y": 210
            },
            {
                "key": "90.30",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "150.30"
                ],
                "pathDirections": [],
                "x": 90,
                "y": 30
            },
            {
                "key": "90.90",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "30.90",
                    "90.150"
                ],
                "pathDirections": [],
                "x": 90,
                "y": 90
            },
            {
                "key": "90.150",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "90.90",
                    "150.150"
                ],
                "pathDirections": [],
                "x": 90,
                "y": 150
            },
            {
                "key": "90.210",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "150.210",
                    "30.210"
                ],
                "pathDirections": [],
                "x": 90,
                "y": 210
            },
            {
                "key": "150.30",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "150.90",
                    "210.30",
                    "90.30"
                ],
                "pathDirections": [],
                "x": 150,
                "y": 30
            },
            {
                "key": "150.90",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "150.150",
                    "150.30"
                ],
                "pathDirections": [],
                "x": 150,
                "y": 90
            },
            {
                "key": "150.150",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "90.150",
                    "150.90"
                ],
                "pathDirections": [],
                "x": 150,
                "y": 150
            },
            {
                "key": "150.210",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "210.210",
                    "90.210"
                ],
                "pathDirections": [],
                "x": 150,
                "y": 210
            },
            {
                "key": "210.30",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "150.30",
                    "210.90"
                ],
                "pathDirections": [],
                "x": 210,
                "y": 30
            },
            {
                "key": "210.90",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "210.30",
                    "210.150"
                ],
                "pathDirections": [],
                "x": 210,
                "y": 90
            },
            {
                "key": "210.150",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "210.90",
                    "210.210"
                ],
                "pathDirections": [],
                "x": 210,
                "y": 150
            },
            {
                "key": "210.210",
                "isVisited": false,
                "isDest": true,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "210.150",
                    "150.210"
                ],
                "pathDirections": [],
                "x": 210,
                "y": 210
            }
        ],
        "allPaths": [
            {
                "id": "30.30.30.90",
                "key": "30.30.30.90",
                "nodeKeys": [
                    "30.30",
                    "30.90"
                ],
                "crossWall": "0.60.60.60"
            },
            {
                "id": "30.90.90.90",
                "key": "30.90.90.90",
                "nodeKeys": [
                    "30.90",
                    "90.90"
                ],
                "crossWall": "60.60.60.120"
            },
            {
                "id": "90.90.90.150",
                "key": "90.90.90.150",
                "nodeKeys": [
                    "90.90",
                    "90.150"
                ],
                "crossWall": "60.120.120.120"
            },
            {
                "id": "90.150.150.150",
                "key": "90.150.150.150",
                "nodeKeys": [
                    "90.150",
                    "150.150"
                ],
                "crossWall": "120.120.120.180"
            },
            {
                "id": "150.90.150.150",
                "key": "150.90.150.150",
                "nodeKeys": [
                    "150.90",
                    "150.150"
                ],
                "crossWall": "120.120.180.120"
            },
            {
                "id": "150.30.150.90",
                "key": "150.30.150.90",
                "nodeKeys": [
                    "150.30",
                    "150.90"
                ],
                "crossWall": "120.60.180.60"
            },
            {
                "id": "150.30.210.30",
                "key": "150.30.210.30",
                "nodeKeys": [
                    "150.30",
                    "210.30"
                ],
                "crossWall": "180.0.180.60"
            },
            {
                "id": "210.30.210.90",
                "key": "210.30.210.90",
                "nodeKeys": [
                    "210.30",
                    "210.90"
                ],
                "crossWall": "180.60.240.60"
            },
            {
                "id": "210.90.210.150",
                "key": "210.90.210.150",
                "nodeKeys": [
                    "210.90",
                    "210.150"
                ],
                "crossWall": "180.120.240.120"
            },
            {
                "id": "210.150.210.210",
                "key": "210.150.210.210",
                "nodeKeys": [
                    "210.150",
                    "210.210"
                ],
                "crossWall": "180.180.240.180"
            },
            {
                "id": "150.210.210.210",
                "key": "150.210.210.210",
                "nodeKeys": [
                    "150.210",
                    "210.210"
                ],
                "crossWall": "180.180.180.240"
            },
            {
                "id": "90.210.150.210",
                "key": "90.210.150.210",
                "nodeKeys": [
                    "90.210",
                    "150.210"
                ],
                "crossWall": "120.180.120.240"
            },
            {
                "id": "30.210.90.210",
                "key": "30.210.90.210",
                "nodeKeys": [
                    "30.210",
                    "90.210"
                ],
                "crossWall": "60.180.60.240"
            },
            {
                "id": "30.150.30.210",
                "key": "30.150.30.210",
                "nodeKeys": [
                    "30.150",
                    "30.210"
                ],
                "crossWall": "0.180.60.180"
            },
            {
                "id": "90.30.150.30",
                "key": "90.30.150.30",
                "nodeKeys": [
                    "90.30",
                    "150.30"
                ],
                "crossWall": "120.0.120.60"
            }
        ],
        "walls": [
            {
                "id": "60.0.60.60",
                "x1": 60,
                "y1": 0,
                "x2": 60,
                "y2": 60
            },
            {
                "id": "60.120.60.180",
                "x1": 60,
                "y1": 120,
                "x2": 60,
                "y2": 180
            },
            {
                "id": "120.60.120.120",
                "x1": 120,
                "y1": 60,
                "x2": 120,
                "y2": 120
            },
            {
                "id": "180.60.180.120",
                "x1": 180,
                "y1": 60,
                "x2": 180,
                "y2": 120
            },
            {
                "id": "180.120.180.180",
                "x1": 180,
                "y1": 120,
                "x2": 180,
                "y2": 180
            },
            {
                "id": "60.60.120.60",
                "x1": 60,
                "y1": 60,
                "x2": 120,
                "y2": 60
            },
            {
                "id": "0.120.60.120",
                "x1": 0,
                "y1": 120,
                "x2": 60,
                "y2": 120
            },
            {
                "id": "60.180.120.180",
                "x1": 60,
                "y1": 180,
                "x2": 120,
                "y2": 180
            },
            {
                "id": "120.180.180.180",
                "x1": 120,
                "y1": 180,
                "x2": 180,
                "y2": 180
            }
        ],
        "inactiveWallKeys": [
            "0.60.60.60",
            "60.60.60.120",
            "60.120.120.120",
            "120.120.120.180",
            "120.120.180.120",
            "120.60.180.60",
            "180.0.180.60",
            "180.60.240.60",
            "180.120.240.120",
            "180.180.240.180",
            "180.180.180.240",
            "120.180.120.240",
            "60.180.60.240",
            "0.180.60.180",
            "120.0.120.60"
        ],
        "destination": {
            "x": 30,
            "y": 150
        },
        "serialized": "",
        "level": 1
    }
}


