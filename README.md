# Maze Racer

Maze Racer is a TypeScript and Next.js maze game. It was created by Nathan Marder, 
of Portland Oregon. AI agents were used to help with code-reviews and with writing 
some of the tests - but the game mechanics, codec, and algorithm implementations 
were hand-crafted by yours truly. The idea behind this is to push the boundaries of
what is 'possible' within the context of a modern React-app. The game feels fluid
and snappy because of the careful attention that has been paid to state-management.
Please pull this down, open up sandbox, and see for yourself.

## Engineering Highlights

- **Canonical MazeCodec** — serializes an entire generated maze into a compact,
  versioned hexadecimal identity suitable for URLs and database keys. The real
  innovation here is a stable, deterministic representation for an entire
  procedural puzzle. See the [codec's readme](./src/maze/codec/codec.md)
  for more detailed information regarding its architecture and purpose.
- **Presentation-independent coordinates** — maze identity uses zero-based grid
  coordinates rather than SVG pixels, so changing visual spacing does not
  change the maze.
- **Deterministic round trips** — encoded mazes reconstruct the same topology,
  start, and destination, with tests protecting codec invariants.
- **Multiple generation algorithms** — depth-first search, randomized Prim, and
  Eller engines share the same inputs and outputs.
- **GraphQL generation boundary** — browser clients request mazes by algorithm
  and dimensions without importing or coordinating the generation engines.
  Generation happens behind the GraphQL API, which returns a canonical maze ID
  for the client to decode and render with its own presentation settings. See the
  [GraphQL specification](./GraphQL-SPEC.md) for the query contract and sandbox
  integration lifecycle.
- **Interactive SVG gameplay** — keyboard controls, wall collision detection,
  and GSAP-powered player and completion animations.
- **Modern TypeScript stack** — Next.js App Router, Turbopack, and Vitest.

## Run the sandbox page locally

The sandbox page is the fastest way for contributors to generate mazes, exercise
the different algorithms, and inspect encoded maze data.

### Requirements

- [Git](https://git-scm.com/)
- Node.js 20.9 or newer
- npm (included with Node.js)

No database, API keys, or environment variables are currently required.

### 1. Download the repository

Clone it with HTTPS:

```bash
git clone https://github.com/NateMarder/Maze-Racer.git
cd Maze-Racer
```

Alternatively, choose **Code → Download ZIP** on the GitHub repository, extract
the archive, and open a terminal in the extracted `Maze-Racer` directory.

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000/sandbox](http://localhost:3000/sandbox) in a browser. If
port 3000 is unavailable, use the local URL printed by Next.js and append
`/sandbox`.

Stop the development server with <kbd>Ctrl</kbd>+<kbd>C</kbd>.

### Using the sandbox page

- Move the player with the arrow keys or <kbd>W</kbd>, <kbd>A</kbd>,
  <kbd>S</kbd>, and <kbd>D</kbd>.
- On an initial visit without maze data in the URL, the sandbox requests a
  randomly selected DFS, Prim, or Eller maze using the default 12×12 dimensions.
- Use the form to select an algorithm and choose between 3 and 20 rows and
  columns. Changing a field does not generate anything; select **refresh** to
  request and render a new maze.
- After a maze renders successfully, the sandbox updates the browser URL with
  its canonical maze ID and presentation spacing. Reloading or sharing that URL
  reconstructs the same maze locally without another GraphQL request.
- When opening maze data from a URL, the form reflects its row and column counts
  and leaves the algorithm at **Select algorithm**, because the canonical ID
  describes the maze rather than the algorithm that generated it.
- If generation fails, the existing maze and shareable URL remain unchanged and
  the sandbox displays an alert.
- Select **print state** and open the browser developer console to inspect the
  current `MazeState`.

## Useful development commands

```bash
npm run dev            # Start the local development server
npm run test:run       # Run the test suite once
npm run test:coverage  # Run tests and generate a coverage report
npm run lint           # Check the code with ESLint
npm run build          # Create a production build
npm run start          # Run an existing production build
```

## Maze generation

The project currently supports three perfect-maze generators:

- Depth-first search — long, winding corridors and shorter dead ends
- Randomized Prim — many short branches and frequent turns
- Eller — row-by-row generation with horizontal and vertical set merging

Each generator accepts the same `MazeState` input and returns the wall keys to
remove plus the destination node farthest from the start.

## MazeCodec

MazeCodec serializes a generated maze into a versioned canonical identifier
that can be embedded in a URL. The decoder reconstructs the same maze from that
data, allowing deterministic sharing without requiring server-side persistence.
This representation is also the foundation for the planned Maze of the Day
catalog.

![Small maze example](./docs/images/small-maze.png)

The canonical identifier for this maze is:

```text
v1:4x4:69a9dc28:start=0,0:end=0,3
```

| Segment | Meaning |
| --- | --- |
| `v1` | Canonical format version |
| `4x4` | Column and row count |
| `69a9dc28` | Hexadecimal maze topology |
| `start=0,0` | Zero-based logical start coordinate |
| `end=0,3` | Zero-based logical destination coordinate |

Logical coordinates make maze identity independent of SVG dimensions and node
spacing. Presentation settings such as `spacing` travel separately in the URL
and are not part of the canonical identifier. Existing unversioned maze URLs
remain readable and are migrated to v1 the next time they are encoded.

## Current features

- Procedural maze generation using multiple graph algorithms
- Compact URL-safe maze encoding and deterministic decoding
- GSAP-powered player and completion animations
- Keyboard navigation with wall collision detection
- Round-trip codec and engine invariant tests with Vitest
- Next.js App Router and Turbopack development

## Screenshot

![Large maze example](./docs/images/large-maze.png)

## Project direction

The planned community experience includes:

- One shared Maze of the Day challenge
- A persistent database of encoded mazes
- Timed global competition on identical maze layouts
- Daily results and recognition for each maze's Maze Master

Ideas, bug reports, and contributions that move the project toward that
experience are welcome.
