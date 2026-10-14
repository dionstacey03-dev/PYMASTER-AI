/* Deterministic learning tools. No AI calls and no trusted assessment credit. */
(function(root) {
  'use strict';
  const prerequisites = [[],[0],[1],[2],[1],[2,3],[1],[1],[4,6],[4],[3,4],[2],[4,5],[5],[2,7],[13,14],[8,15],[13],[5,8],[18],[3,5],[12],[5,13,14],[4,5],[13,16],[8,14],[8,15],[5,14],[13,14],[16,24,26,28]];
  const goals = {
    beginner: {label:'Python beginner',targets:[0,1,2,3,4,5,6,7,8,9,10,11,12],project:'Build a calculator with input validation and three tests.'},
    backend: {label:'Backend developer',targets:[16,22,25,26,28,29],project:'Extend the task tracker with SQLite storage and test save/load behavior.'},
    ai: {label:'AI engineer',targets:[10,16,23,24,25,28],project:'Build a tested data-preparation script before choosing a model library.',gap:'Model training, AI libraries and provider integration are not in the current course; this roadmap prepares their Python prerequisites.'},
    machine_learning: {label:'Machine learning engineer',targets:[7,8,10,16,23,24,28],project:'Create a reproducible data-cleaning pipeline with tests.',gap:'Machine learning and numerical-library lessons remain planned. This is a Python preparation path.'},
    data: {label:'Data analyst',targets:[7,8,10,15,16,23,26],project:'Read a JSON dataset, summarize its numeric fields, and test edge cases.',gap:'NumPy, Pandas and visualization lessons are not yet available.'},
    automation: {label:'Automation developer',targets:[13,14,15,17,22,25,28],project:'Build a file organizer with a dry-run mode and isolated temporary-folder tests.'},
    software: {label:'Software engineer',targets:Array.from({length:30},(_,i)=>i),project:'Finish the task-tracker capstone with validation, persistence, tests and documentation.'},
    vision: {label:'Computer vision developer',targets:[7,10,16,23,24,28],project:'Practice loading and validating structured metadata before adding image libraries.',gap:'Image-processing and computer-vision modules are not implemented. This is a foundation path, not a computer-vision qualification.'}
  };
  function orderTargets(targets, graph=prerequisites) {
    const ordered=[],visiting=new Set(),done=new Set();
    function visit(id) {
      if(!Number.isInteger(id)||id<0||id>=graph.length)throw Error('Invalid lesson reference');
      if(visiting.has(id))throw Error('Prerequisite cycle');
      if(done.has(id))return;
      visiting.add(id);for(const prerequisite of graph[id])visit(prerequisite);visiting.delete(id);done.add(id);ordered.push(id);
    }
    targets.forEach(visit);return ordered;
  }
  function buildRoadmap(options, completed=[], today=new Date()) {
    if(!Object.hasOwn(goals,options.goal))throw Error('Choose a supported learning goal.');
    const minutes=Number(options.minutes);
    if(!Number.isFinite(minutes)||minutes<15||minutes>1200)throw Error('Study time must be between 15 and 1200 minutes per week.');
    if(!['new','some','experienced'].includes(options.skill))throw Error('Choose your current experience level.');
    if(!['examples','reading','practice'].includes(options.style))throw Error('Choose a learning style.');
    const done=new Set(completed.filter(id=>Number.isInteger(id)&&id>=0&&id<prerequisites.length));
    const goal=goals[options.goal],all=orderTargets(goal.targets),remaining=all.filter(id=>!done.has(id));
    // Planning estimates only: each lesson includes example exploration and practice.
    const estimate=options.skill==='experienced'?25:options.skill==='some'?35:45;
    const weeks=[];let week=[],used=0;
    for(const id of remaining){let left=estimate,part=1;while(left>0){const allocation=Math.min(left,minutes-used);week.push({id,minutes:allocation,part,finish:allocation===left});used+=allocation;left-=allocation;part++;if(used>=minutes){weeks.push(week);week=[];used=0;}}}if(week.length)weeks.push(week);
    const totalMinutes=remaining.length*estimate;
    const estimatedWeeks=weeks.length;
    let deadlineWarning='';
    if(options.deadline){if(!/^\d{4}-\d{2}-\d{2}$/.test(options.deadline))throw Error('Choose a valid target date.');const target=new Date(options.deadline+'T23:59:59');if(Number.isNaN(target.getTime())||[target.getFullYear(),String(target.getMonth()+1).padStart(2,'0'),String(target.getDate()).padStart(2,'0')].join('-')!==options.deadline||target<today)throw Error('Choose a target date today or later.');const available=Math.max(1,Math.ceil((target-today)/(7*24*60*60*1000)));if(estimatedWeeks>available)deadlineWarning='Your target date is shorter than this estimate. Increase weekly time or allow more weeks.';}
    return {version:1,options:{goal:options.goal,minutes,skill:options.skill,style:options.style,deadline:options.deadline||''},all,remaining,weeks,totalMinutes,estimatedWeeks,estimate,deadlineWarning,goal,lowBudget:minutes<estimate};
  }
  function readCompanion(raw, now=Date.now()) {
    if(!raw||raw.optIn!==true||!Number.isFinite(raw.updatedAt)||![7,30,90].includes(raw.retentionDays)||now-raw.updatedAt>raw.retentionDays*86400000)return null;
    if(typeof raw.goal!=='string'||raw.goal.length>300||typeof raw.preference!=='string'||raw.preference.length>300)return null;
    return {version:1,optIn:true,goal:raw.goal,preference:raw.preference,retentionDays:raw.retentionDays,updatedAt:raw.updatedAt};
  }
  const comparisons = [
  {
    "id": "list-tuple",
    "title": "List vs Tuple",
    "left": "List",
    "right": "Tuple",
    "explanation": "Both keep items in order and allow duplicates. A list can change; a tuple cannot have its item references reassigned. A tuple can still contain mutable objects.",
    "differences": [
      "Choose a list for a collection that grows or changes.",
      "Choose a tuple for a fixed grouping such as coordinates.",
      "Immutability does not automatically make a tuple hashable: its elements must also be hashable."
    ],
    "leftCode": "items = [1, 2]\nitems.append(3)\nprint(items)",
    "leftOutput": "[1, 2, 3]",
    "rightCode": "point = (3, 4)\nx, y = point\nprint(x + y)",
    "rightOutput": "7",
    "question": "Which collection can append an item?",
    "options": [
      "List",
      "Tuple"
    ],
    "answer": 0,
    "reason": "append() is a list method; tuples do not support item insertion.",
    "mistake": "Trying point[0] = 5 raises TypeError.",
    "lesson": 9
  },
  {
    "id": "set-dict",
    "title": "Set vs Dictionary",
    "left": "Set",
    "right": "Dictionary",
    "explanation": "A set holds distinct values. A dictionary associates unique keys with values. Both require hashable members or keys. Dictionary insertion order is preserved; set iteration order is not guaranteed.",
    "differences": [
      "Use sets for membership checks, intersections and deduplication.",
      "Use dictionaries for named fields or lookup tables.",
      "{} creates an empty dictionary; use set() for an empty set."
    ],
    "leftCode": "tags = {\"python\", \"python\", \"git\"}\nprint(sorted(tags))",
    "leftOutput": "['git', 'python']",
    "rightCode": "scores = {\"Ada\": 95}\nprint(scores[\"Ada\"])",
    "rightOutput": "95",
    "question": "Which structure maps names to scores?",
    "options": [
      "Set",
      "Dictionary"
    ],
    "answer": 1,
    "reason": "A dictionary maps a key such as a name to its score.",
    "mistake": "Confusing {} with an empty set leads to missing set methods.",
    "lesson": 8
  },
  {
    "id": "for-while",
    "title": "For Loop vs While Loop",
    "left": "For loop",
    "right": "While loop",
    "explanation": "for iterates over an iterable. while repeats while a condition stays true. Choose the loop that makes the stopping rule clear.",
    "differences": [
      "Use for when processing known items or a range.",
      "Use while when repetition depends on changing state.",
      "A while loop needs a path that eventually makes its condition false or breaks."
    ],
    "leftCode": "for n in range(3):\n    print(n)",
    "leftOutput": "0\n1\n2",
    "rightCode": "remaining = 3\nwhile remaining > 0:\n    print(remaining)\n    remaining -= 1",
    "rightOutput": "3\n2\n1",
    "question": "Which loop naturally visits every item in a list?",
    "options": [
      "For loop",
      "While loop"
    ],
    "answer": 0,
    "reason": "for directly consumes the list iterator.",
    "mistake": "Forgetting to update a while condition can create an infinite loop.",
    "lesson": 11
  },
  {
    "id": "function-method",
    "title": "Function vs Method",
    "left": "Function",
    "right": "Method",
    "explanation": "A function is a callable defined independently. An instance method is accessed through an object and receives that instance as self. Static and class methods have different binding rules.",
    "differences": [
      "Use functions for independent transformations.",
      "Use methods for behavior related to an object’s state.",
      "A bound instance method receives self automatically."
    ],
    "leftCode": "def double(n):\n    return n * 2\nprint(double(4))",
    "leftOutput": "8",
    "rightCode": "class Counter:\n    def __init__(self):\n        self.value = 4\n    def double(self):\n        return self.value * 2\nprint(Counter().double())",
    "rightOutput": "8",
    "question": "Which receives the instance as self?",
    "options": [
      "A standalone function automatically",
      "A bound instance method"
    ],
    "answer": 1,
    "reason": "Binding supplies the object to the instance method.",
    "mistake": "Omitting self from an ordinary instance method gives argument-count errors.",
    "lesson": 18
  },
  {
    "id": "class-object",
    "title": "Class vs Object",
    "left": "Class",
    "right": "Object",
    "explanation": "A class defines a type and its behavior. Calling it typically constructs an instance object. Classes themselves are also Python objects, so “blueprint vs instance” is a useful simplified teaching model.",
    "differences": [
      "Define behavior once in a class.",
      "Each instance can hold independent state.",
      "Avoid putting per-instance mutable state in class attributes."
    ],
    "leftCode": "class Learner:\n    subject = \"Python\"\nprint(Learner.subject)",
    "leftOutput": "Python",
    "rightCode": "class Learner:\n    def __init__(self, name):\n        self.name = name\nprint(Learner(\"Ada\").name)",
    "rightOutput": "Ada",
    "question": "Which expression constructs a Learner instance?",
    "options": [
      "Learner(\"Ada\")",
      "The class statement alone"
    ],
    "answer": 0,
    "reason": "Calling the class constructs an instance.",
    "mistake": "A class-level list is shared across instances unless each instance creates its own.",
    "lesson": 18
  },
  {
    "id": "thread-process",
    "title": "Threading vs Multiprocessing",
    "left": "Thread",
    "right": "Process",
    "explanation": "Threads share process memory. Processes normally have separate memory and need explicit communication. In conventional GIL-enabled CPython, threads suit many I/O tasks while processes can parallelize CPU-heavy Python work. Free-threaded builds and extension code differ.",
    "differences": [
      "Threads can share state but may need locks.",
      "Processes have serialization and startup overhead.",
      "These examples model the work result sequentially; the browser runtime does not provide ordinary OS threads/processes."
    ],
    "leftCode": "def work(value):\n    return value * 2\nprint([work(n) for n in [1, 2]])",
    "leftOutput": "[2, 4]",
    "rightCode": "def worker_payload(value):\n    return {\"result\": value * 2}\nprint(worker_payload(3)[\"result\"])",
    "rightOutput": "6",
    "question": "Which usually has separate process memory?",
    "options": [
      "A thread in one process",
      "A child process"
    ],
    "answer": 1,
    "reason": "Processes isolate their address spaces; threads share their process address space.",
    "mistake": "Assuming all threading makes CPU-bound Python automatically faster.",
    "lesson": 27
  },
  {
    "id": "sync-async",
    "title": "Synchronous vs Asynchronous",
    "left": "Synchronous",
    "right": "Asynchronous",
    "explanation": "Synchronous calls complete before the caller continues. Coroutines can cooperate at await points while waiting for asynchronous work. Async is not automatically CPU parallelism.",
    "differences": [
      "Use simple synchronous code for straightforward tasks.",
      "Async helps overlap compatible I/O waits.",
      "Blocking calls inside a coroutine still block the event loop."
    ],
    "leftCode": "def label(name):\n    return name.upper()\nprint(label(\"ada\"))",
    "leftOutput": "ADA",
    "rightCode": "import asyncio\nasync def label(name):\n    await asyncio.sleep(0)\n    return name.upper()\nprint(asyncio.run(label(\"ada\")))",
    "rightOutput": "ADA",
    "question": "Does async automatically parallelize CPU-heavy calculations?",
    "options": [
      "Yes",
      "No"
    ],
    "answer": 1,
    "reason": "Async enables cooperative scheduling, not automatic CPU parallel execution.",
    "mistake": "Calling an async function without awaiting or scheduling its coroutine.",
    "lesson": 27
  },
  {
    "id": "flask-fastapi",
    "title": "Flask vs FastAPI",
    "left": "Flask",
    "right": "FastAPI",
    "explanation": "Flask is a flexible WSGI web framework. FastAPI is an ASGI framework with type-driven validation and API schema generation. Choose based on the application, libraries and deployment model. Neither framework is installed in this milestone.",
    "differences": [
      "Flask offers a small core and a broad extension ecosystem.",
      "FastAPI integrates request validation and OpenAPI generation.",
      "Examples below show plain-Python response shapes, not running framework routes."
    ],
    "leftCode": "def greeting():\n    return {\"message\": \"Hello\"}\nprint(greeting()[\"message\"])",
    "leftOutput": "Hello",
    "rightCode": "def greeting(name: str = \"Ada\") -> dict[str, str]:\n    return {\"message\": f\"Hello, {name}\"}\nprint(greeting()[\"message\"])",
    "rightOutput": "Hello, Ada",
    "question": "Which framework centers type-driven API validation and schema generation?",
    "options": [
      "FastAPI",
      "Flask without additional extensions"
    ],
    "answer": 0,
    "reason": "FastAPI integrates these API features; Flask can add them through other libraries.",
    "mistake": "Treating Python type hints alone as runtime validation or assuming either framework removes deployment/security work.",
    "lesson": 25
  }
];
  const api={prerequisites,goals,orderTargets,buildRoadmap,readCompanion,comparisons};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.PyMasterLearning=api;
})(typeof globalThis!=='undefined'?globalThis:this);
