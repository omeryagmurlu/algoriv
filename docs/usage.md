# Usage Manual

There is a main visualization area, 2 sidebars and some controls in the algorithm views. Clicking on their handles opens sidebars. Animation controls consist of: back-to-beginning, one-step-back, pause/start/restart, one-step-forward, to-end and a speed slider to control animation speed. Necessary input is to be supplied upon clicking on the start button, which prompts for these inputs. Main area and sidebars consist of modules, which can be customized or toggled on/off in settings. The app has multiple themes to choose from.

## Algorithms View

In this screen there are predefined algorithms. Each algorithm has its input customized specifically for it.

## Usage of modules

Most modules are static, meaning that they don't support interactions, they are only visual. Interactive modules are:

* Graph module
* Examples module

### Graph module

Graph used in the visualization can be changed by ctrl-clicking on the graph. To add an edge ctrl-click on two nodes consequently. To add a node ctrl-click on the stage, to remove one ctrl-alt-click. If the graph is weighted, then a modal asks for weight when you add an edge. If a node/edge cannot be removed/added because of reasons, an info message pops up, informing the user of these reasons. Graph module, by default, features colors and animations to visualize graphs better.

### Examples module

Examples and Custom Input module is found by default on the left sidebar. Users have the ability to select from multiple examples which are fine tuned for the algorithm, or can save their own customized input and use it. Users can later delete or rename these inputs. Custom inputs are persistent and will stay after application exits.

Options for this module:

* Purge custom inputs: removes all custom inputs

## Custom Code View

Users have the ability to write their own algorithms and have them visualized. Algorithm's logic must be entered in the text editor that greets the user as they enter the view. On the left sidebar users can save their Algorithm and later open it again. On the right sidebar there is a form for Algorithm info and 2 buttons, Run and Visualize. As users write their logic, app evaluates it and checks for errors. Found errors are displayed in a red box on the right sidebar. Via Run button users can run their code, without visualizing it. Debug Bindings are also enabled in run mode. If the logic takes too long or ends up in an infinite loop, it is terminated after a configurable duration of time.

ECMAScript 5 is fully and ECMAScript 6 is partially supported. ECMAScript 6 syntax is [fully available][1]. Code is [interpreted in a sandbox][2] and there are some injected variables to it.

Used text editor is Ace Editor, you can find it's [default keyboard shotcuts here][3].

### Injected Variables

#### Visualization API

| Name | Type | Description | Parameters |
| --- | --- | --- | --- |
| `frame` | function | used to 'snapshot' current state of `Algorithm` as a step | `none` |
| `Algorithm` | object | Visualization API populated depending on configuration | - |
| `Algorithm.code` | function | used to highlight lines in pseudo-code | `lines`: array of integers |
| `Algorithm.explanation` | function | used to inform user about current state of algorithm | `text`: string |
| `Algorithm[name]` where name is a Table name | function | used to update Table's data | `data`: array `rows` of array `columns` |
| `Algorithm[name]` where name is a Text name | function | **used to update Text's text** | `text`: string |
| `Algorithm[type]` where type is Algorithm's type | object | Collection of functions for Algorithm's type | - |
| `Algorithm[type = graph]` | object | Collection of methods to operate on the graph | - |
| `Algorithm[type = graph].setColor` | function | set color of nodes and edges based on indexes [0-360) | `colorIndex`: number, `nodes`: array of [node keys][4], `edges`: array of [edge keys][4] |
| `Algorithm[type = graph].setGlyphs` | function | set glyphs of nodes to strings | `glyphs`: shape{[key: [node key][4]]: value: string}, `position`: number [0; 4) (default: 0) |
| `Algorithm[type = graph].setOverrideGraph` | function | change viewed graph, doesn't affect the input (useful for reversing etc.) | `graph`: [serialized graph][4] |

#### Inputs

| Name | Type | Description |
| --- | --- | --- |
| `input[type]` where type is Algorithm's type | any | Algorithm's main input |
| `input[typeFeature]` where typeFeature is specified type feature ids | any | Toggled additional input for type |
| `input[type = graph]` | [serialized graph][4] | Graph |
| `input[type = graph].startVertex` | [node key][4] | Starting node for the algorithm |

#### Debug Bindings

| Name | Type | Description | Parameters | Returns |
| --- | --- | --- | --- | --- |
| `log` | function | logs params to the console on the right sidebar | ...any | `none` |

#### Others

| Name | Type | Description |
| --- | --- | --- |
| `Structures` | [Buckets-JS][5] | Buckets-JS Data Structures library |
| `buckets` | [Buckets-JS][5] | alias of `Structures` |

## Options

* Theme
* Algorithm speed
* Minimal Colored Visualizations: whether or not to use color in Visualizations
* Animations: are animations enabled
* Timeout for Custom Code

[1]: https://babeljs.io/ (Babel)
[2]: https://github.com/NeilFraser/JS-Interpreter (JS-Interpreter)
[3]: https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts (Ace Keyboard Shortcuts)
[4]: https://graphology.github.io/ (Graphology)
[5]: https://github.com/mauriciosantos/Buckets-JS (Buckets-JS)
