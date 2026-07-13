import { MazeState } from "@/maze/types";


export function simpleMaze(): MazeState {
    return {
        "height": 600,
        "width": 600,
        "spacing": 60,
        "cols": 10,
        "rows": 10,
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
                    "30.150"
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
                    "30.90",
                    "90.150"
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
                    "30.270",
                    "90.210"
                ],
                "pathDirections": [],
                "x": 30,
                "y": 210
            },
            {
                "key": "30.270",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "30.330",
                    "30.210"
                ],
                "pathDirections": [],
                "x": 30,
                "y": 270
            },
            {
                "key": "30.330",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "90.330",
                    "30.270",
                    "30.390"
                ],
                "pathDirections": [],
                "x": 30,
                "y": 330
            },
            {
                "key": "30.390",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "30.330",
                    "30.450"
                ],
                "pathDirections": [],
                "x": 30,
                "y": 390
            },
            {
                "key": "30.450",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "30.390",
                    "30.510"
                ],
                "pathDirections": [],
                "x": 30,
                "y": 450
            },
            {
                "key": "30.510",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "30.450",
                    "90.510"
                ],
                "pathDirections": [],
                "x": 30,
                "y": 510
            },
            {
                "key": "30.570",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "90.570"
                ],
                "pathDirections": [],
                "x": 30,
                "y": 570
            },
            {
                "key": "90.30",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "90.90",
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
                    "90.150",
                    "90.30"
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
                    "30.150",
                    "90.90"
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
                    "30.210",
                    "90.270"
                ],
                "pathDirections": [],
                "x": 90,
                "y": 210
            },
            {
                "key": "90.270",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "90.210",
                    "150.270"
                ],
                "pathDirections": [],
                "x": 90,
                "y": 270
            },
            {
                "key": "90.330",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "90.390",
                    "30.330"
                ],
                "pathDirections": [],
                "x": 90,
                "y": 330
            },
            {
                "key": "90.390",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "150.390",
                    "90.330"
                ],
                "pathDirections": [],
                "x": 90,
                "y": 390
            },
            {
                "key": "90.450",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "90.510"
                ],
                "pathDirections": [],
                "x": 90,
                "y": 450
            },
            {
                "key": "90.510",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "30.510",
                    "90.450",
                    "90.570"
                ],
                "pathDirections": [],
                "x": 90,
                "y": 510
            },
            {
                "key": "90.570",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "90.510",
                    "30.570"
                ],
                "pathDirections": [],
                "x": 90,
                "y": 570
            },
            {
                "key": "150.30",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "90.30",
                    "210.30"
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
                    "150.150"
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
                    "210.150",
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
                    "150.270",
                    "210.210"
                ],
                "pathDirections": [],
                "x": 150,
                "y": 210
            },
            {
                "key": "150.270",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "90.270",
                    "150.210"
                ],
                "pathDirections": [],
                "x": 150,
                "y": 270
            },
            {
                "key": "150.330",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "210.330"
                ],
                "pathDirections": [],
                "x": 150,
                "y": 330
            },
            {
                "key": "150.390",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "150.450",
                    "90.390"
                ],
                "pathDirections": [],
                "x": 150,
                "y": 390
            },
            {
                "key": "150.450",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "150.510",
                    "150.390"
                ],
                "pathDirections": [],
                "x": 150,
                "y": 450
            },
            {
                "key": "150.510",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "150.570",
                    "150.450"
                ],
                "pathDirections": [],
                "x": 150,
                "y": 510
            },
            {
                "key": "150.570",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "210.570",
                    "150.510"
                ],
                "pathDirections": [],
                "x": 150,
                "y": 570
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
                    "270.90"
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
                    "210.210",
                    "270.150",
                    "150.150"
                ],
                "pathDirections": [],
                "x": 210,
                "y": 150
            },
            {
                "key": "210.210",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "150.210",
                    "210.150"
                ],
                "pathDirections": [],
                "x": 210,
                "y": 210
            },
            {
                "key": "210.270",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "210.330"
                ],
                "pathDirections": [],
                "x": 210,
                "y": 270
            },
            {
                "key": "210.330",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "210.390",
                    "210.270",
                    "150.330"
                ],
                "pathDirections": [],
                "x": 210,
                "y": 330
            },
            {
                "key": "210.390",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "210.450",
                    "210.330"
                ],
                "pathDirections": [],
                "x": 210,
                "y": 390
            },
            {
                "key": "210.450",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "210.510",
                    "210.390"
                ],
                "pathDirections": [],
                "x": 210,
                "y": 450
            },
            {
                "key": "210.510",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "270.510",
                    "210.450"
                ],
                "pathDirections": [],
                "x": 210,
                "y": 510
            },
            {
                "key": "210.570",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "270.570",
                    "150.570"
                ],
                "pathDirections": [],
                "x": 210,
                "y": 570
            },
            {
                "key": "270.30",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "270.90",
                    "330.30"
                ],
                "pathDirections": [],
                "x": 270,
                "y": 30
            },
            {
                "key": "270.90",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "210.90",
                    "270.30"
                ],
                "pathDirections": [],
                "x": 270,
                "y": 90
            },
            {
                "key": "270.150",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "210.150",
                    "330.150"
                ],
                "pathDirections": [],
                "x": 270,
                "y": 150
            },
            {
                "key": "270.210",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "270.270"
                ],
                "pathDirections": [],
                "x": 270,
                "y": 210
            },
            {
                "key": "270.270",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "330.270",
                    "270.210",
                    "270.330"
                ],
                "pathDirections": [],
                "x": 270,
                "y": 270
            },
            {
                "key": "270.330",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "270.270",
                    "270.390"
                ],
                "pathDirections": [],
                "x": 270,
                "y": 330
            },
            {
                "key": "270.390",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "270.330",
                    "330.390"
                ],
                "pathDirections": [],
                "x": 270,
                "y": 390
            },
            {
                "key": "270.450",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "330.450",
                    "270.510"
                ],
                "pathDirections": [],
                "x": 270,
                "y": 450
            },
            {
                "key": "270.510",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "270.450",
                    "210.510"
                ],
                "pathDirections": [],
                "x": 270,
                "y": 510
            },
            {
                "key": "270.570",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "330.570",
                    "210.570"
                ],
                "pathDirections": [],
                "x": 270,
                "y": 570
            },
            {
                "key": "330.30",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "270.30",
                    "330.90"
                ],
                "pathDirections": [],
                "x": 330,
                "y": 30
            },
            {
                "key": "330.90",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "330.30",
                    "390.90"
                ],
                "pathDirections": [],
                "x": 330,
                "y": 90
            },
            {
                "key": "330.150",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "270.150",
                    "330.210"
                ],
                "pathDirections": [],
                "x": 330,
                "y": 150
            },
            {
                "key": "330.210",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "330.150",
                    "330.270"
                ],
                "pathDirections": [],
                "x": 330,
                "y": 210
            },
            {
                "key": "330.270",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "330.210",
                    "270.270"
                ],
                "pathDirections": [],
                "x": 330,
                "y": 270
            },
            {
                "key": "330.330",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "330.390",
                    "390.330"
                ],
                "pathDirections": [],
                "x": 330,
                "y": 330
            },
            {
                "key": "330.390",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "270.390",
                    "330.330"
                ],
                "pathDirections": [],
                "x": 330,
                "y": 390
            },
            {
                "key": "330.450",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "330.510",
                    "270.450"
                ],
                "pathDirections": [],
                "x": 330,
                "y": 450
            },
            {
                "key": "330.510",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "390.510",
                    "330.450"
                ],
                "pathDirections": [],
                "x": 330,
                "y": 510
            },
            {
                "key": "330.570",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "390.570",
                    "270.570"
                ],
                "pathDirections": [],
                "x": 330,
                "y": 570
            },
            {
                "key": "390.30",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "450.30"
                ],
                "pathDirections": [],
                "x": 390,
                "y": 30
            },
            {
                "key": "390.90",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "330.90",
                    "390.150"
                ],
                "pathDirections": [],
                "x": 390,
                "y": 90
            },
            {
                "key": "390.150",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "390.90",
                    "450.150"
                ],
                "pathDirections": [],
                "x": 390,
                "y": 150
            },
            {
                "key": "390.210",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "390.270"
                ],
                "pathDirections": [],
                "x": 390,
                "y": 210
            },
            {
                "key": "390.270",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "390.330",
                    "390.210"
                ],
                "pathDirections": [],
                "x": 390,
                "y": 270
            },
            {
                "key": "390.330",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "330.330",
                    "390.270",
                    "390.390"
                ],
                "pathDirections": [],
                "x": 390,
                "y": 330
            },
            {
                "key": "390.390",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "390.330",
                    "390.450"
                ],
                "pathDirections": [],
                "x": 390,
                "y": 390
            },
            {
                "key": "390.450",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "390.390",
                    "390.510"
                ],
                "pathDirections": [],
                "x": 390,
                "y": 450
            },
            {
                "key": "390.510",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "390.450",
                    "450.510",
                    "330.510"
                ],
                "pathDirections": [],
                "x": 390,
                "y": 510
            },
            {
                "key": "390.570",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "450.570",
                    "330.570"
                ],
                "pathDirections": [],
                "x": 390,
                "y": 570
            },
            {
                "key": "450.30",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "510.30",
                    "390.30",
                    "450.90"
                ],
                "pathDirections": [],
                "x": 450,
                "y": 30
            },
            {
                "key": "450.90",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "450.30"
                ],
                "pathDirections": [],
                "x": 450,
                "y": 90
            },
            {
                "key": "450.150",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "390.150",
                    "450.210"
                ],
                "pathDirections": [],
                "x": 450,
                "y": 150
            },
            {
                "key": "450.210",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "450.150",
                    "450.270"
                ],
                "pathDirections": [],
                "x": 450,
                "y": 210
            },
            {
                "key": "450.270",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "450.210",
                    "450.330"
                ],
                "pathDirections": [],
                "x": 450,
                "y": 270
            },
            {
                "key": "450.330",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "450.270",
                    "450.390"
                ],
                "pathDirections": [],
                "x": 450,
                "y": 330
            },
            {
                "key": "450.390",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "450.330",
                    "510.390"
                ],
                "pathDirections": [],
                "x": 450,
                "y": 390
            },
            {
                "key": "450.450",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "450.510"
                ],
                "pathDirections": [],
                "x": 450,
                "y": 450
            },
            {
                "key": "450.510",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "390.510",
                    "450.450"
                ],
                "pathDirections": [],
                "x": 450,
                "y": 510
            },
            {
                "key": "450.570",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "510.570",
                    "390.570"
                ],
                "pathDirections": [],
                "x": 450,
                "y": 570
            },
            {
                "key": "510.30",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "570.30",
                    "450.30"
                ],
                "pathDirections": [],
                "x": 510,
                "y": 30
            },
            {
                "key": "510.90",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "510.150",
                    "570.90"
                ],
                "pathDirections": [],
                "x": 510,
                "y": 90
            },
            {
                "key": "510.150",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "570.150",
                    "510.90"
                ],
                "pathDirections": [],
                "x": 510,
                "y": 150
            },
            {
                "key": "510.210",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "510.270",
                    "570.210"
                ],
                "pathDirections": [],
                "x": 510,
                "y": 210
            },
            {
                "key": "510.270",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "570.270",
                    "510.210",
                    "510.330"
                ],
                "pathDirections": [],
                "x": 510,
                "y": 270
            },
            {
                "key": "510.330",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "510.270"
                ],
                "pathDirections": [],
                "x": 510,
                "y": 330
            },
            {
                "key": "510.390",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "450.390",
                    "510.450"
                ],
                "pathDirections": [],
                "x": 510,
                "y": 390
            },
            {
                "key": "510.450",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "510.390",
                    "510.510"
                ],
                "pathDirections": [],
                "x": 510,
                "y": 450
            },
            {
                "key": "510.510",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "510.450",
                    "570.510"
                ],
                "pathDirections": [],
                "x": 510,
                "y": 510
            },
            {
                "key": "510.570",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "570.570",
                    "450.570"
                ],
                "pathDirections": [],
                "x": 510,
                "y": 570
            },
            {
                "key": "570.30",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "570.90",
                    "510.30"
                ],
                "pathDirections": [],
                "x": 570,
                "y": 30
            },
            {
                "key": "570.90",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "510.90",
                    "570.30"
                ],
                "pathDirections": [],
                "x": 570,
                "y": 90
            },
            {
                "key": "570.150",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "570.210",
                    "510.150"
                ],
                "pathDirections": [],
                "x": 570,
                "y": 150
            },
            {
                "key": "570.210",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "510.210",
                    "570.150"
                ],
                "pathDirections": [],
                "x": 570,
                "y": 210
            },
            {
                "key": "570.270",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "570.330",
                    "510.270"
                ],
                "pathDirections": [],
                "x": 570,
                "y": 270
            },
            {
                "key": "570.330",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "570.390",
                    "570.270"
                ],
                "pathDirections": [],
                "x": 570,
                "y": 330
            },
            {
                "key": "570.390",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "570.450",
                    "570.330"
                ],
                "pathDirections": [],
                "x": 570,
                "y": 390
            },
            {
                "key": "570.450",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "570.510",
                    "570.390"
                ],
                "pathDirections": [],
                "x": 570,
                "y": 450
            },
            {
                "key": "570.510",
                "isVisited": false,
                "isDest": false,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "510.510",
                    "570.450",
                    "570.570"
                ],
                "pathDirections": [],
                "x": 570,
                "y": 510
            },
            {
                "key": "570.570",
                "isVisited": false,
                "isDest": true,
                "isStart": false,
                "distFromStart": 0,
                "siblingKeys": [
                    "570.510",
                    "510.570"
                ],
                "pathDirections": [],
                "x": 570,
                "y": 570
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
                "id": "30.90.30.150",
                "key": "30.90.30.150",
                "nodeKeys": [
                    "30.90",
                    "30.150"
                ],
                "crossWall": "0.120.60.120"
            },
            {
                "id": "30.150.90.150",
                "key": "30.150.90.150",
                "nodeKeys": [
                    "30.150",
                    "90.150"
                ],
                "crossWall": "60.120.60.180"
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
                "id": "90.30.90.90",
                "key": "90.30.90.90",
                "nodeKeys": [
                    "90.30",
                    "90.90"
                ],
                "crossWall": "60.60.120.60"
            },
            {
                "id": "90.30.150.30",
                "key": "90.30.150.30",
                "nodeKeys": [
                    "90.30",
                    "150.30"
                ],
                "crossWall": "120.0.120.60"
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
                "id": "210.90.270.90",
                "key": "210.90.270.90",
                "nodeKeys": [
                    "210.90",
                    "270.90"
                ],
                "crossWall": "240.60.240.120"
            },
            {
                "id": "270.30.270.90",
                "key": "270.30.270.90",
                "nodeKeys": [
                    "270.30",
                    "270.90"
                ],
                "crossWall": "240.60.300.60"
            },
            {
                "id": "270.30.330.30",
                "key": "270.30.330.30",
                "nodeKeys": [
                    "270.30",
                    "330.30"
                ],
                "crossWall": "300.0.300.60"
            },
            {
                "id": "330.30.330.90",
                "key": "330.30.330.90",
                "nodeKeys": [
                    "330.30",
                    "330.90"
                ],
                "crossWall": "300.60.360.60"
            },
            {
                "id": "330.90.390.90",
                "key": "330.90.390.90",
                "nodeKeys": [
                    "330.90",
                    "390.90"
                ],
                "crossWall": "360.60.360.120"
            },
            {
                "id": "390.90.390.150",
                "key": "390.90.390.150",
                "nodeKeys": [
                    "390.90",
                    "390.150"
                ],
                "crossWall": "360.120.420.120"
            },
            {
                "id": "390.150.450.150",
                "key": "390.150.450.150",
                "nodeKeys": [
                    "390.150",
                    "450.150"
                ],
                "crossWall": "420.120.420.180"
            },
            {
                "id": "450.150.450.210",
                "key": "450.150.450.210",
                "nodeKeys": [
                    "450.150",
                    "450.210"
                ],
                "crossWall": "420.180.480.180"
            },
            {
                "id": "450.210.450.270",
                "key": "450.210.450.270",
                "nodeKeys": [
                    "450.210",
                    "450.270"
                ],
                "crossWall": "420.240.480.240"
            },
            {
                "id": "450.270.450.330",
                "key": "450.270.450.330",
                "nodeKeys": [
                    "450.270",
                    "450.330"
                ],
                "crossWall": "420.300.480.300"
            },
            {
                "id": "450.330.450.390",
                "key": "450.330.450.390",
                "nodeKeys": [
                    "450.330",
                    "450.390"
                ],
                "crossWall": "420.360.480.360"
            },
            {
                "id": "450.390.510.390",
                "key": "450.390.510.390",
                "nodeKeys": [
                    "450.390",
                    "510.390"
                ],
                "crossWall": "480.360.480.420"
            },
            {
                "id": "510.390.510.450",
                "key": "510.390.510.450",
                "nodeKeys": [
                    "510.390",
                    "510.450"
                ],
                "crossWall": "480.420.540.420"
            },
            {
                "id": "510.450.510.510",
                "key": "510.450.510.510",
                "nodeKeys": [
                    "510.450",
                    "510.510"
                ],
                "crossWall": "480.480.540.480"
            },
            {
                "id": "510.510.570.510",
                "key": "510.510.570.510",
                "nodeKeys": [
                    "510.510",
                    "570.510"
                ],
                "crossWall": "540.480.540.540"
            },
            {
                "id": "570.450.570.510",
                "key": "570.450.570.510",
                "nodeKeys": [
                    "570.450",
                    "570.510"
                ],
                "crossWall": "540.480.600.480"
            },
            {
                "id": "570.390.570.450",
                "key": "570.390.570.450",
                "nodeKeys": [
                    "570.390",
                    "570.450"
                ],
                "crossWall": "540.420.600.420"
            },
            {
                "id": "570.330.570.390",
                "key": "570.330.570.390",
                "nodeKeys": [
                    "570.330",
                    "570.390"
                ],
                "crossWall": "540.360.600.360"
            },
            {
                "id": "570.270.570.330",
                "key": "570.270.570.330",
                "nodeKeys": [
                    "570.270",
                    "570.330"
                ],
                "crossWall": "540.300.600.300"
            },
            {
                "id": "510.270.570.270",
                "key": "510.270.570.270",
                "nodeKeys": [
                    "510.270",
                    "570.270"
                ],
                "crossWall": "540.240.540.300"
            },
            {
                "id": "510.210.510.270",
                "key": "510.210.510.270",
                "nodeKeys": [
                    "510.210",
                    "510.270"
                ],
                "crossWall": "480.240.540.240"
            },
            {
                "id": "510.210.570.210",
                "key": "510.210.570.210",
                "nodeKeys": [
                    "510.210",
                    "570.210"
                ],
                "crossWall": "540.180.540.240"
            },
            {
                "id": "570.150.570.210",
                "key": "570.150.570.210",
                "nodeKeys": [
                    "570.150",
                    "570.210"
                ],
                "crossWall": "540.180.600.180"
            },
            {
                "id": "510.150.570.150",
                "key": "510.150.570.150",
                "nodeKeys": [
                    "510.150",
                    "570.150"
                ],
                "crossWall": "540.120.540.180"
            },
            {
                "id": "510.90.510.150",
                "key": "510.90.510.150",
                "nodeKeys": [
                    "510.90",
                    "510.150"
                ],
                "crossWall": "480.120.540.120"
            },
            {
                "id": "510.90.570.90",
                "key": "510.90.570.90",
                "nodeKeys": [
                    "510.90",
                    "570.90"
                ],
                "crossWall": "540.60.540.120"
            },
            {
                "id": "570.30.570.90",
                "key": "570.30.570.90",
                "nodeKeys": [
                    "570.30",
                    "570.90"
                ],
                "crossWall": "540.60.600.60"
            },
            {
                "id": "510.30.570.30",
                "key": "510.30.570.30",
                "nodeKeys": [
                    "510.30",
                    "570.30"
                ],
                "crossWall": "540.0.540.60"
            },
            {
                "id": "450.30.510.30",
                "key": "450.30.510.30",
                "nodeKeys": [
                    "450.30",
                    "510.30"
                ],
                "crossWall": "480.0.480.60"
            },
            {
                "id": "390.30.450.30",
                "key": "390.30.450.30",
                "nodeKeys": [
                    "390.30",
                    "450.30"
                ],
                "crossWall": "420.0.420.60"
            },
            {
                "id": "450.30.450.90",
                "key": "450.30.450.90",
                "nodeKeys": [
                    "450.30",
                    "450.90"
                ],
                "crossWall": "420.60.480.60"
            },
            {
                "id": "510.270.510.330",
                "key": "510.270.510.330",
                "nodeKeys": [
                    "510.270",
                    "510.330"
                ],
                "crossWall": "480.300.540.300"
            },
            {
                "id": "570.510.570.570",
                "key": "570.510.570.570",
                "nodeKeys": [
                    "570.510",
                    "570.570"
                ],
                "crossWall": "540.540.600.540"
            },
            {
                "id": "510.570.570.570",
                "key": "510.570.570.570",
                "nodeKeys": [
                    "510.570",
                    "570.570"
                ],
                "crossWall": "540.540.540.600"
            },
            {
                "id": "450.570.510.570",
                "key": "450.570.510.570",
                "nodeKeys": [
                    "450.570",
                    "510.570"
                ],
                "crossWall": "480.540.480.600"
            },
            {
                "id": "390.570.450.570",
                "key": "390.570.450.570",
                "nodeKeys": [
                    "390.570",
                    "450.570"
                ],
                "crossWall": "420.540.420.600"
            },
            {
                "id": "330.570.390.570",
                "key": "330.570.390.570",
                "nodeKeys": [
                    "330.570",
                    "390.570"
                ],
                "crossWall": "360.540.360.600"
            },
            {
                "id": "270.570.330.570",
                "key": "270.570.330.570",
                "nodeKeys": [
                    "270.570",
                    "330.570"
                ],
                "crossWall": "300.540.300.600"
            },
            {
                "id": "210.570.270.570",
                "key": "210.570.270.570",
                "nodeKeys": [
                    "210.570",
                    "270.570"
                ],
                "crossWall": "240.540.240.600"
            },
            {
                "id": "150.570.210.570",
                "key": "150.570.210.570",
                "nodeKeys": [
                    "150.570",
                    "210.570"
                ],
                "crossWall": "180.540.180.600"
            },
            {
                "id": "150.510.150.570",
                "key": "150.510.150.570",
                "nodeKeys": [
                    "150.510",
                    "150.570"
                ],
                "crossWall": "120.540.180.540"
            },
            {
                "id": "150.450.150.510",
                "key": "150.450.150.510",
                "nodeKeys": [
                    "150.450",
                    "150.510"
                ],
                "crossWall": "120.480.180.480"
            },
            {
                "id": "150.390.150.450",
                "key": "150.390.150.450",
                "nodeKeys": [
                    "150.390",
                    "150.450"
                ],
                "crossWall": "120.420.180.420"
            },
            {
                "id": "90.390.150.390",
                "key": "90.390.150.390",
                "nodeKeys": [
                    "90.390",
                    "150.390"
                ],
                "crossWall": "120.360.120.420"
            },
            {
                "id": "90.330.90.390",
                "key": "90.330.90.390",
                "nodeKeys": [
                    "90.330",
                    "90.390"
                ],
                "crossWall": "60.360.120.360"
            },
            {
                "id": "30.330.90.330",
                "key": "30.330.90.330",
                "nodeKeys": [
                    "30.330",
                    "90.330"
                ],
                "crossWall": "60.300.60.360"
            },
            {
                "id": "30.270.30.330",
                "key": "30.270.30.330",
                "nodeKeys": [
                    "30.270",
                    "30.330"
                ],
                "crossWall": "0.300.60.300"
            },
            {
                "id": "30.210.30.270",
                "key": "30.210.30.270",
                "nodeKeys": [
                    "30.210",
                    "30.270"
                ],
                "crossWall": "0.240.60.240"
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
                "id": "90.210.90.270",
                "key": "90.210.90.270",
                "nodeKeys": [
                    "90.210",
                    "90.270"
                ],
                "crossWall": "60.240.120.240"
            },
            {
                "id": "90.270.150.270",
                "key": "90.270.150.270",
                "nodeKeys": [
                    "90.270",
                    "150.270"
                ],
                "crossWall": "120.240.120.300"
            },
            {
                "id": "150.210.150.270",
                "key": "150.210.150.270",
                "nodeKeys": [
                    "150.210",
                    "150.270"
                ],
                "crossWall": "120.240.180.240"
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
                "id": "210.150.210.210",
                "key": "210.150.210.210",
                "nodeKeys": [
                    "210.150",
                    "210.210"
                ],
                "crossWall": "180.180.240.180"
            },
            {
                "id": "210.150.270.150",
                "key": "210.150.270.150",
                "nodeKeys": [
                    "210.150",
                    "270.150"
                ],
                "crossWall": "240.120.240.180"
            },
            {
                "id": "270.150.330.150",
                "key": "270.150.330.150",
                "nodeKeys": [
                    "270.150",
                    "330.150"
                ],
                "crossWall": "300.120.300.180"
            },
            {
                "id": "330.150.330.210",
                "key": "330.150.330.210",
                "nodeKeys": [
                    "330.150",
                    "330.210"
                ],
                "crossWall": "300.180.360.180"
            },
            {
                "id": "330.210.330.270",
                "key": "330.210.330.270",
                "nodeKeys": [
                    "330.210",
                    "330.270"
                ],
                "crossWall": "300.240.360.240"
            },
            {
                "id": "270.270.330.270",
                "key": "270.270.330.270",
                "nodeKeys": [
                    "270.270",
                    "330.270"
                ],
                "crossWall": "300.240.300.300"
            },
            {
                "id": "270.210.270.270",
                "key": "270.210.270.270",
                "nodeKeys": [
                    "270.210",
                    "270.270"
                ],
                "crossWall": "240.240.300.240"
            },
            {
                "id": "270.270.270.330",
                "key": "270.270.270.330",
                "nodeKeys": [
                    "270.270",
                    "270.330"
                ],
                "crossWall": "240.300.300.300"
            },
            {
                "id": "270.330.270.390",
                "key": "270.330.270.390",
                "nodeKeys": [
                    "270.330",
                    "270.390"
                ],
                "crossWall": "240.360.300.360"
            },
            {
                "id": "270.390.330.390",
                "key": "270.390.330.390",
                "nodeKeys": [
                    "270.390",
                    "330.390"
                ],
                "crossWall": "300.360.300.420"
            },
            {
                "id": "330.330.330.390",
                "key": "330.330.330.390",
                "nodeKeys": [
                    "330.330",
                    "330.390"
                ],
                "crossWall": "300.360.360.360"
            },
            {
                "id": "330.330.390.330",
                "key": "330.330.390.330",
                "nodeKeys": [
                    "330.330",
                    "390.330"
                ],
                "crossWall": "360.300.360.360"
            },
            {
                "id": "390.270.390.330",
                "key": "390.270.390.330",
                "nodeKeys": [
                    "390.270",
                    "390.330"
                ],
                "crossWall": "360.300.420.300"
            },
            {
                "id": "390.210.390.270",
                "key": "390.210.390.270",
                "nodeKeys": [
                    "390.210",
                    "390.270"
                ],
                "crossWall": "360.240.420.240"
            },
            {
                "id": "390.330.390.390",
                "key": "390.330.390.390",
                "nodeKeys": [
                    "390.330",
                    "390.390"
                ],
                "crossWall": "360.360.420.360"
            },
            {
                "id": "390.390.390.450",
                "key": "390.390.390.450",
                "nodeKeys": [
                    "390.390",
                    "390.450"
                ],
                "crossWall": "360.420.420.420"
            },
            {
                "id": "390.450.390.510",
                "key": "390.450.390.510",
                "nodeKeys": [
                    "390.450",
                    "390.510"
                ],
                "crossWall": "360.480.420.480"
            },
            {
                "id": "390.510.450.510",
                "key": "390.510.450.510",
                "nodeKeys": [
                    "390.510",
                    "450.510"
                ],
                "crossWall": "420.480.420.540"
            },
            {
                "id": "450.450.450.510",
                "key": "450.450.450.510",
                "nodeKeys": [
                    "450.450",
                    "450.510"
                ],
                "crossWall": "420.480.480.480"
            },
            {
                "id": "330.510.390.510",
                "key": "330.510.390.510",
                "nodeKeys": [
                    "330.510",
                    "390.510"
                ],
                "crossWall": "360.480.360.540"
            },
            {
                "id": "330.450.330.510",
                "key": "330.450.330.510",
                "nodeKeys": [
                    "330.450",
                    "330.510"
                ],
                "crossWall": "300.480.360.480"
            },
            {
                "id": "270.450.330.450",
                "key": "270.450.330.450",
                "nodeKeys": [
                    "270.450",
                    "330.450"
                ],
                "crossWall": "300.420.300.480"
            },
            {
                "id": "270.450.270.510",
                "key": "270.450.270.510",
                "nodeKeys": [
                    "270.450",
                    "270.510"
                ],
                "crossWall": "240.480.300.480"
            },
            {
                "id": "210.510.270.510",
                "key": "210.510.270.510",
                "nodeKeys": [
                    "210.510",
                    "270.510"
                ],
                "crossWall": "240.480.240.540"
            },
            {
                "id": "210.450.210.510",
                "key": "210.450.210.510",
                "nodeKeys": [
                    "210.450",
                    "210.510"
                ],
                "crossWall": "180.480.240.480"
            },
            {
                "id": "210.390.210.450",
                "key": "210.390.210.450",
                "nodeKeys": [
                    "210.390",
                    "210.450"
                ],
                "crossWall": "180.420.240.420"
            },
            {
                "id": "210.330.210.390",
                "key": "210.330.210.390",
                "nodeKeys": [
                    "210.330",
                    "210.390"
                ],
                "crossWall": "180.360.240.360"
            },
            {
                "id": "210.270.210.330",
                "key": "210.270.210.330",
                "nodeKeys": [
                    "210.270",
                    "210.330"
                ],
                "crossWall": "180.300.240.300"
            },
            {
                "id": "150.330.210.330",
                "key": "150.330.210.330",
                "nodeKeys": [
                    "150.330",
                    "210.330"
                ],
                "crossWall": "180.300.180.360"
            },
            {
                "id": "150.150.210.150",
                "key": "150.150.210.150",
                "nodeKeys": [
                    "150.150",
                    "210.150"
                ],
                "crossWall": "180.120.180.180"
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
                "id": "30.330.30.390",
                "key": "30.330.30.390",
                "nodeKeys": [
                    "30.330",
                    "30.390"
                ],
                "crossWall": "0.360.60.360"
            },
            {
                "id": "30.390.30.450",
                "key": "30.390.30.450",
                "nodeKeys": [
                    "30.390",
                    "30.450"
                ],
                "crossWall": "0.420.60.420"
            },
            {
                "id": "30.450.30.510",
                "key": "30.450.30.510",
                "nodeKeys": [
                    "30.450",
                    "30.510"
                ],
                "crossWall": "0.480.60.480"
            },
            {
                "id": "30.510.90.510",
                "key": "30.510.90.510",
                "nodeKeys": [
                    "30.510",
                    "90.510"
                ],
                "crossWall": "60.480.60.540"
            },
            {
                "id": "90.450.90.510",
                "key": "90.450.90.510",
                "nodeKeys": [
                    "90.450",
                    "90.510"
                ],
                "crossWall": "60.480.120.480"
            },
            {
                "id": "90.510.90.570",
                "key": "90.510.90.570",
                "nodeKeys": [
                    "90.510",
                    "90.570"
                ],
                "crossWall": "60.540.120.540"
            },
            {
                "id": "30.570.90.570",
                "key": "30.570.90.570",
                "nodeKeys": [
                    "30.570",
                    "90.570"
                ],
                "crossWall": "60.540.60.600"
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
                "id": "60.60.60.120",
                "x1": 60,
                "y1": 60,
                "x2": 60,
                "y2": 120
            },
            {
                "id": "60.240.60.300",
                "x1": 60,
                "y1": 240,
                "x2": 60,
                "y2": 300
            },
            {
                "id": "60.360.60.420",
                "x1": 60,
                "y1": 360,
                "x2": 60,
                "y2": 420
            },
            {
                "id": "60.420.60.480",
                "x1": 60,
                "y1": 420,
                "x2": 60,
                "y2": 480
            },
            {
                "id": "120.60.120.120",
                "x1": 120,
                "y1": 60,
                "x2": 120,
                "y2": 120
            },
            {
                "id": "120.120.120.180",
                "x1": 120,
                "y1": 120,
                "x2": 120,
                "y2": 180
            },
            {
                "id": "120.180.120.240",
                "x1": 120,
                "y1": 180,
                "x2": 120,
                "y2": 240
            },
            {
                "id": "120.300.120.360",
                "x1": 120,
                "y1": 300,
                "x2": 120,
                "y2": 360
            },
            {
                "id": "120.420.120.480",
                "x1": 120,
                "y1": 420,
                "x2": 120,
                "y2": 480
            },
            {
                "id": "120.480.120.540",
                "x1": 120,
                "y1": 480,
                "x2": 120,
                "y2": 540
            },
            {
                "id": "120.540.120.600",
                "x1": 120,
                "y1": 540,
                "x2": 120,
                "y2": 600
            },
            {
                "id": "180.60.180.120",
                "x1": 180,
                "y1": 60,
                "x2": 180,
                "y2": 120
            },
            {
                "id": "180.240.180.300",
                "x1": 180,
                "y1": 240,
                "x2": 180,
                "y2": 300
            },
            {
                "id": "180.360.180.420",
                "x1": 180,
                "y1": 360,
                "x2": 180,
                "y2": 420
            },
            {
                "id": "180.420.180.480",
                "x1": 180,
                "y1": 420,
                "x2": 180,
                "y2": 480
            },
            {
                "id": "180.480.180.540",
                "x1": 180,
                "y1": 480,
                "x2": 180,
                "y2": 540
            },
            {
                "id": "240.0.240.60",
                "x1": 240,
                "y1": 0,
                "x2": 240,
                "y2": 60
            },
            {
                "id": "240.180.240.240",
                "x1": 240,
                "y1": 180,
                "x2": 240,
                "y2": 240
            },
            {
                "id": "240.240.240.300",
                "x1": 240,
                "y1": 240,
                "x2": 240,
                "y2": 300
            },
            {
                "id": "240.300.240.360",
                "x1": 240,
                "y1": 300,
                "x2": 240,
                "y2": 360
            },
            {
                "id": "240.360.240.420",
                "x1": 240,
                "y1": 360,
                "x2": 240,
                "y2": 420
            },
            {
                "id": "240.420.240.480",
                "x1": 240,
                "y1": 420,
                "x2": 240,
                "y2": 480
            },
            {
                "id": "300.60.300.120",
                "x1": 300,
                "y1": 60,
                "x2": 300,
                "y2": 120
            },
            {
                "id": "300.180.300.240",
                "x1": 300,
                "y1": 180,
                "x2": 300,
                "y2": 240
            },
            {
                "id": "300.300.300.360",
                "x1": 300,
                "y1": 300,
                "x2": 300,
                "y2": 360
            },
            {
                "id": "300.480.300.540",
                "x1": 300,
                "y1": 480,
                "x2": 300,
                "y2": 540
            },
            {
                "id": "360.0.360.60",
                "x1": 360,
                "y1": 0,
                "x2": 360,
                "y2": 60
            },
            {
                "id": "360.120.360.180",
                "x1": 360,
                "y1": 120,
                "x2": 360,
                "y2": 180
            },
            {
                "id": "360.180.360.240",
                "x1": 360,
                "y1": 180,
                "x2": 360,
                "y2": 240
            },
            {
                "id": "360.240.360.300",
                "x1": 360,
                "y1": 240,
                "x2": 360,
                "y2": 300
            },
            {
                "id": "360.360.360.420",
                "x1": 360,
                "y1": 360,
                "x2": 360,
                "y2": 420
            },
            {
                "id": "360.420.360.480",
                "x1": 360,
                "y1": 420,
                "x2": 360,
                "y2": 480
            },
            {
                "id": "420.60.420.120",
                "x1": 420,
                "y1": 60,
                "x2": 420,
                "y2": 120
            },
            {
                "id": "420.180.420.240",
                "x1": 420,
                "y1": 180,
                "x2": 420,
                "y2": 240
            },
            {
                "id": "420.240.420.300",
                "x1": 420,
                "y1": 240,
                "x2": 420,
                "y2": 300
            },
            {
                "id": "420.300.420.360",
                "x1": 420,
                "y1": 300,
                "x2": 420,
                "y2": 360
            },
            {
                "id": "420.360.420.420",
                "x1": 420,
                "y1": 360,
                "x2": 420,
                "y2": 420
            },
            {
                "id": "420.420.420.480",
                "x1": 420,
                "y1": 420,
                "x2": 420,
                "y2": 480
            },
            {
                "id": "480.60.480.120",
                "x1": 480,
                "y1": 60,
                "x2": 480,
                "y2": 120
            },
            {
                "id": "480.120.480.180",
                "x1": 480,
                "y1": 120,
                "x2": 480,
                "y2": 180
            },
            {
                "id": "480.180.480.240",
                "x1": 480,
                "y1": 180,
                "x2": 480,
                "y2": 240
            },
            {
                "id": "480.240.480.300",
                "x1": 480,
                "y1": 240,
                "x2": 480,
                "y2": 300
            },
            {
                "id": "480.300.480.360",
                "x1": 480,
                "y1": 300,
                "x2": 480,
                "y2": 360
            },
            {
                "id": "480.420.480.480",
                "x1": 480,
                "y1": 420,
                "x2": 480,
                "y2": 480
            },
            {
                "id": "480.480.480.540",
                "x1": 480,
                "y1": 480,
                "x2": 480,
                "y2": 540
            },
            {
                "id": "540.300.540.360",
                "x1": 540,
                "y1": 300,
                "x2": 540,
                "y2": 360
            },
            {
                "id": "540.360.540.420",
                "x1": 540,
                "y1": 360,
                "x2": 540,
                "y2": 420
            },
            {
                "id": "540.420.540.480",
                "x1": 540,
                "y1": 420,
                "x2": 540,
                "y2": 480
            },
            {
                "id": "120.60.180.60",
                "x1": 120,
                "y1": 60,
                "x2": 180,
                "y2": 60
            },
            {
                "id": "360.60.420.60",
                "x1": 360,
                "y1": 60,
                "x2": 420,
                "y2": 60
            },
            {
                "id": "480.60.540.60",
                "x1": 480,
                "y1": 60,
                "x2": 540,
                "y2": 60
            },
            {
                "id": "180.120.240.120",
                "x1": 180,
                "y1": 120,
                "x2": 240,
                "y2": 120
            },
            {
                "id": "240.120.300.120",
                "x1": 240,
                "y1": 120,
                "x2": 300,
                "y2": 120
            },
            {
                "id": "300.120.360.120",
                "x1": 300,
                "y1": 120,
                "x2": 360,
                "y2": 120
            },
            {
                "id": "420.120.480.120",
                "x1": 420,
                "y1": 120,
                "x2": 480,
                "y2": 120
            },
            {
                "id": "540.120.600.120",
                "x1": 540,
                "y1": 120,
                "x2": 600,
                "y2": 120
            },
            {
                "id": "0.180.60.180",
                "x1": 0,
                "y1": 180,
                "x2": 60,
                "y2": 180
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
            },
            {
                "id": "240.180.300.180",
                "x1": 240,
                "y1": 180,
                "x2": 300,
                "y2": 180
            },
            {
                "id": "360.180.420.180",
                "x1": 360,
                "y1": 180,
                "x2": 420,
                "y2": 180
            },
            {
                "id": "480.180.540.180",
                "x1": 480,
                "y1": 180,
                "x2": 540,
                "y2": 180
            },
            {
                "id": "180.240.240.240",
                "x1": 180,
                "y1": 240,
                "x2": 240,
                "y2": 240
            },
            {
                "id": "540.240.600.240",
                "x1": 540,
                "y1": 240,
                "x2": 600,
                "y2": 240
            },
            {
                "id": "60.300.120.300",
                "x1": 60,
                "y1": 300,
                "x2": 120,
                "y2": 300
            },
            {
                "id": "120.300.180.300",
                "x1": 120,
                "y1": 300,
                "x2": 180,
                "y2": 300
            },
            {
                "id": "300.300.360.300",
                "x1": 300,
                "y1": 300,
                "x2": 360,
                "y2": 300
            },
            {
                "id": "120.360.180.360",
                "x1": 120,
                "y1": 360,
                "x2": 180,
                "y2": 360
            },
            {
                "id": "480.360.540.360",
                "x1": 480,
                "y1": 360,
                "x2": 540,
                "y2": 360
            },
            {
                "id": "60.420.120.420",
                "x1": 60,
                "y1": 420,
                "x2": 120,
                "y2": 420
            },
            {
                "id": "240.420.300.420",
                "x1": 240,
                "y1": 420,
                "x2": 300,
                "y2": 420
            },
            {
                "id": "300.420.360.420",
                "x1": 300,
                "y1": 420,
                "x2": 360,
                "y2": 420
            },
            {
                "id": "420.420.480.420",
                "x1": 420,
                "y1": 420,
                "x2": 480,
                "y2": 420
            },
            {
                "id": "0.540.60.540",
                "x1": 0,
                "y1": 540,
                "x2": 60,
                "y2": 540
            },
            {
                "id": "180.540.240.540",
                "x1": 180,
                "y1": 540,
                "x2": 240,
                "y2": 540
            },
            {
                "id": "240.540.300.540",
                "x1": 240,
                "y1": 540,
                "x2": 300,
                "y2": 540
            },
            {
                "id": "300.540.360.540",
                "x1": 300,
                "y1": 540,
                "x2": 360,
                "y2": 540
            },
            {
                "id": "360.540.420.540",
                "x1": 360,
                "y1": 540,
                "x2": 420,
                "y2": 540
            },
            {
                "id": "420.540.480.540",
                "x1": 420,
                "y1": 540,
                "x2": 480,
                "y2": 540
            },
            {
                "id": "480.540.540.540",
                "x1": 480,
                "y1": 540,
                "x2": 540,
                "y2": 540
            }
        ],
        "inactiveWallKeys": [
            "0.60.60.60",
            "0.120.60.120",
            "60.120.60.180",
            "60.120.120.120",
            "60.60.120.60",
            "120.0.120.60",
            "180.0.180.60",
            "180.60.240.60",
            "240.60.240.120",
            "240.60.300.60",
            "300.0.300.60",
            "300.60.360.60",
            "360.60.360.120",
            "360.120.420.120",
            "420.120.420.180",
            "420.180.480.180",
            "420.240.480.240",
            "420.300.480.300",
            "420.360.480.360",
            "480.360.480.420",
            "480.420.540.420",
            "480.480.540.480",
            "540.480.540.540",
            "540.480.600.480",
            "540.420.600.420",
            "540.360.600.360",
            "540.300.600.300",
            "540.240.540.300",
            "480.240.540.240",
            "540.180.540.240",
            "540.180.600.180",
            "540.120.540.180",
            "480.120.540.120",
            "540.60.540.120",
            "540.60.600.60",
            "540.0.540.60",
            "480.0.480.60",
            "420.0.420.60",
            "420.60.480.60",
            "480.300.540.300",
            "540.540.600.540",
            "540.540.540.600",
            "480.540.480.600",
            "420.540.420.600",
            "360.540.360.600",
            "300.540.300.600",
            "240.540.240.600",
            "180.540.180.600",
            "120.540.180.540",
            "120.480.180.480",
            "120.420.180.420",
            "120.360.120.420",
            "60.360.120.360",
            "60.300.60.360",
            "0.300.60.300",
            "0.240.60.240",
            "60.180.60.240",
            "60.240.120.240",
            "120.240.120.300",
            "120.240.180.240",
            "180.180.180.240",
            "180.180.240.180",
            "240.120.240.180",
            "300.120.300.180",
            "300.180.360.180",
            "300.240.360.240",
            "300.240.300.300",
            "240.240.300.240",
            "240.300.300.300",
            "240.360.300.360",
            "300.360.300.420",
            "300.360.360.360",
            "360.300.360.360",
            "360.300.420.300",
            "360.240.420.240",
            "360.360.420.360",
            "360.420.420.420",
            "360.480.420.480",
            "420.480.420.540",
            "420.480.480.480",
            "360.480.360.540",
            "300.480.360.480",
            "300.420.300.480",
            "240.480.300.480",
            "240.480.240.540",
            "180.480.240.480",
            "180.420.240.420",
            "180.360.240.360",
            "180.300.240.300",
            "180.300.180.360",
            "180.120.180.180",
            "120.120.180.120",
            "0.360.60.360",
            "0.420.60.420",
            "0.480.60.480",
            "60.480.60.540",
            "60.480.120.480",
            "60.540.120.540",
            "60.540.60.600"
        ],
        "destination": {
            "x": 150,
            "y": 330
        },
        "serialized": "h=79db95624c8b999dc55c61c5dd97516586555d55962898aaa8&c=10&r=10&l=1&dx=150&dy=330&s=60",
        "level": 1
    }
}


