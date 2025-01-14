const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  "Marketplace-Farm",
  "Marketplace-Post Office",
  "Marketplace-Shop",
  "Marketplace-Town Hall",
  "Shop-Town Hall",
];

function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (from in graph) {
      graph[from].push(to);
    } else {
      graph[from] = [to];
    }
  }
  for (let [from, to] of edges.map((r) => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);
console.log(roadGraph);

class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels
        .map((p) => {
          if (p.place != this.place) return p;
          return { place: destination, address: p.address };
        })
        .filter((p) => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}

let first = new VillageState("Post Office", [
  { place: "Post Office", address: "Alice's House" },
]);
let next = first.move("Alice's House");

console.log(next.place);
// → Alice's House
console.log(next.parcels);
// → []
console.log(first.place);
// → Post Office

function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

VillageState.random = function (parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address);
    parcels.push({ place, address });
  }
  return new VillageState("Post Office", parcels);
};

function runRobot(state, robot, memory) {
  console.log(state);
  for (let turn = 0; ; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Done in ${turn} turns`);
      return turn;
      break;
    }
    let action = robot(state, memory);

    state = state.move(action.direction);

    memory = action.memory;

    // console.log(`Moved to ${action.direction}`);
  }
}

const mailRoute = [
  "Alice's House",
  "Cabin",
  "Alice's House",
  "Bob's House",
  "Town Hall",
  "Daria's House",
  "Ernie's House",
  "Grete's House",
  "Shop",
  "Grete's House",
  "Farm",
  "Marketplace",
  "Post Office",
];

function routeRobot(state, memory) {
  if (memory.length == 0) {
    memory = mailRoute;
  }
  return { direction: memory[0], memory: memory.slice(1) };
}

function findRoute(graph, from, to) {
  let work = [{ at: from, route: [] }];

  for (let i = 0; i < work.length; i++) {
    let { at, route } = work[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place);

      if (!work.some((w) => w.at == place)) {
        work.push({ at: place, route: route.concat(place) });
      }
    }
  }
}

// function goalOrientedRobot({ place, parcels }, route) {
//   if (route.length == 0) {
//     let parcel = parcels[0];
//     if (parcel.place != place) {
//       route = findRoute(roadGraph, place, parcel.place);
//     } else {
//       route = findRoute(roadGraph, place, parcel.address);
//     }
//   }
//   return { direction: route[0], memory: route.slice(1) };
// }

function goalOrientedRobot({ place, parcels }, route) {
  console.log(88888888, "place:", place, "parcels:", parcels, "route:", route);
  console.log(33333333333333333333333333, route);
  if (route.length == 0) {
    let parcel = parcels[0];
    if (parcel.place != place) {
      console.log(2222222222, parcels, parcel);
      route = findRoute(roadGraph, place, parcel.place);
      console.log(6565656565, route);
    } else {
      console.log(33333333, parcels, parcel);
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return { direction: route[0], memory: route.slice(1) };
}

// function goalRobot({ place, parcels }, route) {
//   if (route.length == 0) {
//     // Describe a route for every parcel
//     let routes = parcels.map((parcel) => {
//       if (parcel.place != place) {
//         return {
//           route: findRoute(roadGraph, place, parcel.place),
//           pickUp: true,
//         };
//       } else {
//         return {
//           route: findRoute(roadGraph, place, parcel.address),
//           pickUp: false,
//         };
//       }
//     });
//     console.log(66, routes);
//     // This determines the precedence a route gets when choosing.
//     // Route length counts negatively, routes that pick up a package
//     // get a small bonus.
//     function score({ route, pickUp }) {
//       return (pickUp ? 0.5 : 0) - route.length;
//     }
//     route = routes.reduce((a, b) => (score(a) > score(b) ? a : b)).route;
//   }

//   return { direction: route[0], memory: route.slice(1) };
// }

// function goalRobot({ place, parcels }, route) {
//   console.log(22, roadGraph, 33, route);
//   console.log(555555555555555, route, 666666666666, parcels);
//   if (route.length == 0) {
//     let parcel = parcels.filter((a) => a.place == place);

//     if (parcel.length > 0) {
//       console.log(234, parcel, 11111, parcels);
//       let router = [];
//       for (a of parcel) {
//         newRoute = findRoute(roadGraph, place, a.address);
//         router.push(newRoute);
//       }
//       console.log(12345678, router);
//       route = router.reduce((a, b) => (a.length < b.length ? a : b));
//       console.log(56789, route);

//       // route = findRoute(roadGraph, place, place1[0]);
//     } else {
//       // route = findRoute(roadGraph, place, place2[0]);
//       console.log(2222222222, parcels, parcel);
//       let router = [];
//       for (a of parcels) {
//         newRoute = findRoute(roadGraph, place, a.place);
//         router.push(newRoute);
//       }
//       route = router.reduce((a, b) => (a.length < b.length ? a : b));
//     }
//   }

//   // console.log(777777777777, route);
//   return { direction: route[0], memory: route.slice(1) };
// }

function goalRobot({ place, parcels }, route) {
  console.log(22, roadGraph, 33, route);
  console.log(555555555555555, route, 666666666666, parcels);
  if (route.length == 0) {
    let parcel = parcels.filter((a) => a.place == place);

    if (parcel) {
      console.log(2222222222, parcels, parcel);
      route = findRoute(roadGraph, place, parcel[0].place);
    } else {
      let router = [];
      for (a of parcels) {
        newRoute = findRoute(roadGraph, place, a.address);
        router.push(newRoute);
      }
      route = router.reduce((a, b) => (a.length < b.length ? a : b));
      console.log(88, route, router);
    }
  }

  // console.log(777777777777, route);
  return { direction: route[0], memory: route.slice(1) };
}

// function goalRobot({ place, parcels }, route) {
//   let route1 = parcels.map((a) => {
//     if (a.place != place) {
//       return {
//         a: findRoute(roadGraph, place, a.place),
//         b: true,
//       };
//     } else {
//       return {
//         a: findRoute(roadGraph, place, a.address),
//         b: false,
//       };
//     }
//   });
//   function shortest(value1, value2) {
//     console.log(222222222, value1);
//     return value1.a.length + 0 < value2.a.length + 0.5 ? value1 : value2;
//   }
//   route = route1.reduce((a, b) => shortest(a, b));
//   console.log(11111111, route);

//   return { direction: route.a[0], memory: route.a.slice(1) };
// }

function compareRobots(robot1, memory1, robot2, memory2) {
  let RR = 0;
  let GOR = 0;
  let NEWR = 0;

  for (let i = 0; i < 10; i++) {
    let vilState = VillageState.random(10);
    NEWR += runRobot(vilState, goalRobot, []);
    RR += runRobot(vilState, robot1, []);
    GOR += runRobot(vilState, robot2, []);
  }
  console.log(RR / 10, GOR / 10, NEWR / 10);
  // Your code here
}

compareRobots(routeRobot, [], goalOrientedRobot, []);

// runRobot(VillageState.random(), yourRobot, memory);

// class PGroup {
//   emp;
//   // Your code here

//   add(value) {
//     return new PGroup(this.emp.concat([value]));
//   }

//   delete(value) {
//     this.emp = this.emp
//       .split("")
//       .filter((a) => a != value)
//       .join("");
//     return this;
//   }

//   has(value) {
//     return this.emp.includes(value);
//   }

//   static empty = new PGroup([]);
// }

class PGroup {
  members;
  constructor(members) {
    this.members = members;
  }
  add(value) {
    return new PGroup(this.members.concat([value]));
  }

  delete(value) {
    return new PGroup(this.members.filter((a) => a != value));
  }

  has(value) {
    return this.members.includes(value);
  }

  static empty = new PGroup([]);
}

// let a = PGroup.empty.add("a");
// console.log(a);

// let ab = a.add("b");
// console.log(ab);

// let abc = ab.add("c");
// console.log(abc);

// let b = ab.delete("a");
// console.log(b);
// // console.log(a);

// console.log(b.has("b"));
// // → true
// console.log(a.has("b"));
// // → false
// console.log(b.has("a"));
// // → false
